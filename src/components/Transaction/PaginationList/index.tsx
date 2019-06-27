import React, { ReactNode, useState } from 'react'
import LoadMoreIcon from '../../../assets/transaction_load_more.png'
import Container from './styled'

interface Props {
  data: any[]
  pageSize: number
  render: (item: any) => ReactNode
  children?: ReactNode
}

export default ({ data, pageSize, render, children }: Props) => {
  const [count, setCount] = useState(pageSize)
  const onClickLoadMore = () => {
    setCount(Math.min(data.length, count + pageSize))
  }
  const onClickShowLess = () => {
    setCount(pageSize)
  }

  return (
    <Container>
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
          <img src={LoadMoreIcon} alt="load more" />
        </button>
      )}
      {children}
    </Container>
  )
}
