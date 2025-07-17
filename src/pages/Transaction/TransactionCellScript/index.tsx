import type { Cell } from '@ckb-ccc/core'
import classNames from 'classnames'
import { useState, ReactNode, useRef, FC } from 'react'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'react-i18next'
import { scriptToHash } from '@nervosnetwork/ckb-sdk-utils'
import CloseIcon from './modal_close.png'
import { getBtcTimeLockInfo, getBtcUtxo } from '../../../utils/util'
import { localeNumberString } from '../../../utils/number'
import { isTypeIdScript } from '../../../utils/typeid'
import HashTag from '../../../components/HashTag'
import { ReactComponent as CopyIcon } from '../../../assets/copy_icon.svg'
import { ReactComponent as OuterLinkIcon } from './outer_link_icon.svg'
import { ReactComponent as ScriptHashIcon } from './script_hash_icon.svg'
import { HelpTip } from '../../../components/HelpTip'
import { useSetToast } from '../../../components/Toast'
import { Script } from '../../../models/Script'
import { ReactComponent as CompassIcon } from './compass.svg'
import styles from './styles.module.scss'
import { BTCExplorerLink } from '../../../components/Link'
import { Tabs, TabsList, TabsTrigger } from '../../../components/ui/Tabs'

enum CellInfo {
  LOCK = 1,
  TYPE = 2,
  DATA = 3,
  CAPACITY = 4,
}

type CapacityUsage = Record<'declared' | 'occupied', string | null>

interface CellData {
  data: string
}

type CellInfoValue = Script | CellData | CapacityUsage | null | undefined

function isScript(content: CellInfoValue): content is Script {
  return content != null && 'codeHash' in content
}

function isCapacityUsage(content: CellInfoValue): content is CapacityUsage {
  return content != null && 'declared' in content
}

