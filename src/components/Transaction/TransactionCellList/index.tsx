import React, { ReactNode, useState } from 'react'
import LoadMoreIcon from '../../../assets/transaction_load_more.png'
import ShowLessIcon from '../../../assets/transaction_show_less.png'
import TransactionCellListPanel from './styled'

interface TransactionCellListProps {
  data: any[]
  pageSize: number
  render: (item: any) => ReactNode
}

export default ({ data, pageSize, render }: TransactionCellListProps) => {
  const [count, setCount] = useState(pageSize)
  const onClickLoadMore = () => {
    setCount(Math.min(data.length, count + pageSize))
  }
  const onClickShowLess = () => {
    setCount(pageSize)
  }
  return (
    <TransactionCellListPanel>
      {data && data.map((item, idx) => idx < count && render(item))}
      {data && count < data.length && (
        <button type="button" onClick={onClickLoadMore}>
          Load More
          <img src={LoadMoreIcon} alt="load more" />
        </button>
      )}
      {data && count === data.length && (
        <button type="button" onClick={onClickShowLess}>
          Show Less
          <img src={ShowLessIcon} alt="show less" />
        </button>
      )}
    </TransactionCellListPanel>
  )
}
