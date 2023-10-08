import styled from 'styled-components'

export const RewardItemPenal = styled.div`
  display: flex;
  align-items: center;
  height: 20px;
  justify-content: space-between;
  margin-bottom: 15px;
  color: #000;

  @media (max-width: 750px) {
    margin: 5px 10px;
    justify-content: space-between;
  }

  .rewardName {
    font-weight: 500;
  }

  .rewardCapacity {
    margin-left: 15px;

    > span {
      margin-left: 5px;
    }
  }
`

export const RewardPenal = styled.div`
  @media (min-width: 750px) {
    margin-bottom: -20px;
  }

  .transactionRewardTitle {
    margin-left: 10px;
    margin-top: 12px;
    color: #666;

    @media (min-width: 750px) {
      display: none;
    }
  }
`
