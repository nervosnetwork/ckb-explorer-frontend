import classnames from 'classnames'
import styles from './index.module.scss'
import halvingBanner from '../../assets/halving_banner.png'
import halvingBannerSuccess from '../../assets/halving_banner_success.png'
import SimpleButton from '../SimpleButton'
import { useCountdown, useHalving } from '../../utils/hook'
import i18n from '../../utils/i18n'
import { capitalizeFirstLetter } from '../../utils/string'
import { fetchCachedData } from '../../utils/cache'

function numberToOrdinal(number: number) {
  switch (number) {
    case 1:
      return 'first'
    case 2:
      return 'second'
    default:
      break
  }

  switch (number % 10) {
    case 1:
      return `${number}st`
    case 2:
      return `${number}nd`
    case 3:
      return `${number}rd`
    default:
      return `${number}th`
  }
}

export const HalvingBanner = () => {
  const { estimatedDate, nextHalvingCount } = useHalving()
  const [days, hours, minutes, seconds] = useCountdown(estimatedDate)
  const lastedHavingKey = `lasted-having-${nextHalvingCount - 1}`
  const unreadLastedHaving = nextHalvingCount > 1 && fetchCachedData(lastedHavingKey) === null

  const shortCountdown = () => {
    if (days > 0) {
      return `${days}${i18n.t('symbol.char_space')}${capitalizeFirstLetter(i18n.t('unit.days'))}`
    }
    if (hours > 0) {
      return `${hours}${i18n.t('symbol.char_space')}${capitalizeFirstLetter(i18n.t('unit.hours'))}`
    }
    if (minutes > 0) {
      return `${minutes}${i18n.t('symbol.char_space')}${capitalizeFirstLetter(i18n.t('unit.minutes'))}`
    }
    if (seconds > 0) {
      return `${seconds}${i18n.t('symbol.char_space')}${capitalizeFirstLetter(i18n.t('unit.seconds'))}`
    }
    return `${capitalizeFirstLetter(i18n.t('halving.halving'))}!`
  }

  return (
    <div
      className={classnames(styles.halvingBannerWrapper, { [styles.halvingBannerSuccess]: unreadLastedHaving })}
      style={{
        backgroundImage: `url(${unreadLastedHaving ? halvingBannerSuccess : halvingBanner})`,
      }}
    >
      <div className={styles.halvingBannerShadow}>
        <div className={classnames(styles.halvingBanner, 'container')}>
          {unreadLastedHaving ? (
            <div className={styles.halvingBannerText}>
              {i18n.t('halving.banner_congratulation', {
                times: i18n.t(`ordinal.${numberToOrdinal(nextHalvingCount - 1)}`),
              })}
            </div>
          ) : (
            <div className={styles.halvingBannerText}>
              Nervos CKB Layer 1 {capitalizeFirstLetter(i18n.t('halving.halving'))}
            </div>
          )}
          <a href="/halving">
            <SimpleButton className={styles.learnMoreButton}>
              {unreadLastedHaving
                ? i18n.t('halving.learn_more')
                : `${i18n.t('halving.halving_countdown')} ${shortCountdown()}`}
            </SimpleButton>
          </a>
        </div>
      </div>
    </div>
  )
}
