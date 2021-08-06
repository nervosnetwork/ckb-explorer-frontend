import { shannonToCkb } from '../../../utils/util'
import { localeNumberString } from '../../../utils/number'
import i18n from '../../../utils/i18n'
import DecimalCapacity from '../../../components/DecimalCapacity'
import { RewardPenal, RewardItemPenal } from './styled'
import { isMobile } from '../../../utils/screen'

const Rewards = (cell: State.Cell) => [
  {
    name: isMobile() ? i18n.t('transaction.base') : i18n.t('transaction.base_reward'),
    capacity: cell.baseReward,
  },
  {
    name: isMobile() ? i18n.t('transaction.secondary') : i18n.t('transaction.secondary_reward'),
    capacity: cell.secondaryReward,
  },
  {
    name: isMobile() ? i18n.t('transaction.commit') : i18n.t('transaction.commit_reward'),
    capacity: cell.commitReward,
  },
  {
    name: isMobile() ? i18n.t('transaction.proposal') : i18n.t('transaction.proposal_reward'),
    capacity: cell.proposalReward,
  },
]

const TransactionReward = ({ cell, showReward }: { cell: State.Cell; showReward?: boolean }) => {
  // [0, 11] block doesn't show block reward and only cellbase show block reward
  const showBlockReward = showReward && cell.targetBlockNumber > 0

  return showBlockReward ? (
    <RewardPenal>
      <div className="transaction__reward__title">{i18n.t('transaction.reward_info')}</div>
      {Rewards(cell).map(reward => (
        <RewardItemPenal key={reward.name}>
          <div className="reward__name">{reward.name}</div>
          <div className="reward__capacity">
            <DecimalCapacity value={localeNumberString(shannonToCkb(reward.capacity))} />
          </div>
        </RewardItemPenal>
      ))}
    </RewardPenal>
  ) : null
}

export default TransactionReward
