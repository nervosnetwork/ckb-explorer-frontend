import styled from 'styled-components'

export const TransactionCellPanel = styled.div`
  display: flex;
  align-items: center;
  height: 35px;
  justify-content: space-between;

  .transaction__cell_address {
    color: ${({ highLight = false }: { highLight?: boolean }) => (highLight ? '#3cc68a' : '#000000')};
    font-size: 16px;
    font-family: monospace;
    font-weight: 600;
  }

  .transaction__cell_capacity {
    font-size: 16px;
    color: #000000;
    margin-left: 15px;
  }
`

export const CellbasePanel = styled.div`
  display: flex;

  .cellbase__content {
    color: #000000;
    font-size: 16px;
    margin-right: 10px;
  }

  > a {
    font-size: 16px;
    font-weight: 500;
    color: #3cc68a;
  }

  .cellbase__help {
    margin-left: 10px;
    position: relative;
    &:focus {
      outline: 0;
    }

    > img {
      margin-top: -1px;
      width: 20px;
      height: 20px;
    }
  }
`
