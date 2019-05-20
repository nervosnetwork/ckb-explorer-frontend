import styled from 'styled-components'

export const TransactionsItem = styled.div`
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
    padding: 38px 83px 41px 83px;
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
      margin-top: 30px;
      background: rgb(233, 233, 233);
    }

    .transaction__input__output {
      margin-top: 30px;
      display: flex;
      flex-direction: row;
      align-items: center;

      > img {
        width: 40px;
        height: 40px;
        flex: 1;
      }

      > div {
        flex: 13;
      }

      .transaction__output {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        margin-left: 50px;
      }
    }
  }
`

export const TransactionsCell = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 22px;
  margin-top: 11px;
  margin-bottom: 11px;

  .transaction__cell {
    display: flex;
    align-items: center;
    justify-content: left;
    width: 240px;
  }

  .transaction__cell__capacity {
    font-size: 16px;
    color: rgb(136, 136, 136);
    margin-left: 10px;
  }
`
export const CellHash = styled.div`
  font-size: 16px;
  color: rgb(136, 136, 136)};
`
export const CellHashHighLight = styled(CellHash)`
  font-size: 16px;
  color: rgb(75, 188, 142);
`
