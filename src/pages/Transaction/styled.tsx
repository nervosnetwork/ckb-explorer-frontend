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

  .transaction__overview {
    width: 100%;
    margin-top: 15px;

    @media (max-width: 700px) {
      margin-top: 5px;
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
  color: #3cc68a;
`
