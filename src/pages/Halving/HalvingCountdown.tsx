import { useTranslation } from 'react-i18next'
import { useCountdown, useHalving } from '../../hooks'
import styles from './index.module.scss'

export const HalvingCountdown = () => {
  const { t } = useTranslation()
  const { estimatedDate } = useHalving()
  const [days, hours, minutes, seconds] = useCountdown(estimatedDate)

  return (
    <div className={styles.halvingCountdown}>
      <div className={styles.digtialClockItem}>
        <div className={styles.digtialClockNumber}>
          <span>{days}</span>
        </div>
        <div className={styles.digtialClockText}>{t('common.days')}</div>
      </div>
      <div className={styles.digtialClockSeparate} />
      <div className={styles.digtialClockItem}>
        <div className={styles.digtialClockNumber}>
          <span>{hours.toString().padStart(2, '0')}</span>
        </div>
        <div className={styles.digtialClockText}>{t('common.hours')}</div>
      </div>
      <div className={styles.digtialClockSeparate} />
      <div className={styles.digtialClockItem}>
        <div className={styles.digtialClockNumber}>
          <span>{minutes.toString().padStart(2, '0')}</span>
        </div>
        <div className={styles.digtialClockText}>{t('common.minutes')}</div>
      </div>
      <div className={styles.digtialClockSeparate} />
      <div className={styles.digtialClockItem}>
        <div className={styles.digtialClockNumber}>
          <span>{seconds.toString().padStart(2, '0')}</span>
        </div>
        <div className={styles.digtialClockText}>{t('common.seconds')}</div>
      </div>
    </div>
  )
}
