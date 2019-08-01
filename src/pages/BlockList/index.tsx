import React, { useEffect, useContext } from 'react'
import { RouteComponentProps, Link } from 'react-router-dom'
import queryString from 'query-string'
import { parseSimpleDate } from '../../utils/date'
import { BlockListPanel, ContentTable, HighLightValue } from './styled'
import Content from '../../components/Content'
import {
  TableTitleRow,
  TableTitleItem,
  TableContentRow,
  TableContentItem,
  TableMinerContentItem,
} from '../../components/Table'
import { shannonToCkb } from '../../utils/util'
import { parsePageNumber, startEndEllipsis } from '../../utils/string'
import { CachedKeys, BlockListPageParams } from '../../utils/const'
import { fetchCachedData } from '../../utils/cached'
import { localeNumberString } from '../../utils/number'
import { isMobile } from '../../utils/screen'
import { StateWithDispatch, PageActions } from '../../contexts/providers/reducer'
import i18n from '../../utils/i18n'
import Pagination from '../../components/Pagination'
import OverviewCard, { OverviewItemData } from '../../components/Card/OverviewCard'
import { AppContext } from '../../contexts/providers'
import { getBlocks } from '../../service/app/block'

const BlockValueItem = ({ value, to }: { value: string; to: string }) => {
  return (
    <HighLightValue>
      <Link to={to}>
        <code>{value}</code>
      </Link>
    </HighLightValue>
  )
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
  return [
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
  ] as TableContentData[]
}

const BlockCardItems = (block: State.Block) => {
  return [
    {
      title: i18n.t('home.height'),
      content: <BlockValueItem value={localeNumberString(block.number)} to={`/block/${block.number}`} />,
    },
    {
      title: i18n.t('home.transactions'),
      content: localeNumberString(block.transactions_count),
    },
    {
      title: i18n.t('home.block_reward'),
      content: localeNumberString(shannonToCkb(block.reward)),
    },
    {
      title: i18n.t('block.miner'),
      content: <BlockValueItem value={startEndEllipsis(block.miner_hash, 13)} to={`/address/${block.miner_hash}`} />,
    },
    {
      title: i18n.t('home.time'),
      content: parseSimpleDate(block.timestamp),
    },
  ] as OverviewItemData[]
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
                blockListState.blocks.map((block: any) => {
                  return <OverviewCard key={block.attributes.number} items={BlockCardItems(block.attributes)} />
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
                    <TableContentRow key={data.attributes.number}>
                      {getTableContentDatas(data).map((tableContentData: TableContentData, index: number) => {
                        const key = index
                        if (tableContentData.content === data.attributes.miner_hash) {
                          return (
                            <TableMinerContentItem
                              width={tableContentData.width}
                              content={tableContentData.content}
                              key={key}
                            />
                          )
                        }
                        return (
                          <TableContentItem
                            width={tableContentData.width}
                            content={tableContentData.content}
                            to={tableContentData.to}
                            key={key}
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
