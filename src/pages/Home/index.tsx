import { useEffect } from 'react'
import { useHistory } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import {
  HomeHeaderItemPanel,
  BlockPanel,
  TableMorePanel,
  TableHeaderPanel,
  HomeTablePanel,
  TransactionPanel,
  HomeStatisticItemPanel,
} from './styled'
import Content from '../../components/Content'
import { parseTime, parseTimeNoSecond } from '../../utils/date'
import { BLOCK_POLLING_TIME, BLOCKCHAIN_ALERT_POLLING_TIME } from '../../constants/common'
import { localeNumberString, handleHashRate, handleDifficulty } from '../../utils/number'
import { handleBigNumber } from '../../utils/string'
import { isScreenSmallerThan1200 } from '../../utils/screen'
import { useAppState, useDispatch } from '../../contexts/providers'
import i18n from '../../utils/i18n'
import LatestBlocksIcon from '../../assets/latest_blocks.png'
import LatestTransactionsIcon from '../../assets/latest_transactions.png'
import { BlockCardItem, TransactionCardItem } from './TableCard'
import { getTipBlockNumber } from '../../service/app/address'
import Loading from '../../components/Loading/SmallLoading'
import Banner from '../../components/Banner'
import { useInterval, useIsMobile } from '../../utils/hook'
import { handleBlockchainAlert } from '../../service/app/blockchain'
import Search from '../../components/Search'
import AverageBlockTimeChart from './AverageBlockTimeChart'
import HashRateChart from './HashRateChart'
import { ComponentActions } from '../../contexts/actions'
import { AppDispatch } from '../../contexts/reducer'
import styles from './index.module.scss'
import { fetchBlocks, fetchLatestTransactions } from '../../service/http/fetcher'
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

const getBlockchainDataList = (statistics: State.Statistics, isMobile: boolean): BlockchainData[] => [
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
    showSeparate: !isScreenSmallerThan1200(),
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

const useHomeSearchBarStatus = (dispatch: AppDispatch) => {
  useEffect(() => {
    dispatch({
      type: ComponentActions.UpdateHeaderSearchEditable,
      payload: {
        searchBarEditable: false,
      },
    })
  }, [dispatch])

  useInterval(() => {
    const searchBar = document.getElementById('home__search__bar') as HTMLElement
    if (searchBar) {
      const searchPosition = searchBar.scrollHeight + 64 + 100
      dispatch({
        type: ComponentActions.UpdateHeaderSearchBarVisible,
        payload: {
          headerSearchBarVisible: window.pageYOffset > searchPosition,
        },
      })
    }
  }, 300)
}

export default () => {
  const isMobile = useIsMobile()
  const dispatch = useDispatch()
  const history = useHistory<RouteState>()
  const {
    statistics,
    app: { tipBlockNumber },
    components: { headerSearchBarVisible },
  } = useAppState()
  const [t] = useTranslation()

  const blocksQuery = useQuery(
    'latest_blocks',
    async () => {
      const wrappers = await fetchBlocks()
      const blocks = wrappers.map(wrapper => wrapper.attributes)
      return blocks
    },
    {
      refetchInterval: BLOCK_POLLING_TIME,
    },
  )
  const homeBlocks = blocksQuery.data ?? []

  const transactionsQuery = useQuery(
    ['latest_transactions'],
    async () => {
      const { data, meta } = await fetchLatestTransactions()
      return {
        transactions: data.map(wrapper => wrapper.attributes) ?? [],
        total: meta?.total ?? 0,
      }
    },
    {
      refetchInterval: BLOCK_POLLING_TIME,
    },
  )
  const transactions = transactionsQuery.data?.transactions ?? []

  useInterval(() => {
    getTipBlockNumber(dispatch)
  }, BLOCK_POLLING_TIME)

  useInterval(() => {
    handleBlockchainAlert(dispatch)
  }, BLOCKCHAIN_ALERT_POLLING_TIME)

  useHomeSearchBarStatus(dispatch)

  const blockchainDataList = getBlockchainDataList(statistics, isMobile)

  return (
    <Content>
      <Banner />
      <div className="container">
        <div className={styles.HomeHeaderTopPanel}>
          <div className={styles.title}>{i18n.t('common.ckb_explorer')}</div>
          <div className={styles.search} id="home__search__bar">
            {!headerSearchBarVisible && <Search hasButton />}
          </div>
        </div>
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
          {!isScreenSmallerThan1200() &&
            blockchainDataList
              .slice(4)
              .map((data: BlockchainData) => <BlockchainItem blockchain={data} key={data.name} />)}
          {isScreenSmallerThan1200() && (
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
          {homeBlocks.length > 0 ? (
            <>
              {homeBlocks.map((block, index) => (
                <div key={block.number}>
                  <BlockCardItem block={block} index={index} />
                  {homeBlocks.length - 1 !== index && <div className="block__card__separate" />}
                </div>
              ))}
            </>
          ) : (
            <Loading />
          )}
          <TableMorePanel
            onClick={() => {
              history.push(`/block/list`)
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
          {transactions.length > 0 ? (
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
          )}

          <TableMorePanel
            onClick={() => {
              history.push(
                `/transaction/list`,
                transactionsQuery.data
                  ? {
                      type: 'TransactionListPage',
                      createTime: Date.now(),
                      transactionsDataWithFirstPage: {
                        ...transactionsQuery.data,
                      },
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
