import styled from 'styled-components'
import { CommonPagition } from '../BlockList/styled'

export const BlockDetailPanel = styled.div`
  width: 100%;
  margin-top: 60px;
  margin-bottom: 90px;

  @media (max-width: 700px) {
    margin-top: 20px;
    margin-bottom: 20px;
  }
`

export const BlockDetailTitlePanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  .block__title {
    color: rgb(20, 20, 20);
    font-size: 50px;
    text-align: center;

    @media (max-width: 700px) {
      font-size: 20px;
    }
  }

  #block__hash {
    color: rgb(136, 136, 136);
    font-size: 18px;
    cursor: pointer;
    font-family: monospace;

    @media (max-width: 700px) {
      font-size: 10px;
      height: 40px;
      width: 75%;
    }
    white-space: normal;
    word-wrap: break-word;
  }
`

export const BlockOverviewPanel = styled.div`
  margin: 0 auto;
  text-align: center;
  margin-top: 107px;
  margin-bottom: 70px;
  font-size: 50px;
  color: rgb(20, 20, 20);
  height: 70px;

  @media (max-width: 700px) {
    margin-top: 25px;
    margin-bottom: 5px;
    font-size: 18px;
    height: 50px;
  }

  &:after {
    display: block;
    content: '';
    margin: 0 auto;
    background: #3cc68a;
    height: 4px;
    width: 197px;
    @media (max-width: 700px) {
      width: 100px;
      height: 2px;
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

  @media (max-width: 700px) {
    margin-top: 30px;

    .block__arrow {
      height: 7px;
      margin-top: 0;
      img {
        width: 43px;
        height: 10px;
      }
      &:hover {
        cursor: pointer;
      }
    }

    .block__arrow_grey {
      height: 7px;
      margin-top: 0;
      img {
        width: 43px;
        height: 10px;
      }
    }

    .block__mouse {
      width: 15px;
      height: 27px;
      margin: 0 21px 0 21px;
    }
  }
`

export const BlockHightLabel = styled.div`
  margin-top: 17px;
  font-size: 16px;
  color: #979797;
  text-align: center;
  @media (max-width: 700px) {
    font-size: 8px;
  }
`

export const BlockTransactionsPanel = styled.div``

export const BlockTransactionsPagition = styled(CommonPagition)`
  margin: 80px 0 0 0;
  width: 100%;
  overflow-x: auto;

  @media (max-width: 700px) {
    margin: 20px 0 30px 3%;
  }
`

export const BlockItemPC = styled.div`
  @media (max-width: 700px) {
    display: none;
  }
`

export const BlockItemMobile = styled.div`
  @media (min-width: 700px) {
    display: none;
  }
`
