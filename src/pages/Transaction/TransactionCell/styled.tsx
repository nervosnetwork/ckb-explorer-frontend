import styled from 'styled-components'

export const TransactionCellPanel = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`

export const TransactionCellContentPanel = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 20px;

  font-size: 16px;
  color: #000000;
  text-align: center;
  .transaction__cell_index {
    margin-right: 3px;
    color: #666666;
    > div {
      width: 60px;
      text-align: start;
    }
  }
  .transaction__cell_hash {
    flex: 0.33;
  }
  .transaction__cell_capacity {
    flex: 0.3;
    display: flex;
    justify-content: center;
  }
  .transaction__cell_detail {
    flex: 0.33;
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
  justify-content: space-between;
  align-items: center;

  @media (max-width: 700px) {
    text-align: left;
    > a {
      font-weight: 500;
    }
  }

  @media (min-width: 700px) {
    font-weight: 500;
  }
`

export const TransactionCellDetailPanel = styled.div`
  width: 100%;
  font-weight: 500;
  display: flex;
  flex-direction: row;

  .transaction__cell_lock_script {
    flex: 0.34;
    align-items: flex-start;

    @media (max-width: 700px) {
      flex: none;
    }
  }
  .transaction__cell_type_script {
    flex: 0.33;
    @media (max-width: 700px) {
      flex: 1;
    }
  }
  .transaction__cell_data {
    flex: 0.33;

    @media (max-width: 700px) {
      flex: none;
    }
  }
`

export const TransactionCellDetailItemPanel = styled.div`
  cursor: ${(props: { highLight?: boolean; theme: any }) => (props.highLight ? 'pointer' : 'default')};
  display: flex;
  flex-direction: column;
  color: ${(props: { highLight?: boolean; theme: any }) => (props.highLight ? `${props.theme.primary}` : '#000000')};
  font-weight: 500;
  align-items: center;

  @media (max-width: 700px) {
    margin-top: 10px;
  }

  &:after {
    content: '';
    background: ${(props: { highLight?: boolean; theme: any }) => `${props.theme.primary}`};
    width: calc(100% - 4px);
    height: 2px;
    display: ${(props: { highLight?: boolean; theme: any; selected: boolean }) => (props.selected ? 'block' : 'none')};

    @media (max-width: 700px) {
      height: 1px;
      width: calc(100% - 2px);
    }
  }
`

export const TransactionCellDetailLockScriptPanel = styled(TransactionCellDetailItemPanel)`
  width: 90px;
  float: left;

  @media (max-width: 700px) {
    width: 72px;
  }
`

export const TransactionCellDetailTypeScriptPanel = styled(TransactionCellDetailItemPanel)`
  width: 90px;
  margin: 0px auto;

  @media (max-width: 700px) {
    width: 72px;
  }
`

export const TransactionCellDetailDataPanel = styled(TransactionCellDetailItemPanel)`
  width: 40px;
  float: right;

  @media (max-width: 700px) {
    width: 30px;
  }
`
