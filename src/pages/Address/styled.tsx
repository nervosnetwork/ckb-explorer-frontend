import styled from 'styled-components'
import SimpleButton from '../../components/SimpleButton'
import { TransactionPanel } from '../../components/TransactionItem/styled'
import variables from '../../styles/variables.module.scss'

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

  @media (max-width: ${variables.mobileBreakPoint}) {
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

    @media (max-width: ${variables.mobileBreakPoint}) {
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
  cursor: pointer;
  color: ${props => props.theme.primary};
  display: flex;
  align-items: center;

  > img {
    width: 12px;
    height: 12px;
    margin: 2px 0 0 5px;
  }

  @media (max-width: ${variables.mobileBreakPoint}) {
    font-size: 14px;
    margin-top: 0;

    > img {
      margin: 0 0 0 5px;
    }
  }
`

export const AddressTransactionsPanel = styled.div`
  width: 100%;
  margin-top: 4px;

  @media (max-width: ${variables.mobileBreakPoint}) {
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

  > span {
    font-size: 14px;
    font-weight: 600;
    color: #000;
  }

  .addressUdtAssetsGrid {
    margin-top: 10px;
    background-color: #f1f1f1;
    padding: 6px 25px;
    width: 100%;
    display: flex;
    flex-flow: row wrap;
    overflow-y: scroll;

    @media (min-width: ${variables.extraLargeBreakPoint}) {
      max-height: 220px;
    }

    @media (max-width: ${variables.extraLargeBreakPoint}) {
      max-height: 310px;
    }
  }

  @media (max-width: ${variables.mobileBreakPoint}) {
    padding-top: 16px;
    border-top: 1px solid #f5f5f5;
  }
`

export const AddressUDTItemPanel = styled.a`
  display: flex;
  flex-direction: column;
  margin: 6px 15px;
  background: #fff;
  width: 260px;

  @media (max-width: ${variables.mobileBreakPoint}) {
    width: calc(100% - 30px);
  }

  pointer-events: ${(props: { isLink: boolean }) => (props.isLink ? 'auto' : 'none')};

  .addressUdtLabel {
    text-align: left;
    font-size: 12px;
    padding: 2px 8px;
    background: ${props => props.theme.primary};
    color: #fff;

    span {
      text-transform: uppercase;
    }
  }

  .addressUdtDetail {
    display: flex;
    padding: 8px;
    align-items: center;
    line-height: 20px;
  }

  .addressUdtItemIcon {
    display: flex;
    align-items: center;
    width: 40px;
    min-width: 40px;
    height: 40px;
    margin-right: 8px;
    object-fit: cover;
  }

  .addressUdtItemInfo {
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

      @media (max-width: ${variables.mobileBreakPoint}) {
        max-width: calc(100% - 42px);
      }
    }

    > span:nth-child(1) {
      margin-bottom: 1px;
    }
  }
`
