import styled from 'styled-components'
import SimpleButton from '../../components/SimpleButton'

export const AddressTitleOverviewPanel = styled.div`
  display: flex;
  flex-direction: column;
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

export const AddressLockScriptController = styled(SimpleButton)`
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

export const AddressTransactionsPanel = styled.div`
  width: 100%;
`

export const AddressTransactionsPagination = styled.div`
  margin-top: 4px;
  width: 100%;
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
