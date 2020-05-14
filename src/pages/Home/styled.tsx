import styled from 'styled-components'
import { isMainnet } from '../../utils/chain'

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

export const HomeStatisticTopPanel = styled.div`
  height: 207px;
  width: 100%;
  display: flex;
  margin-top: -148px;
  border-radius: 6px 6px 0 0;

  .home__statistic__left__panel {
    flex: 1;
    display: flex;
    border-radius: 6px 0 0 0;
    border: 2px solid ${isMainnet() ? '#3fb39e' : '#6093e4'};

    .home__statistic__left__data {
      flex: 1;
      padding: 32px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      background: ${isMainnet()
        ? 'linear-gradient(134deg, #3fb39e, #1ec196 51%, #3cc6b7 100%)'
        : 'linear-gradient(314deg, #6093e4 100%, #6b88cf 49%, #7074de)'};
    }
    .home__statistic__left__chart {
      flex: 2;
      margin: -2px;
      padding: 5px 5px 0 5px;
      background: ${isMainnet()
        ? 'linear-gradient(134deg, #0bad8e 2%, #20c5a5 48%, #0baab1 99%)'
        : 'linear-gradient(298deg, #6e85e0 99%, #577cdb 48%, #486ecc 2%)'};
    }
  }

  .home__statistic__right__panel {
    flex: 1;
    display: flex;
    border-radius: 0 6px 0 0;
    border: 2px solid #31383e;

    .home__statistic__right__data {
      flex: 1;
      padding: 32px;
      margin: -2px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background: linear-gradient(134deg, #444b57, #39424a 48%, #444c5a 96%);
    }
    .home__statistic__right__chart {
      flex: 2;
      padding: 5px 5px 0 5px;
      background: linear-gradient(118deg, #31383e, #35414d 48%, #334350);
    }
  }
`

export const HomeStatisticBottomPanel = styled.div`
  display: flex;
  padding: 20px 5px;
  margin: 0 0px 20px 0px;
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

export const HomeStatisticItemPanel = styled.div`
  .home__statistic__item__name {
    font-size: 14px;
    color: #ffffff;
  }

  .home__statistic__item__value {
    font-size: ${(props: { isBig?: boolean }) => (props.isBig ? '26px' : '20px')};
    color: #ffffff;
    font-weight: bold;
    margin-top: 3px;
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
