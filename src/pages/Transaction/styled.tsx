import styled from 'styled-components'

export const TransactionDiv = styled.div.attrs({
  className: 'container',
})`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;
  margin-bottom: 40px;

  @media (max-width: 750px) {
    margin: 0px;
    padding: 20px;
  }

  .transaction__overview {
    width: 100%;

    .transaction__overview_info {
      margin: 5px 0;
      display: flex;
      flex-direction: column;

      .transaction__overview_parameters {
        font-size: 16px;
        font-weight: 600;
        margin-top: 15px;
        cursor: pointer;
        color: ${props => props.theme.primary};
        display: flex;
        align-items: center;

        > img {
          width: 12px;
          height: 12px;
          margin: 2px 0 0 5px;
        }

        @media (max-width: 750px) {
          font-size: 14px;
          margin-top: 10px;

          > img {
            margin: 0px 0 0 5px;
          }
        }
      }
    }
  }

  .transaction__inputs {
    width: 100%;
    margin-top: 20px;
  }

  .transaction__outputs {
    width: 100%;
    margin-top: 20px;
  }
`

export const TransactionBlockHeightPanel = styled.div`
  color: ${props => props.theme.primary};
`

export const TransactionInfoItemPanel = styled.div`
  flex: 1;

  @media (max-width: 750px) {
    margin-top: 3px;
  }

  .transaction__info_title {
    margin-top: 10px;
    font-weight: 500;

    @media (max-width: 750px) {
      margin-top: 5px;
    }
  }
  .transaction__info_value {
    margin-left: 20px;
    margin-top: 5px;
    max-height: 250px;
    overflow-y: scroll;

    @media (max-width: 750px) {
      margin-left: 0px;
      margin-top: 2px;
    }
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
    width: 180px;
    color: #333333;
    font-size: 14px;

    @media (max-width: 750px) {
      font-size: 12px;
    }
  }

  .transaction__info__content_value {
    color: #333333;
    font-size: 14px;
    width: auto;
    word-wrap: break-word;
    word-break: break-all;
    display: flex;
    justify-content: flex-start;

    @media (max-width: 1440px) {
      width: 100%;
    }

    @media (max-width: 750px) {
      font-size: 12px;
    }

    .transaction__info__content__tag {
      margin-left: 12px;
    }
  }
`

export const TransactionCellDepTagPanel = styled.div`
  margin-left: 160px;
`
