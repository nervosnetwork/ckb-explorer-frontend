import React, { useState, useEffect } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import Pagination from 'rc-pagination'
import 'rc-pagination/assets/index.css'
import queryString from 'query-string'
import { BlockListPanel, ContentTitle, ContentTable, BlocksPagition } from './styled'
import { parseDate } from '../../utils/date'
import Page from '../../components/Page'
import Header from '../../components/Header'
import Content from '../../components/Content'
import Footer from '../../components/Footer'
import {
  TableTitleRow,
  TableTitleItem,
  TableContentRow,
  TableContentItem,
  TableMinerContentItem,
} from '../../components/Table'
import BlockHeightIcon from '../../asserts/block_height.png'
import TransactionIcon from '../../asserts/transactions.png'
import CellConsumedIcon from '../../asserts/cell_consumed.png'
import MinerIcon from '../../asserts/miner.png'
import TimestampIcon from '../../asserts/timestamp.png'
import { fetchBlockList } from '../../http/fetcher'
import { BlockWrapper } from '../../http/response/Block'
import { Response } from '../../http/response/Response'

enum PageParams {
  PageNo = 1,
  PageSize = 3,
}

export default (props: React.PropsWithoutRef<RouteComponentProps>) => {
  const { location } = props
  const { search } = location
  const parsed = queryString.parse(search)
  const { page, size } = parsed

  const initBlockWrappers: BlockWrapper[] = []
  const [blockWrappers, setBlockWrappers] = useState(initBlockWrappers)
  const [totalBlocks, setTotalBlocks] = useState(1)
  const [pageSize, setPageSize] = useState(page ? parseInt(page as string, 10) : PageParams.PageNo)
  const [pageNo, setPageNo] = useState(size ? parseInt(size as string, 10) : PageParams.PageSize)

  const getBlocks = (page_p: number, size_p: number) => {
    fetchBlockList(page_p, size_p).then(response => {
      const { data, meta } = response as Response<BlockWrapper[]>
      if (meta) {
        const { total } = meta
        setTotalBlocks(total)
      }
      const blocks = data.slice((page_p - 1) * size_p, page_p * size_p)
      setBlockWrappers(blocks)
    })
  }

  useEffect(() => {
    const page_p = page ? parseInt(page as string, 10) : pageNo
    const size_p = size ? parseInt(size as string, 10) : pageSize
    setPageNo(page_p)
    setPageSize(size_p)
    getBlocks(page_p, size_p)
  }, [search])

  const onChange = (page_p: number, size_p: number) => {
    setPageNo(page_p)
    setPageSize(size_p)
    props.history.push(`/block/list?page=${page_p}&size=${size_p}`)
  }

  return (
    <Page>
      <Header />
      <Content>
        <BlockListPanel width={window.innerWidth} className="container">
          <ContentTitle>Blocks</ContentTitle>

          <ContentTable>
            <TableTitleRow>
              <TableTitleItem image={BlockHeightIcon} title="Height" />
              <TableTitleItem image={TransactionIcon} title="Transactions" />
              <TableTitleItem image={CellConsumedIcon} title="Cell Consumed(B)" />
              <TableTitleItem image={MinerIcon} title="Miner" />
              <TableTitleItem image={TimestampIcon} title="Time" />
            </TableTitleRow>
            {blockWrappers.map((data: any) => {
              return (
                <TableContentRow key={data.attributes.block_hash}>
                  <TableContentItem content={data.attributes.number} to={`/block/${data.number}`} />
                  <TableContentItem content={data.attributes.transactions_count} />
                  <TableContentItem content={data.attributes.cell_consumed} />
                  <TableMinerContentItem content={data.attributes.miner_hash} />
                  <TableContentItem content={parseDate(data.attributes.timestamp)} />
                </TableContentRow>
              )
            })}
          </ContentTable>
          <BlocksPagition>
            <Pagination
              showQuickJumper
              showSizeChanger
              defaultPageSize={pageSize}
              defaultCurrent={pageNo}
              total={totalBlocks}
              onChange={onChange}
            />
          </BlocksPagition>
        </BlockListPanel>
      </Content>
      <Footer />
    </Page>
  )
}
