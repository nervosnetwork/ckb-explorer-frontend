import { useTranslation } from 'react-i18next'
import { shannonToCkb } from '../../../utils/util'
import { useIsMobile } from '../../../hooks'
import Capacity from '../../../components/Capacity'
import styles from './index.module.scss'

export type Reward = {
  baseReward: string
  secondaryReward: string
  commitReward: string
  proposalReward: string
}

const useRewards = (reward: Reward, isMobile: boolean) => {
  const { t } = useTranslation()
  return [
    {
      name: isMobile ? t('transaction.base') : t('transaction.base_reward'),
      capacity: reward.baseReward,
    },
    {
      name: isMobile ? t('transaction.secondary') : t('transaction.secondary_reward'),
      capacity: reward.secondaryReward,
    },
    {
      name: isMobile ? t('transaction.commit') : t('transaction.commit_reward'),
      capacity: reward.commitReward,
    },
    {
      name: isMobile ? t('transaction.proposal') : t('transaction.proposal_reward'),
      capacity: reward.proposalReward,
    },
  ]
}

const TransactionReward = ({ reward }: { reward: Reward }) => {
  const isMobile = useIsMobile()
  const { t } = useTranslation()
  const rewards = useRewards(reward, isMobile)

  return (
    <div className={styles.rewardPenal}>
      <div className="transactionRewardTitle">{t('transaction.reward_info')}</div>
      {rewards.map(reward => (
        <div className={styles.rewardItemPenal} key={reward.name}>
          <div className="rewardName">{reward.name}</div>
          <div className="rewardCapacity">
            <Capacity capacity={shannonToCkb(reward.capacity)} />
          </div>
        </div>
      ))}
    </div>
  )
}

export default TransactionReward
