import styled from 'styled-components'

export const TransactionCellPanel = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;

  @media (min-width: 700px) {
    height: 20px;
  }

  @media (max-width: 700px) {
    justify-content: normal;
    align-items: flex-start;
    flex-direction: column;
    margin-top: 10px;
  }

  .transaction__cell_address {
    color: ${({ highLight = false }: { highLight?: boolean }) => (highLight ? '#3cc68a' : '#000000')};
    font-weight: 500;
    height: 20px;

    @media (max-width: 700px) {
      height: 16px;
    }
  }

  .transaction__cell_capacity {
    color: #000000;
    margin-left: 15px;
    height: 20px;

    @media (max-width: 700px) {
      margin-left: 0px;
      margin-top: 5px;
      height: 16px;
    }
  }
`

export const CellbasePanel = styled.div`
  display: flex;
  align-items: center;
  height: 20px;
  position: relative;
  width: 100%;
  margin-top: 20px;

  @media (max-width: 700px) {
    margin-top: 10px;
    height: 16px;
  }

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
