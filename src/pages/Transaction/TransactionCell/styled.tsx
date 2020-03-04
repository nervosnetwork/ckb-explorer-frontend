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
    flex: 0.38;
    display: flex;
  }
  .transaction__cell_capacity {
    flex: 0.22;
    display: flex;
    justify-content: flex-end;
    padding-right: 100px;

    @media (max-width: 1440px) {
      padding-right: 60px;
      flex: 0.26;
    }

    @media (max-width: 1200px) {
      padding-right: 40px;
      flex: 0.26;
    }

    @media (max-width: 1000px) {
      padding-right: 16px;
      flex: 0.24;
    }
  }
  .transaction__cell_detail {
    flex: 0.4;

    @media (max-width: 1440px) {
      padding-right: 60px;
      flex: 0.36;
    }
    @media (max-width: 1000px) {
      flex: 0.38;
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
    width: 18px;
    height: 14px;

    @media (max-width: 750px) {
      width: 9px;
      height: 7px;
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
`

export const TransactionCellDetailItemPanel = styled.div`
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

export const TransactionCellDetailLockScriptPanel = styled(TransactionCellDetailItemPanel)`
  width: 90px;
  float: left;

  @media (max-width: 750px) {
    width: 72px;
  }
`

export const TransactionCellDetailTypeScriptPanel = styled(TransactionCellDetailItemPanel)`
  width: 90px;
  margin: 0px auto;

  @media (max-width: 750px) {
    width: 72px;
  }
`

export const TransactionCellDetailDataPanel = styled(TransactionCellDetailItemPanel)`
  width: 40px;
  float: right;

  @media (max-width: 750px) {
    width: 30px;
  }
`
