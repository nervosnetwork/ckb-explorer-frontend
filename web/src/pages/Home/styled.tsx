import styled from 'styled-components'

export const HomeHeaderPanel = styled.div`
  min-height: ${(props: { width: number }) => (340 * props.width) / 1920}px;
  width: 100%;
  background: #424242;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

export const HomeHeader = styled.div`
  width: 100%;
  display: flex;
  display: -webkit-flex; /* Safari */
  flex-direction: column;
`

export const LogoPanel = styled.div`
  min-height: 134px;
  @media (max-width: 700px) {
    min-height: 80px;
  }
  width: auto;
  justify-content: center;
  dispaly: flex;
  display: -webkit-flex; /* Safari */
  flex-direction: row;
  align-items: center;

  > div {
    color: #3cc68a;
    font-family: Montserrat, PingFang SC, sans-serif;
    line-height: 134px;
    font-size: 64px;
    padding: ${(props: { width: number }) => (24 * props.width) / 1920}px 0;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.56;
    letter-spacing: 5.2px;

    @media (max-width: 700px) {
      font-size: 28px;
      letter-spacing: 1px;
    }
  }
`

export const SearchPanel = styled.div`
  margin-top: ${(props: { width: number }) => (15 * props.width) / 1920}px;
  margin-bottom: ${(props: { width: number }) => (50 * props.width) / 1920}px;
`

export const BlockPanel = styled.div`
  width: 100%;
  margin-top: ${(props: { width: number }) => (80 * props.width) / 1920}px;
  margin-bottom: ${(props: { width: number }) => (120 * props.width) / 1920}px;
`

export const ContentTitle = styled.div`
  font-size: 50px;
  color: #141414;
  font-weight: bold;
  text-align: center;
  margin: 0 auto;

  &:after {
    content: '';
    display: block;
    background: #3cc68a;
    height: 4px;
    width: 197px;
    margin: 0 auto;
  }
`
export const ContentTable = styled.div`
  margin: 0 auto;
  margin-top: 58px;
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
