import styled from 'styled-components'

export default styled.div`
  display: flex;
  flex-direction: column;
  align-items: space-between;
  width: 100%;

  .transaction_item__view_all {
    font-size: 16px;
    color: #3cc68a;
    margin-top: 20px;
    height: 20px;

    @media (max-width: 700px) {
      font-size: 14px;
      margin-top: 15px;
      height: 16px;
    }
  }
`
