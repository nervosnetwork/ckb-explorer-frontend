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

    > span {
      color: #000000;
      font-size: 24px;
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

  >span: nth-child(1) {
    flex: 4;
  }

  >span: nth-child(2) {
    flex: 2;
    text-align: right;
  }

  >span: nth-child(3) {
    flex: 2;
    text-align: right;
  }

  >span: nth-child(4) {
    flex: 2;
    text-align: right;
  }
`

export const TokensTableContent = styled.div`
  border-radius: 0 0 6px 6px;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.12);
  color: #000000;
  margin-top: 4px;
`

export const TokensTableItem = styled.div`
  display: flex;
  align-items: center;
  padding: 15px 0;

  .tokens__item__name__panel {
    display: flex;
    flex: 4;

    > img {
      width: 30px;
      height: 30px;
    }

    > div {
      margin-left: 10px;

      .tokens__item__name {
        font-size: 14px;
        letter-spacing: 0.23px;
        color: ${props => props.theme.primary};
      }

      .tokens__item__description {
        font-size: 12px;
        letter-spacing: 0.17px;
        color: #666666;
        margin-top: 5px;
      }
    }
  }

  .tokens__item__transactions {
    flex: 2;
    text-align: center;
    font-size: 14px;
  }

  .tokens__item__address__count {
    flex: 2;
    text-align: center;
    font-size: 14px;
  }

  .tokens__item__created__time {
    flex: 2;
    text-align: center;
    font-size: 12px;
  }
`
