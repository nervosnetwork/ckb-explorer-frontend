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
    margin-top: 30px;
    margin-bottom: 0px;
    padding: 0px 20px 20px 20px;
  }
`

export const TransactionBlockHeightPanel = styled.div`
  color: #3cc68a;
`
