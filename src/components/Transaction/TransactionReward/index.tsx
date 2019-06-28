import React from 'react'
import styled from 'styled-components'
import { shannonToCkb } from '../../../utils/util'
import { Transaction, InputOutput } from '../../../http/response/Transaction'
import ItemPoint from '../../../assets/grey_point.png'

export const RewardPenal = styled.div`
  display: flex;
  align-items: center;
  height: 30px;
  justify-content: space-between;

  .reward__name__point {
    display: flex;
    align-items: center;
    margin-top: 10px;

    > img {
      @media (min-width: 700px) {
        display: none;
      }
      width: 5px;
      height: 5px;
      margin-right: 8px;
    }

    .reward__name {
      display: flex;
      align-items: center;
      justify-content: left;
      color: rgb(136, 136, 136);
    }
  }

  .reward__capacity {
    font-size: 16px;
    color: rgb(136, 136, 136);
    margin-left: 15px;
  }
`

const TransactionReward = ({ transaction, cell }: { transaction: Transaction; cell: InputOutput }) => {
  // [0, 11] block doesn't show block reward and only cellbase show block reward
  const showBlockReward = transaction.block_number > 0 && transaction.is_cellbase && cell.target_block_number > 0

  const Rewards = [
    {
      name: 'Base Reward',
      capacity: cell.block_reward,
    },
    {
      name: 'Commit Reward',
      capacity: cell.commit_reward,
    },
    {
      name: 'Proposal Reward',
      capacity: cell.proposal_reward,
    },
  ]
  return (
    <div>
      {showBlockReward &&
        Rewards.map(reward => {
          return (
            <RewardPenal key={reward.name}>
              <div className="reward__name__point">
                <img alt="reward point" src={ItemPoint} />
                <div className="reward__name">{reward.name}</div>
              </div>
              <div className="reward__capacity">{`${shannonToCkb(reward.capacity)} CKB`}</div>
            </RewardPenal>
          )
        })}
    </div>
  )
}

export default TransactionReward
