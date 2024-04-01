import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Tooltip } from 'antd'
import { useQuery } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import { ReactComponent as CopyIcon } from '../../../assets/copy_icon.svg'
import { TransactionRGBPPDigestTransfer } from './TransactionRGBPPDigestTransfer'
import { useSetToast } from '../../Toast'
import { explorerService, LiteTransfer } from '../../../services/ExplorerService'
import SmallLoading from '../../Loading/SmallLoading'
import { TransactionLeapDirection } from '../../RGBPP/types'
import SimpleButton from '../../SimpleButton'
import EllipsisMiddle from '../../EllipsisMiddle'
import styles from './styles.module.scss'
import AddressText from '../../AddressText'

export const TransactionRGBPPDigestContent = ({
  leapDirection,
  hash,
}: {
  leapDirection: TransactionLeapDirection
  hash: string
}) => {
  const { t } = useTranslation()
  const setToast = useSetToast()

  const { data, isFetched } = useQuery(['rgb-digest', hash], () => explorerService.api.fetchRGBDigest(hash))

  const transfers = useMemo(() => {
    const m = new Map<string, LiteTransfer.Transfer[]>()
    data?.data.transfers?.forEach(tf => {
      const list = m.get(tf.address) || []
      tf.transfers.forEach(i => {
        let asset: LiteTransfer.Transfer | undefined
        switch (i.cellType) {
          case 'normal': {
            asset = list.find(j => j.cellType === 'normal')
            break
          }
          case 'udt':
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
  }, [data?.data.transfers])

  if (!isFetched) {
    return (
      <div className={styles.digestLoading}>
        <SmallLoading />
      </div>
    )
  }
  if (!data) {
    return <div className={styles.noRecords}>{t('transaction.no_records')}</div>
  }

  return (
    <div className={styles.content}>
      <div className={styles.transactionInfo}>
        <div className={styles.txid}>
          <span>{t('address.seal_tx_on_bitcoin')}</span>
          {data.data.txid && (
            <AddressText
              linkProps={{
                to: `/transaction/${hash}`,
              }}
              className={styles.address}
            >
              {data.data.txid}
            </AddressText>
          )}
          {data.data.confirmations && (
            <span className={styles.blockConfirm}>({data.data.confirmations} Confirmations on Bitcoin)</span>
          )}
          {leapDirection !== TransactionLeapDirection.NONE ? (
            <Tooltip placement="top" title={t(`address.leap_${leapDirection}_tip`)}>
              <span className={styles.leap}>{t(`address.leap_${leapDirection}`)}</span>
            </Tooltip>
          ) : null}
        </div>
        {data.data.commitment ? (
          <div className={styles.commitment}>
            <span>Commitment:</span>
            <EllipsisMiddle text={data.data.commitment} className={styles.commitmentText} />
            <SimpleButton
              className={styles.action}
              onClick={() => {
                navigator.clipboard.writeText(data.data.commitment)
                setToast({ message: t('common.copied') })
              }}
            >
              <CopyIcon />
            </SimpleButton>
          </div>
        ) : null}
      </div>
      {transfers.size ? (
        [...transfers.entries()].map(([address, transfers]) => (
          <TransactionRGBPPDigestTransfer address={address} transfers={transfers} />
        ))
      ) : (
        <div className={styles.noRecords}>{t('transaction.no_records')}</div>
      )}
    </div>
  )
}
