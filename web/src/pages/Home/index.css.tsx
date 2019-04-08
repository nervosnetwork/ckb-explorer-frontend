import styled from 'styled-components'

export const HomeHeaderPanel = styled.div`
  height: ${(props: { width: number }) => (670 * props.width) / 1920}px;
  width: 100%;
  background: rgb(24, 50, 93);
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
  height: 149px;
  width: auto;
  justify-content: center;
  dispaly: flex;
  display: -webkit-flex; /* Safari */
  flex-direction: row;
  img {
    width: 156px;
    height: 149px;
  }
  div {
    line-height: 156px;
    margin-left: 29px;
    color: #46ab81;
    font-size: 50px;
    font-weight: bold;
  }
`

export const SearchPanel = styled.div`
  margin-top: ${(props: { width: number }) => (98 * props.width) / 1920}px;
  width: auto;
  height: 65px;
  text-align: center;
  input {
    position: relative;
    width: 650px;
    color: #bababa;
    height: 65px;
    font-size: 16px;
    padding-left: 20px;
    padding-right: 106px;
    opacity: 0.2;
    border-radius: 6px;
    background-color: #ffffff;
    &: focus {
      color: black;
      opacity: 1;
    }
  }
  img {
    position: relative;
    top: 14px;
    right: 50px;
    width: 41px;
    height: 41px;
    opacity: 0.8;
    &: hover {
      opacity: 1;
      cursor: pointer;
    }
  }
`

export const BlockPanel = styled.div`
  width: 100%;
  margin-top: ${(props: { width: number }) => (150 * props.width) / 1920}px;
  margin-bottom: ${(props: { width: number }) => (200 * props.width) / 1920}px;
`

export const ContentTitle = styled.div`
  display: flex;
  flex-direction: column;

  div {
    font-size: 50px;
    color: black;
    margin: 0 auto;
  }

  span {
    background: #46ab81;
    height: 4px;
    width: 197px;
    margin: 0 auto;
  }
`

export const ContentTable = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 58px;
`

export const TableTitleRow = styled.div`
  background: rgb(75, 188, 142);
  display: flex;
  flex-direction: row;

  div {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 240px;
    height: ${(props: { width: number }) => (78 * props.width) / 1920}px;

    div {
      width: auto;
      img {
        width: 23px;
        height: 23px;
      }

      div {
        color: white;
        font-size: 20px;
        margin-left: 10px;
      }
    }
  }
`

export const TableContentRow = styled.div`
  display: flex;

  div {
    width: 240px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`

export const TableMinerContentPanel = styled.div`
  height: 78px;

  .table__miner__content {
    max-width: 90px;
    overflow: hidden;
    text-overflow: ellipsis;
    color: ${(props: { color: string }) => props.color};
    text-decoration: none;
  }
`

export const TableMorePanel = styled.div`
  height: 78px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;

  div {
    height: 33px;
    display: flex;

    img {
      width: 61px;
      height: 15px;
      margin-top: 9px;
    }

    div {
      width: 59px;
      height: 33px;
      margin: 0 42px 0 42px;

      .table__more {
        font-size: 24px;
        color: rgb(75, 188, 142);
        overflow: hidden;
        text-overflow: ellipsis;
        text-decoration: none;
      }
    }
  }
`
