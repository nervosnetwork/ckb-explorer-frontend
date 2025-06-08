import { useTranslation } from 'react-i18next'
import { useCountdown, useHalving } from '../../hooks'
import styles from './index.module.scss'

export const HalvingCountdown = () => {
  const { t } = useTranslation()
  const { estimatedDate } = useHalving()
  const [days, hours, minutes, seconds] = useCountdown(estimatedDate)

  return (
    <div className={styles.halvingCountdown}>
      <div className={styles.digitalClockItem}>
        <div className={styles.digitalClockNumber}>
          <span>{days}</span>
        </div>
        <div className={styles.digitalClockText}>{t('common.days')}</div>
      </div>
      <div className={styles.digitalClockSeparate} />
      <div className={styles.digitalClockItem}>
        <div className={styles.digitalClockNumber}>
          <span>{hours.toString().padStart(2, '0')}</span>
        </div>
        <div className={styles.digitalClockText}>{t('common.hours')}</div>
      </div>
      <div className={styles.digitalClockSeparate} />
      <div className={styles.digitalClockItem}>
        <div className={styles.digitalClockNumber}>
          <span>{minutes.toString().padStart(2, '0')}</span>
        </div>
        <div className={styles.digitalClockText}>{t('common.minutes')}</div>
      </div>
      <div className={styles.digitalClockSeparate} />
      <div className={styles.digitalClockItem}>
        <div className={styles.digitalClockNumber}>
          <span>{seconds.toString().padStart(2, '0')}</span>
        </div>
        <div className={styles.digitalClockText}>{t('common.seconds')}</div>
      </div>
    </div>
  )
}
