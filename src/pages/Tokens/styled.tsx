import styled from 'styled-components'
import { Link } from 'react-router-dom'

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

export const TokensTableItem = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  padding: 0 15px;

  &:hover {
    background: #fafafa;
  }

  .tokens__item__content {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 15px 25px;
  }

  .tokens__item__name__panel {
    display: flex;
    flex: 4;
    align-items: center;

    > img {
      width: 30px;
      height: 30px;
    }

    > div {
      margin-left: 10px;

      .tokens__item__name {
        display: flex;
        align-items: center;
        font-size: 14px;
        letter-spacing: 0.23px;
        color: ${props => props.theme.primary};

        > img {
          width: 16px;
          height: 16px;
          margin-left: 5px;
        }
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
    text-align: right;
    color: #000000;
  }

  .tokens__item__address__count {
    flex: 2;
    text-align: center;
    font-size: 14px;
    text-align: right;
    color: #000000;
  }

  .tokens__item__created__time {
    flex: 2;
    text-align: center;
    font-size: 12px;
    text-align: right;
    color: #000000;
  }

  .tokens__item__separate {
    background: #d8d8d8;
    width: 100%;
    height: 1px;
  }
`

export const TokensContentEmpty = styled.div`
  height: 66px;
  width: 100%;
  border-radius: 0 0 6px 6px;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.12);
  background-color: #ffffff;
  line-height: 66px;
  text-align: center;
`

export const TokensLoadingPanel = styled.div`
  height: 100px;
  width: 100%;
  line-height: 100px;
  text-align: center;
`
