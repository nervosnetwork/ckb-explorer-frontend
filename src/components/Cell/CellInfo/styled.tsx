import { Tabs } from 'antd'
import TabPane from 'antd/lib/tabs/TabPane'
import styled from 'styled-components'
import variables from '../../../styles/variables.module.scss'

export const TransactionDetailContainer = styled.div`
  .transactionDetailSeparate {
    width: auto;
    height: 1px;
    background: #eaeaea;
    margin-top: -3px;
  }
`

export const TransactionDetailItem = styled.div<{ selected?: boolean }>`
  cursor: pointer;
  position: relative;
  display: flex;
  padding-bottom: 22px;
  color: ${props => (props.selected ? '#000000' : 'rgba(0, 0, 0, 0.6)')};
  font-weight: 600;
  font-size: 16px;
  align-items: center;
  white-space: pre-wrap;

  @media (max-width: ${variables.mobileBreakPoint}) {
    margin-top: 5px;
  }

  &::after {
    position: absolute;
    left: 2px;
    bottom: 0;
    content: '';
    background: ${props => `${props.theme.primary}`};
    width: calc(100% - 4px);
    height: 5px;
    display: ${props => (props.selected ? 'block' : 'none')};
  }
`

export const TransactionDetailLock = styled(TransactionDetailItem)``

export const TransactionDetailType = styled(TransactionDetailItem)`
  margin-left: 90px;

  @media (max-width: ${variables.mobileBreakPoint}) {
    margin-left: 12px;
  }

  @media (min-width: 751px) and (max-width: 1300px) {
    margin-left: 50px;
  }
`

export const TransactionDetailData = styled(TransactionDetailItem)`
  margin-left: 90px;

  @media (max-width: ${variables.mobileBreakPoint}) {
    margin-left: 12px;
  }

  @media (min-width: 751px) and (max-width: 1300px) {
    margin-left: 50px;
  }
`

export const TransactionDetailCapacityUsage = styled(TransactionDetailItem)`
  margin-left: 90px;

  @media (max-width: ${variables.mobileBreakPoint}) {
    margin-left: 12px;
  }

  @media (min-width: 751px) and (max-width: 1300px) {
    margin-left: 50px;
  }
`

export const TransactionCellDetailTab = styled(Tabs)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;

  /* stylelint-disable-next-line selector-class-pattern */
  .ant-tabs-nav-operations {
    display: none !important;
  }

  /* stylelint-disable-next-line selector-class-pattern */
  .ant-tabs-tab.ant-tabs-tab-active {
    /* stylelint-disable-next-line selector-class-pattern */
    .ant-tabs-tab-btn {
      color: var(--primary-color);
    }
  }

  /* stylelint-disable-next-line selector-class-pattern */
  .ant-tabs-nav .ant-tabs-ink-bar {
    background: linear-gradient(to right, var(--primary-color) 100%, transparent 100%);
    height: 3px;
    bottom: 3px;
  }
`

export const TransactionCellDetailTitle = styled.span`
  font-size: 16px;
`

export const TransactionCellDetailPane = styled(TabPane)`
  color: #333;
`
