import styled from 'styled-components'

export const TransactionCellPanel = styled.div`
  display: flex;
  align-items: center;
  height: 35px;
  justify-content: space-between;

  @media (max-width: 700px) {
    justify-content: normal;
    align-items: flex-start;
    flex-direction: column;
    height: 37px;
    margin-top: 10px;
  }

  .transaction__cell_address {
    color: ${({ highLight = false }: { highLight?: boolean }) => (highLight ? '#3cc68a' : '#000000')};
    font-weight: 500;
  }

  .transaction__cell_capacity {
    color: #000000;
    margin-left: 15px;

    @media (max-width: 700px) {
      margin-left: 0px;
      margin-top: 5px;
    }
  }
`

export const CellbasePanel = styled.div`
  display: flex;
  align-items: center;
  height: 16px;

  .cellbase__content {
    color: #000000;
    margin-right: 10px;
  }

  > a {
    font-weight: 500;
    color: #3cc68a;
  }

  .cellbase__help {
    margin-left: 10px;
    position: relative;
    transform: translateY(2px);

    &:focus {
      outline: 0;
    }

    > img {
      width: 20px;
      height: 20px;

      @media (max-width: 700px) {
        width: 16px;
        height: 16px;
      }
    }
  }
`
