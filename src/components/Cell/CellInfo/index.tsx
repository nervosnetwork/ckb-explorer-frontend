/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useState, ReactNode, useRef, useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { scriptToHash } from '@nervosnetwork/ckb-sdk-utils'
import { CopyIcon, ExternalLinkIcon, FileChartColumnIcon } from 'lucide-react'
import type { ContractHashTag } from '../../../constants/scripts'
import { explorerService } from '../../../services/ExplorerService'
import { hexToUtf8 } from '../../../utils/string'
import SmallLoading from '../../Loading/SmallLoading'
import { getBtcTimeLockInfo, getBtcUtxo } from '../../../utils/util'
import { localeNumberString } from '../../../utils/number'
import HashTag from '../../HashTag'
import { ReactComponent as ViewIcon } from '../../../assets/view-icon.svg'
import { ReactComponent as PendingBindIcon } from '../../../assets/pending-bind-icon.svg'
import { ReactComponent as BindIcon } from '../../../assets/bind-icon.svg'
import { ReactComponent as UnboundIcon } from '../../../assets/unbind-icon.svg'
import { HelpTip } from '../../HelpTip'
import { useSetToast } from '../../Toast'
import { isTypeIdScript, TYPE_ID_TAG } from '../../../utils/typeid'
import { CellBasicInfo } from '../../../utils/transformer'
import { isRequestError } from '../../../utils/error'
import { Script } from '../../../models/Script'
import { ReactComponent as CompassIcon } from './compass.svg'
import styles from './styles.module.scss'
import EllipsisMiddle from '../../EllipsisMiddle'
import { useIsMobile } from '../../../hooks'
import { BTCExplorerLink } from '../../Link'
import { CellInfoProps } from './types'
import UTXOGraph from '../../UTXOGraph'
import Tooltip from '../../Tooltip'
import { Tabs, TabsList, TabsTrigger } from '../../ui/Tabs'
import { cn } from '../../../lib/utils'

enum CellInfo {
  LOCK = 'lock',
  TYPE = 'type',
  DATA = 'data',
  CAPACITY = 'capacity',
  RGBPP = 'rgbpp',
  UTXO = 'uxto',
}

type CapacityUsage = Record<'declared' | 'occupied', string | null>

interface CellData {
  data: string
}

interface RGBPP {
  btcTx: string
}

type UtxoGraphInfo = CellBasicInfo & {
  lock: Script | null
}

type CellInfoValue = Script | CellData | CapacityUsage | RGBPP | null | undefined | UtxoGraphInfo

function isScript(content: CellInfoValue): content is Script {
  return content != null && 'codeHash' in content
}

function isCapacityUsage(content: CellInfoValue): content is CapacityUsage {
  return content != null && 'declared' in content
}

function isCellData(content: CellInfoValue): content is CellData {
  return content != null && 'data' in content
}

function isUTXOData(content: CellInfoValue): content is UtxoGraphInfo {
  return content != null && 'generatedTxHash' in content
}

function isRGBPP(content: CellInfoValue): content is RGBPP {
  return content != null && 'btcTx' in content
}

const initCellInfoValue = {
  lock: null,
  type: null,
  data: {
    data: '0x',
  },
}

const getContentJSONWithSnakeCase = (content: CellInfoValue): string => {
  if (isScript(content)) {
    const { codeHash, args, hashType } = content
    return JSON.stringify(
      {
        code_hash: codeHash,
        args,
        hash_type: hashType,
      },
      null,
      4,
    )
  }
  return JSON.stringify(content, null, 4)
}

