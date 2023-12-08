import { Tabs } from 'antd'
import TabPane from 'antd/lib/tabs/TabPane'
import styled from 'styled-components'

export const ScriptTab = styled(Tabs)`
  /* stylelint-disable selector-class-pattern */
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  margin-top: 24px;

  .ant-tabs-nav-list {
    padding-left: 40px;
  }

  .ant-tabs-tab.ant-tabs-tab-active {
    .ant-tabs-tab-btn {
      color: var(--primary-color);
    }
  }

  .ant-tabs-tab-active {
    .ant-tabs-tab-btn {
      color: #333;
    }
  }

  .ant-tabs-tab-btn {
    color: #333;
    font-weight: 400;
    font-size: 20px;
    line-height: 23px;
    margin-bottom: 0;

    &[aria-selected='true'] {
      font-weight: 500;
    }
  }

  /* Repeating class selectors to increase selector specificity. */
  .ant-tabs-nav.ant-tabs-nav .ant-tabs-ink-bar {
    background: linear-gradient(
      to right,
      transparent 30%,
      var(--primary-color) 30%,
      var(--primary-color) 70%,
      transparent 70%
    );
    height: 4px;

    @media (max-width: 750px) {
      height: 2px;
    }
  }

  @media (max-width: 750px) {
    margin-top: 20px;
  }
`
export const ScriptTabTitle = styled.span`
  font-size: 20px;
`

export const ScriptTabPane = styled(TabPane)`
  color: #333;
`
