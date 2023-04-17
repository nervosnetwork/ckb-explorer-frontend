import { FC, memo, useEffect, useMemo, useRef } from 'react'
import { useHistory } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useResizeDetector } from 'react-resize-detector'
import {
  HomeHeaderItemPanel,
  BlockPanel,
  TableMorePanel,
  TableHeaderPanel,
  HomeTablePanel,
  TransactionPanel,
  HomeStatisticItemPanel,
} from '../Home/styled'
import Content from '../../components/Content'
import { parseTime, parseTimeNoSecond } from '../../utils/date'
import {
  BLOCK_POLLING_TIME,
  BLOCKCHAIN_ALERT_POLLING_TIME,
  ListPageParams,
  DELAY_BLOCK_NUMBER,
} from '../../constants/common'
import { localeNumberString, handleHashRate, handleDifficulty } from '../../utils/number'
import { handleBigNumber } from '../../utils/string'
import { useAppState, useDispatch } from '../../contexts/providers'
import i18n from '../../utils/i18n'
import LatestBlocksIcon from '../../assets/latest_blocks.png'
import LatestTransactionsIcon from '../../assets/latest_transactions.png'
import { BlockCardItem, TransactionCardItem } from '../Home/TableCard'
import { getTipBlockNumber } from '../../service/app/address'
import Loading from '../../components/Loading/SmallLoading'
import { useElementIntersecting, useInterval, useIsLGScreen, useIsMobile } from '../../utils/hook'
import { Banner } from '../Home/Banner'
import { handleBlockchainAlert } from '../../service/app/blockchain'
import Search from '../../components/Search'
import AverageBlockTimeChart from '../Home/AverageBlockTimeChart'
import HashRateChart from '../Home/HashRateChart'
import { ComponentActions } from '../../contexts/actions'
import styles from '../Home/index.module.scss'
import { fetchLatestBlocks, fetchLatestTransactions } from '../../service/http/fetcher'
import { RouteState } from '../../routes/state'

interface BlockchainData {
  name: string
  value: string
  rightValue?: string
  showSeparate: boolean
}

const StatisticItem = ({ blockchain, isFirst }: { blockchain: BlockchainData; isFirst?: boolean }) => (
  <HomeStatisticItemPanel isFirst={isFirst}>
    <div className="home__statistic__item__name">{blockchain.name}</div>
    <div className="home__statistic__item__value">{blockchain.value}</div>
  </HomeStatisticItemPanel>
)

const BlockchainItem = ({ blockchain }: { blockchain: BlockchainData }) => (
  <HomeHeaderItemPanel>
    <div className="blockchain__item__content">
      <div className="blockchain__item__name">{blockchain.name}</div>
      <div className="blockchain__item__value">
        <div className="blockchain__item__left__value">{blockchain.value}</div>
        {blockchain.rightValue && <div className="blockchain__item__right__value">{blockchain.rightValue}</div>}
      </div>
    </div>
    {blockchain.showSeparate && <div className="blockchain__item__between_separate" />}
  </HomeHeaderItemPanel>
)

const parseHashRate = (hashRate: string | undefined) => (hashRate ? handleHashRate(Number(hashRate) * 1000) : '- -')

const parseBlockTime = (blockTime: string | undefined) => (blockTime ? parseTime(Number(blockTime)) : '- -')

const getBlockchainDataList = (statistics: State.Statistics, isMobile: boolean, isLG: boolean): BlockchainData[] => [
  {
    name: i18n.t('blockchain.latest_block'),
    value: localeNumberString(statistics.tipBlockNumber),
    showSeparate: true,
  },
  {
    name: i18n.t('blockchain.average_block_time'),
    value: parseBlockTime(statistics.averageBlockTime),
    showSeparate: !isMobile,
  },
  {
    name: i18n.t('blockchain.hash_rate'),
    value: parseHashRate(statistics.hashRate),
    showSeparate: true,
  },
  {
    name: i18n.t('blockchain.difficulty'),
    value: handleDifficulty(statistics.currentEpochDifficulty),
    showSeparate: true,
  },
  {
    name: i18n.t('blockchain.epoch'),
    value: statistics.epochInfo.epochNumber,
    rightValue: `${statistics.epochInfo.index}/${statistics.epochInfo.epochLength}`,
    showSeparate: true,
  },
  {
    name: i18n.t('blockchain.estimated_epoch_time'),
    value: parseTimeNoSecond(Number(statistics.estimatedEpochTime)),
    showSeparate: !isLG,
  },
  {
    name: i18n.t('blockchain.transactions_per_minute'),
    value: handleBigNumber(statistics.transactionsCountPerMinute, 2),
    showSeparate: true,
  },
  {
    name: i18n.t('blockchain.transactions_last_24hrs'),
    value: handleBigNumber(statistics.transactionsLast24Hrs, 2),
    showSeparate: false,
  },
]

