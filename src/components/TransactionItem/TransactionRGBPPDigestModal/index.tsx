import { useTranslation } from 'react-i18next'
import styles from './styles.module.scss'
import CloseIcon from '../../../assets/modal_close.png'
import { TransactionRGBPPDigestContent } from './TransactionRGBPPDigestContent'
import { TransactionLeapDirection } from '../../RGBPP/types'

const TransactionRGBPPDigestModal = ({
  hash,
  leapDirection,
  onClickClose,
}: {
  onClickClose: Function
  hash: string
  leapDirection: TransactionLeapDirection
}) => {
  const { t } = useTranslation()

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.left}>{t('address.transaction_rgbpp_digest')}</span>
        <button onClick={() => onClickClose()} type="button" className={styles.buttonClose}>
          <img src={CloseIcon} alt="close icon" className={styles.closeIcon} />
        </button>
      </div>
      <TransactionRGBPPDigestContent leapDirection={leapDirection} hash={hash} />
    </div>
  )
}

export default TransactionRGBPPDigestModal
