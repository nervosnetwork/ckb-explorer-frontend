import styled from 'styled-components'

export const HomeHeaderPanel = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;

  .blockchain__item__container {
    min-width: 100%;
    display: flex;
    margin: 40px 0 20px 0;
    padding: 20px 5px;
    box-shadow: 2px 2px 4px 0 #b3b3b3;
    border-radius: 6px;
    background: #ffffff;
  }
`

export const HomeHeaderItemPanel = styled.div`
  display: flex;
  align-items: center;
  background-color: white;
  flex: 1;

  .blockchain__item__content {
    display: flex;
    flex-direction: column;
    width: 80%;
    margin: 0 9%;

    .blockchain__item__top_name {
      color: ${props => props.theme.primary};
      font-size: 14px;
      font-weight: 450;

      @media (max-width: 1000px) {
        font-size: 12px;
      }
    }

    .blockchain__item__top_value {
      margin-top: 5px;
      color: #000000;
      font-size: 22px;
      font-weight: 600;

      @media (max-width: 1000px) {
        font-size: 17px;
      }
    }

    .blockchain__item__separate {
      margin: 10px 0 20px 0;
      height: 1px;
      background: #eaeaea;
      width: 100%;
    }

    .blockchain__item__bottom_name {
      color: ${props => props.theme.primary};
      font-size: 14px;
      font-weight: 450;

      @media (max-width: 1000px) {
        font-size: 12px;
      }
    }

    .blockchain__item__bottom_value {
      margin-top: 5px;
      color: #000000;
      font-size: 22px;
      font-weight: 600;
      display: flex;
      justify-content: space-between;

      @media (max-width: 1000px) {
        font-size: 17px;
      }
    }
  }

  .blockchain__item__between_separate {
    height: 60%;
    margin-left: 1%;
    background: #eaeaea;
    width: 1px;
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
    background: ${props => props.theme.primary};
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
      background: ${props => props.theme.primary};
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
    background-color: ${props => props.theme.primary};
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
  cursor: pointer;
  :hover {
    background: #f8f9fa;
  }
  > div {
    height: 33px;
    display: flex;

    .table__more {
      font-size: 20px;
      font-weight: 500;
      color: ${props => props.theme.primary};
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
        color: ${props => props.theme.primary};
      }
    }
  }
`

export const HighLightValue = styled.div`
  color: ${props => props.theme.primary};
  font-size: 13px;
  height: 16px;

  a {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
    color: ${props => props.theme.primary};
  }

  a:hover {
    color: ${props => props.theme.primary};
  }
`

export const BlockRewardContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;

  @media (max-width: 700px) {
    align-items: flex-end;
    justify-content: flex-start;
  }

  :after {
    display: inline;
    content: '+';
    color: #7f7d7d;
    font-size: 13px;
  }
`

export const BlockRewardPanel = styled.div`
  margin-right: 8px;
  display: flex;
  justify-content: center;
`
