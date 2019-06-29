import React, { ReactNode, useState } from 'react'
import styled from 'styled-components'
import LoadMoreIcon from '../../../assets/transaction_load_more.png'
import { InputOutput } from '../../../http/response/Transaction'
import TransactionCell from '../TransactionCell/index'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 13;
  width: 100%;
  > button {
    border: none;
    padding: 10px 0px;
    color: #888888;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    cursor: pointer;
    outline: none;
    > img {
      width: 16px;
      height: 9px;
      flex: 1;
      margin-left: 10px;
    }
  }
`

const MAX_CELL_SHOW_SIZE = 10

export default ({ cells, address, children }: { cells: InputOutput[]; address?: string; children?: ReactNode }) => {
  const [count, setCount] = useState(MAX_CELL_SHOW_SIZE)
  const onClickLoadMore = () => {
    setCount(Math.min(cells.length, count + MAX_CELL_SHOW_SIZE))
  }
  return (
    <Container>
      {cells &&
        cells.map(
          (cell: InputOutput, index: number) =>
            index < count && cell && <TransactionCell cell={cell} address={address} key={cell.id} />,
        )}
      {count < cells.length && (
        <button type="button" onClick={onClickLoadMore}>
          Load More
          <img src={LoadMoreIcon} alt="load more" />
        </button>
      )}
      {children}
    </Container>
  )
}
