import styled from 'styled-components'

export const TransactionsItem = styled.div`
  @media (max-width: 700px) {
    display: none;
  }
  width: 100%;
  overflow-x: auto;
  margin-top: 10px;
  background: white;
  border: 0px solid white;
  border-radius: 6px;
  box-shadow: 0px 5px 9px #dfdfdf;
  > div {
    width: 1200px;
    margin: 0 auto;
    padding: 38px 75px 41px 75px;
    display: flex;
    flex-direction: column;
    .transaction__hash__panel {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      .transaction_hash {
        font-size: 16px;
        color: rgb(75, 188, 142);
      }
      .transaction_block {
        font-size: 16px;
        color: rgb(136, 136, 136);
      }
    }
    .transaction__separate {
      width: 100%;
      height: 1px;
      margin-top: 35px;
      background: rgb(233, 233, 233);
    }
    .transaction__input__output {
      margin-top: 20px;
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      > img {
        width: 40px;
        height: 40px;
        flex: 1;
      }
      > div {
        flex: 15;
      }
      .transaction__input {
        margin-right: 40px;
      }
      .transaction__output {
        margin-left: 40px;
        display: flex;
        flex-direction: column;
        align-items: flex-between;
      }
    }
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
