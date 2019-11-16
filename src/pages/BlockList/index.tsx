import React, { useEffect, useContext, Fragment, useMemo } from 'react'
import { RouteComponentProps, Link } from 'react-router-dom'
import queryString from 'query-string'
import { useTranslation } from 'react-i18next'
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
import { parsePageNumber, adaptMobileEllipsis } from '../../utils/string'
import { BlockListPageParams, DELAY_BLOCK_NUMBER } from '../../utils/const'
import { localeNumberString } from '../../utils/number'
import { isMobile } from '../../utils/screen'
import { StateWithDispatch } from '../../contexts/providers/reducer'
import i18n from '../../utils/i18n'
import Pagination from '../../components/Pagination'
import OverviewCard, { OverviewItemData } from '../../components/Card/OverviewCard'
import { AppContext } from '../../contexts/providers'
import { getBlocks } from '../../service/app/block'

const BlockValueItem = ({ value, to }: { value: string; to: string }) => {
  return (
    <HighLightValue>
      <Link to={to}>
        <span>{value}</span>
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

const getTableContentDataList = (block: State.Block, index: number) => {
  const blockReward = `${localeNumberString(shannonToCkb(block.reward))}${index <= DELAY_BLOCK_NUMBER ? ' +' : ''}`
  return [
    {
      width: '14%',
      to: `/block/${block.number}`,
      content: localeNumberString(block.number),
    },
    {
      width: '14%',
      content: `${block.transactionsCount}`,
    },
    {
      width: '20%',
      content: blockReward,
    },
    {
      width: '37%',
      content: block.minerHash,
    },
    {
      width: '15%',
      content: parseSimpleDate(block.timestamp),
    },
  ] as TableContentData[]
}

const BlockCardItems = (block: State.Block, index: number) => {
  const blockReward = `${localeNumberString(shannonToCkb(block.reward))}${index <= DELAY_BLOCK_NUMBER ? ' +' : ''}`
  return [
    {
      title: i18n.t('home.height'),
      content: <BlockValueItem value={localeNumberString(block.number)} to={`/block/${block.number}`} />,
    },
    {
      title: i18n.t('home.transactions'),
      content: localeNumberString(block.transactionsCount),
    },
    {
      title: i18n.t('home.block_reward'),
      content: blockReward,
    },
    {
      title: i18n.t('block.miner'),
      content: <BlockValueItem value={adaptMobileEllipsis(block.minerHash, 12)} to={`/address/${block.minerHash}`} />,
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
  const [t] = useTranslation()
  const TableTitles = useMemo(() => {
    return [
      {
        title: t('home.height'),
        width: '14%',
      },
      {
        title: t('home.transactions'),
        width: '14%',
      },
      {
        title: t('home.block_reward'),
        width: '20%',
      },
      {
        title: t('block.miner'),
        width: '37%',
      },
      {
        title: t('home.time'),
        width: '15%',
      },
    ]
  }, [t])

  const parsed = queryString.parse(search)
  const { blockListState } = useContext(AppContext)
  const { blocks = [] } = blockListState

  const currentPage = parsePageNumber(parsed.page, BlockListPageParams.PageNo)
  const pageSize = parsePageNumber(parsed.size, BlockListPageParams.PageSize)
  const totalPages = Math.ceil(blockListState.total / pageSize)

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
              {blocks.map((block: State.Block, index: number) => {
                return <OverviewCard key={block.number} items={BlockCardItems(block, index)} />
              })}
            </div>
          </ContentTable>
        ) : (
          <ContentTable>
            <TableTitleRow>
              {TableTitles.map((data: TableTitleData) => {
                return <TableTitleItem width={data.width} title={data.title} key={data.title} />
              })}
            </TableTitleRow>
            {blocks.map((block: State.Block, blockIndex: number) => {
              return (
                block && (
                  <TableContentRow key={block.number} onClick={() => push(`/block/${block.blockHash}`)}>
                    {getTableContentDataList(block, blockIndex).map((data: TableContentData, index: number) => {
                      const key = index
                      return (
                        <Fragment key={key}>
                          {data.content === block.minerHash ? (
                            <TableMinerContentItem width={data.width} content={data.content} />
                          ) : (
                            <TableContentItem width={data.width} content={data.content} to={data.to} />
                          )}
                        </Fragment>
                      )
                    })}
                  </TableContentRow>
                )
              )
            })}
          </ContentTable>
        )}
        <div className="block_list__pagination">
          <Pagination currentPage={currentPage} totalPages={totalPages} onChange={onChange} />
        </div>
      </BlockListPanel>
    </Content>
  )
}
