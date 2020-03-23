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
    flex: 0.34;
    display: flex;
  }

  .transaction__cell_capacity {
    flex: 0.26;
    display: flex;
    justify-content: flex-end;
    padding-right: 100px;

    @media (max-width: 1440px) {
      padding-right: 40px;
    }

    @media (max-width: 1000px) {
      padding-right: 20px;
    }
  }
  .transaction__cell_detail {
    flex: 0.4;
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
  justify-content: flex-start;
  align-items: center;

  @media (max-width: 750px) {
    margin-top: 12px;
  }

  > img {
    width: ${(props: { isWithdraw: boolean }) => (props.isWithdraw ? '16px' : '18px')};
    height: ${(props: { isWithdraw: boolean }) => (props.isWithdraw ? '20px' : '14px')};

    @media (max-width: 750px) {
      width: ${(props: { isWithdraw: boolean }) => (props.isWithdraw ? '9.6px' : '12px')};
      height: ${(props: { isWithdraw: boolean }) => (props.isWithdraw ? '12px' : '9px')};
    }
  }

  > div {
    margin: 0 12px;
    font-size: 16px;
    width: 178px;
    text-align: left;

    @media (max-width: 1200px) {
      width: 110px;
      font-size: 15px;
      margin: 0 6px;
    }

    @media (max-width: 750px) {
      font-size: 13px;
      width: 178px;
    }
  }

  .dropdown__icon {
    width: 10px;
    height: 5px;
  }

  .transaction__detail__cell_info {
    color: ${props => props.theme.primary};

    &:hover {
      color: ${props => props.theme.primary};
    }
  }

  .transaction__detail__modal {
    display: block;
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgb(0, 0, 0);
    background-color: rgba(0, 0, 0, 0.4);
  }

  .transaction__detail__modal__content {
    background-color: #fefefe;
    margin: 15% auto;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
  }

  .close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
  }

  .close:hover,
  .close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
  }
`

export const TransactionDetailItem = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  color: ${props => props.theme.primary};
  font-weight: 500;
  align-items: center;

  @media (max-width: 750px) {
    margin-top: 10px;
  }

  &:after {
    content: '';
    background: ${props => props.theme.primary};
    width: calc(100% - 4px);
    height: 2px;
    display: ${(props: { highLight?: boolean; theme: any; selected: boolean }) => (props.selected ? 'block' : 'none')};

    @media (max-width: 750px) {
      height: 1px;
      width: calc(100% - 2px);
    }
  }
`

export const TransactionDetailLockPanel = styled(TransactionDetailItem)`
  width: 90px;
  float: left;

  @media (max-width: 750px) {
    width: 72px;
  }
`

export const TransactionDetailTypePanel = styled(TransactionDetailItem)`
  width: 90px;
  margin: 0px auto;

  @media (max-width: 750px) {
    width: 72px;
  }
`

export const TransactionDetailDataPanel = styled(TransactionDetailItem)`
  width: 40px;
  float: right;

  @media (max-width: 750px) {
    width: 30px;
  }
`
