import { useTranslation } from 'react-i18next'
import { shannonToCkb } from '../../../utils/util'
import { localeNumberString } from '../../../utils/number'
import DecimalCapacity from '../../../components/DecimalCapacity'
import { RewardPenal, RewardItemPenal } from './styled'
import { useIsMobile } from '../../../utils/hook'

const useRewards = (cell: State.Cell, isMobile: boolean) => {
  const { t } = useTranslation()
  return [
    {
      name: isMobile ? t('transaction.base') : t('transaction.base_reward'),
      capacity: cell.baseReward,
    },
    {
      name: isMobile ? t('transaction.secondary') : t('transaction.secondary_reward'),
      capacity: cell.secondaryReward,
    },
    {
      name: isMobile ? t('transaction.commit') : t('transaction.commit_reward'),
      capacity: cell.commitReward,
    },
    {
      name: isMobile ? t('transaction.proposal') : t('transaction.proposal_reward'),
      capacity: cell.proposalReward,
    },
  ]
}

const TransactionReward = ({ cell, showReward }: { cell: State.Cell; showReward?: boolean }) => {
  const isMobile = useIsMobile()
  const { t } = useTranslation()
  // [0, 11] block doesn't show block reward and only cellbase show block reward
  const showBlockReward = showReward && cell.targetBlockNumber > 0
  const rewards = useRewards(cell, isMobile)

  return showBlockReward ? (
    <RewardPenal>
      <div className="transactionRewardTitle">{t('transaction.reward_info')}</div>
      {rewards.map(reward => (
        <RewardItemPenal key={reward.name}>
          <div className="rewardName">{reward.name}</div>
          <div className="rewardCapacity">
            <DecimalCapacity value={localeNumberString(shannonToCkb(reward.capacity))} />
          </div>
        </RewardItemPenal>
      ))}
    </RewardPenal>
  ) : null
}

export default TransactionReward
