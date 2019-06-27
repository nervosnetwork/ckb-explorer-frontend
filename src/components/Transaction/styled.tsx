import styled from 'styled-components'
import TooltipCellbaseImage from '../../assets/tooltip_cellbase.png'

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
        flex: 15;
      }

      .transaction__output {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
      }
    }
  }
`

export const TransactionsCell = styled.div`
  display: flex;
  align-items: center;
  height: 22px;
  margin-top: 11px;
  margin-bottom: 11px;
  justify-content: space-between;

  .transaction__cell {
    display: flex;
    align-items: center;
    justify-content: left;
  }

  .transaction__cell__capacity {
    font-size: 16px;
    color: rgb(136, 136, 136);
    margin-left: 15px;
  }
`
export const CellHash = styled.code`
  font-size: 16px;
  color: rgb(136, 136, 136)};
`
export const CellHashHighLight = styled(CellHash)`
  font-size: 16px;
  color: rgb(75, 188, 142);
`

export const CellbasePanel = styled.div`
  display: flex;

  .cellbase__content {
    color: #888888;
    font-size: 16px;
    margin-right: 10px;
  }

  .cellbase__help {
    margin-left: 10px;

    > img {
      width: 20px;
      height: 20px;
    }

    &:hover .cellbase__help__content {
      visibility: visible;
    }

    .cellbase__help__content {
      width: 300px;
      height: 150px;
      position: absolute;
      margin-left: -78px;
      padding: 28px 20px 17px 20px;
      white-space: pre-wrap;
      z-index: 1;
      color: white;
      font-weight: 450;
      visibility: hidden;
      font-size: 13px;
      background-image: url(${TooltipCellbaseImage});
      background-repeat: no-repeat;
      background-size: 300px 150px;
    }
  }
`
