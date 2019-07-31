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
    margin-bottom: 0px;
    padding: 0px 20px 20px 20px;
  }
`

export const AddressPendingRewardTitlePanel = styled.div`
  display: flex;

  #address__pending_reward_help {
    margin-left: 20px;
    transform: translateY(2px);

    @media (max-width: 700px) {
      margin-left: 10px;
      transform: translateY(1px);
    }

    > img {
      width: 20px;
      height: 20px;

      @media (max-width: 700px) {
        width: 16px;
        height: 16px;
      }
    }
    &:focus {
      outline: 0;
    }
  }
`

export const AddressLockScriptPanel = styled.div`
  width: 100%;
  margin-top: 20px;

  @media (max-width: 700px) {
    margin-top: 10px;
  }

  .address__lock_script_title {
    font-weight: 500;
    height: 25px;
    padding: 0px 0px 5px 0px;

    @media (max-width: 700px) {
      height: 16px;
      padding: 0px;
    }
  }
`

export const AddressLockScriptItemPanel = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  align-items: flex-start;
  margin-top: 10px;

  @media (min-width: 700px) {
    height: 20px;
  }

  @media (max-width: 700px) {
    flex-direction: column;
  }

  .address_lock_script__title {
    display: flex;
    flex-direction: row;
    align-items: center;

    &:before {
      content: ' ';
      width: 9px;
      height: 9px;
      border-radius: 50% 50%;
      background: #3cc68a;

      @media (max-width: 700px) {
        width: 5px;
        height: 5px;
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
    transform: translateY(2px);

    @media (max-width: 700px) {
      margin-left: 10px;
      word-wrap: break-word;
      word-break: break-all;
      transform: translateY(0px);
    }
  }
`

export const AddressTransactionsPanel = styled.div`
  width: 100%;
`

export const AddressTransactionsPagition = styled(CommonPagition)`
  margin: 20px 0 0px 0;
  width: 100%;

  @media (max-width: 700px) {
    margin: 10px 0 0px 0;
  }
`
