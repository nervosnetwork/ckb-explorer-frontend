import React, { useReducer, useEffect } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import 'rc-pagination/assets/index.css'
import queryString from 'query-string'
import { BlockListPanel, ContentTitle, ContentTable } from './styled'
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
import { fetchBlockList } from '../../service/http/fetcher'
import { shannonToCkb } from '../../utils/util'
import { parsePageNumber } from '../../utils/string'
import { CachedKeys } from '../../utils/const'
import { fetchCachedData, storeCachedData } from '../../utils/cached'
import { localeNumberString } from '../../utils/number'
import { isMobile } from '../../utils/screen'
import i18n from '../../utils/i18n'
import DividePage from '../../components/Pagination'

enum PageParams {
  PageNo = 1,
  PageSize = 25,
  MaxPageSize = 100,
}

const Actions = {
  blocks: 'BLOCKS',
  total: 'TOTAL',
}

interface TableTitleData {
  title: string
  width: string
}

interface TableContentData {
  width: string
  to?: any
  content: string
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

const TableTitleDatas: TableTitleData[] = [
  {
    title: i18n.t('home.height'),
    width: '14%',
  },
  {
    title: i18n.t('home.transactions'),
    width: '14%',
  },
  {
    title: i18n.t('home.block_reward'),
    width: '20%',
  },
  {
    title: i18n.t('block.miner'),
    width: '37%',
  },
  {
    title: i18n.t('home.time'),
    width: '15%',
  },
]

const getTableContentDatas = (data: Response.Wrapper<State.Block>) => {
  const tableContentDatas: TableContentData[] = [
    {
      width: '14%',
      to: `/block/${data.attributes.number}`,
      content: localeNumberString(data.attributes.number),
    },
    {
      width: '14%',
      content: `${data.attributes.transactions_count}`,
    },
    {
      width: '20%',
      content: localeNumberString(shannonToCkb(data.attributes.reward)),
    },
    {
      width: '37%',
      content: data.attributes.miner_hash,
    },
    {
      width: '15%',
      content: parseSimpleDate(data.attributes.timestamp),
    },
  ]
  return tableContentDatas
}

export default (props: React.PropsWithoutRef<RouteComponentProps>) => {
  const { location, history } = props
  const { search } = location
  const { replace } = history
  const parsed = queryString.parse(search)

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
              {TableTitleDatas.map((data: TableTitleData) => {
                return <TableTitleItem width={data.width} title={data.title} />
              })}
            </TableTitleRow>
            {state.blocks &&
              state.blocks.map((data: Response.Wrapper<State.Block>) => {
                return (
                  data && (
                    <TableContentRow key={data.attributes.block_hash}>
                      {getTableContentDatas(data).map((tableContentData: TableContentData) => {
                        if (tableContentData.content === data.attributes.miner_hash) {
                          return (
                            <TableMinerContentItem width={tableContentData.width} content={tableContentData.content} />
                          )
                        }
                        return (
                          <TableContentItem
                            width={tableContentData.width}
                            content={tableContentData.content}
                            to={tableContentData.to}
                          />
                        )
                      })}
                    </TableContentRow>
                  )
                )
              })}
          </ContentTable>
        )}
        <DividePage currentPage={page} total={size} onChange={onChange} />
      </BlockListPanel>
    </Content>
  )
}
