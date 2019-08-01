import styled from 'styled-components'

export const HomeHeaderPanel = styled.div`
  min-height: 170px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 0px 40px 0px;

  .blockchain__item__container {
    min-width: 100%;
    display: flex;
    flex-wrap: wrap;

    @media (min-width: 700px) {
      margin: 0 -6px;
    }
  }
  @media (max-width: 1200px) {
    .blockchain__item__container {
      margin: 0 auto;
    }
  }
  @media (max-width: 700px) {
    padding: 10px 20px 20px 20px;
    .blockchain__item__container {
      justify-content: space-between;
    }
  }
`

export const HomeHeaderItemPanel = styled.div`
  width: 290px;
  height: 148px;
  margin: 0px 6px;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  background-color: white;
  border: 0px solid white;
  border-radius: 6px;
  box-shadow: 2px 2px 4px #b3b3b3;
  overflow: hidden;

  cursor: ${(props: { clickable: boolean }) => (props.clickable ? 'pointer' : 'default')};

  .blockchain__item__value {
    margin-top: 45px;
    height: 32px;
    color: #000000;
    text-align: center;
    font-size: 26px;
    font-weight: 500;
    transition: margin-top 200ms ease-in-out;
  }

  .blockchain__item__name {
    margin-top: 12px;
    height: 19px;
    color: #000000;
    text-align: center;
    font-size: 16px;
    font-weight: normal;
  }

  &:hover {
    @media (min-width: 700px) {
      box-shadow: 4px 4px 8px 0 #b3b3b3;
      .blockchain__item__tip__content {
        visibility: visible;
        opacity: 1;
      }
      .blockchain__item__value {
        margin-top: 35px;
      }
    }
  }

  .blockchain__item__tip__content {
    width: 100%;
    height: 40px;
    opacity: 0;
    text-align: center;
    font-weight: 500;
    line-height: 40px;
    color: #ffffff;
    font-size: 12px;
    background: #3cc68a;
    margin-top: 14px;
    transition: opacity 200ms linear;
  }

  @media (max-width: 700px) {
    width: calc(50% - 5px);
    height: 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: white;
    border: 0px solid white;
    border-radius: 3px;
    box-shadow: 1px 1px 3px #dfdfdf;
    margin: 10px 0px 0px 0px;

    .blockchain__item__value {
      margin-top: 23px;
      height: 18px;
      color: #000000;
      text-align: center;
      font-size: 16px;
      font-weight: 600;
    }

    .blockchain__item__name {
      margin-top: 5px;
      height: 10px;
      color: #000000;
      text-align: center;
      font-size: 12px;
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
    padding: 0px 20px 0px 20px;
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
    }
  }
`
export const ContentTable = styled.div`
  margin: 0 auto;
  width: 100%;
  z-index: 2;

  .block__green__background {
    margin-left: -20px;
    height: 61px;
    width: calc(100% + 40px);
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
    width: 100%;
    height: 46px;
    border: 0px solid white;
    border-radius: 3px;
    box-shadow: 1px 1px 3px 0 #dfdfdf;
    background-color: #ffffff;
    margin-top: 5px;

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

export const HighLightValue = styled.div`
  color: #3cc68a;
  font-size: 13px;
  height: 16px;
`
