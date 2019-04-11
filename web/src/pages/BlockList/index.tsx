import React, { useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
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
import BlocksData from './mock'

export default (props: React.PropsWithoutRef<RouteComponentProps<{ pageNo: string; pageSize: string }>>) => {
  const { match } = props
  const { params } = match
  const { pageNo, pageSize } = params

  const [currentPageNo, setCurrentPageNo] = useState(pageNo === undefined ? 1 : parseInt(pageNo, 10))
  const [currentPageSize, setCurrentPageSize] = useState(pageSize === undefined ? 3 : parseInt(pageSize, 10))

  // TODO: fetch transaction data from server
  const getBlocks = (page: number, size: number) => {
    return BlocksData.data.slice((page - 1) * size, page * size)
  }

  const onChange = (page: number, size: number) => {
    setCurrentPageNo(page)
    setCurrentPageSize(size)
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
              {getBlocks(currentPageNo, currentPageSize).map((data: any) => {
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
              defaultPageSize={currentPageSize}
              defaultCurrent={currentPageNo}
              total={BlocksData.data.length}
              onChange={onChange}
            />
          </BlocksPagition>
        </BlockListPanel>
      </Content>
      <Footer />
    </Page>
  )
}
