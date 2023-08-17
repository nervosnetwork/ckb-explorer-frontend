import styled from 'styled-components'

export const TransactionsPagination = styled.div`
  margin-top: 4px;
  width: 100%;
`

export const DAONoResultPanel = styled.div`
  width: 100%;
  height: 94px;
  border-radius: 0 0 6px 6px;
  box-shadow: 0 2px 6px 0 rgb(0 0 0 / 12%);
  background-color: #fff;
  margin-top: 4px;
  display: flex;
  justify-content: center;
  align-items: center;

  > span {
    white-space: pre-wrap;
    font-size: 14px;
    letter-spacing: 0.2px;
    color: #666;
    text-align: center;
  }
`