function isCellData(content: CellInfoValue): content is CellData {
  return content != null && 'data' in content
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

const JSONKeyValueView = ({ title = '', value = '' }: { title?: string; value?: ReactNode | string }) => (
  <div>
    <div>{title}</div>
    <div className="monospace">{value}</div>
  </div>
)

const RGBPP: FC<{ btcUtxo: Partial<Record<'txid' | 'index', string>> }> = ({ btcUtxo }) => {
  return (
    <JSONKeyValueView
      value={
        <BTCExplorerLink
          className={styles.action}
          id={btcUtxo.txid}
          anchor={`vout=${parseInt(btcUtxo.index!, 16)}`}
          path="/tx"
        >
          BTC UTXO
          <CompassIcon />
        </BTCExplorerLink>
      }
    />
  )
}

const BTCTimeLock: FC<{
  btcTimeLockInfo: {
    txid: string | undefined
    after: number
  }
}> = ({ btcTimeLockInfo }) => {
  return (
    <JSONKeyValueView
      value={
        <BTCExplorerLink className={styles.action} id={btcTimeLockInfo.txid} path="/tx">
          {`${btcTimeLockInfo.after} confirmations after BTC Tx`}
          <CompassIcon />
        </BTCExplorerLink>
      }
    />
  )
}

const CellInfoValueRender = ({ content }: { content: CellInfoValue }) => {
  const { t } = useTranslation()

  if (isScript(content)) {
    const btcUtxo = getBtcUtxo(content)
    const btcTimeLockInfo = !btcUtxo ? getBtcTimeLockInfo(content) : null
    return (
      <>
        <JSONKeyValueView title={`"${t('transaction.script_code_hash')}": `} value={content.codeHash} />
        <JSONKeyValueView
          value={
            <div>
              <HashTag script={content} />
            </div>
          }
        />
        <JSONKeyValueView title={`"${t('transaction.script_hash_type')}": `} value={content.hashType} />
        <JSONKeyValueView title={`"${t('transaction.script_args')}": `} value={content.args} />
        {btcUtxo ? <RGBPP btcUtxo={btcUtxo} /> : null}
        {btcTimeLockInfo ? <BTCTimeLock btcTimeLockInfo={btcTimeLockInfo} /> : null}
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

  return <JSONKeyValueView title="null" />
}

const CellInfoValueJSONView = ({ content, state }: { content: CellInfoValue; state: CellInfo }) => (
  <div
    className={classNames(styles.transactionCellInfoValuePanel, state === CellInfo.DATA && styles.isData)}
    data-is-decodable="true"
  >
    <span>{'{'}</span>
    <CellInfoValueRender content={content} />
    <span>{'}'}</span>
  </div>
)

export const CellInfoModal = ({ cell, onClose }: { cell: Cell; onClose: Function }) => {
  const setToast = useSetToast()
  const { t } = useTranslation()
  const [selectedInfo, setSelectedInfo] = useState<CellInfo>(CellInfo.LOCK)

  const content = ((): CellInfoValue => {
    if (selectedInfo === CellInfo.LOCK) {
      return cell.cellOutput.lock
    }

    if (selectedInfo === CellInfo.TYPE) {
      return cell.cellOutput.type
    }

    if (selectedInfo === CellInfo.DATA) {
      return {
        data: cell.outputData,
      }
    }

    if (selectedInfo === CellInfo.CAPACITY) {
      const declared = new BigNumber(cell.cellOutput.capacity)
      const occupied = new BigNumber(cell.occupiedSize)

      return {
        declared: `${localeNumberString(declared.dividedBy(10 ** 8))} CKBytes`,
        occupied: `${localeNumberString(occupied.dividedBy(10 ** 8))} CKBytes`,
      }
    }

    return null
  })()

  const ref = useRef<HTMLDivElement>(null)

  const changeType = (newState: CellInfo) => {
    setSelectedInfo(selectedInfo !== newState ? newState : selectedInfo)
  }

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

  const isContentAScript = isScript(content)
  const isContentATypeIdScript = isContentAScript && isTypeIdScript(content as Script)

  return (
    <div className={styles.transactionDetailContainer} ref={ref}>
      <div className="transactionDetailModalClose">
        <img src={CloseIcon} alt="close icon" tabIndex={-1} onKeyDown={() => {}} onClick={() => onClose()} />
      </div>
      <div className={styles.transactionCellDetailPanel}>
        <Tabs
          onValueChange={key => {
            const state = parseInt(key, 10)
            if (state && !Number.isNaN(state)) {
              changeType(state)
            }
          }}
          style={{ width: '100%' }}
        >
          <TabsList style={{ width: '100%', display: 'flex' }}>
            <TabsTrigger value={CellInfo.LOCK.toString()}>
              <>
                <span className={styles.transactionCellDetailTitle}>{t('transaction.lock_script')}</span>
                <HelpTip>{t('glossary.lock_script')}</HelpTip>
              </>
            </TabsTrigger>
            <TabsTrigger value={CellInfo.TYPE.toString()}>
              <>
                <span className={styles.transactionCellDetailTitle}>{t('transaction.type_script')}</span>
                <HelpTip>{t('glossary.type_script')}</HelpTip>
              </>
            </TabsTrigger>
            <TabsTrigger value={CellInfo.DATA.toString()}>
              <span className={styles.transactionCellDetailTitle}>{t('transaction.data')}</span>
            </TabsTrigger>
            <TabsTrigger value={CellInfo.CAPACITY.toString()}>
              <>
                <span className={styles.transactionCellDetailTitle}>{t('transaction.capacity_usage')}</span>
                <HelpTip>{t('glossary.capacity_usage')}</HelpTip>
              </>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className={styles.transactionDetailPanel}>
        <div className="transactionDetailContent">
          <CellInfoValueJSONView content={content} state={selectedInfo} />
        </div>
        {!content ? null : (
          <div className={styles.scriptActions}>
            <button data-role="copy-script" className={styles.button} type="button" onClick={onCopy}>
              <div>{t('common.copy')}</div>
              <CopyIcon />
            </button>

            {isContentAScript ? (
              <button data-role="copy-script-hash" className={styles.button} type="button" onClick={onCopy}>
                <div>Script Hash</div>
                <ScriptHashIcon />
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
                <OuterLinkIcon />
              </a>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}
