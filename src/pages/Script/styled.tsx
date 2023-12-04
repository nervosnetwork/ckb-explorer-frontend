import { Tabs } from 'antd'
import TabPane from 'antd/lib/tabs/TabPane'
import styled from 'styled-components'

export const ScriptTab = styled(Tabs)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  background-color: #fff;
  border-radius: 6px 6px 0 0;

  /* stylelint-disable-next-line selector-class-pattern */
  .ant-tabs-nav-list {
    padding-left: 40px;
  }

  /* stylelint-disable-next-line selector-class-pattern */
  .ant-tabs-tab.ant-tabs-tab-active {
    /* stylelint-disable-next-line selector-class-pattern */
    .ant-tabs-tab-btn {
      color: var(--primary-color);
    }
  }

  /* stylelint-disable-next-line selector-class-pattern */
  .ant-tabs-tab-active {
    /* stylelint-disable-next-line selector-class-pattern */
    .ant-tabs-tab-btn {
      color: #333;
    }
  }

  /* stylelint-disable-next-line selector-class-pattern */
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

  /* stylelint-disable-next-line selector-class-pattern */
  .ant-tabs-nav .ant-tabs-ink-bar {
    background: linear-gradient(
      to right,
      transparent 30%,
      var(--primary-color) 30%,
      var(--primary-color) 70%,
      transparent 70%
    );
    height: 3px;
    bottom: 3px;
  }
`
export const ScriptTabTitle = styled.span`
  font-size: 20px;
`

export const ScriptTabPane = styled(TabPane)`
  color: #333;
`
