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
    margin: 0;
    padding: 20px;
  }

  .transactionInputs {
    width: 100%;
  }

  .transactionOutputs {
    width: 100%;
    margin-top: 20px;
  }

  .transactionLite {
    width: 100%;
    border-radius: 6px;
    box-shadow: 2px 2px 6px 0 #dfdfdf;
    background-color: #fff;
    margin-bottom: 10px;
    padding: 16px 36px 12px;

    @media (max-width: 750px) {
      padding: 16px 18px;
    }
  }
`

export const TransactionOverviewPanel = styled.div`
  width: 100%;

  .transactionOverviewInfo {
    margin-bottom: 12px;
    display: flex;
    flex-direction: column;

    .transactionOverviewParameters {
      font-size: 16px;
      font-weight: 600;
      margin: 8px 0;
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
        margin-top: 15px;

        > img {
          margin: 0 0 0 5px;
        }
      }
    }
  }

  .transactionOverviewParams {
    background: #f1f1f1;
    padding: 0 12px;
  }
`

export const TransactionBlockHeightPanel = styled.div`
  color: ${props => props.theme.primary};

  span {
    color: #000;
  }
`

export const TransactionInfoItemPanel = styled.div`
  flex: 1;

  @media (max-width: 750px) {
    margin-top: 3px;
  }

  .transactionInfoTitle {
    display: flex;
    align-items: center;
    margin-top: 10px;
    font-weight: 500;

    @media (max-width: 750px) {
      margin-top: 5px;
    }
  }

  .transactionInfoValue {
    margin-left: 10px;
    margin-top: 5px;
    max-height: 250px;
    font-size: 16px;
    overflow-y: scroll;

    @media (max-width: 750px) {
      margin-left: 0;
      margin-top: 2px;
    }
  }
`

export const TransactionInfoContentPanel = styled.div`
  margin: 15px 0;
`

export const TransactionInfoContentItem = styled.div`
  display: flex;
  margin: 5px 0;

  a {
    color: ${props => props.theme.primary};
    word-wrap: break-word;
    word-break: break-all;
  }

  a:hover {
    color: ${props => props.theme.primary};
  }

  .transactionInfoContentTitle {
    display: flex;
    align-items: center;
    width: 160px;
    color: #333;
    font-size: 14px;

    @media (max-width: 750px) {
      font-size: 12px;
    }
  }

  .transactionInfoContentContainer {
    color: #333;
    font-size: 14px;
    width: 100%;
    word-wrap: break-word;
    word-break: break-all;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    gap: 0 12px;

    @media (max-width: 750px) {
      font-size: 12px;
    }

    .transactionInfoContentValue {
      display: flex;
      align-items: center;
      flex-shrink: 0;
    }

    .transactionInfoContentTag {
      width: 400px;
      max-width: 100%;
    }
  }
`

export const TransactionCellDepTagPanel = styled.div`
  margin-left: 160px;
`
