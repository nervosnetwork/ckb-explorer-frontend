import React, { useEffect, Fragment, useMemo } from 'react'
import { useHistory, useLocation, Link } from 'react-router-dom'
import queryString from 'query-string'
import { useTranslation } from 'react-i18next'
import { parseSimpleDate } from '../../utils/date'
import { BlockListPanel, ContentTable, HighLightValue, BlockRewardContainer, BlockRewardPanel } from './styled'
import Content from '../../components/Content'
import { TableTitleItem, TableContentItem, TableMinerContentItem } from '../../components/Table'
import { TableTitleRow, TableContentRow } from '../../components/Table/styled'
import { shannonToCkb } from '../../utils/util'
import { parsePageNumber, adaptMobileEllipsis } from '../../utils/string'
import { ListPageParams, DELAY_BLOCK_NUMBER } from '../../utils/const'
import { localeNumberString } from '../../utils/number'
import { isMobile } from '../../utils/screen'
import i18n from '../../utils/i18n'
import Pagination from '../../components/Pagination'
import OverviewCard, { OverviewItemData } from '../../components/Card/OverviewCard'
import { useAppState, useDispatch } from '../../contexts/providers'
import { getBlocks } from '../../service/app/block'
import DecimalCapacity from '../../components/DecimalCapacity'

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

const getTableContentDataList = (block: State.Block, index: number, page: number) => {
  const blockReward =
    index < DELAY_BLOCK_NUMBER && page === 1 ? (
      <BlockRewardContainer>
        <DecimalCapacity value={localeNumberString(shannonToCkb(block.reward))} hideUnit />
      </BlockRewardContainer>
    ) : (
      <BlockRewardPanel>
        <DecimalCapacity value={localeNumberString(shannonToCkb(block.reward))} hideUnit />
      </BlockRewardPanel>
    )

  return [
    {
      width: '14%',
      to: `/block/${block.number}`,
      content: localeNumberString(block.number),
    },
    {
      width: '8%',
      content: `${block.transactionsCount}`,
    },
    {
      width: '20%',
      content: blockReward,
    },
    {
      width: '43%',
      content: block.minerHash,
    },
    {
      width: '15%',
      content: parseSimpleDate(block.timestamp),
    },
  ] as TableContentData[]
}

const BlockCardItems = (block: State.Block, index: number, page: number) => {
  const blockReward =
    index < DELAY_BLOCK_NUMBER && page === 1 ? (
      <BlockRewardContainer>
        <DecimalCapacity value={localeNumberString(shannonToCkb(block.reward))} hideUnit />
      </BlockRewardContainer>
    ) : (
      <BlockRewardPanel>
        <DecimalCapacity value={localeNumberString(shannonToCkb(block.reward))} hideUnit />
      </BlockRewardPanel>
    )
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

export default () => {
  const dispatch = useDispatch()
  const { replace, push } = useHistory()
  const { search } = useLocation()

  const [t] = useTranslation()
  const TableTitles = useMemo(() => {
    return [
      {
        title: t('home.height'),
        width: '14%',
      },
      {
        title: t('home.transactions'),
        width: '8%',
      },
      {
        title: t('home.block_reward'),
        width: '20%',
      },
      {
        title: t('block.miner'),
        width: '43%',
      },
      {
        title: t('home.time'),
        width: '15%',
      },
    ]
  }, [t])

  const parsed = queryString.parse(search)
  const {
    blockListState: { blocks = [], total },
  } = useAppState()

  const currentPage = parsePageNumber(parsed.page, ListPageParams.PageNo)
  const pageSize = parsePageNumber(parsed.size, ListPageParams.PageSize)
  const totalPages = Math.ceil(total / pageSize)

  useEffect(() => {
    if (pageSize > ListPageParams.MaxPageSize) {
      replace(`/block/list?page=${currentPage}&size=${ListPageParams.MaxPageSize}`)
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
            <div>
              {blocks.map((block: State.Block, index: number) => {
                return <OverviewCard key={block.number} items={BlockCardItems(block, index, currentPage)} />
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
                  <TableContentRow key={block.number}>
                    {getTableContentDataList(block, blockIndex, currentPage).map(
                      (data: TableContentData, index: number) => {
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
                      },
                    )}
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
