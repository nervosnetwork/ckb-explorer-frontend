import { Fragment, useMemo, FC } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { Link } from '../../components/Link'
import { parseSimpleDate } from '../../utils/date'
import Content from '../../components/Content'
import { TableContentItem, TableMinerContentItem } from '../../components/Table'
import { TableTitleRow, TableContentRow, TableTitleRowItem } from '../../components/Table/TableComp'
import { deprecatedAddrToNewAddr, shannonToCkb } from '../../utils/util'
import { DELAY_BLOCK_NUMBER } from '../../constants/common'
import { localeNumberString } from '../../utils/number'
import Capacity from '../../components/Capacity'
import AddressText from '../../components/AddressText'
import { useIsMobile, useMediaQuery, usePaginationParamsInListPage, useSortParam } from '../../hooks'
import { explorerService } from '../../services/ExplorerService'
import { RouteState } from '../../routes/state'
import { ReactComponent as SortIcon } from '../../assets/sort_icon.svg'
import { CsvExport } from '../../components/CsvExport'
import PaginationWithRear from '../../components/PaginationWithRear'
import styles from './styles.module.scss'
import { Block } from '../../models/Block'
import { CardCellFactory, CardListWithCellsList } from '../../components/CardList'

const BlockValueItem = ({ value, to }: { value: string; to: string }) => (
  <div className={styles.highLightValue}>
    <Link to={to}>
      <span>{value}</span>
    </Link>
  </div>
)

type BlockListSortByType = 'height' | 'transactions' | 'reward'

interface TableTitleData {
  title: string
  width: string
  sortRule?: BlockListSortByType
}

interface TableContentData {
  width: string
  to?: string
  content: string
}

const LoadingSection = () => <div className={styles.loadingSection}>Loading...</div>

const getTableContentDataList = (block: Block, index: number, page: number, isMaxW: boolean) => {
  const blockReward =
    index < DELAY_BLOCK_NUMBER && page === 1 ? (
      <div className={styles.blockRewardContainer}>
        <Capacity capacity={shannonToCkb(block.reward)} unit={null} />
      </div>
    ) : (
      <div className={styles.blockRewardPanel}>
        <Capacity capacity={shannonToCkb(block.reward)} unit={null} />
      </div>
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

const BlockCardGroup: FC<{ blocks: Block[]; isFirstPage: boolean }> = ({ blocks, isFirstPage }) => {
  const { t } = useTranslation()
  const items: CardCellFactory<Block>[] = [
    {
      title: t('home.height'),
      content: block => <BlockValueItem value={localeNumberString(block.number)} to={`/block/${block.number}`} />,
    },
    {
      title: t('home.transactions'),
      content: block => localeNumberString(block.transactionsCount),
    },
    {
      title: t('home.block_reward'),
      content: (block, index) =>
        index < DELAY_BLOCK_NUMBER && isFirstPage ? (
          <div className={styles.blockRewardContainer}>
            <Capacity capacity={shannonToCkb(block.reward)} unit={null} />
          </div>
        ) : (
          <div className={styles.blockRewardPanel}>
            <Capacity capacity={shannonToCkb(block.reward)} unit={null} />
          </div>
        ),
    },
    {
      title: t('block.miner'),
      content: block => (
        <div className={styles.highLightValue}>
          <AddressText
            disableTooltip
            monospace={false}
            linkProps={{
              to: `/address/${block.minerHash}`,
            }}
          >
            {block.minerHash}
          </AddressText>
        </div>
      ),
    },
    {
      title: t('home.time'),
      content: block => parseSimpleDate(block.timestamp),
    },
  ]

  return (
    <CardListWithCellsList
      className={styles.blockCardGroup}
      dataSource={blocks}
      getDataKey={block => block.number}
      cells={items}
    />
  )
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
      const { data, meta } = await explorerService.api.fetchBlocks(currentPage, pageSize, sort)
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

  // FIXME: remove the any type
  const blockList = blocks.map((b: any) => ({
    ...b,
    minerHash: deprecatedAddrToNewAddr(b.minerHash),
  }))

  return (
    <Content>
      <div className={`${styles.blockListPanel} container`}>
        <div className="blockGreenBackground" />
        {isMobile ? (
          <div className={styles.contentTable}>
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
          </div>
        ) : (
          <div className={styles.contentTable}>
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
                (block: Block, blockIndex: number) =>
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
          </div>
        )}
        <PaginationWithRear
          currentPage={currentPage}
          totalPages={totalPages}
          onChange={setPage}
          rear={<CsvExport link="/export-transactions?type=blocks" />}
        />
      </div>
    </Content>
  )
}
