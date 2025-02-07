import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { parseNumericAbbr } from '../../../../utils/chart'
import { localeNumberString } from '../../../../utils/number'
import { shannonToCkb } from '../../../../utils/util'
import styles from './index.module.scss'

const MeanAndMedium = ({
  meanFeeRate,
  medianFeeRate,
  meanLockedCapacity,
  medianLockedCapacity,
}: Record<'meanFeeRate' | 'meanLockedCapacity' | 'medianFeeRate' | 'medianLockedCapacity', string | null>) => {
  const [t] = useTranslation()
  const [isMean, setIsMean] = useState(true)

  const handleSwitch = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    e.preventDefault()
    const { isMean } = e.currentTarget.dataset
    setIsMean(isMean === 'true')
  }

  return (
    <div className={styles.container}>
      <div className={styles.switch}>
        <button type="button" data-is-mean onClick={handleSwitch} data-is-active={isMean}>
          {t('fiber.graph.mean')}
        </button>
        <button type="button" data-is-medium onClick={handleSwitch} data-is-active={!isMean}>
          {t('fiber.graph.median')}
        </button>
      </div>

      <div className={styles.values}>
        {isMean ? (
          <div>
            <span>{t('fiber.graph.mean_locked_capacity')}</span>
            {typeof meanLockedCapacity === 'string' ? (
              <span className={styles.value}>
                {parseNumericAbbr(shannonToCkb(meanLockedCapacity), 2)}
                <small>CKB</small>
              </span>
            ) : null}
          </div>
        ) : (
          <div>
            <span>{t('fiber.graph.median_locked_capacity')}</span>
            {typeof medianLockedCapacity === 'string' ? (
              <span className={styles.value}>
                {parseNumericAbbr(shannonToCkb(medianLockedCapacity), 2)}
                <small>CKB</small>
              </span>
            ) : null}
          </div>
        )}
        <hr />
        {isMean ? (
          <div>
            <span>{t('fiber.graph.mean_fee_rate')}</span>
            {typeof meanFeeRate === 'string' ? (
              <span className={styles.value}>
                {localeNumberString(meanFeeRate)}
                <small>shannon/kB</small>
              </span>
            ) : null}
          </div>
        ) : (
          <div>
            <span>{t('fiber.graph.median_fee_rate')}</span>
            {typeof medianFeeRate === 'string' ? (
              <span className={styles.value}>
                {medianFeeRate}
                <small>shannon/kB</small>
              </span>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}

export default MeanAndMedium
