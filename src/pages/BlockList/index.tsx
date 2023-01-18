import { Fragment, useMemo, FC } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { parseSimpleDate } from '../../utils/date'
import { BlockListPanel, ContentTable, HighLightValue, BlockRewardContainer, BlockRewardPanel } from './styled'
import Content from '../../components/Content'
import { TableTitleItem, TableContentItem, TableMinerContentItem } from '../../components/Table'
import { TableTitleRow, TableContentRow } from '../../components/Table/styled'
import { deprecatedAddrToNewAddr, shannonToCkb } from '../../utils/util'
import { DELAY_BLOCK_NUMBER } from '../../constants/common'
import { localeNumberString } from '../../utils/number'
import i18n from '../../utils/i18n'
import Pagination from '../../components/Pagination'
import DecimalCapacity from '../../components/DecimalCapacity'
import { ItemCardData, ItemCardGroup } from '../../components/Card/ItemCard'
import AddressText from '../../components/AddressText'
import { useIsMobile, usePaginationParamsInListPage } from '../../utils/hook'
import { fetchBlocks } from '../../service/http/fetcher'
import { RouteState } from '../../routes/state'

const BlockValueItem = ({ value, to }: { value: string; to: string }) => (
  <HighLightValue>
    <Link to={to}>
      <span>{value}</span>
    </Link>
  </HighLightValue>
)

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

const BlockCardGroup: FC<{ blocks: State.Block[]; isFirstPage: boolean }> = ({ blocks, isFirstPage }) => {
  const items: ItemCardData<State.Block>[] = [
    {
      title: i18n.t('home.height'),
      render: block => <BlockValueItem value={localeNumberString(block.number)} to={`/block/${block.number}`} />,
    },
    {
      title: i18n.t('home.transactions'),
      render: block => localeNumberString(block.transactionsCount),
    },
    {
      title: i18n.t('home.block_reward'),
      render: (block, index) =>
        index < DELAY_BLOCK_NUMBER && isFirstPage ? (
          <BlockRewardContainer>
            <DecimalCapacity value={localeNumberString(shannonToCkb(block.reward))} hideUnit />
          </BlockRewardContainer>
        ) : (
          <BlockRewardPanel>
            <DecimalCapacity value={localeNumberString(shannonToCkb(block.reward))} hideUnit />
          </BlockRewardPanel>
        ),
    },
    {
      title: i18n.t('block.miner'),
      render: block => (
        <HighLightValue>
          <AddressText
            disableTooltip
            monospace={false}
            linkProps={{
              to: `/address/${block.minerHash}`,
            }}
          >
            {block.minerHash}
          </AddressText>
        </HighLightValue>
      ),
    },
    {
      title: i18n.t('home.time'),
      render: block => parseSimpleDate(block.timestamp),
    },
  ]

  return <ItemCardGroup items={items} dataSource={blocks} getDataKey={block => block.number} />
}

export default () => {
  const isMobile = useIsMobile()

  const [t] = useTranslation()
  const TableTitles = useMemo(
    () => [
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
    ],
    [t],
  )

  const { currentPage, pageSize, setPage } = usePaginationParamsInListPage()
  const { state } = useLocation<RouteState>()
  const stateStaleTime = 3000

  const query = useQuery(
    ['blocks', currentPage, pageSize],
    async () => {
      const { data, meta } = await fetchBlocks(currentPage, pageSize)
      return {
        blocks: data.map(wrapper => wrapper.attributes),
        total: meta?.total ?? 0,
      }
    },
    {
      initialData:
        state?.type === 'BlockListPage' && state.createTime + stateStaleTime > Date.now()
          ? state.blocksDataWithFirstPage
          : undefined,
    },
  )
  const blocks = query.data?.blocks ?? []
  const total = query.data?.total ?? 0
  const totalPages = Math.ceil(total / pageSize)

  const blockList = blocks.map(b => ({
    ...b,
    minerHash: deprecatedAddrToNewAddr(b.minerHash),
  }))

  return (
    <Content>
      <BlockListPanel className="container">
        <div className="block__green__background" />
        {isMobile ? (
          <ContentTable>
            <BlockCardGroup blocks={blockList} isFirstPage={currentPage === 1} />
          </ContentTable>
        ) : (
          <ContentTable>
            <TableTitleRow>
              {TableTitles.map((data: TableTitleData) => (
                <TableTitleItem width={data.width} title={data.title} key={data.title} />
              ))}
            </TableTitleRow>
            {blockList.map(
              (block: State.Block, blockIndex: number) =>
                block && (
                  <TableContentRow key={block.number}>
                    {getTableContentDataList(block, blockIndex, currentPage).map(
                      (data: TableContentData, index: number) => {
                        const key = index
                        return (
                          <Fragment key={key}>
                            {data.content === block.minerHash ? (
                              <TableMinerContentItem width={data.width} content={data.content} textCenter />
                            ) : (
                              <TableContentItem width={data.width} content={data.content} to={data.to} />
                            )}
                          </Fragment>
                        )
                      },
                    )}
                  </TableContentRow>
                ),
            )}
          </ContentTable>
        )}
        <div className="block_list__pagination">
          <Pagination currentPage={currentPage} totalPages={totalPages} onChange={setPage} />
        </div>
      </BlockListPanel>
    </Content>
  )
}
