import React, { useEffect, useContext } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import queryString from 'query-string'
import { parseSimpleDate } from '../../utils/date'
import { BlockListPanel, ContentTable } from './styled'
import Content from '../../components/Content'
import {
  TableTitleRow,
  TableTitleItem,
  TableContentRow,
  TableContentItem,
  TableMinerContentItem,
} from '../../components/Table'
import BlockCard from '../../components/Card/BlockCard'
import { shannonToCkb } from '../../utils/util'
import { parsePageNumber } from '../../utils/string'
import { CachedKeys, BlockListPageParams } from '../../utils/const'
import { fetchCachedData } from '../../utils/cached'
import { localeNumberString } from '../../utils/number'
import { isMobile } from '../../utils/screen'
import { StateWithDispatch, PageActions } from '../../contexts/providers/reducer'
import i18n from '../../utils/i18n'
import Pagination from '../../components/Pagination'

import { AppContext } from '../../contexts/providers'
import { getBlocks } from '../../service/app/block'

interface TableTitleData {
  title: string
  width: string
}

interface TableContentData {
  width: string
  to?: any
  content: string
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

export default ({
  dispatch,
  history: { replace, push },
  location: { search },
}: React.PropsWithoutRef<StateWithDispatch & RouteComponentProps>) => {
  const parsed = queryString.parse(search)
  const { blockListState } = useContext(AppContext)

  const currentPage = parsePageNumber(parsed.page, BlockListPageParams.PageNo)
  const pageSize = parsePageNumber(parsed.size, BlockListPageParams.PageSize)
  const totalPages = Math.ceil(blockListState.total / pageSize)

  useEffect(() => {
    const cachedBlocks = fetchCachedData<Response.Wrapper<State.Block>[]>(CachedKeys.BlockList)
    if (cachedBlocks) {
      dispatch({
        type: PageActions.UpdateBlockList,
        payload: {
          blocks: cachedBlocks,
        },
      })
    }
  }, [dispatch])

  useEffect(() => {
    if (pageSize > BlockListPageParams.MaxPageSize) {
      replace(`/block/list?page=${currentPage}&size=${BlockListPageParams.MaxPageSize}`)
    }
    getBlocks(currentPage, pageSize, dispatch)
  }, [replace, currentPage, pageSize, dispatch])

  const onChange = (page: number) => {
    push(`/block/list?page=${page}&size=${pageSize}`)
  }

  return (
    <Content>
      <BlockListPanel className="container">
        <div className="block__green__background" />
        {isMobile() ? (
          <ContentTable>
            <div className="block__panel">
              {blockListState &&
                blockListState.blocks &&
                blockListState.blocks.map((block: any, index: number) => {
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
            {blockListState &&
              blockListState.blocks &&
              blockListState.blocks.map((data: Response.Wrapper<State.Block>) => {
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
        <Pagination currentPage={currentPage} totalPages={totalPages} onChange={onChange} />
      </BlockListPanel>
    </Content>
  )
}
