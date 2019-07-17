import styled from 'styled-components'

export const TransactionPanel = styled.div`
  width: 100%;
  margin-top: 5px;
  border-radius: ${({ isEndItem }: { isEndItem?: boolean }) => (isEndItem ? '0px 0px 6px 6px' : '0px 0px 0px 0px')};
  box-shadow: 2px 2px 6px 0 #dfdfdf;
  background-color: #ffffff;
  padding: 20px 40px 20px 40px;
  display: flex;
  flex-direction: column;

  /* common */
  font-family: Montserrat;

  .sperate__line_top {
    width: 100%;
    height: 1px;
    margin-top: 20px;
    background: #dfdfdf;
  }

  .sperate__line_bottom {
    width: 100%;
    height: 1px;
    margin-top: 20px;
    margin-bottom: 20px;
    background: #dfdfdf;
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
  flex-direction: row;
  justify-content: space-between;

  .transaction_item__hash {
    font-size: 16px;
    color: #3cc68a;
    font-weight: 500;
  }

  .transaction_item__block {
    font-size: 16px;
    font-weight: 500;
    color: #000000;
  }
`

export const TransactionInputOutputPanel = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: row;
  align-items: flex-start;

  > img {
    width: 40px;
    height: 40px;
  }

  > div {
    flex: 1;
  }

  .transaction_item__input {
    margin-right: 40px;
  }

  .transaction_item__output {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-left: 40px;
  }
`

export const FullPanel = styled.div`
  width: 100%;
`
