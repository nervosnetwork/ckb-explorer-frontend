import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import styles from './styles.module.scss'
import CloseIcon from '../../../assets/modal_close.png'
import { TransactionRGBPPDigestContent } from './TransactionRGBPPDigestContent'
import { explorerService } from '../../../services/ExplorerService'
import { TransactionLeapDirection } from '../../RGBPP/types'

const TransactionRGBPPDigestModal = ({ hash, onClickClose }: { onClickClose: Function; hash: string }) => {
  const { t } = useTranslation()

  const { data, isFetched } = useQuery(['rgb-digest', hash], () => explorerService.api.fetchRGBDigest(hash))

  const direction = useMemo(() => {
    switch (data?.data.leapDirection) {
      case 'in':
        return TransactionLeapDirection.IN
      case 'leapoutBTC':
        return TransactionLeapDirection.OUT
      case 'withinBTC':
        return TransactionLeapDirection.WITH_IN_BTC
      default:
        return TransactionLeapDirection.NONE
    }
  }, [data])

  if (isFetched && data?.data) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.left}>
            <span>{t('address.transaction_rgbpp_digest')}</span>
            {direction !== TransactionLeapDirection.NONE && (
              <span className={styles.leap}>{t(`address.leap_${direction}`)}</span>
            )}
          </div>
          <button onClick={() => onClickClose()} type="button" className={styles.buttonClose}>
            <img src={CloseIcon} alt="close icon" className={styles.closeIcon} />
          </button>
        </div>
        <TransactionRGBPPDigestContent hash={hash} digest={data?.data} isFetched={isFetched} />
      </div>
    )
  }
  return null
}

export default TransactionRGBPPDigestModal
