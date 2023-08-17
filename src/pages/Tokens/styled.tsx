import styled from 'styled-components'

export const TokensPanel = styled.div`
  margin-top: 40px;
  margin-bottom: 60px;

  @media (max-width: 750px) {
    margin-top: 20px;
    margin-bottom: 30px;
  }

  .tokens__title__panel {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    @media (max-width: 750px) {
      margin-bottom: 10px;
    }

    > span {
      color: #000000;
      font-size: 24px;
      font-weight: bold;
    }

    > a {
      font-size: 14px;
      color: ${props => props.theme.primary};
    }
  }
`

export const TokensTableTitle = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 46px;
  border-radius: 6px 6px 0 0;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.12);
  background-color: #ffffff;
  padding: 0 40px;
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 0.2px;
  color: #000000;

  > span:nth-child(1) {
    flex: 4.6;
  }

  > span:nth-child(2) {
    flex: 1.8;
    text-align: right;
  }

  > span:nth-child(3) {
    flex: 1.8;
    text-align: right;
  }

  > span:nth-child(4) {
    flex: 1.8;
    text-align: right;
  }
`

export const TokensTableContent = styled.div`
  padding-bottom: 5px;
  background: #ffffff;
  color: #000000;
  margin-top: 4px;

  @media (max-width: 750px) {
    border-radius: 6px;
    padding: 5px 0;
  }
`

export const TokensTableItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  padding: 0 15px;

  .tokens__item__content {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 15px 25px;

    @media (max-width: 750px) {
      flex-direction: column;
      align-items: flex-start;
      padding: 10px 20px;
    }
  }

  .tokens__item__name__panel {
    display: flex;
    flex: 4.6;
    align-items: center;

    > img {
      width: 30px;
      height: 30px;

      @media (max-width: 750px) {
        width: 20px;
        height: 20px;
      }
    }

    > div {
      margin-left: 10px;

      .tokens__item__description {
        font-size: 12px;
        letter-spacing: 0.17px;
        line-height: normal;
        color: #666666;
        margin-top: 2px;
      }
    }
  }

  .tokens__item__transactions {
    flex: 1.8;
    text-align: center;
    font-size: 14px;
    text-align: right;
    color: #000000;

    @media (max-width: 750px) {
      margin-left: 30px;
      margin-top: 3px;
    }
  }

  .tokens__item__address__count {
    flex: 1.8;
    text-align: center;
    font-size: 14px;
    text-align: right;
    color: #000000;

    @media (max-width: 750px) {
      margin-left: 30px;
      margin-top: 3px;
    }
  }

  .tokens__item__created__time {
    flex: 1.8;
    text-align: center;
    font-size: 12px;
    text-align: right;
    color: #000000;
  }

  .tokens__item__separate {
    background: #d8d8d8;
    width: 100%;
    height: 1px;
    transform: ${() => `scaleY(${Math.ceil((1.0 / window.devicePixelRatio) * 10.0) / 10.0})`};
  }
`

export const TokensItemNamePanel = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  letter-spacing: 0.23px;

  a {
    color: ${props => props.theme.primary};

    &:hover {
      color: ${props => props.theme.primary};
    }
  }

  > span {
    color: #000000;
  }

  > img {
    width: 16px;
    height: 16px;
    margin-left: 5px;
  }
`

export const TokensContentEmpty = styled.div`
  height: 100px;
  line-height: 100px;
  width: 100%;
  border-radius: 0 0 6px 6px;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.12);
  background-color: #ffffff;
  text-align: center;
  font-size: 16px;
  margin-top: 4px;
  margin-bottom: 180px;

  @media (max-width: 750px) {
    font-size: 14px;
    border-radius: 6px;
    margin-bottom: 160px;
  }
`

export const TokensLoadingPanel = styled.div`
  width: 100%;
  text-align: center;

  @media (max-width: 750px) {
    height: 100px;
    line-height: 100px;
    margin-bottom: 160px;
    width: 100%;
    text-align: center;
    margin-top: 4px;
    border-radius: 0 0 6px 6px;
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.12);
    background-color: #ffffff;
  }
`

export const TokensTitlePanel = styled.div`
  display: flex;

  > span:nth-child(1) {
    width: 125px;
    text-align: left;
  }
`

export const TokensPagination = styled.div`
  margin-top: 4px;
  width: 100%;
`
