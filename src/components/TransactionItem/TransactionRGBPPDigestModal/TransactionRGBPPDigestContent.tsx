import { useTranslation } from 'react-i18next'
import { Tooltip } from 'antd'
import { useQuery } from '@tanstack/react-query'
import styles from './styles.module.scss'
import { ReactComponent as CopyIcon } from '../../../assets/copy_icon.svg'
import { TransactionLeapDirection } from './types'
import { TransactionRGBPPDigestTransfer } from './TransactionRGBPPDigestTransfer'
import { useSetToast } from '../../Toast'
import { explorerService } from '../../../services/ExplorerService'
import AddressText from '../../AddressText'
import SmallLoading from '../../Loading/SmallLoading'

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

  if (!isFetched) {
    return (
      <div className={styles.digestLoading}>
        <SmallLoading />{' '}
      </div>
    )
  }
  if (!data) {
    return <div className={styles.noRecords}>no</div>
  }
  return (
    <div className={styles.content}>
      <div className={styles.transactionInfo}>
        <div className={styles.left}>
          <span>{t('address.seal_tx_on_bitcoin')}</span>
          <AddressText
            className={styles.transactionHash}
            style={{ maxWidth: '319px' }}
            onClick={() => {
              navigator.clipboard.writeText(data.data.txid).then(
                () => {
                  setToast({ message: t('common.copied') })
                },
                error => {
                  console.error(error)
                },
              )
            }}
          >
            {data.data.txid}
          </AddressText>
          <span className={styles.blockConfirm}>({data.data.confirmations} Bitcoin Confirmed)</span>
          <Tooltip placement="top" title={t(`address.leap_${leapDirection}_tip`)}>
            <span className={styles.leap}>{t(`address.leap_${leapDirection}`)}</span>
          </Tooltip>
        </div>
        <div className={styles.right}>
          <span className={styles.commitment}>Commitment:</span>
          <AddressText style={{ maxWidth: '101px' }} className={styles.commitment}>
            {data.data.commitment}
          </AddressText>
          <CopyIcon
            onClick={() => {
              navigator.clipboard.writeText(data.data.commitment).then(
                () => {
                  setToast({ message: t('common.copied') })
                },
                error => {
                  console.error(error)
                },
              )
            }}
          />
        </div>
      </div>
      {data.data.transfers ? (
        data.data.transfers.map(transfer =>
          transfer && transfer.address ? <TransactionRGBPPDigestTransfer transfer={transfer} /> : null,
        )
      ) : (
        <div className={styles.noRecords}>no</div>
      )}
    </div>
  )
}
