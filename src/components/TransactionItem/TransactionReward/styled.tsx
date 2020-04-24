import styled from 'styled-components'

export const RewardPenal = styled.div`
  display: flex;
  align-items: center;
  height: 20px;
  justify-content: space-between;
  margin-top: 20px;
  color: #000000;
  margin-right: 22px;

  @media (max-width: 750px) {
    height: 32px;
    margin-top: 10px;
    justify-content: normal;
    align-items: flex-start;
    flex-direction: column;
  }

  .reward__name__point {
    display: flex;
    align-items: center;

    &:before {
      content: '';
      width: 5px;
      height: 5px;
      margin-right: 8px;
      border-radius: 50% 50%;
      background: #424242;
      display: none;

      @media (max-width: 750px) {
        display: flex;
      }
    }

    .reward__name {
      display: flex;
      align-items: center;
      justify-content: left;
      font-weight: 500;
    }
  }

  .reward__capacity {
    margin-left: 15px;

    @media (max-width: 750px) {
      margin-left: 13px;
      width: 100%;
      padding-right: 18px;
    }

    > span {
      margin-left: 5px;
    }
  }
`
