import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Pagination from 'rc-pagination'
import 'rc-pagination/assets/index.css'
import {
  BlockListPanel,
  ContentTitle,
  ContentTable,
  TableTitleRow,
  TableContentRow,
  TableMinerContentPanel,
  BlocksPagition,
} from './index.css'
import { parseDate } from '../../utils/date'
import Page from '../../components/Page'
import Header from '../../components/Header'
import Content from '../../components/Content'
import Footer from '../../components/Footer'
import BlockHeightIcon from '../../asserts/block_height.png'
import TransactionIcon from '../../asserts/transactions.png'
import CellConsumedIcon from '../../asserts/cell_consumed.png'
import MinerIcon from '../../asserts/miner.png'
import TimestampIcon from '../../asserts/timestamp.png'
import BlocksData from './mock'

const TableTitleItem = ({ image, title }: { image: string; title: string }) => {
  return (
    <div>
      <div>
        <img src={image} alt={title} />
        <div>{title}</div>
      </div>
    </div>
  )
}

const TableContentItem = ({ color, content }: { color: string; content: string }) => {
  return (
    <td
      style={{
        color,
        height: 78,
      }}
    >
      {content}
    </td>
  )
}

const TableMinerContentItem = ({ color, content }: { color: string; content: string }) => {
  return (
    <TableMinerContentPanel color={color}>
      <Link className="table__miner__content" to={`/address/${content}`}>
        {content}
      </Link>
    </TableMinerContentPanel>
  )
}

export default () => {
  const [clickableColor, normalColor] = ['#4bbc8e', '888888']

  const PageSize = 10
  const [currentPageNo, setCurrentPageNo] = useState(1)

  // TODO: fetch transaction data from server
  const getBlocks = (pageNo: number, pageSize: number) => {
    return BlocksData.data.slice((pageNo - 1) * pageSize, pageNo * pageSize)
  }

  const onChange = (current: number, pageSize: number) => {
    setCurrentPageNo(current)
    getBlocks(current, pageSize)
  }

  return (
    <Page>
      <Header />
      <Content>
        <BlockListPanel width={window.innerWidth}>
          <ContentTitle>Blocks</ContentTitle>

          <ContentTable>
            <table>
              <tbody>
                <TableTitleRow>
                  <TableTitleItem image={BlockHeightIcon} title="Height" />
                  <TableTitleItem image={TransactionIcon} title="Transactions" />
                  <TableTitleItem image={CellConsumedIcon} title="Cell Consumed(B)" />
                  <TableTitleItem image={MinerIcon} title="Miner" />
                  <TableTitleItem image={TimestampIcon} title="Time" />
                </TableTitleRow>
                {getBlocks(currentPageNo, PageSize).map((data: any) => {
                  return (
                    <TableContentRow key={data.block_hash}>
                      <TableContentItem color={clickableColor} content={data.number} />
                      <TableContentItem color={normalColor} content={data.transactions_count} />
                      <TableContentItem color={normalColor} content={data.cell_consumed} />
                      <TableMinerContentItem color={clickableColor} content={data.miner_hash} />
                      <TableContentItem color={normalColor} content={parseDate(data.timestamp)} />
                    </TableContentRow>
                  )
                })}
              </tbody>
            </table>
          </ContentTable>
          <BlocksPagition>
            <Pagination
              showQuickJumper
              showSizeChanger
              defaultPageSize={PageSize}
              defaultCurrent={1}
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
