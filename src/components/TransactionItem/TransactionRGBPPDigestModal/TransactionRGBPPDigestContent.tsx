import { useTranslation } from 'react-i18next'
import { Tooltip } from 'antd'
import styles from './styles.module.scss'
import { ReactComponent as CopyIcon } from '../../../assets/copy_icon.svg'
import { TransactionLeapDirection } from './types'
import { TransactionRGBPPDigestTransfer } from './TransactionRGBPPDigestTransfer'
import { useSetToast } from '../../Toast'
import { RGBDigest } from '../../../services/ExplorerService'

export const TransactionRGBPPDigestContent = ({
  tx,
  leapDirection,
}: {
  tx: RGBDigest
  leapDirection: TransactionLeapDirection
}) => {
  const { t } = useTranslation()
  const setToast = useSetToast()

  return (
    <div className={styles.content}>
      <div className={styles.transactionInfo}>
        <div className={styles.left}>
          <span>{t('address.seal_tx_on_bitcoin')}</span>
          <span className={styles.transactionHash}>{tx.txId}</span>
          <span className={styles.blockConfirm}>({tx.confirmations} Bitcoin Confirmed)</span>
          <Tooltip placement="top" title={t(`address.leap_${leapDirection}_tip`)}>
            <span className={styles.leap}>{t(`address.leap_${leapDirection}`)}</span>
          </Tooltip>
        </div>
        <div className={styles.right}>
          <span>Commitment:</span>
          <span>{tx.commitment}</span>
          <CopyIcon
            onClick={() => {
              navigator.clipboard.writeText(tx.commitment).then(
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
      {(tx.transfers ?? []).map(transfer => (
        <TransactionRGBPPDigestTransfer transfer={transfer} />
      ))}
    </div>
  )
}
