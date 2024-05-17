import { useMemo, type FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Tooltip } from 'antd'
import dayjs from 'dayjs'
import { type RawBtcRPC } from '../../../services/ExplorerService'
import config from '../../../config'
import styles from './styles.module.scss'
import AddressText from '../../AddressText'
import EllipsisMiddle from '../../EllipsisMiddle'
import { ReactComponent as UsedSeal } from './used-seal.svg'
import { ReactComponent as NewSeal } from './new-seal.svg'
import { ReactComponent as ViewNewSeal } from './view-new-seal.svg'
import { ReactComponent as BtcIcon } from './btc.svg'
import { ReactComponent as DirectionIcon } from '../../../assets/direction.svg'

const MAX_ITEMS = 10

const BtcTransaction: FC<{
  tx: RawBtcRPC.BtcTx
  boundCellIndex: Record<string, number>
  showId?: boolean
}> = ({ tx, boundCellIndex, showId = true }) => {
  const { t } = useTranslation()

  const time = tx.blocktime ? dayjs(tx.blocktime * 1000) : null

  const commitment = useMemo(() => {
    const msg = tx.vout.find(v => v.scriptPubKey.asm.includes('OP_RETURN'))?.scriptPubKey.asm
    return msg?.slice('OP_RETURN '.length) ?? null
  }, [tx.vout])

  const [viewMoreInputs, viewMoreOutputs] = [tx.vin, tx.vout].map(v => v.length > MAX_ITEMS)

  return (
    <div className={styles.container}>
      <BtcIcon className={styles.btcIcon} />
      {showId ? (
        <div className={styles.header}>
          <h3 className={styles.txid}>
            <a
              href={`${config.BITCOIN_EXPLORER}/tx/${tx.txid}`}
              title={tx.txid}
              rel="noopener noreferrer"
              target="_blank"
            >
              <EllipsisMiddle className="monospace" text={tx.txid} />
            </a>
          </h3>
          {time && tx.confirmations ? (
            <time dateTime={time.toISOString()}>{`${tx.confirmations.toLocaleString('en')} Confirmations (${time.format(
              'YYYY-MM-DD HH:mm:ss',
            )})`}</time>
          ) : (
            <div>{t('transaction.loading')}</div>
          )}
        </div>
      ) : null}
      <div className={styles.utxos}>
        <div className={styles.inputs}>
          {tx.vin.slice(0, MAX_ITEMS).map(input => {
            if (!input.prevout) return null
            const key = `${input?.txid}-${input.vout}`
            const [int, dec] = input.prevout.value.toString().split('.')
            const boundIndex = boundCellIndex[key]
            return (
              <div key={key} className={styles.input}>
                <a
                  href={`${config.BITCOIN_EXPLORER}/address/${input.prevout.scriptPubKey.address}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <AddressText className="monospace">{input.prevout.scriptPubKey.address}</AddressText>
                </a>
                <div className={`${styles.btcAttr} monospace`}>
                  <div className={styles.btcValue}>
                    <span>{int}</span>
                    {dec ? <span>{`.${dec}`}</span> : null}
                  </div>
                  BTC
                  {boundIndex !== undefined ? (
                    <Tooltip
                      placement="top"
                      title={t('transaction.isomorphic-binding-with-index', {
                        index: `Input #${boundIndex}`,
                      })}
                    >
                      <UsedSeal />
                    </Tooltip>
                  ) : (
                    <div className={styles.iconPlaceholder} />
                  )}
                </div>
              </div>
            )
          })}
          {viewMoreInputs ? (
            <div style={{ marginTop: 4 }}>
              <a href={`${config.BITCOIN_EXPLORER}/tx/${tx.txid}`} rel="noopener noreferrer" target="_blank">
                View more in BTC Explorer
              </a>
            </div>
          ) : null}
        </div>
        <DirectionIcon className={styles.direction} />
        <div className={styles.outputs}>
          {tx.vout.slice(0, MAX_ITEMS).map((output, idx) => {
            const key = `${tx.txid}-${idx}`
            const [int, dec] = output.value.toString().split('.')
            const boundIndex = boundCellIndex[key]
            return (
              <div key={key} className={styles.output}>
                <a
                  href={`${config.BITCOIN_EXPLORER}/address/${output.scriptPubKey.address}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <AddressText className="monospace">{output.scriptPubKey.address}</AddressText>
                </a>
                <div className={`${styles.btcAttr} monospace`}>
                  <div className={styles.btcValue}>
                    <span>{int}</span>
                    {dec ? <span>{`.${dec}`}</span> : null}
                  </div>
                  BTC
                  {boundIndex !== undefined ? (
                    <Tooltip
                      placement="top"
                      title={t(
                        `transaction.${
                          commitment ? 'isomorphic-binding-with-index-commitment' : 'isomorphic-binding-with-index'
                        }`,
                        {
                          index: `Output #${boundIndex}`,
                          commitment,
                        },
                      )}
                    >
                      <div className={styles.newSeal}>
                        <NewSeal />
                        <ViewNewSeal />
                      </div>
                    </Tooltip>
                  ) : (
                    <div className={styles.iconPlaceholder} />
                  )}
                </div>
              </div>
            )
          })}
          {viewMoreOutputs ? (
            <div style={{ marginTop: 4 }}>
              <a href={`${config.BITCOIN_EXPLORER}/tx/${tx.txid}`} rel="noopener noreferrer" target="_blank">
                View more in BTC Explorer
              </a>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default BtcTransaction
