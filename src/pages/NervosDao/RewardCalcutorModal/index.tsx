import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Input } from 'antd'
import { Trans, useTranslation } from 'react-i18next'
import BigNumber from 'bignumber.js'
import CommonModal from '../../../components/CommonModal'
import Loading from '../../../components/AwesomeLoadings/Spinner'
import CloseIcon from '../../../assets/modal_close.png'
import { ReactChartCore } from '../../StatisticsChart/common'
import { MIN_DEPOSIT_AMOUNT, NERVOS_DAO_RFC_URL, IS_MAINNET, MAX_DECIMAL_DIGITS } from '../../../constants/common'
import { localeNumberString } from '../../../utils/number'
import styles from './RewardCalcutorModal.module.scss'

const INIT_DEPOSIT_VALUE = '1000'

const RewardCalcutorModal = ({ onClose, estimatedApc }: { onClose: () => void; estimatedApc: string }) => {
  const { t } = useTranslation()
  const [depositValue, setDepositValue] = useState<string>(INIT_DEPOSIT_VALUE)
  const [years, setYears] = useState<number>(5)

  const yearReward = useMemo(() => {
    const EMPTY = BigNumber(0)
    if (!estimatedApc) return EMPTY
    if (!depositValue) return EMPTY
    const v = BigNumber(depositValue)

    if (v.isNaN() || v.isNegative()) return EMPTY

    const amount = v.minus(MIN_DEPOSIT_AMOUNT)
    if (amount.isNegative()) return EMPTY

    const yearReward = amount.multipliedBy(estimatedApc).dividedBy(100)
    return yearReward
  }, [depositValue, estimatedApc])

  const monthReward = yearReward.dividedBy(12)

  const handleDepositChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation()
    e.preventDefault()
    const { value } = e.currentTarget
    const v = value.replace(/,/g, '')
    if (!v) {
      setDepositValue('')
      return
    }
    setDepositValue(v)
  }

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation()
    e.preventDefault()
    const y = +e.currentTarget.value
    if (y < 1) {
      return
    }
    setYears(y)
  }
  if (!estimatedApc) {
    return (
      <CommonModal isOpen onClose={onClose}>
        <div className={styles.modalWrapper}>
          <div className={styles.contentWrapper}>
            <div className={styles.modalTitle}>
              <p>{t('nervos_dao.dao_reward_calculator')}</p>
              <button type="button" onClick={onClose} className={styles.closeBtn}>
                <img src={CloseIcon} alt="close icon" />
              </button>
            </div>
            <div className={styles.subTitle}>
              <Trans
                i18nKey="nervos_dao.deposit_terms"
                components={[
                  <a href={NERVOS_DAO_RFC_URL} className={styles.rfcLink} target="_blank" rel="noreferrer">
                    Nervos DAO RFC
                  </a>,
                ]}
              />
            </div>
            <div className={styles.divider} />
            <div className={styles.loading}>
              <Loading />
            </div>
          </div>
        </div>
      </CommonModal>
    )
  }

  return (
    <CommonModal isOpen onClose={onClose}>
      <div className={styles.modalWrapper}>
        <div className={styles.contentWrapper}>
          <div className={styles.modalTitle}>
            <p>{t('nervos_dao.dao_reward_calculator')}</p>
            <button type="button" onClick={onClose} className={styles.closeBtn}>
              <img src={CloseIcon} alt="close icon" />
            </button>
          </div>
          <div className={styles.subTitle}>
            <Trans
              i18nKey="nervos_dao.deposit_terms"
              components={[
                <a href={NERVOS_DAO_RFC_URL} className={styles.rfcLink} target="_blank" rel="noreferrer">
                  Nervos DAO RFC
                </a>,
              ]}
            />
          </div>

          <div className={styles.divider} />
          <div className={styles.modalContent}>
            <h2>{t('nervos_dao.you_deposit')}</h2>
            <Input
              value={
                /\.$/.test(depositValue)
                  ? `${localeNumberString(depositValue.slice(0, -1))}.`
                  : localeNumberString(depositValue)
              }
              className={styles.input}
              suffix="CKB"
              onChange={handleDepositChange}
            />
            <h2>{t('nervos_dao.you_can_withdraw')}</h2>
            <p>{t(`nervos_dao.estimated_rewards`, { days: 30 })}</p>
            <Input
              value={localeNumberString(monthReward.plus(depositValue).toFixed(MAX_DECIMAL_DIGITS))}
              className={styles.input}
              suffix="CKB"
              disabled
            />
            <p>{t(`nervos_dao.estimated_rewards`, { days: 360 })}</p>
            <Input
              value={localeNumberString(yearReward.plus(depositValue).toFixed(MAX_DECIMAL_DIGITS))}
              className={styles.input}
              suffix="CKB"
              disabled
            />
            <div className={styles.notice}>{t('nervos_dao.deposit_notice')}</div>

            <div className={styles.apcHeader}>
              <h2 className={styles.apcTitle}>
                {t('nervos_dao.estimated_APC')}
                <Link to="charts/nominal-apc" target="_blank">
                  {`(${t('nervos_dao.view_apc_trending')})`}
                </Link>
              </h2>
            </div>
            <Input value={`${estimatedApc}%`} className={styles.input} disabled />

            <h2 className={styles.years}>
              {t('nervos_dao.estimated_rewards_in_years')}
              <input onChange={handleYearChange} value={years} type="number" min="1" />
              {t('nervos_dao.years')}
            </h2>
            <div className={styles.chartWap}>
              <p className={styles.yTitle}>{t('nervos_dao.rewards')}</p>
              <ReactChartCore
                option={{
                  color: IS_MAINNET ? ['#00cc9b'] : ['#9a2cec'],
                  tooltip: {
                    show: true,
                    formatter: '{c} CKB',
                  },
                  grid: { top: 12, right: 30, bottom: 80, left: 78 },
                  xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: Array.from({ length: years }, (_, i) => i + 1),
                    axisLabel: {
                      formatter: (value: string) =>
                        +value > 1 ? `${value} ${t('nervos_dao.years')}` : `${value} ${t('nervos_dao.year')}`,
                    },
                  },
                  yAxis: {
                    type: 'value',
                    axisLabel: {
                      formatter: (value: string) => `${value} CKB`,
                    },
                    boundaryGap: ['20%', '20%'],
                  },
                  series: [
                    {
                      data: Array.from({ length: years }, (_, i) =>
                        yearReward
                          .multipliedBy(BigNumber(1 + +estimatedApc / 100).exponentiatedBy(i + 1))
                          .toFixed(8, BigNumber.ROUND_DOWN),
                      ),
                      type: 'line',
                      stack: 'withdrawal',
                      areaStyle: {},
                      label: {
                        normal: {
                          show: years <= 5,
                          position: 'top',
                          formatter: '{c} CKB',
                        },
                      },
                    },
                  ],
                }}
                notMerge
                lazyUpdate
                style={{ height: '100%', width: '100%' }}
              />
              <p className={styles.xTitle}>{t('nervos_dao.years')}</p>
            </div>
          </div>

          <button type="button" className={styles.doneBtn} onClick={onClose}>
            {t('nervos_dao.done')}
          </button>
        </div>
      </div>
    </CommonModal>
  )
}

export default RewardCalcutorModal