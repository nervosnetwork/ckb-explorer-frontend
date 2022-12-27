import styled from 'styled-components'
import { Tabs } from 'antd'

export const ScriptsTitleOverviewPanel = styled.div`
  display: flex;
  flex-direction: column;
`

export const ScriptContentPanel = styled.div`
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

export const ScriptTabs = styled(Tabs)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  background-color: #ffffff;
  border-radius: 6px 6px 0 0;
  .ant-tabs-nav-list {
    margin-left: 40px;
  }
  .ant-tabs-tab-btn {
    color: #000000 !important;
    font-size: 20px;
    font-weight: 400;
    margin-bottom: 0;
  }
  .ant-tabs-tab-btn[aria-selected='true'] {
    font-weight: 500;
  }
`

export const ScriptTransactionsPanel = styled.div`
  width: 100%;
`

export const ScriptTransactionsPagination = styled.div`
  margin-top: 4px;
  width: 100%;
`
