import React from 'react'
import { shannonToCkb } from '../../../utils/util'
import { localeNumberString } from '../../../utils/number'
import i18n from '../../../utils/i18n'
import DecimalCapacity from '../../DecimalCapacity'
import { RewardPenal } from './styled'

const rewards = (cell: State.Cell) => [
  {
    name: i18n.t('transaction.base_reward'),
    capacity: cell.baseReward,
  },
  {
    name: i18n.t('transaction.secondary_reward'),
    capacity: cell.secondaryReward,
  },
  {
    name: i18n.t('transaction.commit_reward'),
    capacity: cell.commitReward,
  },
  {
    name: i18n.t('transaction.proposal_reward'),
    capacity: cell.proposalReward,
  },
]

const TransactionReward = ({ transaction, cell }: { transaction: State.Transaction; cell: State.Cell }) => {
  // [0, 11] block doesn't show block reward and only cellbase show block reward
  const showBlockReward = transaction.blockNumber > 0 && transaction.isCellbase && cell.targetBlockNumber > 0

  return (
    <div>
      {showBlockReward &&
        rewards(cell).map(reward => {
          return (
            <RewardPenal key={reward.name}>
              <div className="reward__name__point">
                <div className="reward__name">{reward.name}</div>
              </div>
              <div className="reward__capacity">
                <DecimalCapacity value={localeNumberString(shannonToCkb(reward.capacity))} />
              </div>
            </RewardPenal>
          )
        })}
    </div>
  )
}

export default TransactionReward
