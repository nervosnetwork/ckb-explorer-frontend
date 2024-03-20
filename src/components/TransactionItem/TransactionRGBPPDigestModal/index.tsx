import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import styles from './styles.module.scss'
import { ReactComponent as CloseIcon } from '../../../assets/close_icon.svg'
import { explorerService } from '../../../services/ExplorerService'
import { TransactionRGBPPDigestContent } from './TransactionRGBPPDigestContent'
import { TransactionLeapDirection } from './types'

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

  const { data } = useQuery(['rgb-digest', hash], () => explorerService.api.fetchRGBDigest(hash))

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.left}>{t('address.transaction_rgbpp_digest')}</span>
        <CloseIcon className={styles.right} onClick={() => onClickClose()} />
      </div>
      {data && <TransactionRGBPPDigestContent tx={data.data} leapDirection={leapDirection} />}
    </div>
  )
}

export default TransactionRGBPPDigestModal
