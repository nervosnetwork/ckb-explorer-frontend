import styled from 'styled-components'

export const HomeHeaderPanel = styled.div``

export const HomeHeaderTopPanel = styled.div`
  height: 360px;
  margin: 0 -120px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .home__top__title {
    color: #ffffff;
    font-size: 36px;
    padding-top: 49px;
  }

  .home__top__search {
    height: 38px;
    width: 600px;
    padding-top: 31px;
  }
`

export const HomeHeaderBottomPanel = styled.div`
  display: flex;
  padding: 20px 5px;
  margin: -148px 0px 20px 0px;
  box-shadow: 0 2px 6px 0 rgb(77, 77, 77, 0.2);
  border-radius: 0 0 6px 6px;
  background: #ffffff;

  @media (max-width: 750px) {
    flex-direction: column;
    margin: 20px 0px;
    padding: 0px 5px;
    box-shadow: 0 2px 6px 0 rgb(77, 77, 77, 0.2);
    border-radius: 3px;
  }

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

    .blockchain__item__name {
      color: #555555;
      font-size: 14px;

      @media (max-width: 750px) {
        font-size: 12px;
      }
    }

    .blockchain__item__value {
      margin-top: 5px;
      color: #000000;
      font-weight: 600;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;

      .blockchain__item__left__value {
        font-size: 20px;

        @media (max-width: 750px) {
          font-size: 16px;
        }
      }

      .blockchain__item__right__value {
        font-size: 14px;

        @media (max-width: 750px) {
          font-size: 12px;
        }
      }
    }

    .blockchain__item__separate {
      margin: 10px 0 20px 0;
      height: 1px;
      background: #eaeaea;
      width: 100%;
    }
  }

  .blockchain__item__between_separate {
    height: 90%;
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
  margin-bottom: 40px;
  margin-right: 20px;
  background: white;
  flex: 1;
  border: 0px solid white;
  border-radius: 6px;
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
  border-radius: 6px;
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
