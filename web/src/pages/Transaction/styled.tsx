import styled from 'styled-components'

const PanelDiv = styled.div`
  border-radius: 6px;
  box-shadow: 0 5px 9px 0 #dfdfdf;
  background-color: #ffffff;
`
const BriefInfoDiv = styled(PanelDiv)`
  padding: ${(props: { width: number }) => `60px ${(14 * props.width) / 1920}px`};
  margin-top: 80px;
  min-height: 233px;
  display: flex;
  flex-wrap: wrap;
  > div {
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
      font-family: PingFang-SC-Heavy;
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

const InputOutPutTable = styled.table`
  width: 1100px;
  border-collapse: collapse;
  thead {
    tr {
      height: 58px;
      border-bottom: 2px solid #4bbc8e;
      font-size: 20px;
      font-family: PingFang-SC-Heavy;
      color: #4d4d4d;
      font-weight: 900;
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
      }
    }
    td {
      .td-operatable {
        cursor: pointer;
        text-align: center;
        padding-bottom: 4px;
      }
      .td-operatable-active {
        border-bottom: 2px solid #4bbc8e;
      }
    }
  }
`

const WithRowDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
`
export { PanelDiv }
export { BriefInfoDiv }
export { InputOutPutTable }
export { WithRowDiv }
