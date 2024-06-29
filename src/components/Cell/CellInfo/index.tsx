/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useState, ReactNode, useRef } from 'react'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { scriptToHash } from '@nervosnetwork/ckb-sdk-utils'
import classNames from 'classnames'
import { Tooltip } from 'antd'
import { explorerService } from '../../../services/ExplorerService'
import { hexToUtf8 } from '../../../utils/string'
import { TransactionCellDetailTab, TransactionCellDetailPane, TransactionCellDetailTitle } from './styled'
import SmallLoading from '../../Loading/SmallLoading'
import CloseIcon from './modal_close.png'
import config from '../../../config'
import { getBtcTimeLockInfo, getBtcUtxo, getContractHashTag } from '../../../utils/util'
import { localeNumberString } from '../../../utils/number'
import HashTag from '../../HashTag'
import { ReactComponent as CopyIcon } from '../../../assets/copy_icon.svg'
import { ReactComponent as ViewIcon } from '../../../assets/view-icon.svg'
import { ReactComponent as PendingBindIcon } from '../../../assets/pending-bind-icon.svg'
import { ReactComponent as BindIcon } from '../../../assets/bind-icon.svg'
import { ReactComponent as UnboundIcon } from '../../../assets/unbind-icon.svg'
import { ReactComponent as PointIcon } from '../../../assets/point.svg'
import { ReactComponent as OuterLinkIcon } from './outer_link_icon.svg'
import { ReactComponent as ScriptHashIcon } from './script_hash_icon.svg'
import { HelpTip } from '../../HelpTip'
import { useSetToast } from '../../Toast'
import { CellBasicInfo } from '../../../utils/transformer'
import { isAxiosError } from '../../../utils/error'
import { Script } from '../../../models/Script'
import { ReactComponent as CompassIcon } from './compass.svg'
import styles from './styles.module.scss'
import EllipsisMiddle from '../../EllipsisMiddle'
import { useIsMobile } from '../../../hooks'
import { Link } from '../../Link'
import { CellInfoProps } from './types'

enum CellInfo {
  LOCK = 'lock',
  TYPE = 'type',
  DATA = 'data',
  CAPACITY = 'capacity',
  RGBPP = 'rgbpp',
}

type CapacityUsage = Record<'declared' | 'occupied', string | null>

interface CellData {
  data: string
}

interface RGBPP {
  btcTx: string
}

type CellInfoValue = Script | CellData | CapacityUsage | RGBPP | null | undefined

function isScript(content: CellInfoValue): content is Script {
  return content != null && 'codeHash' in content
}

function isCapacityUsage(content: CellInfoValue): content is CapacityUsage {
  return content != null && 'declared' in content
}

function isCellData(content: CellInfoValue): content is CellData {
  return content != null && 'data' in content
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
    <div className={classNames(styles.value, 'monospace')}>{value}</div>
  </div>
)

const CellInfoValueRender = ({ content }: { content: CellInfoValue }) => {
  const { t } = useTranslation()

  if (isScript(content)) {
    const hashTag = getContractHashTag(content)
    const btcUtxo = getBtcUtxo(content)
    const btcTimeLockInfo = !btcUtxo ? getBtcTimeLockInfo(content) : null
    return (
      <>
        <JSONKeyValueView title={`"${t('transaction.script_code_hash')}": `} value={content.codeHash} />
        {hashTag && (
          <JSONKeyValueView
            value={
              <div>
                <HashTag content={hashTag.tag} category={hashTag.category} />
              </div>
            }
          />
        )}
        <JSONKeyValueView title={`"${t('transaction.script_hash_type')}": `} value={content.hashType} />
        <JSONKeyValueView title={`"${t('transaction.script_args')}": `} value={content.args} />
        {btcUtxo ? (
          <JSONKeyValueView
            value={
              <a
                href={`${config.BITCOIN_EXPLORER}/tx/${btcUtxo.txid}#vout=${parseInt(btcUtxo.index!, 16)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.btcUtxo}
              >
                BTC UTXO
                <CompassIcon />
              </a>
            }
          />
        ) : null}

        {btcTimeLockInfo ? (
          <JSONKeyValueView
            value={
              <a
                href={`${config.BITCOIN_EXPLORER}/tx/${btcTimeLockInfo.txid}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.btcUtxo}
              >
                {`${btcTimeLockInfo.after} confirmations after BTC Tx`}
                <CompassIcon />
              </a>
            }
          />
        ) : null}
      </>
    )
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
            <Link to={`${config.BITCOIN_EXPLORER}/tx/${content.btcTx}`}>
              <ViewIcon />
            </Link>
          </>
        }
      />
    )
  }

  return <JSONKeyValueView title="null" />
}

