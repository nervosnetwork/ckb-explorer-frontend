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