const HomeHeaderTopPanel: FC = memo(() => {
  const dispatch = useDispatch()
  const ref = useRef<HTMLDivElement>(null)

  const { height: resizedHeight } = useResizeDetector({
    targetRef: ref,
    handleWidth: false,
  })
  const height = Math.round(resizedHeight ?? ref.current?.clientHeight ?? 0)
  const selfMarginTop = 20
  const headerHeight = 64
  const intersectingCheckOffset = height + selfMarginTop + headerHeight

  const isFullDisplayInScreen = useElementIntersecting(
    ref,
    useMemo(
      () => ({
        threshold: 0,
        rootMargin: `-${intersectingCheckOffset}px`,
      }),
      [intersectingCheckOffset],
    ),
    true,
  )

  useEffect(() => {
    if (ref.current == null) return

    dispatch({
      type: ComponentActions.UpdateHeaderSearchBarVisible,
      payload: {
        headerSearchBarVisible: !isFullDisplayInScreen,
      },
    })

    // eslint-disable-next-line consistent-return
    return () => {
      dispatch({
        type: ComponentActions.UpdateHeaderSearchBarVisible,
        payload: {
          headerSearchBarVisible: true,
        },
      })
    }
  }, [dispatch, isFullDisplayInScreen])

  return (
    <div ref={ref} className={styles.HomeHeaderTopPanel}>
      <div className={styles.title}>{i18n.t('common.ckb_explorer')}</div>
      <div className={styles.search}>{isFullDisplayInScreen && <Search hasButton />}</div>
    </div>
  )
})

const BlockList: FC<{ blocks: State.Block[] }> = memo(({ blocks }) => {
  return blocks.length > 0 ? (
    <>
      {blocks.map((block, index) => (
        <div key={block.number}>
          <BlockCardItem block={block} isDelayBlock={index < DELAY_BLOCK_NUMBER} />
          {blocks.length - 1 !== index && <div className="block__card__separate" />}
        </div>
      ))}
    </>
  ) : (
    <Loading />
  )
})

const TransactionList: FC<{ transactions: State.Transaction[]; tipBlockNumber: number }> = memo(
  ({ transactions, tipBlockNumber }) => {
    return transactions.length > 0 ? (
      <>
        {transactions.map((transaction, index) => (
          <div key={transaction.transactionHash}>
            <TransactionCardItem transaction={transaction} tipBlockNumber={tipBlockNumber} />
            {transactions.length - 1 !== index && <div className="transaction__card__separate" />}
          </div>
        ))}
      </>
    ) : (
      <Loading />
    )
  },
)

