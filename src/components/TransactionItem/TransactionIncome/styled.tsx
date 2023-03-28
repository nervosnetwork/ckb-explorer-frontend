import styled from 'styled-components'

export const TransactionIncomePanel = styled.div`
  width: 100%;
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;

  @media (max-width: 750px) {
    justify-content: center;
  }
`

export const TransactionCapacityValuePanel = styled.div`
  height: 36px;
  border-radius: 18px;
  background-color: white;
  padding: 0 21px;
  width: 220px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  color: ${(props: { increased: boolean; theme: any }) => (props.increased ? props.theme.primary : '#FF6347')};
  font-size: 16px;

  @media (max-width: 750px) {
    font-size: 14px;
  }
`
