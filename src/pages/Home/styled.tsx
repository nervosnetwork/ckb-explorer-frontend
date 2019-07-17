import styled from 'styled-components'
import BlockchainTipImage from '../../assets/blockchain_tip_background.png'

export const HomeHeaderPanel = styled.div`
  min-height: 180px;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 70px 0px;

  .blockchain__item__container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 1200px;
  }

  @media (max-width: 700px) {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding-top: 20px;
    padding-bottom: 10px;

    .blockchain__item__container {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;

      > div:nth-child(n) {
        margin-bottom: 10px;
      }

      > div:nth-child(even) {
        margin-left: 5%;
      }

      > div:nth-child(odd) {
        margin-left: 0px;
      }
    }
  }
`

export const HomeHeaderItemPanel = styled.div`
  width: 285px;
  height: 180px;
  margin: 10px 0px;
  display: flex;
  flex-direction: column;
  item-align: center;
  background-color: white;
  border: 0px solid white;
  border-radius: 6px;
  box-shadow: 4px 4px 6px #dfdfdf;
  cursor: ${(props: { clickable: boolean }) => (props.clickable ? 'pointer' : 'default')};

  .blockchain__item__value {
    color: ${(porps: { clickable: boolean }) => (porps.clickable ? '#3cc68a' : '#888888')};
    text-align: center;
    font-size: 26px;
    font-weight: 450;
    margin-top: 60px;
  }

  .blockchain__item__name {
    color: #888888;
    text-align: center;
    font-size: 16px;
    margin-top: 12px;
    font-weight: 450;
  }

  .blockchain__item__tip {
    margin-top: 8px;
    opacity: 0;
    width: 285px;
    height: 41px;
    background-image: url(${BlockchainTipImage});
    background-repeat: no-repeat;
    background-size: 285px 41px;
  }

  &:hover .blockchain__item__tip {
    visibility: visible;
    opacity: 1;
  }

  .blockchain__item__tip__content {
    width: 285px;
    height: 41px;
    text-align: center;
    line-height: 41px;
    color: white;
    font-size: 12px;
  }

  @media (max-width: 700px) {
    width: 42%;
    height: 80px;
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
      font-size: 14px;
      margin-top: 20px;
      font-weight: 450;
    }

    .blockchain__item__name {
      color: #888888;
      text-align: center;
      font-size: 12px;
      margin-top: 5px;
      font-weight: 450;
    }

    .blockchain__item__tip {
      display: none;
    }

    &:hover .blockchain__item__tip {
      display: none;
    }

    .blockchain__item__tip__content {
      display: none;
    }
  }
`

export const BlockPanel = styled.div`
  width: 100%;
  margin-bottom: 60px;

  @media (max-width: 700px) {
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
  z-index: 2;

  .block__green__background {
    height: 61px;
    width: 100%;
    background-color: #3cc68a;
    z-index: 1;
  }

  .block__panel {
    margin-top: -41px;
    z-index: 2;
  }
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

    .table__more {
      font-size: 24px;
      color: #3cc68a;
      width: 59px;
      height: 33px;
      margin: 0 42px 0 42px;
    }
  }

  @media (max-width: 700px) {
    width: 88%;
    margin-left: 6%;
    height: 34px;

    > div {
      height: 14px;
      display: flex;
      item-align: center;

      > img {
        width: auto;
        height: 8px;
        margin-top: 3px;
      }

      .table__more {
        width: auto;
        height: 14px;
        line-height: 14px;
        margin: 0px 18px;
        font-size: 14px;
        color: #3cc68a;
      }
    }
  }
`
