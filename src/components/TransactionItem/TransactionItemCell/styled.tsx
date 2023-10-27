import styled from 'styled-components'

export const TransactionCellPanel = styled.div<{ highLight?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  background: ${({ highLight }) => (highLight ? '' : '#f5f5f5')};

  @media (min-width: 750px) {
    height: 20px;
  }

  @media (max-width: 750px) {
    justify-content: normal;
    align-items: flex-start;
    flex-direction: column;
  }

  .transactionCellAddress {
    color: ${({ highLight = false, theme }) => (highLight ? `${theme.primary}` : '#000000')};
    font-weight: 500;
    min-width: 0;
    width: 100%;
    height: 20px;
    display: flex;
    align-items: center;

    @media (max-width: 750px) {
      height: 16px;
      font-size: 14px;
    }

    a {
      color: ${({ theme }) => `${theme.primary}`};
    }

    a:hover {
      color: ${({ theme }) => `${theme.primary}`};
    }
  }
`

export const TransactionCellCapacityPanel = styled.div`
  flex-shrink: 0;
  color: #000;
  margin-left: 15px;
  display: flex;
  max-height: 40px;
  align-items: center;

  .transactionCellWithoutIcon {
    margin-right: 21px;
  }

  @media (max-width: 750px) {
    margin-left: 0;
    margin-top: 5px;
    height: 16px;
    width: 100%;
    justify-content: flex-end;

    .transactionCellWithoutIcon {
      margin: 0 6px;
    }
  }

  > span {
    margin-left: 5px;
  }
`

export const TransactionCellWithdraw = styled.div`
  display: flex;
  align-items: center;
  margin-top: 2px;

  span {
    margin-left: 6px;
  }

  img {
    margin-left: 5px;
    width: 16px;
    height: auto;
    cursor: pointer;

    @media (max-width: 750px) {
      width: 12px;
      height: auto;
    }
  }
`

export const TransactionCellUDTPanel = styled.div`
  display: flex;
  align-items: center;

  span {
    margin-left: 6px;
  }

  .transactionCellUdtIcon {
    margin-left: 5px;
    width: 16px;
    height: auto;
    cursor: pointer;

    @media (max-width: 750px) {
      width: 12px;
      height: auto;
      margin-bottom: 3px;
    }
  }
`

export const WithdrawInfoPanel = styled.div`
  > p {
    font-size: 16px;
    font-weight: 600;
    width: 100%;
    text-align: center;
    margin-bottom: 16px;

    @media (max-width: 750px) {
      font-size: 11px;
      margin-bottom: 8px;
    }
  }
`

export const WithdrawItemPanel = styled.div`
  margin: 10px;
  display: flex;

  @media (max-width: 750px) {
    margin: 5px;
  }

  .withdrawInfoTitle {
    font-size: 14px;
    font-weight: 450;
    width: ${({ width }: { width: string }) => {
      switch (width) {
        case 'long':
          return '180px'
        case 'medium':
          return '150px'
        default:
          return '85px'
      }
    }};

    @media (max-width: 750px) {
      font-size: 10px;
      width: ${({ width }: { width: string }) => {
        switch (width) {
          case 'long':
            return '130px'
          case 'medium':
            return '105px'
          default:
            return '60px'
        }
      }};
    }

    @media (max-width: 375px) {
      font-size: 9px;
      width: ${({ width }: { width: string }) => {
        switch (width) {
          case 'long':
            return '145px'
          case 'medium':
            return '115px'
          default:
            return '65px'
        }
      }};
    }
  }

  .withdrawInfoContent {
    font-size: 14px;

    @media (max-width: 750px) {
      font-size: 10px;
    }

    @media (max-width: 375px) {
      font-size: 9px;
    }
  }

  a {
    color: ${({ theme }) => theme.primary};
  }

  a:hover {
    color: ${({ theme }) => `${theme.primary}`};
  }
`
