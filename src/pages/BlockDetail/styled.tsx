import styled from 'styled-components'
import { CommonPagition } from '../BlockList/styled'

export const BlockDetailPanel = styled.div`
  width: 100%;
  margin-top: 40px;
  margin-bottom: 40px;

  @media (max-width: 700px) {
    margin-top: 20px;
    margin-bottom: 20px;
  }
`

export const BlockRootInfoItemPanel = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  @media (min-width: 700px) {
    height: 20px;
    margin-top: 20px;
  }

  .block__root_info_title {
    font-weight: 500;
  }
  .block__root_info_value {
    flex: 1;
    margin-left: 20px;
  }
`

export const BlockCommonContent = styled.div`
  overflow-x: auto;
  padding: 72px 88px 56px 88px;
  margin: 10px auto;
  background: white;
  border: 0px solid white;
  border-radius: 6px;
  box-shadow: 0px 5px 9px rgb(233, 233, 233);

  > div:nth-child(1) {
    display: flex;
    flex-direction: row;

    > div:nth-child(1) {
      flex: 1;
      min-width: 350px;
    }

    > div:nth-child(2) {
      display: flex;
      flex: 1;
      min-width: 350px;
      margin-left: 82px;
    }
  }

  @media (max-width: 700px) {
    overflow-x: auto;
    padding: 15px;
    margin: 0 20px;
    background: white;
    border: 0px solid white;
    border-radius: 6px;

    > div:nth-child(1) {
      display: flex;
      flex-direction: column;

      > div:nth-child(1) {
        min-width: 100%;
      }

      > div:nth-child(2) {
        margin-left: 0;
        min-width: 100%;
      }
    }
  }
`

export const BlockMultiLinesPanel = styled.div`
  margin-left: 10px;
  margin-bottom: 6px;

  > div {
    font-size: 16px;
    color: #606060;
    font-weight: 450;
  }

  > code {
    font-size: 15px;
    color: #adadad;
    height: 40px;
    width: 85%;
    white-space: normal;
    word-wrap: break-word;
    margin-top: 2px;
  }

  @media (max-width: 320px) {
    > div {
      font-size: 14px;
    }

    > code {
      font-size: 13px;
    }
  }
`

export const BlockTransactionsPagition = styled(CommonPagition)`
  margin: 40px 0 0px 0;
  width: 100%;

  @media (max-width: 700px) {
    margin: 20px 0 0px 0;
  }
`
