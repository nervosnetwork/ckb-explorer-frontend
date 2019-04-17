import React, { useState, useEffect } from 'react'
import Pagination from 'rc-pagination'
import 'rc-pagination/assets/index.css'
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
import { fetchBlocksList } from '../../http/fetcher'
import { BlockWrapper } from '../../http/response/Block'
import { Response } from '../../http/response/Response'

export default () => {
  const initBlockWrappers: BlockWrapper[] = []
  const [blockWrappers, setBlockWrappers] = useState(initBlockWrappers)
  const [totalBlocks, setTotalBlocks] = useState(1)
  const [pageSize, setPageSize] = useState(3)
  const [pageNo, setPageNo] = useState(1)

  const getBlocks = (page: number, size: number) => {
    fetchBlocksList().then(response => {
      const { data, meta } = response as Response<BlockWrapper[]>
      if (meta) {
        const { total } = meta
        setTotalBlocks(total)
      }
      const blocks = data.slice((page - 1) * size, page * size)
      setBlockWrappers(blocks)
    })
  }

  useEffect(() => {
    getBlocks(pageNo, pageSize)
  }, [])

  const onChange = (page: number, size: number) => {
    setPageSize(size)
    setPageNo(page)
    getBlocks(page, size)
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