const fetchCellInfo = async (cell: CellBasicInfo, state: CellInfo): Promise<CellInfoValue> => {
  const fetchLock = async () => {
    if (cell.id) {
      const wrapper = await explorerService.api.fetchScript('lock_scripts', `${cell.id}`)
      return wrapper ? wrapper.attributes : initCellInfoValue.lock
    }
    return initCellInfoValue.lock
  }

  const fetchType = async () => {
    if (cell.id) {
      const wrapper = await explorerService.api.fetchScript('type_scripts', `${cell.id}`)
      return wrapper ? wrapper.attributes : initCellInfoValue.type
    }
    return initCellInfoValue.type
  }

  const fetchData = async () => {
    // TODO: When will cell.id be empty? Its type description indicates that it will not be empty.
    if (!cell.id) return initCellInfoValue.data

    let dataValue = await explorerService.api.fetchCellData(`${cell.id}`)
    if (!dataValue) return initCellInfoValue.data

    if (cell.isGenesisOutput) {
      dataValue = hexToUtf8(dataValue)
    }
    return { data: dataValue }
  }

  switch (state) {
    case CellInfo.LOCK:
      return fetchLock()

    case CellInfo.TYPE:
      return fetchType()

    case CellInfo.DATA:
      return fetchData()

    case CellInfo.CAPACITY: {
      const declared = new BigNumber(cell.capacity)
      const occupied = new BigNumber(cell.occupiedCapacity)

      return {
        declared: `${localeNumberString(declared.dividedBy(10 ** 8))} CKBytes`,
        occupied: `${localeNumberString(occupied.dividedBy(10 ** 8))} CKBytes`,
      }
    }

    case CellInfo.UTXO:
      return {
        lock: await fetchLock(),
        ...cell,
      }

    case CellInfo.RGBPP: {
      return {
        btcTx: cell.rgbInfo?.txid ?? '',
      }
    }

    default:
      return null
  }
}

const JSONKeyValueView = ({ title = '', value = '' }: { title?: string; value?: ReactNode | string }) => (
  <div className={styles.jsonValue}>
    <div className={styles.title}>{title}</div>
    <div className={cn(styles.value, 'monospace')}>{value}</div>
  </div>
)

///
const ScriptRender = ({ content: script, state }: { content: Script; state: CellInfo }) => {
  const { t } = useTranslation()
  let hashTag: Pick<ContractHashTag, 'tag' | 'category'> | undefined

  if (isTypeIdScript(script)) {
    hashTag = { tag: TYPE_ID_TAG }
  } else {
    const category = (() => {
      switch (state) {
        case CellInfo.LOCK:
          return 'lock'
        case CellInfo.TYPE:
          return 'type'
        default:
          return undefined
      }
    })()
    hashTag = script.verifiedScriptName ? { tag: script.verifiedScriptName, category } : undefined
  }
  const btcUtxo = getBtcUtxo(script)
  const btcTimeLockInfo = !btcUtxo ? getBtcTimeLockInfo(script) : null

  const txid = btcUtxo?.txid ?? btcTimeLockInfo?.txid

  return (
    <>
      <JSONKeyValueView title={`"${t('transaction.script_code_hash')}": `} value={script.codeHash} />
      {hashTag && (
        <JSONKeyValueView
          value={
            <div>
              <HashTag content={hashTag.tag} category={hashTag.category} script={script} />
            </div>
          }
        />
      )}
      <JSONKeyValueView title={`"${t('transaction.script_hash_type')}": `} value={script.hashType} />
      <JSONKeyValueView title={`"${t('transaction.script_args')}": `} value={script.args} />
      {btcUtxo?.txid && btcUtxo?.index ? (
        <JSONKeyValueView
          value={
            <BTCExplorerLink
              className={styles.btcUtxo}
              id={btcUtxo.txid}
              path="/tx"
              anchor={`vout=${parseInt(btcUtxo.index, 16)}`}
            >
              BTC UTXO
              <CompassIcon />
            </BTCExplorerLink>
          }
        />
      ) : null}

      {btcTimeLockInfo && txid ? (
        <JSONKeyValueView
          value={
            <BTCExplorerLink className={styles.btcUtxo} id={txid} path="/tx">
              {`${btcTimeLockInfo.after} confirmations after BTC Tx`}
              <CompassIcon />
            </BTCExplorerLink>
          }
        />
      ) : null}
    </>
  )
}

