import styled from 'styled-components'
import variables from '../../../styles/variables.module.scss'

export const TransactionIncomePanel = styled.div`
  width: 100%;
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;

  @media (max-width: ${variables.mobileBreakPoint}) {
    justify-content: center;
  }
`

export const TransactionCapacityValuePanel = styled.div<{ increased: boolean }>`
  height: 36px;
  border-radius: 18px;
  background-color: white;
  padding: 0 4px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  color: ${props => (props.increased ? props.theme.primary : '#FF6347')};
  font-size: 16px;

  img {
    width: 13px;
    margin-left: 3px;
    margin-bottom: 2px;
  }

  @media (max-width: ${variables.mobileBreakPoint}) {
    font-size: 14px;

    img {
      width: 13px;
      margin-right: 6px;
      margin-bottom: 0;
    }
  }
`
