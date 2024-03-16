import styled from 'styled-components'
import variables from '../../../styles/variables.module.scss'

export const TransactionDiv = styled.div.attrs({
  className: 'container',
})`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;
  margin-bottom: 40px;

  @media (max-width: ${variables.mobileBreakPoint}) {
    margin: 0;
    padding: 20px;
  }

  .transactionInputs {
    width: 100%;
    margin-top: 4px;

    @media (max-width: ${variables.mobileBreakPoint}) {
      margin-top: 20px;
    }
  }

  .transactionOutputs {
    width: 100%;
    margin-top: 24px;

    @media (max-width: ${variables.mobileBreakPoint}) {
      margin-top: 20px;
    }
  }

  .transactionLite {
    width: 100%;
    border-radius: 6px;
    box-shadow: 2px 2px 6px 0 #dfdfdf;
    background-color: #fff;
    margin-bottom: 10px;
    padding: 16px 36px 12px;

    @media (max-width: ${variables.mobileBreakPoint}) {
      padding: 16px 18px;
    }
  }
`

export const TransactionOverviewPanel = styled.div`
  width: 100%;

  .transactionOverviewParams {
    background: #f5f5f5;
    margin-top: 8px;
    padding: 24px 40px;
    border-radius: 4px;
    color: #333;
  }

  @media (max-width: ${variables.mobileBreakPoint}) {
    margin-top: 8px;

    .transactionOverviewParams {
      padding: 12px 8px 8px;
    }
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

  .transactionInfoTitle {
    display: flex;
    align-items: center;
    margin-top: 24px;

    @media (max-width: ${variables.mobileBreakPoint}) {
      margin-top: 12px;
    }
  }

  &:first-child {
    .transactionInfoTitle {
      margin-top: 0;
    }
  }

  .transactionInfoValue {
    margin-top: 16px;
    padding: 12px;
    max-height: 250px;
    font-size: 16px;
    overflow-y: auto;
    background: #eee;
    border-radius: 4px;

    @media (max-width: ${variables.mobileBreakPoint}) {
      margin-top: 8px;
      padding: 12px 8px;
    }
  }
`

export const TransactionInfoContentPanel = styled.div`
  margin: 16px 0;

  &:first-child {
    margin-top: 0;

    /* TODO: This is a highly hardcoded implementation. The entire Transaction Parameters section needs to be refactored into a more maintainable layout structure. */
    & > :nth-child(1) {
      margin-top: 0;
    }
  }

  &:last-child {
    margin-bottom: 0;

    & > :nth-last-child(1) {
      margin-bottom: 0;
    }
  }
`

export const TransactionInfoContentTitle = styled.div`
  flex: 0 0 auto;
  width: 160px;
  font-size: 14px;

  @media (max-width: ${variables.mobileBreakPoint}) {
    width: 130px;
    font-size: 12px;
  }
`

export const TransactionInfoContentContainer = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px 16px;
  font-size: 14px;

  @media (max-width: ${variables.mobileBreakPoint}) {
    font-size: 12px;
  }
`

export const TransactionInfoContentItem = styled.div`
  display: flex;
  margin: 12px 0;

  @media (max-width: ${variables.mobileBreakPoint}) {
    margin: 8px 0;
  }

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

    @media (max-width: ${variables.mobileBreakPoint}) {
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

    @media (max-width: ${variables.mobileBreakPoint}) {
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
