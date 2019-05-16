import styled from 'styled-components'
import { CommonPagition } from '../BlockList/styled'

export const BlockDetailPanel = styled.div`
  width: 100%;
  margin-top: ${(props: { width: number }) => (100 * props.width) / 1920}px;
  margin-bottom: ${(props: { width: number }) => (150 * props.width) / 1920}px;
`

export const BlockDetailTitlePanel = styled.div`
  dispaly: flex;
  flex-direction: column;
  align-items: center;

  .address__title {
    color: rgb(20, 20, 20);
    font-size: 40pt;
    text-align: center;
  }

  .address__content {
    display: flex;
    flex-direction: row;
    justify-content: center;

    > div {
      color: rgb(136, 136, 136);
      font-size: 18px;
      height: 25px;
    }

    img {
      margin-left: 19px;
      width: 24px;
      height: 21px;
    }
  }
`

export const BlockOverviewPanel = styled.div`
  margin: 0 auto;
  text-align: center;
  margin-top: 107px;
  margin-bottom: 50px;
  font-size: 50px;
  color: rgb(20, 20, 20);
  height: 70px;

  &:after {
    display: block;
    content: '';
    margin: 0 auto;
    background: #3CC68A;
    height: 4px;
    width: 197px;
  }
`
export const BlockCommonContentWrap = styled.div`
  margin-left: -30px;
  margin-right: -30px;
  padding-left: 30px;
  padding-right: 30px;
  position: relative;
  &.hasPrev::before {
    content: '';
    display: block;
    box-sizing: border-box;
    border-radius: 6px 0 0 6px;
    box-shadow: 0 5px 9px #dfdfdf;
    background-color: #ffffff;
    width: 30px;
    height: 453px;
    margin: 22px 0;
    position: absolute;
    left: 0;
    top: 0;
  }
  &.hasNext:after {
    content: '';
    display: block;
    box-sizing: border-box;
    margin: 22px 0;
    border-radius: 0 6px 6px 0;
    box-shadow: 0 5px 9px #dfdfdf;
    background-color: #ffffff;
    width: 30px;
    height: 453px;
    margin: 22px 0;
    position: absolute;
    top: 0;
    right: 0px;
  }
`
export const BlockCommonContent = styled.div`
  overflow-x: auto;
  padding: 72px 88px 56px 88px;
  margin: 0 auto;
  margin-top: 50px;
  background: white;
  border: 0px solid white;
  border-radius: 6px;
  box-shadow: 0px 5px 9px rgb(233, 233, 233);
  display: flex;
  flex-direction: row;

  > div:nth-child(1) {
    flex: 1;
  }

  > div:nth-child(2) {
    display: flex;
    flex: 1;
    > div:nth-child(1) {
      width: 1px;
      height: 300px;
      background: #3CC68A;
      content: '';
      margin-right: 82px;
    }
  }
`

export const BlockPreviousNextPanel = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 59px;

  .block__arrow {
    margin-top: 13px;
    img {
      width: 83px;
      height: 19px;
    }
    &:hover {
      cursor: pointer;
    }
  }

  .block__mouse {
    width: 25px;
    height: 45px;
    margin: 0 21px 0 21px;
  }
`

export const BlockHightLabel = styled.div`
  margin-top: 17px;
  font-size: 16px;
  color: #979797;
  text-align: center;
`

export const BlockTransactionsPanel = styled.div`
`

export const BlockTransactionsPagition = styled(CommonPagition)`
  margin: 80px 0 0 0;
  width: 100%;
  overflow-x: auto;
`
