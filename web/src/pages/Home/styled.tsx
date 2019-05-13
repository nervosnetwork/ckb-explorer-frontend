import styled from 'styled-components'

export const HomeHeaderPanel = styled.div`
  min-height: ${(props: { width: number }) => (500 * props.width) / 1920}px;
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
  width: auto;
  justify-content: center;
  dispaly: flex;
  display: -webkit-flex; /* Safari */
  flex-direction: row;
  align-items: center;

  > div {
    margin-left: 29px;
    color: #3CC68A;
    font-family: DINPro;
    height: ${(props: { width: number }) => (134 * props.width) / 1920}px;
    font-size: ${(props: { width: number }) => (86 * props.width) / 1920}px;
    padding: ${(props: { width: number }) => (24 * props.width) / 1920}px 0;
    font-weight: 900;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.56;
    letter-spacing: 5.2px;
  }
`

export const SearchPanel = styled.div`
  margin-top: ${(props: { width: number }) => (64 * props.width) / 1920}px;
  margin-bottom: ${(props: { width: number }) => (98 * props.width) / 1920}px;
`

export const BlockPanel = styled.div`
  width: 100%;
  margin-top: ${(props: { width: number }) => (100 * props.width) / 1920}px;
  margin-bottom: ${(props: { width: number }) => (150 * props.width) / 1920}px;
`

export const ContentTitle = styled.div`
  font-size: 50px;
  color: black;
  text-align: center;
  margin: 0 auto;

  &:after {
    content: '';
    display: block;
    background: #3CC68A;
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
        color: #3CC68A;
        overflow: hidden;
        text-overflow: ellipsis;
        text-decoration: none;
      }
    }
  }
`
