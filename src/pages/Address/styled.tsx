import styled from 'styled-components'

export const AddressTitleOverviewPanel = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 20px;

  .address__title__separate {
    background: #eaeaea;
    width: 100%;
    height: 1px;
  }
`

export const AddressContentPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 25px;
  margin-bottom: 40px;

  @media (max-width: 750px) {
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

    @media (max-width: 750px) {
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

export const AddressLockScriptController = styled.div`
  font-size: 16px;
  font-weight: 600;
  margin-top: 15px;
  cursor: pointer;
  color: ${props => props.theme.primary};
  display: flex;
  align-items: center;

  > img {
    width: 12px;
    height: 12px;
    margin: 2px 0 0 5px;
  }

  @media (max-width: 750px) {
    font-size: 14px;
    margin-top: 10px;

    > img {
      margin: 0px 0 0 5px;
    }
  }
`

export const AddressLockScriptPanel = styled.div`
  width: 100%;
  margin-top: 8px;
  background-color: #f7f7f7;
  padding: 12px 24px;

  @media (max-width: 750px) {
    margin-top: 5px;
    padding: 6px 12px;
  }

  .address__lock_script_title {
    font-weight: 500;
    height: 25px;
    padding: 0px 0px 5px 0px;

    @media (max-width: 750px) {
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
  margin-bottom: 10px;
  font-size: 16px;

  @media (min-width: 750px) {
    min-height: 20px;
    max-height: 45px;
  }

  @media (max-width: 1200px) {
    font-size: 14px;
  }

  @media (max-width: 900px) {
    font-size: 12px;
  }

  @media (max-width: 750px) {
    flex-direction: column;
    font-size: 14px;
  }

  .address_lock_script__title {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 130px;

    > span {
      margin-left: 10px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.6);

      @media (max-width: 750px) {
        margin-left: 5px;
      }
    }
  }

  .address_lock_script__content {
    flex: 1;
    margin-left: 12px;
    display: flex;
    align-items: center;
    transform: translateY(2px);
    color: #000000;

    @media (max-width: 750px) {
      margin-left: 5px;
      word-wrap: break-word;
      word-break: break-all;
      transform: translateY(0px);
    }
  }

  .address__lock__script_code_hash {
    display: flex;
    flex-direction: row;
    align-items: center;

    > span {
      margin-right: 12px;
      margin-bottom: 0px;
    }

    @media (max-width: 1440px) {
      flex-direction: column;
      align-items: flex-start;

      > span {
        margin-right: 0px;
        margin-bottom: 6px;
      }
    }
  }
`

export const AddressTransactionsPanel = styled.div`
  width: 100%;
`

export const AddressTransactionsPagination = styled.div`
  margin: 20px 0 0 0;
  width: 100%;

  @media (max-width: 750px) {
    margin: 10px 0 0px 0;
  }
`

export const AddressUDTAssetsPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 20px 0;

  > span {
    font-size: 14px;
    font-weight: 600;
    color: #000000;
  }

  .address__udt__assets__grid {
    margin-top: 10px;
    background-color: #f1f1f1;
    padding: 6px 25px;
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    overflow-y: scroll;

    @media (min-width: 1200px) {
      max-height: 170px;
    }

    @media (max-width: 1200px) {
      max-height: 240px;
    }
  }
`

export const AddressUDTItemPanel = styled.a`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 6px 15px;
  padding: 8px;
  background: #ffffff;
  width: 260px;
  height: 56px;

  .address__udt__item__icon {
    width: 40px;
    height: 40px;
    margin-right: 8px;
  }

  .address__udt__item__info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    > span {
      font-size: 14px;
      color: #000000;
    }

    > span:nth-child(1) {
      margin-bottom: 1px;
    }
  }
`
