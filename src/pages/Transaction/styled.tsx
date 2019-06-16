import styled from 'styled-components'

export const TransactionDiv = styled.div.attrs({
  className: 'container',
})`
  padding-top: 100px;
  padding-bottom: 150px;

  @media (max-width: 700px) {
    padding-top: 20px;
    padding-bottom: 20px;
  }
`
export const TransactionTitleDiv = styled.div`
  text-align: center;
  font-size: 40px;
  font-family: PingFangSC-Medium, sans-serif;
  font-weight: 900;

  @media (max-width: 700px) {
    font-size: 26px;
    font-weight: 600;
  }
`
export const TransactionOverviewLabel = styled.div`
  text-align: center;
  margin-top: 100px;
  font-size: 50px;
  @media (max-width: 700px) {
    margin-top: 25px;
    font-size: 26px;
    font-weight: 600;
  }
  font-family: PingFangSC-Medium, sans-serif;
  font-weight: 900;
  &:after {
    content: '';
    display: block;
    width: 100px;
    height: 4px;
    margin: 0 auto;
    background-color: #50ba8e;
  }
`

export const TransactionTitlePanel = styled.div`
  .transaction__title {
    color: rgb(20, 20, 20);
    font-size: 32pt;
    text-align: center;
    font-family: PingFangSC-Medium, sans-serif;
    font-weight: 900;

    @media (max-width: 700px) {
      font-weight: 600;
      font-size: 26px;
    }
  }

  .transaction__content {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin: 0 12px;

    > code {
      color: rgb(136, 136, 136);
      font-size: 18px;
      height: 25px;

      @media (max-width: 700px) {
        font-size: 14px;
      }
    }
    #transaction__hash {
      color: rgb(136, 136, 136);
      font-size: 18px;

      @media (max-width: 700px) {
        font-size: 14px;
        height: 40px;
        width: 75%;
      }
      white-space: normal;
      word-wrap: break-word;
    }

    > div {
      > img {
        margin-left: 15px;
        width: 21px;
        height: 21px;
      }
    }
  }
`

export const TransactionCommonContent = styled.div`
  width: 100%;
  overflow-x: auto;
  margin-top: 50px;
  background: white;
  border: 0px solid white;
  border-radius: 6px;
  box-shadow: 0px 5px 9px #dfdfdf;

  > div {
    padding: 72px 88px 56px 88px;
    width: 1200px;
    margin: 0 auto;
    display: flex;

    > div:nth-child(1) {
      flex: 1;
    }

    > div:nth-child(2) {
      display: flex;
      flex: 1;
      > div:nth-child(1) {
        width: 1px;
        height: 80px;
        background: #3cc68a;
        content: '';
        margin-right: 82px;
      }
    }
  }

  @media (max-width: 700px) {
    overflow-x: auto;
    width: 88%;
    margin: 15px 6%;
    background: white;
    border: 0px solid white;
    border-radius: 6px;
    display: flex;
    flex-direction: column;

    > div {
      padding: 15px;
      display: flex;
      flex-direction: column;
      width: 100%;

      > div:nth-child(1) {
      }

      > div:nth-child(2) {
        > div:nth-child(1) {
          width: 1px;
          height: 0px;
          margin-right: 0px;
        }
      }
    }
  }
`

export const TransactionHashDiv = styled.div`
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #888888;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  #transaction__hash {
    height: 56px;
    line-height: 56px;
  }
`

export const PanelDiv = styled.div`
  border-radius: 6px;
  box-shadow: 0 5px 9px 0 #dfdfdf;
  background-color: #ffffff;
  > div {
    overflow-x: auto;
  }
`

export const CellPanelPC = styled.div`
  @media (max-width: 700px) {
    display: none;
  }
`

export const CellPanelMobile = styled.div`
  @media (min-width: 700px) {
    display: none;
  }
`

export const InputPanelDiv = styled(PanelDiv)`
  margin-top: 20px;
  min-height: 88px;
  padding: 30px 50px;
  width: 100%;
  overflow-x: auto;
`

export const OutputPanelDiv = styled(PanelDiv)`
  margin-top: 10px;
  min-height: 88px;
  padding: 30px 50px;
  width: 100%;
  overflow-x: auto;
`

export const InputOutputTable = styled.table`
  width: 1100px;
  border-collapse: collapse;
  thead {
    tr {
      height: 58px;
      border-bottom: 1px solid #4bbc8e;
      font-size: 20px;
      font-family: PingFangSC-Medium, sans-serif;
      color: #4d4d4d;
      font-weight: 900;
      td {
        &:nth-child(1) {
          width: ${1100 - 150 - 360}px;
        }
        &:nth-child(2) {
          width: 150px;
          text-align: center;
        }
        &:nth-child(3) {
          width: 360px;
          text-align: center;
        }
      }
    }
  }
  tbody {
    tr {
      &.tr-brief {
        height: 66px;
        padding-top: 34px;
        padding-bottom: 10px;
        &: hover {
          background-color: #f9f9f9;
        }
        td {
          &: nth-child(1) {
            width: ${1100 - 150 - 120 * 3}px;
            font-size: 16px;
            color: #4bbc8e;
          }
          &: nth-child(2) {
            width: 150px;
            font-size: 16px;
            text-align: center;
            font-weight: bold;
            color: #888888;
          }
          &: nth-child(3),&: nth-child(4),&: nth-child(5) {
            width: 120px;
            font-size: 16px;
            text-align: center;
            color: #4bbc8e;
            font-family: PingFangSC-Semibold, sans-serif;
          }
        }
      }
      &.tr-detail {
        border-bottom: 2px solid #4bbc8e;
        &:last-child {
          border-bottom: 0;
        }
        td {
          textarea {
            border: none;
            width: 100%;
            padding: 18px 30px 18px 34px;
            font-size: 16px;
            color: #888888;
            font-weight: bold;
            font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
            margin-top: 5px;
            min-height: 170px;
            background-color: #f9f9f9;
            border-radius: 6px 6px;
            user-select: none;
            transform: translateZ(0);
          }
          .tr-detail-td-buttons {
            display: flex;
            justify-content: center;
            > div {
              width: 150px;
              height: 40px;
              margin: 20px 10px 40px 10px;
              text-align: center;
              line-height: 40px;
              border-radius: 2px 2px;
              &:nth-child(1) {
                border: 1px solid #4bbc8e;
                background-color: #4bbc8e;
                color: white;
                display: flex;
                justify-content: center;
                align-items: center;
                img {
                  margin-left: 5px;
                  width: 21px;
                  height: 24px;
                }
              }
            }
          }
        }
      }
    }
    td {
      .td-operatable {
        cursor: pointer;
        text-align: center;
        padding-bottom: 4px;
      }
      .td-operatable-active {
        cursor: pointer;
        text-align: center;
        padding-bottom: 4px;
        border-bottom: 2px solid #4bbc8e;
      }
      .td-operatable-disabled {
        color: #888888;
        cursor: unset;
      }
    }
  }
`

export const WithRowDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
`
