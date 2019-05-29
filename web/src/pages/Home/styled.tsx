import styled from 'styled-components'

export const HomeHeaderPanel = styled.div`
  min-height: 180px;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 50px 0px;

  > div:nth-child(n) {
    margin-left: 20px;
  }

  > div:nth-child(1) {
    margin: 0px;
  }

  @media (max-width: 700px) {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding: 50px 0px;

    > div:nth-child(n) {
      width: 85%;
      margin-top: 20px;
      margin-left: 0px;
    }

    > div:nth-child(1) {
      margin: 0px;
    }
  }
`

export const HomeHeaderItemPanel = styled.div`
  width: 285px;
  height: 180px;
  display: flex;
  flex-direction: column;
  item-align: center;
  background-color: white;
  border: 0px solid white;
  border-radius: 6px;
  box-shadow: 4px 4px 6px #dfdfdf;

  .blockchain__item__value {
    color: #3cc68a;
    text-align: center;
    line-height: 100%;
    font-size: 26px;
    margin-top: 60px;
  }

  .blockchain__item__name {
    color: #888888;
    text-align: center;
    line-height: 100%;
    font-size: 16px;
    margin-top: 12px;
  }
`

export const BlockPanel = styled.div`
  width: 100%;
  margin-top: ${(props: { width: number }) => (80 * props.width) / 1920}px;
  margin-bottom: ${(props: { width: number }) => (120 * props.width) / 1920}px;

  @media (max-width: 700px) {
    margin-top: 20px;
    margin-bottom: 20px;
  }
`

export const ContentTitle = styled.div`
  font-size: 50px;
  color: #141414;
  font-weight: bold;
  text-align: center;
  margin-bottom: 58px;

  &:after {
    content: '';
    display: block;
    background: #3cc68a;
    height: 4px;
    width: 197px;
    margin: 0 auto;
  }

  @media (max-width: 700px) {
    font-size: 30px;
    color: #141414;
    font-weight: bold;
    text-align: center;
    margin-bottom: 20px;

    &:after {
      content: '';
      display: block;
      background: #3cc68a;
      height: 4px;
      width: 100px;
      margin: 0 auto;
    }
  }
`
export const ContentTable = styled.div`
  margin: 0 auto;
  width: 100%;
  overflow-x: auto;
`

export const TableMorePanel = styled.div`
  height: 78px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;

  > div {
    height: 33px;
    display: flex;

    > img {
      width: 61px;
      height: 16px;
      margin-top: 9px;
    }

    > div {
      width: 59px;
      height: 33px;
      margin: 0 42px 0 42px;

      .table__more {
        font-size: 24px;
        color: #3cc68a;
        overflow: hidden;
        text-overflow: ellipsis;
        text-decoration: none;
      }
    }
  }
`
