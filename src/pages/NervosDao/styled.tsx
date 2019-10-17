import styled from 'styled-components'

export const DaoContentPanel = styled.div`
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
`

export const TransactionsPagition = styled.div`
  margin: 20px 0px 0px 0px;
  width: 100%;

  @media (max-width: 700px) {
    margin: 10px 0px 0px 0px;
  }
`
