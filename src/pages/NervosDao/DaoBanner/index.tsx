import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ReactComponent as GoIcon } from '../../../assets/go.svg'
import RewardCalcutorModal from '../RewardCalcutorModal'
import { NERVOS_DAO_RFC_URL } from '../../../constants/common'
import styles from './DaoBanner.module.scss'

const DaoBanner = ({ estimatedApc }: { estimatedApc: string }) => {
  const [showRewardCalcutorModal, setShowRewardCalcutorModal] = useState(false)
  const { t } = useTranslation()

  return (
    <div className={styles.bannerContainer}>
      <div className={styles.content}>
        <p className={styles.title}>{t('nervos_dao.deposit_to_dao')}</p>
        <p className={styles.description}>{t('nervos_dao.deposit_to_dao_description')}</p>
        <div className={styles.actions}>
          <button type="button" className={styles.btn} onClick={() => setShowRewardCalcutorModal(true)}>
            {t('nervos_dao.reward_calculator')}
          </button>
          <a className={styles.btn} href={NERVOS_DAO_RFC_URL} target="_blank" rel="noopener noreferrer">
            {t('nervos_dao.nervos_dao_rfc')}
            <GoIcon className={styles.icon} />
          </a>
          <a
            className={styles.btn}
            href="https://www.nervos.org/knowledge-base/nervosdao_withdrawal_process_explained"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('nervos_dao.learn_more')}
            <GoIcon className={styles.icon} />
          </a>
        </div>
      </div>

      {showRewardCalcutorModal ? (
        <RewardCalcutorModal estimatedApc={estimatedApc} onClose={() => setShowRewardCalcutorModal(false)} />
      ) : null}
    </div>
  )
}

export default DaoBanner
