import styled from 'styled-components'
import variables from '../../../styles/variables.module.scss'

export const TransactionDetailContainer = styled.div`
  .transactionDetailSeparate {
    width: auto;
    height: 1px;
    background: #eaeaea;
    margin-top: -3px;
  }
`

export const TransactionDetailItem = styled.div<{ selected?: boolean }>`
  cursor: pointer;
  position: relative;
  display: flex;
  padding-bottom: 22px;
  color: ${props => (props.selected ? '#000000' : 'rgba(0, 0, 0, 0.6)')};
  font-weight: 600;
  font-size: 16px;
  align-items: center;
  white-space: pre-wrap;

  @media (max-width: ${variables.mobileBreakPoint}) {
    margin-top: 5px;
  }

  &::after {
    position: absolute;
    left: 2px;
    bottom: 0;
    content: '';
    background: ${props => `${props.theme.primary}`};
    width: calc(100% - 4px);
    height: 5px;
    display: ${props => (props.selected ? 'block' : 'none')};
  }
`

export const TransactionDetailLock = styled(TransactionDetailItem)``

export const TransactionDetailType = styled(TransactionDetailItem)`
  margin-left: 90px;

  @media (max-width: ${variables.mobileBreakPoint}) {
    margin-left: 12px;
  }

  @media (min-width: 751px) and (max-width: 1300px) {
    margin-left: 50px;
  }
`

export const TransactionDetailData = styled(TransactionDetailItem)`
  margin-left: 90px;

  @media (max-width: ${variables.mobileBreakPoint}) {
    margin-left: 12px;
  }

  @media (min-width: 751px) and (max-width: 1300px) {
    margin-left: 50px;
  }
`

export const TransactionDetailCapacityUsage = styled(TransactionDetailItem)`
  margin-left: 90px;

  @media (max-width: ${variables.mobileBreakPoint}) {
    margin-left: 12px;
  }

  @media (min-width: 751px) and (max-width: 1300px) {
    margin-left: 50px;
  }
`

export const TransactionCellDetailTitle = styled.span`
  font-size: 0.875rem;
`
