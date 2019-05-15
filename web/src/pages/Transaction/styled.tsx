import styled from 'styled-components'

export const TransactionDiv = styled.div.attrs({
  className: 'container',
})`
  padding-top: 100px;
  padding-bottom: 150px;
`
export const TransactionTitleDiv = styled.div`
  text-align: center;
  font-size: 40px;
  font-family: PingFangSC-Medium, sans-serif;
  font-weight: 900;
`
export const TransactionOverviewLabel = styled.div`
  text-align: center;
  margin-top: 100px;
  font-size: 50px;
  font-family: PingFangSC-Medium, sans-serif;
  font-weight: 900;
  &:after {
    content: '';
    display: block;
    width: 197px;
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
  }

  .transaction__content {
    display: flex;
    flex-direction: row;
    justify-content: center;

    > div {
      color: rgb(136, 136, 136);
      font-size: 18px;
      height: 25px;
    }
    #transaction__hash {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    > div {
      > img {
        margin-left: 19px;
        width: 24px;
        height: 21px;
      }
    }
  }
`

export const TransactionCommonContent = styled.div`
  width: 100%;
  overflow-x: auto;
  > div {
    padding: 72px 88px 56px 88px;
    width: 1200px;
    margin: 0 auto;
    margin-top: 50px;
    background: white;
    border: 0px solid white;
    border-radius: 6px;
    box-shadow: 0px 5px 9px rgb(233, 233, 233);
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
        background: #3CC68A;
        content: '';
        margin-right: 82px;
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

export const BriefInfoDiv = styled(PanelDiv)`
  padding: ${(props: { width: number }) => `60px ${(14 * props.width) / 1920}px`};
  margin-top: 80px;
  min-height: 233px;
  display: flex;
  flex-wrap: wrap;
  > div {
    overflow-x: unset;
    margin-top: 20px;
    // margin-bottom: 20px;
    width: 50%;
    min-width: 320px;
    height: 71px;
    padding-left: ${(props: { width: number }) => `${(74 * props.width) / 1920}px`};

    &:nth-child(1) {
      // border-right: 2px solid #4bbc8e;
      position: relative;
      &:after {
        content: '';
        display: block;
        height: 110px;
        width: 2px;
        position: absolute;
        top: -20px;
        right: 0;
        background-color: #4bbc8e;
      }
    }
    .brief__img {
      width: 28px;
      height: 28px;
    }
    .brief__key {
      margin-left: 10px;
      font-family: PingFangSC-Medium, sans-serif;
      font-weight: 900;
      font-size: 18px;
      color: #4d4d4d;
    }
    .brief__value {
      margin-left: 10px;
      font-size: 16px;
      color: #888888;
    }
  }
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
        }
        &:nth-child(3) {
          width: 360px;
          padding-left: 20px;
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
            text-align: center;
            width: 86px;
            font-size: 18px;
            color: #888888;
          }
          &: nth-child(2) {
            width: ${1100 - 86 - 150 - 120 * 3}px;
            font-size: 16px;
            color: #4bbc8e;
          }
          &: nth-child(3) {
            width: 150px;
            font-size: 16px;
            color: #888888;
          }
          &: nth-child(4),&: nth-child(5),&: nth-child(6) {
            width: 120px;
            font-size: 16px;
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
            margin-top: 5px;
            min-height: 170px;
            background-color: #f9f9f9;
            border-radius: 6px 6px;
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
