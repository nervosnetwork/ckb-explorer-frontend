import styled from 'styled-components'

export const TransactionDetailPanel = styled.div`
  width: 100%;
  margin-top: 20px;

  @media (max-width: 750px) {
    margin-top: 10px;
  }

  .transaction__detail_content {
    border: none;
    width: 100%;
    max-height: 400px;
    overflow-y: auto;
    overflow-wrap: break-word;
    white-space: pre-wrap;
    word-break: break-all;
    padding: 20px 30px;
    font-size: 16px;
    color: #888888;
    font-weight: bold;
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
    margin-top: 5px;
    background-color: #f9f9f9;
    border-radius: 6px;

    @media (max-width: 750px) {
      font-size: 10px;
      border-radius: 3px;
      padding: 10px;
    }
  }

  .transaction__detail_copy {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 20px;
    width: 100%;

    @media (max-width: 750px) {
      margin-top: 10px;
    }
  }
`

export const TransactionDetailContainer = styled.div`
  width: 940px;

  @media (max-width: 750px) {
    width: 350px;
  }

  .transaction__detail__separate {
    width: auto;
    height: 1px;
    background: #eaeaea;
    margin-top: 17px;
  }
`

export const TransactionCellDetailCopyButtonPanel = styled.div`
  margin: auto;
  cursor: pointer;
  width: 150px;
  height: 40px;
  background: ${props => props.theme.primary};
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0 20px;

  > div {
    color: white;
    font-size: 20px;
  }

  > img {
    width: 24px;
    height: 24px;
  }

  @media (max-width: 750px) {
    width: 75px;
    height: 20px;
    padding: 0 10px;

    > div {
      font-size: 12px;
    }

    > img {
      width: 14px;
      height: 14px;
    }
  }
`

export const TransactionCellDetailPanel = styled.div`
  width: 100%;
  font-weight: 500;
  display: flex;
  flex-direction: row;
`

export const TransactionDetailItem = styled.div`
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

export const TransactionDetailLockPanel = styled(TransactionDetailItem)`
  width: 90px;
`

export const TransactionDetailTypePanel = styled(TransactionDetailItem)`
  width: 90px;
  margin-left: 90px;
`

export const TransactionDetailDataPanel = styled(TransactionDetailItem)`
  width: 40px;
  margin-left: 90px;
`