const CellInfoValueRender = ({ content, state }: { content: CellInfoValue; state: CellInfo }) => {
  const { t } = useTranslation()

  if (isScript(content)) {
    return <ScriptRender content={content} state={state} />
  }

  if (isCapacityUsage(content)) {
    return (
      <>
        {Object.entries(content).map(([key, value]) => {
          const field = t(`transaction.${key}_capacity`)
          return <JSONKeyValueView key={key} title={`"${field}": `} value={value ?? ''} />
        })}
      </>
    )
  }

  if (isCellData(content)) {
    return (
      <JSONKeyValueView
        title={content.data ? `"${t('transaction.script_data')}": ` : ''}
        value={content.data ? `"${content.data}"` : JSON.stringify(initCellInfoValue.data, null, 4)}
      />
    )
  }

  if (isRGBPP(content)) {
    return (
      <JSONKeyValueView
        title="BTC TX: "
        value={
          <>
            <EllipsisMiddle useTextWidthForPlaceholderWidth>{content.btcTx}</EllipsisMiddle>
            <BTCExplorerLink id={content.btcTx} path="/tx">
              <ViewIcon />
            </BTCExplorerLink>
          </>
        }
      />
    )
  }

  return <JSONKeyValueView title="null" />
}

const CellInfoValueView = ({
  content,
  state,
  modalRef,
  onViewCell,
}: {
  content: CellInfoValue
  state: CellInfo
  modalRef?: HTMLDivElement | null
  onViewCell: (cell: CellBasicInfo) => void
}) => {
  switch (state) {
    case CellInfo.LOCK:
    case CellInfo.TYPE:
    case CellInfo.DATA:
    case CellInfo.CAPACITY:
      return <CellInfoValueJSONView content={content} state={state} />
    case CellInfo.UTXO:
      if (isUTXOData(content)) {
        return <UTXOGraph {...content} modalRef={modalRef} onViewCell={onViewCell} />
      }
      return null
    case CellInfo.RGBPP:
      return <CellInfoNormalValueView content={content} state={state} />
    default:
      return null
  }
}

const CellInfoNormalValueView = ({ content, state }: { content: CellInfoValue; state: CellInfo }) => (
  <div data-state={state} className={styles.transactionCellInfoValuePanel}>
    <CellInfoValueRender content={content} state={state} />
  </div>
)

const CellInfoValueJSONView = ({ content, state }: { content: CellInfoValue; state: CellInfo }) => (
  <div data-state={state} data-is-decodable="true" className={styles.transactionCellInfoValuePanel}>
    <span>{'{'}</span>
    <CellInfoValueRender content={content} state={state} />
    <span>{'}'}</span>
  </div>
)

