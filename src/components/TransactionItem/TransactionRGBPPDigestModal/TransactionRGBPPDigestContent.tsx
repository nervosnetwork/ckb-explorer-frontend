import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import BigNumber from 'bignumber.js'
import { ReactComponent as CopyIcon } from '../../../assets/copy_icon.svg'
import { ReactComponent as RedirectIcon } from '../../../assets/redirect-icon.svg'
import { TransactionRGBPPDigestTransfer } from './TransactionRGBPPDigestTransfer'
import { useSetToast } from '../../Toast'
import { LiteTransfer, RGBDigest } from '../../../services/ExplorerService'
import SimpleButton from '../../SimpleButton'
import EllipsisMiddle from '../../EllipsisMiddle'
import styles from './TransactionRGBPPDigestContent.module.scss'
import AddressText from '../../AddressText'
import { useIsMobile } from '../../../hooks'
import { Link } from '../../Link'
import config from '../../../config'
import SmallLoading from '../../Loading/SmallLoading'
import { getBtcChainIdentify } from '../../../services/BTCIdentifier'
import { IS_MAINNET } from '../../../constants/common'

export const TransactionRGBPPDigestContent = ({
  hash,
  digest,
  isFetched,
}: {
  hash: string
  digest?: RGBDigest
  isFetched: boolean
}) => {
  const { t } = useTranslation()
  const setToast = useSetToast()
  const isMobile = useIsMobile()

  const btcTxId = digest?.txid

  const { data: identity } = useQuery({
    queryKey: ['btc-testnet-identity', btcTxId],
    queryFn: () => (btcTxId ? getBtcChainIdentify(btcTxId) : null),
    enabled: !IS_MAINNET && !!btcTxId,
  })

  const transfers = useMemo(() => {
    const m = new Map<string, LiteTransfer.Transfer[]>()
    digest?.transfers.forEach(tf => {
      const list = m.get(tf.address) || []
      tf.transfers.forEach(i => {
        let asset: LiteTransfer.Transfer | undefined
        switch (i.cellType) {
          case 'normal': {
            asset = list.find(j => j.cellType === 'normal')
            break
          }
          case 'udt':
          case 'xudt_compatible':
          case 'xudt':
          case 'omiga_inscription': {
            asset = list.find(j => j.cellType === i.cellType && j.udtInfo?.typeHash === i.udtInfo?.typeHash) as
              | LiteTransfer.XudtTransfer
              | LiteTransfer.UDTTransfer
              | LiteTransfer.OmigaTransfer
              | undefined
            if (asset) {
              asset.capacity = new BigNumber(asset.capacity).plus(i.capacity).toString()
              asset.udtInfo.amount = new BigNumber(asset.udtInfo.amount).plus(i.udtInfo.amount).toString()
            }
            break
          }
          case 'did_cell':
          case 'spore_cell': {
            asset = list.find(j => j.cellType === i.cellType && j.tokenId === i.tokenId) as
              | LiteTransfer.SporeTransfer
              | undefined
            if (asset) {
              asset.capacity = new BigNumber(asset.capacity).plus(i.capacity).toString()
              asset.count = new BigNumber(asset.count).plus(i.count).toString()
            }
            break
          }
          case 'nrc_721_token':
          case 'cota_regular': {
            // ignore
            break
          }
          default: {
            // ignore
          }
        }

        if (!asset) {
          list.push(i)
        }
      })
      m.set(tf.address, list)
    })
    return m
  }, [digest?.transfers])

  if (!isFetched) {
    return (
      <div className={styles.digestLoading}>
        <SmallLoading />
      </div>
    )
  }
  if (!digest) {
    return <div className={styles.noRecords}>{t('transaction.no_records')}</div>
  }

  return (
    <div className={styles.content}>
      {digest.commitment ? (
        <div className={styles.transactionInfo}>
          <div className={styles.txid}>
            <span>{t('address.seal_tx_on_bitcoin')}</span>
            {digest.txid && (
              <>
                <AddressText
                  ellipsisMiddle={!isMobile}
                  linkProps={{
                    to: `/transaction/${hash}`,
                  }}
                  className={styles.address}
                  style={{ overflow: 'hidden' }}
                >
                  {digest.txid}
                </AddressText>
                <Link
                  to={`${config.BITCOIN_EXPLORER}${IS_MAINNET ? '' : `/${identity}`}/tx/${digest.txid}`}
                  className={styles.action}
                >
                  <RedirectIcon />
                </Link>
              </>
            )}
          </div>
          <div className={styles.btcConfirmationsAndDirection}>
            {typeof digest.confirmations === 'number' && (
              <span className={styles.blockConfirm}>({digest.confirmations} Confirmations on Bitcoin)</span>
            )}
          </div>
          <div className={styles.commitment}>
            <span>Commitment:</span>
            <div style={{ width: '64ch', minWidth: '20ch' }}>
              <EllipsisMiddle text={digest.commitment} className={styles.commitmentText} />
              <SimpleButton
                className={styles.action}
                onClick={() => {
                  navigator.clipboard.writeText(digest.commitment)
                  setToast({ message: t('common.copied') })
                }}
              >
                <CopyIcon />
              </SimpleButton>
            </div>
          </div>
        </div>
      ) : null}
      <div className={styles.list}>
        {transfers.size ? (
          [...transfers.entries()].map(([address, transfers]) => (
            <TransactionRGBPPDigestTransfer address={address} transfers={transfers} />
          ))
        ) : (
          <div className={styles.noRecords}>{t('transaction.no_records')}</div>
        )}
      </div>
    </div>
  )
}
