import styled from 'styled-components'
import SimpleButton from '../../components/SimpleButton'
import { TransactionPanel } from '../../components/TransactionItem/styled'

export const AddressLockScriptPanel = styled.div`
  display: flex;
  flex-direction: column;
`

export const AddressContentPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 25px;
  margin-bottom: 40px;

  @media (width <= 750px) {
    margin: 0;
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

    @media (width <= 750px) {
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

  @media (width <= 750px) {
    font-size: 14px;
    margin-top: 10px;

    > img {
      margin: 0 0 0 5px;
    }
  }
`

export const AddressTransactionsPanel = styled.div`
  width: 100%;

  @media (width <= 750px) {
    ${TransactionPanel}:first-child {
      margin-top: 0;
      box-shadow: none;
    }
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
    color: #000;
  }

  .address__udt__assets__grid {
    margin-top: 10px;
    background-color: #f1f1f1;
    padding: 6px 25px;
    width: 100%;
    display: flex;
    flex-flow: row wrap;
    overflow-y: scroll;

    @media (width >= 1200px) {
      max-height: 220px;
    }

    @media (width <= 1200px) {
      max-height: 310px;
    }
  }
`

export const AddressUDTItemPanel = styled.a`
  display: flex;
  flex-direction: column;
  margin: 6px 15px;
  background: #fff;
  width: 260px;

  @media (width <= 750px) {
    width: calc(100% - 30px);
  }

  pointer-events: ${(props: { isLink: boolean }) => (props.isLink ? 'auto' : 'none')};

  .address__udt__label {
    text-align: left;
    font-size: 12px;
    padding: 2px 8px;
    background: ${props => props.theme.primary};
    color: #fff;

    span {
      text-transform: uppercase;
    }
  }

  .address__udt__detail {
    display: flex;
    padding: 8px;
    align-items: center;
    line-height: 20px;
  }

  .address__udt__item__icon {
    display: flex;
    align-items: center;
    width: 40px;
    height: 40px;
    margin-right: 8px;
    object-fit: contain;
  }

  .address__udt__item__info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;

    > span {
      font-size: 14px;
      color: #000;
      white-space: nowrap;
      overflow-x: hidden;
      text-overflow: ellipsis;
      max-width: 196px;

      @media (width <= 750px) {
        max-width: calc(100% - 42px);
      }
    }

    > span:nth-child(1) {
      margin-bottom: 1px;
    }
  }
`