export default ({ cell: entryCell, suffix }: CellInfoProps) => {
  const setToast = useSetToast()
  const { t } = useTranslation()
  const [selectedInfo, setSelectedInfo] = useState<CellInfo>(CellInfo.LOCK)
  const ref = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()

  const changeType = (newState: CellInfo) => {
    setSelectedInfo(selectedInfo !== newState ? newState : selectedInfo)
  }

  const [viewCell, setViewCell] = useState<CellBasicInfo | undefined>()
  const onViewCell = useCallback((newViewCell: CellBasicInfo) => {
    setViewCell(newViewCell)
    setSelectedInfo(CellInfo.LOCK)
  }, [])
  const cell = viewCell ?? entryCell

  const { data: content, isFetched } = useQuery(
    ['cell-info', cell, selectedInfo],
    () =>
      fetchCellInfo(cell, selectedInfo).catch(error => {
        if (!isRequestError(error)) return null
        const respErrors = error.response?.data
        if (!Array.isArray(respErrors)) return null

        const err = respErrors[0]
        if (err.status === 400 && err.code === 1022) {
          setToast({
            message: t('toast.data_too_large'),
            type: 'warning',
          })
        }

        return null
      }),
    {
      retry: false,
      refetchInterval: false,
    },
  )

  const isContentAScript = isScript(content)
  const isContentATypeIdScript = isContentAScript && isTypeIdScript(content)

  const onCopy = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    const { role } = e.currentTarget.dataset

    let v = ''

    switch (role) {
      case 'copy-script': {
        v = getContentJSONWithSnakeCase(content)
        break
      }
      case 'copy-script-hash': {
        if (isScript(content)) {
          v = scriptToHash(content as CKBComponents.Script)
        }
        break
      }
      case 'copy-outpoint': {
        v = `${cell.generatedTxHash}:${cell.cellIndex}`
        break
      }
      default: {
        // ignore
      }
    }
    if (!v) return

    navigator.clipboard.writeText(v).then(
      () => setToast({ message: t('common.copied') }),
      error => {
        console.error(error)
      },
    )
  }

  const renderBindIcon = () => {
    if (!cell.status || cell.status === 'dead') {
      return null
    }

    switch (cell.rgbInfo?.status) {
      case 'binding':
        return (
          <Tooltip trigger={<PendingBindIcon />} placement="top">
            {t('cell.bind_description.binding')}
          </Tooltip>
        )
      case 'bound':
        return (
          <Tooltip trigger={<BindIcon />} placement="top">
            {t('cell.bind_description.bound')}
          </Tooltip>
        )
      case 'unbound':
        return (
          <Tooltip trigger={<UnboundIcon />} placement="top">
            {t('cell.bind_description.unbound')}
          </Tooltip>
        )
      default:
        return null
    }
  }
  const status = cell.status ?? 'dead'

  return (
    <div className="w-full overflow-hidden flex flex-col gap-2" ref={ref}>
      <div className="w-full flex items-center overflow-hidden">
        {isMobile ? (
          <div className={styles.transactionDetailModalHeaderLeft}>
            <div className="w-full flex items-center gap-2">
              <span className="text-nowrap text-base font-black">{t('cell.cell_info')}</span>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    {
                      'bg-primary': status === 'live',
                      'bg-[#999]': status === 'dead',
                    },
                    'w-2 h-2 rounded-full',
                  )}
                />
                <span className="text-[#666]">{t(`cell.${status}_cell`)}</span>
              </div>
              {suffix}
            </div>
            <div className="w-full flex items-center gap-2">
              <div className={styles.outpoint}>
                <EllipsisMiddle
                  useTextWidthForPlaceholderWidth
                >{`Outpoint: ${cell.generatedTxHash}:${cell.cellIndex}`}</EllipsisMiddle>
                <button data-role="copy-outpoint" type="button" onClick={onCopy}>
                  <CopyIcon size={16} className="text-[#999] hover:text-primary transition-colors cursor-pointer" />
                </button>

                <a
                  href={`/transaction/${cell.generatedTxHash}#${cell.cellIndex}`}
                  title={t('transaction.out_point')}
                  target="_blank"
                  rel="opener noreferrer"
                >
                  <ExternalLinkIcon size={16} className="text-[#999] hover:text-primary transition-colors" />
                </a>
              </div>
              {cell.status !== 'dead' && cell.rgbInfo?.status && (
                <div className={styles.svgContainer}>{renderBindIcon()}</div>
              )}
            </div>
          </div>
        ) : (
          <div className="w-full flex items-center gap-2">
            <span className="text-nowrap text-base font-black">{t('cell.cell_info')}</span>
            <div className="flex items-center px-2 py-1 gap-2 max-w-3/5 border border-primary rounded-full">
              <EllipsisMiddle useTextWidthForPlaceholderWidth>
                {`Outpoint: ${cell.generatedTxHash}:${cell.cellIndex}`}
              </EllipsisMiddle>
              <button type="button" onClick={onCopy}>
                <CopyIcon size={16} className="text-[#999] hover:text-primary transition-colors cursor-pointer" />
              </button>
              <a
                href={`/transaction/${cell.generatedTxHash}#${cell.cellIndex}`}
                title={t('transaction.out_point')}
                target="_blank"
                rel="opener noreferrer"
              >
                <ExternalLinkIcon size={16} className="text-[#999] hover:text-primary transition-colors" />
              </a>
            </div>
            {cell.status !== 'dead' && cell.rgbInfo?.status && (
              <div className={styles.svgContainer}>{renderBindIcon()}</div>
            )}
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  {
                    'bg-primary': status === 'live',
                    'bg-[#999]': status === 'dead',
                  },
                  'w-2 h-2 rounded-full',
                )}
              />
              <span className="text-[#666]">{t(`cell.${status}_cell`)}</span>
            </div>

            {suffix}
          </div>
        )}
      </div>

      <div className={styles.transactionDetailPanel}>
        <Tabs className={styles.tabs} value={selectedInfo} onValueChange={v => changeType(v as CellInfo)}>
          <TabsList className={styles.tabsList}>
            <TabsTrigger value={CellInfo.LOCK}>
              <>
                <span className={styles.transactionCellDetailTitle}>{t('transaction.lock_script')}</span>
                <HelpTip>{t('glossary.lock_script')}</HelpTip>
              </>
            </TabsTrigger>
            <TabsTrigger value={CellInfo.TYPE}>
              <>
                <span className={styles.transactionCellDetailTitle}>{t('transaction.type_script')}</span>
                <HelpTip>{t('glossary.type_script')}</HelpTip>
              </>
            </TabsTrigger>
            <TabsTrigger value={CellInfo.DATA}>{t('transaction.data')}</TabsTrigger>
            <TabsTrigger value={CellInfo.CAPACITY}>
              <>
                <span className={styles.transactionCellDetailTitle}>{t('transaction.capacity_usage')}</span>
                <HelpTip>{t('glossary.capacity_usage')}</HelpTip>
              </>
            </TabsTrigger>
            {cell.rgbInfo && <TabsTrigger value={CellInfo.RGBPP}>{t('transaction.rgbpp')}</TabsTrigger>}
            <TabsTrigger value={CellInfo.UTXO}>{t('transaction.utxo_graph')}</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className={styles.transactionDetailPanel}>
        {isFetched ? (
          <div className={cn(styles.transactionDetailContent, isUTXOData(content) ? styles.utxoContent : undefined)}>
            <CellInfoValueView content={content} state={selectedInfo} modalRef={ref.current} onViewCell={onViewCell} />
          </div>
        ) : (
          <div className={styles.transactionDetailLoading}>{!isFetched ? <SmallLoading /> : null}</div>
        )}

        {!isFetched || !content ? null : (
          <div className={styles.scriptActions}>
            {!isRGBPP(content) && !isUTXOData(content) && (
              <button data-role="copy-script" className={styles.button} type="button" onClick={onCopy}>
                <div>{t('common.copy')}</div>
                <CopyIcon size={16} />
              </button>
            )}

            {isContentAScript ? (
              <button data-role="copy-script-hash" className={styles.button} type="button" onClick={onCopy}>
                <div>Script Hash</div>
                <FileChartColumnIcon size={16} />
              </button>
            ) : null}

            {isContentAScript ? (
              <a
                data-role="script-info"
                className={styles.button}
                href={
                  isContentATypeIdScript
                    ? `/script/${scriptToHash(content as CKBComponents.Script)}/type`
                    : `/script/${content.codeHash}/${content.hashType}`
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                <div>{isContentATypeIdScript ? t('scripts.deployed_script') : `${t('scripts.script')} Info`}</div>
                <ExternalLinkIcon />
              </a>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}
