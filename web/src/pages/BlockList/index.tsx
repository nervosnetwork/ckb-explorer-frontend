import React, { useState, useEffect } from 'react'
import Pagination from 'rc-pagination'
import 'rc-pagination/assets/index.css'
import { BlockListPanel, ContentTitle, ContentTable, BlocksPagition } from './index.css'
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
import Block from '../../http/response/Block'

export default () => {
  const PageSize = 5
  const currentPageNo = 1

  const initBlocks: Block[] = []
  const [blocksData, setBlocksData] = useState(initBlocks)
  const [totalBlocks, setTotalBlocks] = useState(1)

  const getBlocks = (page: number, size: number) => {
    fetchBlocksList().then(data => {
      setTotalBlocks((data as Block[]).length)
      const blocks = (data as Block[]).slice((page - 1) * size, page * size)
      setBlocksData(blocks)
    })
  }

  useEffect(() => {
    getBlocks(currentPageNo, PageSize)
  }, [])

  const onChange = (page: number, size: number) => {
    getBlocks(page, size)
  }

  return (
    <Page>
      <Header />
      <Content>
        <BlockListPanel width={window.innerWidth}>
          <ContentTitle>Blocks</ContentTitle>

          <ContentTable>
            <div>
              <TableTitleRow>
                <TableTitleItem image={BlockHeightIcon} title="Height" />
                <TableTitleItem image={TransactionIcon} title="Transactions" />
                <TableTitleItem image={CellConsumedIcon} title="Cell Consumed(B)" />
                <TableTitleItem image={MinerIcon} title="Miner" />
                <TableTitleItem image={TimestampIcon} title="Time" />
              </TableTitleRow>
              {blocksData.map((data: any) => {
                return (
                  <TableContentRow key={data.block_hash}>
                    <TableContentItem content={data.number} to={`block/${data.number}`} />
                    <TableContentItem content={data.transactions_count} />
                    <TableContentItem content={data.cell_consumed} />
                    <TableMinerContentItem content={data.miner_hash} />
                    <TableContentItem content={parseDate(data.timestamp)} />
                  </TableContentRow>
                )
              })}
            </div>
          </ContentTable>
          <BlocksPagition>
            <Pagination
              showQuickJumper
              showSizeChanger
              defaultPageSize={PageSize}
              defaultCurrent={1}
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
