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
  background-color: #fff;
  border-radius: 6px 6px 0 0;

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

export const TransactionCellDetailPanel = styled.div`
  width: 100%;
  font-weight: 500;
  display: flex;
  flex-direction: row;

  @media (max-width: ${variables.mobileBreakPoint}) {
    div {
      font-size: 13px;
    }
  }

  @media (max-width: 1300px) {
    div {
      font-size: 15px;
    }
  }

  .transactionDetailModalClose {
    padding: 17px 0 17px 17px;

    > img {
      cursor: pointer;
      width: 16px;
      height: 16px;
    }

    @media (max-width: ${variables.mobileBreakPoint}) {
      padding: 15px 0 15px 15px;

      > img {
        width: 12px;
        height: 12px;
      }
    }
  }
`

export const TransactionDetailPanel = styled.div`
  width: 100%;
  margin-top: 20px;

  @media (max-width: ${variables.mobileBreakPoint}) {
    margin-top: 10px;
  }

  .transactionDetailContent {
    border: none;
    width: 100%;
    text-align: left;
    min-height: 120px;
    max-height: 250px;
    overflow-y: auto;
    overflow-wrap: break-word;
    white-space: pre-wrap;
    word-break: break-all;
    padding: 20px 6px;
    margin-top: 5px;
    font-size: 16px;
    color: #888;
    font-weight: bold;
    background-color: #f9f9f9;
    border-radius: 6px;

    @media (max-width: ${variables.mobileBreakPoint}) {
      font-size: 10px;
      padding: 10px;
    }
  }

  .transactionDetailCopy {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
    width: 100%;

    @media (max-width: ${variables.mobileBreakPoint}) {
      margin-top: 10px;

      svg {
        width: 12px;
        height: 12px;
        margin-left: 6px;
      }
    }
  }

  .transactionDetailLoading {
    padding: 20px 0;

    @media (max-width: ${variables.mobileBreakPoint}) {
      padding: 10px 0;
    }
  }
`

export const TransactionCellInfoValuePanel = styled.div`
  > div {
    display: flex;
    margin: 2px 0 2px 30px;

    @media (max-width: ${variables.mobileBreakPoint}) {
      margin: 2px 0 2px 12px;
    }

    > div:nth-child(1) {
      min-width: ${(props: { isData: boolean }) => (props.isData ? '80px' : '120px')};

      @media (max-width: ${variables.mobileBreakPoint}) {
        min-width: ${(props: { isData: boolean }) => (props.isData ? '40px' : '70px')};
      }
    }

    > div:nth-child(2) {
      word-wrap: break-word;
      word-break: break-all;
    }
  }
`
