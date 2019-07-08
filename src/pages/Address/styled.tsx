import styled from 'styled-components'
import { CommonPagition } from '../BlockList/styled'

export const AddressContentPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 59px;

  @media (max-width: 700px) {
    margin-top: 30px;
  }
`

export const AddressTitlePanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0px 12px;

  .address__title {
    color: rgb(20, 20, 20);
    font-size: 50px;
    text-align: center;

    @media (max-width: 700px) {
      font-size: 26px;
    }
  }

  .address__content {
    display: flex;
    flex-direction: row;
    justify-content: center;

    #address__hash {
      color: rgb(136, 136, 136);
      font-size: 18px;

      @media (max-width: 700px) {
        font-size: 14px;
        height: 40px;
        width: 75%;
      }
      white-space: normal;
      word-wrap: break-word;
    }

    img {
      margin-left: 19px;
      @media (max-width: 700px) {
        margin-left: 8px;
        width: 18px;
        height: 18px;
      }
      width: 21px;
      height: 21px;
    }
  }
`

export const AddressOverviewPanel = styled.div`
  margin-top: 107px;
  margin-bottom: 50px;
  font-size: 50px;
  color: rgb(20, 20, 20);
  height: 70px;
  text-align: center;

  @media (max-width: 700px) {
    margin-top: 30px;
    height: 50px;
    margin-bottom: 5px;
    font-size: 26px;
  }

  &:after {
    display: block;
    content: '';
    margin: 0 auto;
    background: #3cc68a;
    height: 4px;
    width: 197px;

    @media (max-width: 700px) {
      width: 100px;
    }
  }
`

export const AddressCommonContent = styled.div`
  width: 100%;
  overflow-x: auto;
  padding: 72px 60px 56px 88px;
  margin: 0 auto;
  margin-top: 50px;
  background: white;
  border: 0px solid white;
  border-radius: 6px;
  box-shadow: 0px 5px 9px rgb(233, 233, 233);
  display: flex;
  flex-direction: column;

  @media (max-width: 700px) {
    width: 88%;
    overflow-x: auto;
    padding: 10px;
    margin: 20px 6%;
    background: white;
    border: 0px solid white;
    border-radius: 6px;
    display: flex;
    flex-direction: column;
  }
`

export const AddressTransactionsPanel = styled.div`
  width: 100%;
  overflow-x: auto;
`

export const AddressTransactionsItem = styled.div`
  padding: 38px 83px 41px 83px;
  margin: 0 auto;
  margin-top: 10px;
  background: white;
  border: 0px solid white;
  border-radius: 6px;
  box-shadow: 0px 5px 9px rgb(233, 233, 233);
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
      color: rgb(75, 188, 142);
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
    justify-content: space-between;

    > img {
      width: 68px;
      height: 68px;
    }
  }
`

export const AddressScriptLabelPanel = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 28px;

  > img {
    width: 20px;
    height: 20px;

    @media (max-width: 700px) {
      width: 15px;
      height: 15px;
      display: none;
    }
  }

  > span {
    font-size: 18px;
    font-weight: 450;
    @media (max-width: 700px) {
      font-size: 16px;

      @media (max-width: 320px) {
        font-size: 14px;
      }
    }
    color: rgb(77, 77, 77);
    margin-left: 10px;
    margin-right: 30px;
  }
`

export const AddressScriptContentPanel = styled.div`
  @media (max-width: 700px) {
    width: 100%;
  }
`

export const AddressScriptContent = styled.div`
  border: none;
  width: 100%;
  padding: 18px 30px 10px 25px;
  font-size: 16px;
  color: #4d4d4d;

  @media (max-width: 700px) {
    font-size: 15px;
    margin: 0px;
    padding: 0px 0px 0px 25px;

    @media (max-width: 320px) {
      font-size: 13px;
    }
  }
`

export const ScriptLabelItemPanel = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 5px 0;
  width: 95%;

  > img {
    width: 9px;
    height: 9px;
  }

  > div {
    margin-left: 8px;
    color: rgb(77, 77, 77);
    font-size: 16px;

    @media (max-width: 700px) {
      font-size: 14px;
    }
  }

  > code {
    margin-left: 16px;
    color: #adadad;
    white-space: normal;
    word-wrap: break-word;

    @media (max-width: 700px) {
      width: 100%;
    }
  }
`

export const ScriptOtherArgs = styled.div`
  margin-left: 52px;

  @media (max-width: 700px) {
    margin-left: 0px;
  }
`

export const AddressTransactionsCell = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 22px;

  .transaction__cell__hash {
    font-size: 16px;
    color: rgb(75, 188, 142);
    max-width: 320px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .transaction__cell__capacity {
    font-size: 16px;
    color: rgb(136, 136, 136);
    margin-left: 25px;
  }
`

export const AddressTransactionsPagition = styled(CommonPagition)`
  margin: 80px 0 150px 0;
  width: 100%;
  overflow-x: auto;

  @media (max-width: 700px) {
    margin: 20px 0 30px 3%;
  }
`

export const AddressCommonRowPanel = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;

  > div {
    flex-grow: 1;
  }

  > div:nth-child(2) {
    margin-left: 45px;

    @media (max-width: 700px) {
      margin-left: 0px;
    }
  }
`
