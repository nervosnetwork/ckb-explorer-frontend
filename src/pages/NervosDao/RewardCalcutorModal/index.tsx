import { useState, useMemo } from 'react'
import { Input } from 'antd'
import { Trans, useTranslation } from 'react-i18next'
import CommonModal from '../../../components/CommonModal'
import styles from './RewardCalcutorModal.module.scss'
import { ReactChartCore } from '../../StatisticsChart/common'
import CloseIcon from '../../../assets/modal_close.png'
import { MIN_DEPOSIT_AMOUNT, MAX_DECIMAL_DIGITS, NERVOS_DAO_RFC_URL } from '../../../constants/common'
import { ckbToShannon, shannonToCkb } from '../../../utils/util'
import { localeNumberString } from '../../../utils/number'
import { isMainnet } from '../../../utils/chain'

const RewardCalcutorModal = ({ onClose, estimatedApc }: { onClose: () => void; estimatedApc: string }) => {
  const [depositValue, setDepositValue] = useState('1000')
  const { t } = useTranslation()

  const [annualRewards, monthRewards] = useMemo(() => {
    const amount = Number(depositValue) - MIN_DEPOSIT_AMOUNT
    const value = ckbToShannon((amount > 0 ? amount : 0).toFixed(MAX_DECIMAL_DIGITS).toString())

    const dpc = Number(estimatedApc || 0) / 365 / 100

    const mRewards = (Number(value) * dpc * 30).toFixed(0).toString()

    const rewerds = (Number(value) * dpc * 360).toFixed(0).toString()

    return [shannonToCkb(rewerds), shannonToCkb(mRewards)]
  }, [depositValue, estimatedApc])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { value } = e.target

    value = value.replace(/,/g, '')

    const charReg = /[^\d.]/g

    if (charReg.test(value)) {
      value = value.replace(charReg, '')
    }

    setDepositValue(value)
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
                <a href={NERVOS_DAO_RFC_URL} className={styles.rfcLink}>
                  Nervos DAO RFC
                </a>,
              ]}
            />
          </div>

          <div className={styles.divider} />
          <div className={styles.modalContent}>
            <h2>{t('nervos_dao.you_deposit')}</h2>
            <Input
              value={localeNumberString(depositValue)}
              maxLength={15}
              className={styles.input}
              suffix="CKB"
              onChange={handleInputChange}
            />
            <h2>{t('nervos_dao.you_can_withdraw')}</h2>
            <p>{t(`nervos_dao.estimated_rewards`, { days: 30 })}</p>
            <Input value={localeNumberString(monthRewards)} className={styles.input} suffix="CKB" disabled />
            <p>{t(`nervos_dao.estimated_rewards`, { days: 360 })}</p>
            <Input value={localeNumberString(annualRewards)} className={styles.input} suffix="CKB" disabled />
            <div className={styles.notice}>{t('nervos_dao.deposit_notice')}</div>

            <div className={styles.apcHeader}>
              <h2 className={styles.apcTitle}>{t('nervos_dao.estimated_APC')}</h2>
            </div>
            <Input value={`${estimatedApc}%`} className={styles.input} disabled />

            <h2>{t('nervos_dao.estimated_rewards_30')}</h2>
            <div className={styles.chartWap}>
              <p className={styles.yTitle}>{t('nervos_dao.rewards')}</p>
              <ReactChartCore
                option={{
                  color: [isMainnet() ? '#00cc9b' : '#9a2cec'],
                  grid: { top: 12, right: 30, bottom: 80, left: 78 },
                  xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: ['0', '30'],
                  },
                  yAxis: {
                    type: 'value',
                  },
                  series: [
                    {
                      data: [0, Number(monthRewards)],
                      type: 'line',
                      areaStyle: {},
                    },
                  ],
                }}
                notMerge
                lazyUpdate
                style={{
                  height: '100%',
                  width: '100%',
                }}
              />
              <p className={styles.xTitle}>{t('nervos_dao.day')}</p>
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