export default () => {
  const isMobile = useIsMobile()
  const isLG = useIsLGScreen()
  const dispatch = useDispatch()
  const history = useHistory<RouteState>()
  const {
    statistics,
    app: { tipBlockNumber },
  } = useAppState()
  const [t] = useTranslation()

  const blocksQuery = useQuery(
    'latest_blocks',
    async () => {
      // Using the size of list pages to request will be more friendly to the data reuse of the list pages.
      const { data, meta } = await fetchLatestBlocks(ListPageParams.PageSize)
      const blocks = data.map(wrapper => wrapper.attributes)
      return {
        blocks,
        total: meta?.total ?? blocks.length,
      }
    },
    {
      refetchInterval: BLOCK_POLLING_TIME,
    },
  )

  const transactionsQuery = useQuery(
    ['latest_transactions'],
    async () => {
      const { data, meta } = await fetchLatestTransactions(ListPageParams.PageSize)
      const transactions = data.map(wrapper => wrapper.attributes)
      return {
        transactions,
        total: meta?.total ?? transactions.length,
      }
    },
    {
      refetchInterval: BLOCK_POLLING_TIME,
    },
  )

  const maxDisplaysCount = 15
  const blocks = useMemo(() => blocksQuery.data?.blocks.slice(0, maxDisplaysCount) ?? [], [blocksQuery.data?.blocks])
  const transactions = useMemo(
    () => transactionsQuery.data?.transactions.slice(0, maxDisplaysCount) ?? [],
    [transactionsQuery.data?.transactions],
  )

  useInterval(() => {
    getTipBlockNumber(dispatch)
  }, BLOCK_POLLING_TIME)

  useInterval(() => {
    handleBlockchainAlert(dispatch)
  }, BLOCKCHAIN_ALERT_POLLING_TIME)

  const blockchainDataList = getBlockchainDataList(statistics, isMobile, isLG)

  return (
    <Content>
      <Banner latestBlock={blocksQuery.data?.blocks[0]} fallbackThreshold={60} />
      <div className="container">
        <HomeHeaderTopPanel />
        <div className={`${styles.HomeStatisticTopPanel} ${styles.AfterHardFork}`}>
          <div className={styles.home__statistic__left__panel}>
            <div className={styles.home__statistic__left__data}>
              <StatisticItem blockchain={blockchainDataList[0]} isFirst />
              <StatisticItem blockchain={blockchainDataList[1]} />
            </div>
            <div className={styles.home__statistic__left__chart}>
              <AverageBlockTimeChart />
            </div>
          </div>
          <div className={styles.home__statistic__right__panel}>
            <div className={styles.home__statistic__right__data}>
              <StatisticItem blockchain={blockchainDataList[2]} isFirst />
              <StatisticItem blockchain={blockchainDataList[3]} />
            </div>
            <div className={styles.home__statistic__right__chart}>
              <HashRateChart />
            </div>
          </div>
        </div>
        <div className={styles.HomeStatisticBottomPanel}>
          {!isLG ? (
            blockchainDataList
              .slice(4)
              .map((data: BlockchainData) => <BlockchainItem blockchain={data} key={data.name} />)
          ) : (
            <>
              <div className={styles.blockchain__item__row}>
                {blockchainDataList.slice(4, 6).map((data: BlockchainData) => (
                  <BlockchainItem blockchain={data} key={data.name} />
                ))}
              </div>
              <div className={styles.blockchain__item__row_separate} />
              <div className={styles.blockchain__item__row}>
                {blockchainDataList.slice(6).map((data: BlockchainData) => (
                  <BlockchainItem blockchain={data} key={data.name} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <HomeTablePanel className="container">
        <BlockPanel>
          <TableHeaderPanel>
            <img src={LatestBlocksIcon} alt="latest blocks" />
            <span>{i18n.t('home.latest_blocks')}</span>
          </TableHeaderPanel>
          <BlockList blocks={blocks} />
          <TableMorePanel
            onClick={() => {
              history.push(
                `/block/list`,
                blocksQuery.data
                  ? {
                      type: 'BlockListPage',
                      createTime: Date.now(),
                      blocksDataWithFirstPage: blocksQuery.data,
                    }
                  : undefined,
              )
            }}
          >
            <span>{t('home.more')}</span>
          </TableMorePanel>
        </BlockPanel>

        <TransactionPanel>
          <TableHeaderPanel>
            <img src={LatestTransactionsIcon} alt="latest transactions" />
            <span>{i18n.t('home.latest_transactions')}</span>
          </TableHeaderPanel>
          <TransactionList transactions={transactions} tipBlockNumber={tipBlockNumber} />
          <TableMorePanel
            onClick={() => {
              history.push(
                `/transaction/list`,
                transactionsQuery.data
                  ? {
                      type: 'TransactionListPage',
                      createTime: Date.now(),
                      transactionsDataWithFirstPage: transactionsQuery.data,
                    }
                  : undefined,
              )
            }}
          >
            <span>{t('home.more')}</span>
          </TableMorePanel>
        </TransactionPanel>
      </HomeTablePanel>
    </Content>
  )
}
