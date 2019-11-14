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
    color: ${({ highLight = false, theme }: { highLight?: boolean; theme: any }) =>
      highLight ? `${theme.primary}` : '#000000'};

    font-weight: 500;
    height: 20px;
    display: flex;
    align-items: center;

    @media (max-width: 700px) {
      height: 16px;
    }

    > a {
      color: ${({ theme }: { theme: any }) => `${theme.primary}`};
    }

    .nervos__dao__withdraw_help {
      margin-left: 5px;
      width: 18px;
      height: 18px;

      @media (max-width: 700px) {
        width: 14px;
        height: 14px;
      }
    }
  }

  .transaction__cell_withdraw {
    display: flex;
    align-items: center;
    margin-top: 2px;
  }

  .transaction__cell_dao {
    color: ${({ highLight = false, theme }: { highLight?: boolean; theme: any }) =>
      highLight ? `${theme.primary}` : '#000000'};
  }
`

export const TransactionCellCapacity = styled.div`
  color: #000000;
  margin-left: 15px;
  display: flex;
  height: 20px;
  align-items: center;

  @media (max-width: 700px) {
    margin-left: 0px;
    margin-top: 5px;
    height: 16px;
    width: ${({ fullWidth = false }: { fullWidth?: boolean }) => (fullWidth ? '100%' : 'auto')};
    justify-content: space-between;
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
    color: ${props => props.theme.primary};
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
      margin-bottom: 3px;

      @media (max-width: 700px) {
        width: 16px;
        height: 16px;
      }
    }
  }
`

export const WithdrawInfoPanel = styled.div`
  font-family: Montserrat, Montserrat-Regular, PingFang SC, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
    'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'Noto Sans CJK SC', 'Noto Sans CJK',
    'Source Han Sans', source-han-sans-simplified-c, sans-serif;

  > div {
    margin: 5px;
    display: flex;

    .withdraw__info_title {
      font-size: 14px;
      font-weight: 450;
      width: 150px;

      @media (max-width: 700px) {
        font-size: 10px;
        width: 100px;
      }

      @media (max-width: 375px) {
        font-size: 9px;
        width: 90px;
      }
    }

    .withdraw__info_content {
      font-size: 14px;

      @media (max-width: 700px) {
        font-size: 10px;
      }

      @media (max-width: 375px) {
        font-size: 9px;
      }
    }

    a {
      color: ${({ theme }: { theme: any }) => theme.primary};
    }
  }
`
