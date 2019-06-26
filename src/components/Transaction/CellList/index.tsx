import React, { ReactNode, useState } from 'react'
import LoadMoreIcon from '../../../assets/transaction_load_more.png'
import { InputOutput } from '../../../http/response/Transaction'
import TransactionCell from '../Cell'
import Container from './styled'

interface Props {
  cells: [any]
  address?: string
  pageSize: number
  children?: ReactNode
}

export default ({ cells, address, pageSize, children }: Props) => {
  const [count, setCount] = useState(pageSize)
  const onClickLoadMore = () => {
    setCount(Math.min(cells.length, count + pageSize))
  }
  return (
    <Container>
      {cells &&
        cells.map(
          (cell: InputOutput, idx: number) =>
            idx < count && cell && <TransactionCell cell={cell} address={address} key={cell.id} />,
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
