import styled from 'styled-components'

export const TransactionCellPanel = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`

export const TransactionCellContentPanel = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 10px 0;

  font-size: 16px;
  color: #000000;
  text-align: center;
  .transaction__cell_index {
    margin-right: 3px;
    color: #666666;
    > div {
      width: 40px;
      text-align: start;
    }
  }
  .transaction__cell_hash {
    flex: 0.4;
    display: flex;
  }

  .transaction__cell_detail {
    flex: 0.22;
  }

  .transaction__cell_capacity {
    flex: 0.3;
    display: flex;
    justify-content: flex-end;
  }

  .transaction__detail__cell_info {
    flex: 0.08;
    font-size: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;

    .transaction__cell__info__content {
      color: rgba(0, 0, 0, 0.6);
      cursor: pointer;
      width: 45px;

      &:hover {
        color: ${props => props.theme.primary};
      }
    }

    .transaction__cell__info__separate {
      background: rgba(0, 0, 0, 0.6);
      width: 45px;
      height: 1px;

      &:hover {
        background: ${props => props.theme.primary};
      }
    }
  }

  a {
    color: ${props => props.theme.primary};
  }
  a:hover {
    color: ${props => props.theme.primary};
  }
`

export const TransactionCellHashPanel = styled.div`
  color: ${({ highLight = false, theme }: { highLight?: boolean; theme: any }) =>
    highLight ? `${theme.primary}` : '#000000'};
  text-align: ${({ highLight = false }: { highLight?: boolean }) => (highLight ? 'left' : 'center')};
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
    margin-right: 19px;

    @media (max-width: 750px) {
      margin-right: 0px;
    }
  }

  .transaction__cell_address_no_link {
    color: #000000;
  }
`

export const TransactionCellDetailPanel = styled.div`
  width: 100%;
  font-weight: 500;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  .transaction__cell__detail__panel {
    display: flex;
    flex-direction: row;
    align-items: center;

    > div {
      margin: 0 12px;
      font-size: 15px;
      text-align: left;
    }
    > img {
      width: ${(props: { isWithdraw: boolean }) => (props.isWithdraw ? '16px' : '18px')};
      height: ${(props: { isWithdraw: boolean }) => (props.isWithdraw ? '20px' : '14px')};

      @media (max-width: 750px) {
        width: ${(props: { isWithdraw: boolean }) => (props.isWithdraw ? '9.6px' : '12px')};
        height: ${(props: { isWithdraw: boolean }) => (props.isWithdraw ? '12px' : '9px')};
      }
    }
  }
`

export const TransactionCellDetailModal = styled.div`
  background-color: #ffffff;
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
  .transaction__cell__card__separate {
    width: 100%;
    height: 1px;
    background: #ededed;
    margin: 8px 0;
  }

  >div: nth-child(2) {
    margin-bottom: 6px;
  }

  >div: nth-child(4) {
    margin-bottom: 10px;
  }

  .transaction__cell__card__content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
  }

  .transaction__cell__card__title {
    font-size: 16px;
    color: #666666;
    margin-top: 3px;
  }

  .transaction__cell__card__value {
    display: flex;
    font-size: 16px;
    color: #000000;

    a:hover {
      color: ${props => props.theme.primary};
    }
  }
`
