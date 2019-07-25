import React, { useEffect, useContext } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import Pagination from 'rc-pagination'
import 'rc-pagination/assets/index.css'
import localeInfo from 'rc-pagination/lib/locale/en_US'
import queryString from 'query-string'
import { BlockListPanel, ContentTitle, ContentTable, BlocksPagition } from './styled'
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
import { parseSimpleDate } from '../../utils/date'
import i18n from '../../utils/i18n'
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

  const page = parsePageNumber(parsed.page, BlockListPageParams.PageNo)
  const size = parsePageNumber(parsed.size, BlockListPageParams.PageSize)

  const { blockListState } = useContext(AppContext)

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
    if (size > BlockListPageParams.MaxPageSize) {
      replace(`/block/list?page=${page}&size=${BlockListPageParams.MaxPageSize}`)
    }
    getBlocks(page, size, dispatch)
  }, [replace, page, size, dispatch])

  const onChange = (pageNo: number, pageSize: number) => {
    push(`/block/list?page=${pageNo}&size=${pageSize}`)
  }

  return (
    <Content>
      <BlockListPanel className="container">
        <ContentTitle>Blocks</ContentTitle>
        {isMobile() ? (
          <ContentTable>
            <div className="block__panel">
              {blockListState.blocks &&
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
            {blockListState.blocks &&
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
        <BlocksPagition>
          <Pagination
            showQuickJumper
            showSizeChanger
            defaultPageSize={size}
            pageSize={size}
            defaultCurrent={page}
            current={page}
            total={blockListState.total}
            onChange={onChange}
            locale={localeInfo}
          />
        </BlocksPagition>
      </BlockListPanel>
    </Content>
  )
}
