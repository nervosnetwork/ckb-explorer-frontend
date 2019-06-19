import React, { useReducer, useEffect } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import Pagination from 'rc-pagination'
import 'rc-pagination/assets/index.css'
import localeInfo from 'rc-pagination/lib/locale/en_US'
import queryString from 'query-string'
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
import { shannonToCkb } from '../../utils/util'
import { validNumber } from '../../utils/string'

enum PageParams {
  PageNo = 1,
  PageSize = 25,
  MaxPageSize = 100,
}

const Actions = {
  blocks: 'BLOCKS',
  total: 'TOTAL',
  page: 'PAGE_NO',
  size: 'PAGE_SIZE',
}

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case Actions.blocks:
      return {
        ...state,
        blocks: action.payload.blocks,
      }
    case Actions.total:
      return {
        ...state,
        total: action.payload.total,
      }
    case Actions.page:
      return {
        ...state,
        page: action.payload.page,
      }
    case Actions.size:
      return {
        ...state,
        size: action.payload.size,
      }
    default:
      return state
  }
}

const getBlocks = (page: number, size: number, dispatch: any) => {
  fetchBlockList(page, size).then(response => {
    const { data, meta } = response as Response<BlockWrapper[]>
    if (meta) {
      dispatch({
        type: Actions.total,
        payload: {
          total: meta.total,
        },
      })
      dispatch({
        type: Actions.size,
        payload: {
          size: meta.page_size,
        },
      })
    }
    if (data) {
      dispatch({
        type: Actions.blocks,
        payload: {
          blocks: data,
        },
      })
    }
  })
}

export default (props: React.PropsWithoutRef<RouteComponentProps>) => {
  const { location } = props
  const { search } = location
  const parsed = queryString.parse(search)

  const initialState = {
    blocks: [] as BlockWrapper[],
    total: 1,
    page: validNumber(parsed.page, PageParams.PageNo),
    size: validNumber(parsed.size, PageParams.PageSize),
  }
  const [state, dispatch] = useReducer(reducer, initialState)
  const { page, size } = state
  const { history } = props
  const { replace } = history

  useEffect(() => {
    if (size > PageParams.MaxPageSize) {
      replace(`/block/list?page=${page}&size=${PageParams.MaxPageSize}`)
    }
    getBlocks(page, size, dispatch)
  }, [replace, page, size, dispatch])

  const onChange = (pageNo: number, pageSize: number) => {
    dispatch({
      type: Actions.page,
      payload: {
        page: pageNo,
      },
    })
    dispatch({
      type: Actions.size,
      payload: {
        size: pageSize,
      },
    })
    props.history.push(`/block/list?page=${pageNo}&size=${pageSize}`)
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
            {state.blocks &&
              state.blocks.map((data: any) => {
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
              {state.blocks &&
                state.blocks.map((block: any, index: number) => {
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
            defaultPageSize={state.size}
            pageSize={state.size}
            defaultCurrent={state.page}
            current={state.page}
            total={state.total}
            onChange={onChange}
            locale={localeInfo}
          />
        </BlocksPagition>
      </BlockListPanel>
    </Content>
  )
}
