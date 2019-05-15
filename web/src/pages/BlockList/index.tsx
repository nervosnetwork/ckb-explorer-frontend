import React, { useState, useContext, useEffect } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import Pagination from 'rc-pagination'
import 'rc-pagination/assets/index.css'
import localeInfo from 'rc-pagination/lib/locale/en_US'
import queryString from 'query-string'
import AppContext from '../../contexts/App'
import { BlockListPanel, ContentTitle, ContentTable, BlocksPagition } from './styled'
import { parseDate } from '../../utils/date'
import Content from '../../components/Content'
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
import { validNumber } from '../../utils/util'

enum PageParams {
  PageNo = 1,
  PageSize = 20,
}

export default (props: React.PropsWithoutRef<RouteComponentProps>) => {
  const { location } = props
  const { search } = location
  const parsed = queryString.parse(search)
  const { page, size } = parsed

  const appContext = useContext(AppContext)

  const initBlockWrappers: BlockWrapper[] = []
  const [blockWrappers, setBlockWrappers] = useState(initBlockWrappers)
  const [totalBlocks, setTotalBlocks] = useState(1)
  const [pageNo, setPageNo] = useState(validNumber(page, PageParams.PageNo))
  const [pageSize, setPageSize] = useState(validNumber(size, PageParams.PageSize))

  const getBlocks = (page_p: number, size_p: number) => {
    appContext.showLoading()
    fetchBlockList(page_p, size_p)
      .then(response => {
        const { data, meta } = response as Response<BlockWrapper[]>
        if (meta) {
          const { total } = meta
          setTotalBlocks(total)
        }
        setBlockWrappers(() => data)
        appContext.hideLoading()
      })
      .catch(() => {
        appContext.hideLoading()
      })
  }

  useEffect(() => {
    const page_p = validNumber(page, PageParams.PageNo)
    const size_p = validNumber(size, PageParams.PageSize)
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
    <Content>
      <BlockListPanel width={window.innerWidth} className="container">
        <ContentTitle>Blocks</ContentTitle>

        <ContentTable>
          <TableTitleRow>
            <TableTitleItem image={BlockHeightIcon} title="Height" />
            <TableTitleItem image={TransactionIcon} title="Transactions" />
            <TableTitleItem image={CellConsumedIcon} title="Cell Consumed(Byte)" />
            <TableTitleItem image={MinerIcon} title="Miner" />
            <TableTitleItem image={TimestampIcon} title="Time" />
          </TableTitleRow>
          {blockWrappers && blockWrappers.map((data: any) => {
            return (
              <TableContentRow key={data.attributes.block_hash}>
                <TableContentItem content={data.attributes.number} to={`/block/${data.attributes.number}`} />
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
            pageSize={pageSize}
            defaultCurrent={pageNo}
            current={pageNo}
            total={totalBlocks}
            onChange={onChange}
            locale={localeInfo}
          />
        </BlocksPagition>
      </BlockListPanel>
    </Content>
  )
}
