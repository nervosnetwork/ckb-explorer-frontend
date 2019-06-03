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

    @media (max-width: 700px) {
      font-size: 30pt;
    }
  }

  .address__content {
    display: flex;
    flex-direction: row;
    justify-content: center;

    > code {
      color: rgb(136, 136, 136);
      font-size: 18px;
      height: 25px;

      @media (max-width: 700px) {
        font-size: 14px;
        height: 20px;
        overflow: hidden;
        max-width: 320px;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    img {
      margin-left: 19px;
      @media (max-width: 700px) {
        margin-left: 8px;
      }
      width: 24px;
      height: 21px;
    }
  }
`

export const BlockOverviewPanel = styled.div`
  margin: 0 auto;
  text-align: center;
  margin-top: 107px;
  margin-bottom: 70px;
  font-size: 50px;
  @media (max-width: 700px) {
    margin-top: 25px;
    margin-bottom: 5px;
    font-size: 35px;
  }
  color: rgb(20, 20, 20);
  height: 70px;

  &:after {
    display: block;
    content: '';
    margin: 0 auto;
    background: #3cc68a;
    height: 4px;
    width: 197px;
    @media (max-width: 700px) {
      width: 150px;
    }
  }
`
export const BlockCommonContent = styled.div`
  overflow-x: auto;
  padding: 72px 88px 56px 88px;
  margin: 0 auto;
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
      > div:nth-child(1) {
        width: 1px;
        height: 360px;
        background: #3cc68a;
        content: '';
        margin-right: 82px;
      }
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
      }

      > div:nth-child(2) {
        > div:nth-child(1) {
          width: 0px;
          height: 0px;
          margin-right: 0px;
        }
      }
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

  .block__arrow_grey {
    margin-top: 13px;
    img {
      width: 83px;
      height: 19px;
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

export const BlockTransactionsPanel = styled.div``

export const BlockTransactionsPagition = styled(CommonPagition)`
  margin: 80px 0 0 0;
  width: 100%;
  overflow-x: auto;
`
