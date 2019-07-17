import styled from 'styled-components'
import { CommonPagition } from '../BlockList/styled'

export const AddressContentPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;
  margin-bottom: 40px;
  width: 100%;

  @media (max-width: 700px) {
    margin-top: 30px;
    padding: 0px 20px 20px 20px;
  }
`

export const AddressLockScriptItemPanel = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  align-items: flex-start;
  margin-top: 10px;

  .address_lock_script__title {
    > img {
      width: 9px;
      height: 9px;
    }

    > span {
      margin-left: 10px;
      font-family: Montserrat;
      font-size: 16px;
      font-weight: 500;
      color: #000000;
    }
  }

  .address_lock_script__content {
    flex: 1;
    margin-left: 20px;
    font-family: Montserrat;
    font-size: 16px;
    color: #000000;
    display: flex;
    flex-direction: column;
  }
`

export const AddressTransactionsPanel = styled.div`
  width: 100%;
`

export const AddressTransactionsPagition = styled(CommonPagition)`
  margin: 40px 0 0px 0;
  width: 100%;

  @media (max-width: 700px) {
    margin: 20px 0 30px 3%;
  }
`
