import styled from 'styled-components'

export const TransactionPanel = styled.div`
  width: 100%;
  /* overflow-x: auto; */
  margin-top: 5px;

  /* background: white;
  border: 0px solid white;
  border-radius: 6px;
  box-shadow: 0px 5px 9px #dfdfdf; */
  border-radius: 0px 0px 0px 0px;
  box-shadow: 2px 2px 6px 0 #dfdfdf;
  background-color: #ffffff;

  /* > div { */
  /* width: 1200px; */
  /* margin: 0 auto; */
  padding: 20px 40px 20px 40px;
  display: flex;
  flex-direction: column;
  /* } */
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
interface SeparationLineProps {
  marginTop?: string
  marginBottom?: string
}

export const SeparationLine = styled.span`
  width: 100%;
  height: 1px;
  margin-top: ${({ marginTop }: SeparationLineProps) => marginTop || '0px'};
  margin-bottom: ${({ marginBottom }: SeparationLineProps) => marginBottom || '0px'};
  background: rgb(233, 233, 233);
`

export const TransactionHashBlockPanel = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  .transaction_item__hash {
    font-size: 16px;
    color: rgb(75, 188, 142);
  }

  .transaction_item__block {
    font-size: 16px;
    color: rgb(136, 136, 136);
  }
`

export const TransactionInputOutputPanel = styled.div`
  margin-top: 30px;
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
