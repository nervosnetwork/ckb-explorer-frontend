import React, { useReducer, useEffect } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import Pagination from 'rc-pagination'
import 'rc-pagination/assets/index.css'
import localeInfo from 'rc-pagination/lib/locale/en_US'
import queryString from 'query-string'
import { useTranslation } from 'react-i18next'
import { BlockListPanel, ContentTitle, ContentTable, BlocksPagition } from './styled'
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
import { fetchBlockList } from '../../service/http/fetcher'
import { shannonToCkb } from '../../utils/util'
import { parsePageNumber } from '../../utils/string'
import { CachedKeys } from '../../utils/const'
import { fetchCachedData, storeCachedData } from '../../utils/cached'
import { localeNumberString } from '../../utils/number'
import { isMobile } from '../../utils/screen'

enum PageParams {
  PageNo = 1,
  PageSize = 25,
  MaxPageSize = 100,
}

const Actions = {
  blocks: 'BLOCKS',
  total: 'TOTAL',
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
    default:
      return state
  }
}

const getBlocks = (page: number, size: number, dispatch: any) => {
  fetchBlockList(page, size).then(response => {
    const { data, meta } = response as Response.Response<Response.Wrapper<State.Block>[]>
    if (meta) {
      dispatch({
        type: Actions.total,
        payload: {
          total: meta.total,
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
      storeCachedData(CachedKeys.BlockList, data)
    }
  })
}

const initialState = {
  blocks: [] as Response.Wrapper<State.Block>[],
  total: 1,
}

export default (props: React.PropsWithoutRef<RouteComponentProps>) => {
  const { location, history } = props
  const { search } = location
  const { replace } = history
  const parsed = queryString.parse(search)
  const [t] = useTranslation()

  const page = parsePageNumber(parsed.page, PageParams.PageNo)
  const size = parsePageNumber(parsed.size, PageParams.PageSize)

  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    const cachedBlocks = fetchCachedData<Response.Wrapper<State.Block>[]>(CachedKeys.BlockList)
    if (cachedBlocks) {
      dispatch({
        type: Actions.blocks,
        payload: {
          blocks: cachedBlocks,
        },
      })
    }
  }, [dispatch])

  useEffect(() => {
    if (size > PageParams.MaxPageSize) {
      replace(`/block/list?page=${page}&size=${PageParams.MaxPageSize}`)
    }
    getBlocks(page, size, dispatch)
  }, [replace, page, size, dispatch])

  const onChange = (pageNo: number, pageSize: number) => {
    props.history.push(`/block/list?page=${pageNo}&size=${pageSize}`)
  }

  return (
    <Content>
      <BlockListPanel className="container">
        <ContentTitle>Blocks</ContentTitle>
        {isMobile() ? (
          <ContentTable>
            <div className="block__panel">
              {state.blocks &&
                state.blocks.map((block: any, index: number) => {
                  const key = index
                  return block && <BlockCard key={key} block={block.attributes} />
                })}
            </div>
          </ContentTable>
        ) : (
          <ContentTable>
            <TableTitleRow>
              <TableTitleItem image={BlockHeightIcon} title={t('home.height')} />
              <TableTitleItem image={TransactionIcon} title={t('home.transactions')} />
              <TableTitleItem image={BlockRewardIcon} title={t('home.block_reward')} />
              <TableTitleItem image={MinerIcon} title={t('block.miner')} />
              <TableTitleItem image={TimestampIcon} title={t('home.time')} />
            </TableTitleRow>
            {state.blocks &&
              state.blocks.map((data: Response.Wrapper<State.Block>) => {
                return (
                  data && (
                    <TableContentRow key={data.attributes.block_hash}>
                      <TableContentItem
                        content={localeNumberString(data.attributes.number)}
                        to={`/block/${data.attributes.number}`}
                      />
                      <TableContentItem content={`${data.attributes.transactions_count}`} />
                      <TableContentItem content={`${localeNumberString(shannonToCkb(data.attributes.reward))}`} />
                      <TableMinerContentItem content={data.attributes.miner_hash} />
                      <TableContentItem content={parseSimpleDate(data.attributes.timestamp)} />
                    </TableContentRow>
                  )
                )
              })}
          </ContentTable>
        )}
        <BlocksPagition>
          <Pagination
            showQuickJumper
            showSizeChanger
            defaultPageSize={size}
            pageSize={size}
            defaultCurrent={page}
            current={page}
            total={state.total}
            onChange={onChange}
            locale={localeInfo}
          />
        </BlocksPagition>
      </BlockListPanel>
    </Content>
  )
}
