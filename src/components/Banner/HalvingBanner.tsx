import classnames from 'classnames'
import { useTranslation } from 'react-i18next'
import styles from './index.module.scss'
import halvingBanner from './halving_banner.png'
import halvingBannerSuccess from './halving_banner_success.png'
import halvingBannerSuccessMobile from './halving_banner_success_mobile.png'
import { ReactComponent as MoveIcon } from './move.svg'
import LoadingWhiteImage from '../../assets/loading_white.gif'
import halvingSuccessAni from './halving_success_ani.gif'
import SimpleButton from '../SimpleButton'
import { useCountdown, useHalving, useIsMobile } from '../../utils/hook'

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
  const { estimatedDate, halvingCount, inCelebration, isLoading } = useHalving()
  const [days, hours, minutes, seconds, countdown] = useCountdown(estimatedDate)
  const isMobile = useIsMobile()
  const [t, { language }] = useTranslation()

  const shortCountdown = () => {
    if (isLoading || Number.isNaN(seconds)) {
      return <img className={styles.halvingLoading} src={LoadingWhiteImage} alt="loading" />
    }
    if (days > 0) {
      return `${days}${t('symbol.char_space')}${t('unit.days')}`
    }
    if (hours > 0) {
      return `${hours}${t('symbol.char_space')}${t('unit.hours')}`
    }
    if (minutes > 0) {
      return `${minutes}${t('symbol.char_space')}${t('unit.minutes')}`
    }

    return `${seconds}${t('symbol.char_space')}${t('unit.seconds')}`
  }

  const learnMoreText = () => {
    if (inCelebration) {
      return t('halving.learn_more')
    }

    if (countdown <= 3) {
      return t('halving.coming_soon')
    }

    return (
      <>
        {t('halving.halving_countdown')} {shortCountdown()}
      </>
    )
  }

  const bgImage = (() => {
    if (!inCelebration) {
      return halvingBanner
    }

    if (isMobile) {
      return halvingBannerSuccessMobile
    }

    return halvingBannerSuccess
  })()

  return (
    <div
      className={classnames(styles.halvingBannerWrapper, { [styles.halvingBannerSuccess]: inCelebration })}
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      <div className={styles.halvingBannerShadow}>
        <div className={classnames(styles.halvingBanner, 'container')}>
          {inCelebration && <img className={styles.halvingBannerAnimation} src={halvingSuccessAni} alt="animation" />}
          {inCelebration ? (
            <div className={classnames(styles.halvingBannerText, styles.success)}>
              {t('halving.banner_congratulation', {
                times: t(`ordinal.${numberToOrdinal(halvingCount)}`),
              }).toUpperCase()}
            </div>
          ) : (
            <div className={classnames(styles.halvingBannerText, styles.linear)}>
              {`Nervos CKB ${t(`ordinal.${numberToOrdinal(halvingCount)}`)}${language === 'en' ? ' ' : ''}${t(
                'halving.halving',
              )}`}
            </div>
          )}
          <a href="/halving">
            <SimpleButton className={styles.learnMoreButton}>
              {learnMoreText()}
              <MoveIcon style={{ marginTop: 2 }} />
            </SimpleButton>
          </a>
        </div>
      </div>
    </div>
  )
}
