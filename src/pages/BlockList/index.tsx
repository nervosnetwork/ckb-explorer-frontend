import { Fragment, useMemo, FC } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { parseSimpleDate } from '../../utils/date'
import { BlockListPanel, ContentTable, HighLightValue, BlockRewardContainer, BlockRewardPanel } from './styled'
import Content from '../../components/Content'
import { TableContentItem, TableMinerContentItem } from '../../components/Table'
import { TableTitleRow, TableContentRow, TableTitleRowItem } from '../../components/Table/styled'
import { deprecatedAddrToNewAddr, shannonToCkb } from '../../utils/util'
import { DELAY_BLOCK_NUMBER } from '../../constants/common'
import { localeNumberString } from '../../utils/number'
import i18n from '../../utils/i18n'
import DecimalCapacity from '../../components/DecimalCapacity'
import { ItemCardData, ItemCardGroup } from '../../components/Card/ItemCard'
import AddressText from '../../components/AddressText'
import { useIsMobile, useMediaQuery, usePaginationParamsInListPage, useSortParam } from '../../utils/hook'
import { fetchBlocks } from '../../service/http/fetcher'
import { RouteState } from '../../routes/state'
import { ReactComponent as SortIcon } from '../../assets/sort_icon.svg'
import { CsvExport } from '../../components/CsvExport'
import PaginationWithRear from '../../components/PaginationWithRear'
import styles from './styles.module.scss'

const BlockValueItem = ({ value, to }: { value: string; to: string }) => (
  <HighLightValue>
    <Link to={to}>
      <span>{value}</span>
    </Link>
  </HighLightValue>
)

type BlockListSortByType = 'height' | 'transactions' | 'reward'

interface TableTitleData {
  title: string
  width: string
  sortRule?: BlockListSortByType
}

interface TableContentData {
  width: string
  to?: any
  content: string
}

const LoadingSection = () => <div className={styles.loadingSection}>Loading...</div>

const getTableContentDataList = (block: State.Block, index: number, page: number, isMaxW: boolean) => {
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
      width: isMaxW ? '16%' : '14%',
      to: `/block/${block.number}`,
      content: localeNumberString(block.number),
    },
    {
      width: isMaxW ? '18%' : '11%',
      content: `${block.transactionsCount}`,
    },
    {
      width: '20%',
      content: blockReward,
    },
    {
      width: isMaxW ? '33%' : '40%',
      content: block.minerHash,
    },
    {
      width: isMaxW ? '13%' : '15%',
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
  const isMaxW = useMediaQuery(`(max-width: 1111px)`)

  const { sortBy, orderBy, sort, handleSortClick } = useSortParam<BlockListSortByType>(s =>
    s ? ['height', 'transactions', 'reward'].includes(s) : false,
  )

  const [t] = useTranslation()
  const TableTitles: TableTitleData[] = useMemo(
    () => [
      {
        title: t('home.height'),
        width: isMaxW ? '16%' : '14%',
        sortRule: 'height',
      },
      {
        title: t('home.transactions'),
        width: isMaxW ? '18%' : '11%',
        sortRule: 'transactions',
      },
      {
        title: t('home.block_reward'),
        width: '20%',
        sortRule: 'reward',
      },
      {
        title: t('block.miner'),
        width: isMaxW ? '33%' : '40%',
      },
      {
        title: t('home.time'),
        width: isMaxW ? '13%' : '15%',
      },
    ],
    [t, isMaxW],
  )

  const { currentPage, pageSize, setPage } = usePaginationParamsInListPage()
  const { state } = useLocation<RouteState>()
  const stateStaleTime = 3000

  const query = useQuery(
    ['blocks', currentPage, pageSize, sort],
    async () => {
      const { data, meta } = await fetchBlocks(currentPage, pageSize, sort)
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
  const { data, isLoading } = query
  const blocks = data?.blocks ?? []
  const total = data?.total ?? 0
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
            <TableTitleRow>
              {TableTitles.filter(data => data.sortRule).map((data: TableTitleData) => (
                <TableTitleRowItem width="fit-content" key={data.title}>
                  <div>{data.title}</div>
                  <button
                    type="button"
                    className={styles.sortIcon}
                    data-order={sortBy === data.sortRule ? orderBy : undefined}
                    onClick={() => handleSortClick(data.sortRule)}
                  >
                    <SortIcon />
                  </button>
                </TableTitleRowItem>
              ))}
            </TableTitleRow>
            {isLoading ? <LoadingSection /> : <BlockCardGroup blocks={blockList} isFirstPage={currentPage === 1} />}
          </ContentTable>
        ) : (
          <ContentTable>
            <TableTitleRow>
              {TableTitles.map((data: TableTitleData) => (
                <TableTitleRowItem width={data.width} key={data.title}>
                  <div>{data.title}</div>
                  {data.sortRule && (
                    <button
                      type="button"
                      className={styles.sortIcon}
                      data-order={sortBy === data.sortRule ? orderBy : undefined}
                      onClick={() => handleSortClick(data.sortRule)}
                    >
                      <SortIcon />
                    </button>
                  )}
                </TableTitleRowItem>
              ))}
            </TableTitleRow>
            {isLoading ? (
              <LoadingSection />
            ) : (
              blockList.map(
                (block: State.Block, blockIndex: number) =>
                  block && (
                    <TableContentRow key={block.number}>
                      {getTableContentDataList(block, blockIndex, currentPage, isMaxW).map(
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
              )
            )}
          </ContentTable>
        )}
        <PaginationWithRear
          currentPage={currentPage}
          totalPages={totalPages}
          onChange={setPage}
          rear={<CsvExport type="blocks" />}
        />
      </BlockListPanel>
    </Content>
  )
}
