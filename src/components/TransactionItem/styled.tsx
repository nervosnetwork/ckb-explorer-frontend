import styled from 'styled-components'
import { CircleCorner } from '.'

export const TransactionPanel = styled.div`
  width: 100%;
  margin-top: 4px;
  border-radius: ${(props: { circleCorner: CircleCorner }) =>
    `${props.circleCorner.top ? '6px 6px' : '0 0'}${props.circleCorner.bottom ? ' 6px 6px' : ' 0 0'}`};
  box-shadow: 2px 2px 6px 0 #dfdfdf;
  background-color: #ffffff;
  padding: 10px 40px 15px 40px;
  display: flex;
  flex-direction: column;
  font-size: 16px;

  @media (max-width: 750px) {
    padding: 15px 20px 15px 20px;
    font-size: 13px;
  }
`

export const TransactionsReward = styled.div`
  display: flex;
  align-items: center;
  height: 35px;
  justify-content: space-between;
  .transaction__cell {
    display: flex;
    align-items: center;
    justify-content: left;
    color: rgb(136, 136, 136);
  }
  .transaction__cell__capacity {
    font-size: 16px;
    color: rgb(136, 136, 136);
    margin-left: 15px;
  }
`

export const TransactionHashBlockPanel = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 10px;

  .transaction_item__content {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 10px;

    @media (max-width: 750px) {
      flex-direction: column;
      justify-content: normal;
      margin-bottom: 10px;
    }

    .transaction_item__hash {
      font-size: 14px;
      color: ${props => props.theme.primary};
      font-weight: 500;
    }

    .transaction_item__block {
      color: #000000;

      @media (max-width: 750px) {
        font-weight: normal;
      }
    }
  }

  &:after {
    content: '';
    background: #e2e2e2;
    height: 1px;
    width: 100%;
    display: block;
    transform: ${() => `scaleY(${Math.ceil((1.0 / window.devicePixelRatio) * 10.0) / 10.0})`};
  }
`

export const TransactionCellPanel = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;

  @media (max-width: 1200px) {
    flex-direction: column;
    align-items: center;
  }

  > img {
    margin-top: 16px;
    width: 16px;
    height: 16px;
  }

  .transaction_item__input {
    margin-right: 40px;
    flex: 1;
    min-width: 0;

    @media (max-width: 1200px) {
      margin: 0px;
      flex: none;
      width: 100%;
    }
  }

  .transaction_item__output {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-left: 40px;

    @media (max-width: 1200px) {
      margin: 0px;
      flex: none;
      width: 100%;
    }
  }

  .transaction_item__output__empty {
    font-size: 16px;
    color: #666666;
    margin-top: 18px;

    @media (max-width: 750px) {
      font-size: 13px;
    }
  }
`

export const FullPanel = styled.div`
  width: 100%;
`
