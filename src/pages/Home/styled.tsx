import styled from 'styled-components'

export const HomeHeaderPanel = styled.div`
  .blockchain__item__container {
    display: flex;
    padding: 20px 5px;
    margin: 30px 0px 20px 0px;
    box-shadow: 0 2px 6px 0 rgb(77, 77, 77, 0.2);
    border-radius: 6px;

    @media (max-width: 750px) {
      flex-direction: column;
      margin: 20px 0px;
      padding: 0px 5px;
      box-shadow: 0 2px 6px 0 rgb(77, 77, 77, 0.2);
      border-radius: 3px;
    }

    background: #ffffff;

    .blockchain__item__mobile {
      display: flex;
      width: 100%;
      padding: 20px 0;
    }

    .blockchain__item__mobile_separate {
      height: 1px;
      background: #eaeaea;
      width: 100%;
    }
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
      font-weight: 600;

      @media (max-width: 1000px) {
        font-size: 12px;
      }

      @media (max-width: 750px) {
        font-size: 10px;
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

      @media (max-width: 750px) {
        font-size: 14px;
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
      font-weight: 600;

      @media (max-width: 1000px) {
        font-size: 12px;
      }

      @media (max-width: 750px) {
        font-size: 10px;
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

      @media (max-width: 750px) {
        font-size: 14px;
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

export const HomeTablePanel = styled.div`
  display: flex;
  flex-direction: row;

  @media (max-width: 750px) {
    flex-direction: column;
  }
`

export const BlockPanel = styled.div`
  width: 100%;
  margin-bottom: 20px;
  margin-right: 20px;
  background: white;
  flex: 1;
  border: 0px solid white;
  border-radius: 0 0 6px 6px;
  box-shadow: 0 2px 6px 0 rgb(77, 77, 77, 0.2);

  .block__card__separate {
    background: #eaeaea;
    width: auto;
    margin: 0 16px;
    height: 1px;
  }
`

export const TransactionPanel = styled.div`
  width: 100%;
  margin-bottom: 40px;
  background: white;
  flex: 1;
  border: 0px solid white;
  border-radius: 0 0 6px 6px;
  box-shadow: 0 2px 6px 0 rgb(77, 77, 77, 0.2);

  .transaction__card__separate {
    background: #eaeaea;
    width: auto;
    margin: 0 16px;
    height: 1px;
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

  @media (max-width: 750px) {
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

export const TableHeaderPanel = styled.div`
  height: 44px;
  width: 100%;
  display: flex;
  align-items: center;
  background: ${props => props.theme.primary};
  border: 0px solid white;
  border-radius: 6px 6px 0 0;

  > img {
    width: 20px;
    height: 20px;
    margin-left: 12px;
    margin-right: 8px;
  }

  > span {
    font-size: 16px;
    font-weight: 600;
    color: white;
  }
`

export const TableMorePanel = styled.div`
  height: 44px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border: 0px solid white;
  border-radius: 0 0 6px 6px;
  cursor: pointer;

  > span {
    font-size: 16px;
    font-weight: 500;
    color: ${props => props.theme.primary};
  }

  &:hover {
    background: ${props => props.theme.primary};

    > span {
      color: white;
    }
  }
`

export const HighLightValue = styled.div`
  color: ${props => props.theme.primary};
  font-size: 13px;
  height: 16px;

  a {
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

  @media (max-width: 750px) {
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
