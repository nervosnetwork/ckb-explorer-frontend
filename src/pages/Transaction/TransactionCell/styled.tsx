import styled from 'styled-components'

export const TransactionCellPanel = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`

export const TransactionCellContentPanel = styled.div`
  display: flex;
  flex-direction: row;
  align-items: ${(props: { isCellbase: boolean }) => (props.isCellbase ? 'flex-start' : 'center')};
  margin: 10px 0;
  font-size: 16px;
  color: #000;
  text-align: center;

  .transactionCellAddress {
    display: flex;
    flex: 0.4;
    min-width: 0;
  }

  .transactionCellDetail {
    flex: ${(props: { isCellbase: boolean }) => (props.isCellbase ? '0.6' : '0.22')};
  }

  .transactionCellCapacity {
    flex: 0.3;
    display: ${(props: { isCellbase: boolean }) => (props.isCellbase ? 'none' : 'flex')};
    justify-content: flex-end;
  }

  .transactionDetailCellInfo {
    flex: 0.08;
    font-size: 12px;
    display: ${(props: { isCellbase: boolean }) => (props.isCellbase ? 'none' : 'flex')};
    flex-direction: column;
    align-items: center;
  }

  a {
    color: ${props => props.theme.primary};
  }

  a:hover {
    color: ${props => props.theme.primary};
  }
`
export const TransactionCellInfoPanel = styled.div`
  .transactionCellInfoContent {
    color: rgb(0 0 0 / 60%);
    cursor: pointer;
    width: 45px;

    @media (max-width: 750px) {
      width: auto;
    }

    .transactionCellInfoSeparate {
      background: rgb(0 0 0 / 60%);
      width: 45px;
      height: 1px;
      transform: ${() => `scaleY(${Math.ceil((1.0 / window.devicePixelRatio) * 10.0) / 10.0})`};

      @media (max-width: 750px) {
        width: auto;
      }
    }

    &:hover {
      color: ${props => props.theme.primary};

      .transactionCellInfoSeparate {
        background: ${props => props.theme.primary};
      }
    }
  }
`

export const TransactionCellAddressPanel = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: row;

  .transactionCellIndex {
    margin-right: 3px;
    color: #666;

    > div {
      width: 70px;
      text-align: start;

      @media (max-width: 1440px) {
        width: 50px;
      }
    }
  }
`

export const TransactionCellHashPanel = styled.div<{ highLight?: boolean }>`
  color: ${({ highLight = false, theme }) => (highLight ? `${theme.primary}` : '#000000')};
  text-align: ${({ highLight = false }) => (highLight ? 'left' : 'center')};
  flex: 1;
  min-width: 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 16px;

  @media (max-width: 750px) {
    text-align: left;

    > a {
      font-weight: 500;
    }
  }

  @media (min-width: 750px) {
    font-weight: 500;
  }

  > span {
    margin: 0 3px;
  }

  .transactionCellAddressLink {
    max-width: 70%;

    @media (max-width: 750px) {
      max-width: unset;
    }
  }

  .transactionCellAddressNoLink {
    color: #000;
  }
`

export const TransactionCellDetailPanel = styled.div`
  width: 100%;
  font-weight: 500;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  .transactionCellDetailPanel {
    display: flex;
    flex-direction: row;
    align-items: center;

    > div {
      font-size: 15px;
      text-align: left;
    }

    > img {
      margin-right: 5px;
      width: ${(props: { isWithdraw: boolean }) => (props.isWithdraw ? '16px' : '18px')};
      height: ${(props: { isWithdraw: boolean }) => (props.isWithdraw ? '20px' : '14px')};
    }
  }
`

export const TransactionCellNftInfo = styled.div`
  white-space: pre-line;
`

export const TransactionCellDetailModal = styled.div`
  background-color: #fff;
  margin: 15% auto;
  padding: 20px 40px;
  border: 1px solid #888;
  width: 75%;

  @media (max-width: 750px) {
    width: 90%;
    margin-top: 40%;
    padding: 10px;
  }
`

export const TransactionCellCardPanel = styled.div`
  .transactionCellCardSeparate {
    width: 100%;
    height: 1px;
    background: #ccc;
    margin: 8px 0;
    transform: ${() => `scaleY(${Math.ceil((1.0 / window.devicePixelRatio) * 10.0) / 10.0})`};
  }

  > div:nth-child(2) {
    margin-bottom: 15px;
  }

  > div:nth-child(4) {
    margin-bottom: 12px;
  }
`

export const TransactionCellCardContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;

  .transactionCellCardTitle {
    flex: 1;
    min-width: 0;
    font-size: 16px;
    color: #666;
    margin-top: 3px;
  }

  .transactionCellCardValue {
    display: flex;
    font-size: 16px;
    color: #000;
  }

  a {
    color: ${props => props.theme.primary};
  }

  a:hover {
    color: ${props => props.theme.primary};
  }
`
