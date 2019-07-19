import styled from 'styled-components'
import BlockchainTipImage from '../../assets/blockchain_tip_background.png'

export const HomeHeaderPanel = styled.div`
  min-height: 180px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 0px;

  .blockchain__item__container {
    min-width: 100%;
    display: flex;
    flex-wrap: wrap;
    margin: 0 -6px;
  }
  @media (max-width: 1200px) {
    .blockchain__item__container {
      margin: 0 auto;
    }
  }
  @media (max-width: 700px) {
    padding: 20px 6% 10px 6%;
    .blockchain__item__container {
      justify-content: space-between;
    }
  }
`

export const HomeHeaderItemPanel = styled.div`
  width: 291px;
  height: 148px;
  margin: 10px 6px;
  display: flex;
  flex-direction: column;
  background-color: white;
  border: 0px solid white;
  border-radius: 6px;
  box-shadow: 2px 2px 4px #b3b3b3;
  cursor: ${(props: { clickable: boolean }) => (props.clickable ? 'pointer' : 'default')};

  .blockchain__item__value {
    color: #000000;
    text-align: center;
    font-size: 26px;
    font-weight: 500;
    margin-top: 60px;
  }

  .blockchain__item__name {
    color: #000000;
    text-align: center;
    font-size: 16px;
    margin-top: 12px;
    font-weight: normal;
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

  &:hover {
    box-shadow: 4px 4px 8px 0 #b3b3b3;
  }

  .blockchain__item__tip__content {
    width: 285px;
    height: 41px;
    text-align: center;
    font-weight: 500;
    line-height: 41px;
    color: #ffffff;
    font-size: 12px;
  }
  @media (max-width: 1200px) {
    margin: 10px 20px;
  }
  @media (max-width: 700px) {
    width: 48%;
    height: 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: white;
    border: 0px solid white;
    border-radius: 6px;
    box-shadow: 3px 3px 5px #dfdfdf;
    margin: 10px 0;

    .blockchain__item__value {
      color: #000000;
      text-align: center;
      font-size: 14px;
      margin-top: 20px;
      font-weight: 600;
    }

    .blockchain__item__name {
      color: #000000;
      text-align: center;
      font-size: 8px;
      margin-top: 5px;
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
  margin-bottom: 40px;

  @media (min-width: 700px) {
    box-shadow: 0px 2px 8px #b3b3b3;
    border: 0px solid white;
    border-radius: 6px;
  }

  @media (max-width: 700px) {
    margin-bottom: 24px;
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

      @media (-webkit-min-device-pixel-ratio: 2) {
        transform: scaleY(0.5);
      }
      @media (-webkit-min-device-pixel-ratio: 3) {
        transform: scaleY(0.33);
      }
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
  height: 65px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 0px solid white;
  border-radius: 6px;

  > div {
    height: 33px;
    display: flex;

    .table__more {
      font-size: 24px;
      font-weight: 500;
      color: #3cc68a;
      width: 59px;
      height: 33px;
    }
  }

  @media (max-width: 700px) {
    width: 88%;
    margin-left: 6%;
    height: 46px;
    border: 0px solid white;
    border-radius: 3px;
    box-shadow: 1px 1px 3px 0 #dfdfdf;
    background-color: #ffffff;

    > div {
      height: 14px;
      display: flex;
      align-items: center;

      .table__more {
        width: auto;
        height: 14px;
        line-height: 14px;
        margin: 5px 18px;
        font-size: 14px;
        color: #3cc68a;
      }
    }
  }
`
