import React, { ReactNode, useState } from 'react'
import LoadMoreIcon from '../../../assets/transaction_load_more.png'
import ShowLessIcon from '../../../assets/transaction_show_less.png'
import PaginationListPanel from './styled'

interface PaginationListProps {
  data: any[]
  pageSize: number
  render: (item: any) => ReactNode
}

export default ({ data, pageSize, render }: PaginationListProps) => {
  const [count, setCount] = useState(pageSize)
  const onClickLoadMore = () => {
    setCount(Math.min(data.length, count + pageSize))
  }
  const onClickShowLess = () => {
    setCount(pageSize)
  }
  return (
    <PaginationListPanel>
      {data && data.map((item, idx) => idx < count && render(item))}
      {count < data.length && (
        <button type="button" onClick={onClickLoadMore}>
          Load More
          <img src={LoadMoreIcon} alt="load more" />
        </button>
      )}
      {count === data.length && (
        <button type="button" onClick={onClickShowLess}>
          Show Less
          <img src={ShowLessIcon} alt="show less" />
        </button>
      )}
    </PaginationListPanel>
  )
}