const CellInfoValueView = ({ content, state }: { content: CellInfoValue; state: CellInfo }) => {
  switch (state) {
    case CellInfo.LOCK:
    case CellInfo.TYPE:
    case CellInfo.DATA:
    case CellInfo.CAPACITY:
      return <CellInfoValueJSONView content={content} state={state} />
    case CellInfo.RGBPP:
      return <CellInfoNormalValueView content={content} state={state} />
    default:
      return null
  }
}

const CellInfoNormalValueView = ({ content, state }: { content: CellInfoValue; state: CellInfo }) => (
  <div data-state={state} className={styles.transactionCellInfoValuePanel}>
    <CellInfoValueRender content={content} />
  </div>
)

const CellInfoValueJSONView = ({ content, state }: { content: CellInfoValue; state: CellInfo }) => (
  <div data-state={state} data-is-decodable="true" className={styles.transactionCellInfoValuePanel}>
    <span>{'{'}</span>
    <CellInfoValueRender content={content} />
    <span>{'}'}</span>
  </div>
)

export default ({ cell, onClose }: CellInfoProps) => {
  const setToast = useSetToast()
  const { t } = useTranslation()
  const [selectedInfo, setSelectedInfo] = useState<CellInfo>(CellInfo.LOCK)
  const ref = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()

  const changeType = (newState: CellInfo) => {
    setSelectedInfo(selectedInfo !== newState ? newState : selectedInfo)
  }

  const { data: content, isFetched } = useQuery(
    ['cell-info', cell, selectedInfo],
    () =>
      fetchCellInfo(cell, selectedInfo).catch(error => {
        if (!isAxiosError(error)) return null
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
          <Tooltip placement="top" title={t('cell.bind_description.binding')}>
            <PendingBindIcon />
          </Tooltip>
        )
      case 'bound':
        return (
          <Tooltip placement="top" title={t('cell.bind_description.bound')}>
            <BindIcon />
          </Tooltip>
        )
      case 'unbound':
        return (
          <Tooltip placement="top" title={t('cell.bind_description.unbound')}>
            <UnboundIcon />
          </Tooltip>
        )
      default:
        return null
    }
  }

  return (
    <div className={styles.transactionDetailContainer} ref={ref}>
      <div className={styles.transactionDetailModalHeader}>
        {isMobile ? (
          <div className={styles.transactionDetailModalHeaderLeft}>
            <div className={styles.mobileVision}>
              <h2>{t('cell.cell_info')}</h2>
              <div className={styles.cellStatusIcon} data-cell-status={cell.status ?? 'dead'}>
                <PointIcon />
              </div>
              <span style={{ color: '#666', flexShrink: 1 }}>{t(`cell.${cell.status ?? 'dead'}_cell`)}</span>
            </div>
            <div className={styles.mobileVision}>
              <div className={styles.outpoint}>
                <EllipsisMiddle
                  useTextWidthForPlaceholderWidth
                >{`Outpoint: ${cell.generatedTxHash}:${cell.cellIndex}`}</EllipsisMiddle>
                <button
                  data-role="copy-outpoint"
                  type="button"
                  onClick={onCopy}
                  className={classNames(styles.copy, styles.hoverIconButton)}
                >
                  <CopyIcon />
                </button>
              </div>
              <div className={styles.svgContainer}>{renderBindIcon()}</div>
            </div>
          </div>
        ) : (
          <div className={styles.transactionDetailModalHeaderLeft}>
            <h2>{t('cell.cell_info')}</h2>
            <div className={styles.outpoint}>
              <EllipsisMiddle useTextWidthForPlaceholderWidth>
                {`Outpoint: ${cell.generatedTxHash}:${cell.cellIndex}`}
              </EllipsisMiddle>
              <button
                data-role="copy-outpoint"
                type="button"
                onClick={onCopy}
                className={classNames(styles.copy, styles.hoverIconButton)}
              >
                <CopyIcon />
              </button>
            </div>
            <div className={styles.svgContainer}>{renderBindIcon()}</div>
            <div className={styles.cellStatusIcon} data-cell-status={cell.status ?? 'dead'}>
              <PointIcon />
            </div>
            <span style={{ color: '#666', flexShrink: 1 }}>{t(`cell.${cell.status ?? 'dead'}_cell`)}</span>
          </div>
        )}
        <img src={CloseIcon} alt="close icon" tabIndex={-1} onKeyDown={() => {}} onClick={() => onClose()} />
      </div>
      <div className={styles.transactionDetailPanel}>
        <TransactionCellDetailTab
          tabBarStyle={{ fontSize: '10px' }}
          onTabClick={key => {
            const state = key as CellInfo
            if (state) {
              changeType(state)
            }
          }}
        >
          <TransactionCellDetailPane
            tab={
              <>
                <TransactionCellDetailTitle>{t('transaction.lock_script')}</TransactionCellDetailTitle>
                <HelpTip title={t('glossary.lock_script')} placement="bottom" containerRef={ref} />
              </>
            }
            key={CellInfo.LOCK}
          />
          <TransactionCellDetailPane
            tab={
              <>
                <TransactionCellDetailTitle>{t('transaction.type_script')}</TransactionCellDetailTitle>
                <HelpTip title={t('glossary.type_script')} placement="bottom" containerRef={ref} />
              </>
            }
            key={CellInfo.TYPE}
          />
          <TransactionCellDetailPane
            tab={<TransactionCellDetailTitle>{t('transaction.data')}</TransactionCellDetailTitle>}
            key={CellInfo.DATA}
          />
          <TransactionCellDetailPane
            tab={
              <>
                <TransactionCellDetailTitle>{t('transaction.capacity_usage')}</TransactionCellDetailTitle>
                <HelpTip title={t('glossary.capacity_usage')} placement="bottom" containerRef={ref} />
              </>
            }
            key={CellInfo.CAPACITY}
          />
          {cell.rgbInfo && (
            <TransactionCellDetailPane
              tab={
                <>
                  <TransactionCellDetailTitle>{t('transaction.rgbpp')}</TransactionCellDetailTitle>
                  <HelpTip title={t('glossary.capacity_usage')} placement="bottom" containerRef={ref} />
                </>
              }
              key={CellInfo.RGBPP}
            />
          )}
        </TransactionCellDetailTab>
      </div>

      <div className={styles.transactionDetailPanel}>
        {isFetched ? (
          <div className={styles.transactionDetailContent}>
            <CellInfoValueView content={content} state={selectedInfo} />
          </div>
        ) : (
          <div className={styles.transactionDetailLoading}>{!isFetched ? <SmallLoading /> : null}</div>
        )}

        {!isFetched || !content ? null : (
          <div className={styles.scriptActions}>
            {!isRGBPP(content) && (
              <button data-role="copy-script" className={styles.button} type="button" onClick={onCopy}>
                <div>{t('common.copy')}</div>
                <CopyIcon />
              </button>
            )}

            {isScript(content) ? (
              <button data-role="copy-script-hash" className={styles.button} type="button" onClick={onCopy}>
                <div>Script Hash</div>
                <ScriptHashIcon />
              </button>
            ) : null}

            {isScript(content) ? (
              <a
                data-role="script-info"
                className={styles.button}
                href={`/script/${content.codeHash}/${content.hashType}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div>{`${t('scripts.script')} Info`}</div>
                <OuterLinkIcon />
              </a>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}
