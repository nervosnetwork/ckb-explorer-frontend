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

export const AddressPendingRewardTitlePanel = styled.div`
  display: flex;
  align-items: center;

  .address__pending_reward_help {
    margin-left: 20px;
    transform: translateY(2px);
    position: relative;
    > img {
      width: 20px;
      height: 20px;
    }
  }
`

export const AddressLockScriptPanel = styled.div`
  width: 100%;
  .address__lock_script_title {
    font-weight: 500;
  }
`

export const AddressLockScriptItemPanel = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  align-items: flex-start;
  margin-top: 10px;

  @media (max-width: 700px) {
    flex-direction: column;
  }

  .address_lock_script__title {
    > img {
      width: 9px;
      height: 9px;

      @media (max-width: 700px) {
        width: 5px;
        height: 5px;
        transform: translateY(-2px);
      }
    }

    > span {
      margin-left: 10px;
      font-weight: 500;

      @media (max-width: 700px) {
        margin-left: 5px;
      }
    }
  }

  .address_lock_script__content {
    flex: 1;
    margin-left: 20px;
    display: flex;
    flex-direction: column;

    @media (max-width: 700px) {
      margin-left: 10px;
      word-wrap: break-word;
      word-break: break-all;
    }
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
