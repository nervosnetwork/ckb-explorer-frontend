import styled from 'styled-components'

export const TransactionDiv = styled.div.attrs({
  className: 'container',
})`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;
  margin-bottom: 40px;
  width: 100%;

  @media (max-width: 700px) {
    margin: 0px;
    padding: 20px;
  }

  .transaction__overview {
    width: 100%;
    margin-top: 15px;

    @media (max-width: 700px) {
      margin-top: 5px;
    }

    .transaction__overview_info {
      margin: 5px 0;
      display: flex;
      flex-direction: column;
    }
  }

  .transaction__inputs {
    width: 100%;
    margin-top: 20px;

    @media (max-width: 700px) {
      margin-top: 10px;
    }
  }

  .transaction__outputs {
    width: 100%;
    margin-top: 5px;
  }
`

export const TransactionBlockHeightPanel = styled.div`
  color: ${props => props.theme.primary};
`

export const TransactionInfoItemPanel = styled.div`
  flex: 1;

  @media (min-width: 700px) {
    height: 20px;
    margin-top: 20px;
  }

  .transaction__info_title {
    font-weight: 500;
  }
  .transaction__info_value {
    margin-left: 20px;
    margin-top: 10px;
    font-family: source-code-pro, Menlo, Monaco, Consolas, Courier New, monospace;
  }
`

export const TransactionInfoContentPanel = styled.div`
  margin: 15px 0;

  .transaction__info__content_item {
    display: flex;
    margin: 5px 0;

    a {
      font-size: 14px;
      color: ${props => props.theme.primary};
      width: 100%;
      word-wrap: break-word;
      word-break: break-all;
    }

    a:hover {
      color: ${props => props.theme.primary};
    }
  }

  .transaction__info__content_title {
    width: 200px;
    color: #333333;
    font-size: 14px;
  }

  .transaction__info__content_value {
    color: #333333;
    font-size: 14px;
    width: 100%;
    word-wrap: break-word;
    word-break: break-all;
  }
`
