import styled from 'styled-components'

export const BlockDetailPanel = styled.div`
  width: 100%;
  margin-top: ${(props: { width: number }) => (100 * props.width) / 1920}px;
  margin-bottom: ${(props: { width: number }) => (200 * props.width) / 1920}px;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  margin-top: 107px;
  margin-bottom: 50px;
  font-size: 50px;
  color: rgb(20, 20, 20);
  height: 70px;

  &:after {
    display: block;
    content: '';
    margin: 0 auto;
    background: #46ab81;
    height: 4px;
    width: 197px;
  }
`
export const BlockCommonContent = styled.div`
  width: 1200px;
  padding: 72px 88px 56px 88px;
  margin: 0 auto;
  margin-top: 50px;
  background: white;
  border: 0px solid white;
  border-radius: 6px;
  box-shadow: 0px 5px 9px rgb(233, 233, 233);
  display: flex;
  flex-direction: row;

  .block__content__separate {
    width: 1px;
    height: 360px;
    background: #46ab81;
    margin: 0 auto;
  }
`

export const BlockPreviousNextPanel = styled.div`
  display: flex;
  margin-top: 59px;

  .block__arrow {
    width: 83px;
    height: 19px;
    margin-top: 13px;
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
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const BlockTransactionsPagition = styled.div`
  margin: 80px 0 0 0;
`
