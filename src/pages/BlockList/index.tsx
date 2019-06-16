import React, { useState, useContext, useEffect } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import Pagination from 'rc-pagination'
import 'rc-pagination/assets/index.css'
import localeInfo from 'rc-pagination/lib/locale/en_US'
import queryString from 'query-string'
import AppContext from '../../contexts/App'
import { BlockListPanel, ContentTitle, ContentTable, BlocksPagition, BlockListPC, BlockListMobile } from './styled'
import { parseSimpleDate } from '../../utils/date'
import Content from '../../components/Content'
import {
  TableTitleRow,
  TableTitleItem,
  TableContentRow,
  TableContentItem,
  TableMinerContentItem,
} from '../../components/Table'
import BlockCard from '../../components/Card/BlockCard'
import BlockHeightIcon from '../../assets/block_height.png'
import TransactionIcon from '../../assets/transactions.png'
import BlockRewardIcon from '../../assets/block_reward_white.png'
import MinerIcon from '../../assets/miner.png'
import TimestampIcon from '../../assets/timestamp.png'
import { fetchBlockList } from '../../http/fetcher'
import { BlockWrapper } from '../../http/response/Block'
import { Response } from '../../http/response/Response'
import { validNumber } from '../../utils/string'
import { shannonToCkb } from '../../utils/util'

enum PageParams {
  PageNo = 1,
  PageSize = 25,
  MaxPageSize = 100,
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

  if (pageSize > PageParams.MaxPageSize) {
    setPageSize(PageParams.MaxPageSize)
    props.history.replace(`/block/list?page=${pageNo}&size=${PageParams.MaxPageSize}`)
  }

  const getBlocks = (page_p: number, size_p: number) => {
    fetchBlockList(page_p, size_p)
      .then(response => {
        const { data, meta } = response as Response<BlockWrapper[]>
        if (meta) {
          const { total, page_size } = meta
          setTotalBlocks(total)
          setPageSize(page_size)
        }
        setBlockWrappers(() => data)
      })
      .catch(() => {
        appContext.toastMessage('Network exception, please try again later', 3000)
      })
  }

  useEffect(() => {
    const page_p = validNumber(page, PageParams.PageNo)
    const size_p = validNumber(size, PageParams.PageSize)
    setPageNo(page_p)
    setPageSize(size_p)
    getBlocks(page_p, size_p)
  }, [search, window.location.href])

  const onChange = (page_p: number, size_p: number) => {
    setPageNo(page_p)
    setPageSize(size_p)
    props.history.push(`/block/list?page=${page_p}&size=${size_p}`)
  }

  return (
    <Content>
      <BlockListPanel className="container">
        <ContentTitle>Blocks</ContentTitle>
        <BlockListPC>
          <ContentTable>
            <TableTitleRow>
              <TableTitleItem image={BlockHeightIcon} title="Height" />
              <TableTitleItem image={TransactionIcon} title="Transactions" />
              <TableTitleItem image={BlockRewardIcon} title="Block Reward (CKB)" />
              <TableTitleItem image={MinerIcon} title="Miner" />
              <TableTitleItem image={TimestampIcon} title="Time" />
            </TableTitleRow>
            {blockWrappers &&
              blockWrappers.map((data: any) => {
                return (
                  data && (
                    <TableContentRow key={data.attributes.block_hash}>
                      <TableContentItem content={data.attributes.number} to={`/block/${data.attributes.number}`} />
                      <TableContentItem content={data.attributes.transactions_count} />
                      <TableContentItem content={`${shannonToCkb(data.attributes.reward)}`} />
                      <TableMinerContentItem content={data.attributes.miner_hash} />
                      <TableContentItem content={parseSimpleDate(data.attributes.timestamp)} />
                    </TableContentRow>
                  )
                )
              })}
          </ContentTable>
        </BlockListPC>
        <BlockListMobile>
          <ContentTable>
            <div className="block__panel">
              {blockWrappers &&
                blockWrappers.map((block: any, index: number) => {
                  const key = index
                  return block && <BlockCard key={key} block={block.attributes} />
                })}
            </div>
          </ContentTable>
        </BlockListMobile>
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
