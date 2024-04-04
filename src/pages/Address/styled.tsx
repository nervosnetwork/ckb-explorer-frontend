import styled from 'styled-components'
import { Tabs } from 'antd'
import TabPane from 'antd/lib/tabs/TabPane'
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

export const AddressAssetsTab = styled(Tabs)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  background-color: #fff;
  border-radius: 6px 6px 0 0;

  /* stylelint-disable-next-line selector-class-pattern */
  .ant-tabs-tab-btn {
    &:active,
    &:focus {
      color: var(--primary-color);
    }
  }
  /* stylelint-disable-next-line selector-class-pattern */
  .ant-tabs-tab {
    color: #000;
  }
  /* stylelint-disable-next-line selector-class-pattern */
  .ant-tabs-tab-active span {
    color: var(--primary-color);
  }

  /* stylelint-disable-next-line selector-class-pattern */
  .ant-tabs-nav .ant-tabs-ink-bar {
    height: 4px;
    bottom: 3px;
    background: transparent;

    ::after {
      content: ' ';
      position: absolute;
      left: 50%;
      right: 0;
      height: 100%;
      max-width: 72px;
      width: 100%;
      background: linear-gradient(to right, var(--primary-color) 100%, transparent 100%);
      transform: translateX(-50%);
    }
  }
`

export const AddressAssetsTabPane = styled(TabPane)``

export const AddressAssetsTabPaneTitle = styled.span`
  font-family: Roboto, sans-serif;
  color: inherit;
  font-size: 16px;
  font-weight: 500;
  line-height: 19px;
  letter-spacing: 0;
  text-align: left;
`

export const AddressUDTAssetsPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  @media (max-width: ${variables.mobileBreakPoint}) {
    padding-top: 16px;
    border-top: 1px solid #f5f5f5;
  }
`
