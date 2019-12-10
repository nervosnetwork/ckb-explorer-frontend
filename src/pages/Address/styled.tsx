import styled from 'styled-components'

export const AddressContentPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 25px;
  margin-bottom: 40px;
  width: 100%;

  @media (max-width: 700px) {
    margin: 0px;
    padding: 20px;
  }
`

export const AddressPendingRewardTitlePanel = styled.div`
  display: flex;
  flex-direction: row;

  #address__pending_reward_help {
    margin-left: 20px;
    width: 20px;
    height: 20px;

    @media (max-width: 700px) {
      margin-left: 10px;
      width: 16px;
      height: 16px;
    }

    > img {
      width: 100%;
      height: 100%;
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
    width: 130px;
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;

    &:before {
      content: ' ';
      width: 9px;
      height: 9px;
      border-radius: 50% 50%;
      background: ${prop => prop.theme.primary};

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
    font-family: source-code-pro, Menlo, Monaco, Consolas, Courier New, monospace;

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

export const AddressTransactionsPagination = styled.div`
  margin: 20px 0 0px 0;
  width: 100%;

  @media (max-width: 700px) {
    margin: 10px 0 0px 0;
  }
`
