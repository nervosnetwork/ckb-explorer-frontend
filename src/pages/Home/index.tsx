import { FC, memo, useMemo, useRef } from 'react'
import { useHistory } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { useResizeDetector } from 'react-resize-detector'
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
import { BLOCK_POLLING_TIME, ListPageParams, DELAY_BLOCK_NUMBER, EPOCHS_PER_HALVING } from '../../constants/common'
import { localeNumberString, handleHashRate, handleDifficulty } from '../../utils/number'
import { handleBigNumber } from '../../utils/string'
import { isMainnet } from '../../utils/chain'
import LatestBlocksIcon from './latest_blocks.png'
import LatestTransactionsIcon from './latest_transactions.png'
import { BlockCardItem, TransactionCardItem } from './TableCard'
import Loading from '../../components/Loading/SmallLoading'
import { useElementIntersecting, useIsExtraLarge, useIsMobile, useSingleHalving } from '../../hooks'
import { useNodeLatestBlocks, useNodeLatestTransactions } from '../../hooks/block'
import Banner from './Banner'
import { HalvingBanner } from './Banner/HalvingBanner'
import Search from '../../components/Search'
import AverageBlockTimeChart from './AverageBlockTimeChart'
import HashRateChart from './HashRateChart'
import styles from './index.module.scss'
import { RouteState } from '../../routes/state'
import { explorerService, useLatestBlockNumber, useStatistics } from '../../services/ExplorerService'
import { useShowSearchBarInHeader } from '../../components/Header'
import { useCKBNode } from '../../hooks/useCKBNode'

interface BlockchainData {
  name: string
  value: string
  rightValue?: string
  showSeparate: boolean
}

const StatisticItem = ({ blockchain, isFirst }: { blockchain: BlockchainData; isFirst?: boolean }) => (
  <HomeStatisticItemPanel isFirst={isFirst}>
    <div className="homeStatisticItemName">{blockchain.name}</div>
    <div className="homeStatisticItemValue">{blockchain.value}</div>
  </HomeStatisticItemPanel>
)

const BlockchainItem = ({ blockchain }: { blockchain: BlockchainData }) => (
  <HomeHeaderItemPanel>
    <div className="blockchainItemContent">
      <div className="blockchainItemName">{blockchain.name}</div>
      <div className="blockchainItemValue">
        <div className="blockchainItemLeftValue">{blockchain.value}</div>
        {blockchain.rightValue && <div className="blockchainItemRightValue">{blockchain.rightValue}</div>}
      </div>
    </div>
    {blockchain.showSeparate && <div className="blockchainItemBetweenSeparate" />}
  </HomeHeaderItemPanel>
)

const parseHashRate = (hashRate: string | undefined) => (hashRate ? handleHashRate(Number(hashRate) * 1000) : '- -')

const parseBlockTime = (blockTime: string | undefined) => (blockTime ? parseTime(Number(blockTime)) : '- -')

const useBlockchainDataList = (isMobile: boolean, isXL: boolean): BlockchainData[] => {
  const { t } = useTranslation()
  const statistics = useStatistics()

  return [
    {
      name: t('blockchain.latest_block'),
      value: localeNumberString(statistics.tipBlockNumber),
      showSeparate: true,
    },
    {
      name: t('blockchain.average_block_time'),
      value: parseBlockTime(statistics.averageBlockTime),
      showSeparate: !isMobile,
    },
    {
      name: t('blockchain.hash_rate'),
      value: parseHashRate(statistics.hashRate),
      showSeparate: true,
    },
    {
      name: t('blockchain.difficulty'),
      value: handleDifficulty(statistics.currentEpochDifficulty),
      showSeparate: true,
    },
    {
      name: t('blockchain.epoch'),
      value: statistics.epochInfo.epochNumber,
      rightValue: `${statistics.epochInfo.index}/${statistics.epochInfo.epochLength}`,
      showSeparate: true,
    },
    {
      name: t('blockchain.estimated_epoch_time'),
      value: parseTimeNoSecond(Number(statistics.estimatedEpochTime)),
      showSeparate: !isXL,
    },
    {
      name: t('blockchain.transactions_per_minute'),
      value: handleBigNumber(statistics.transactionsCountPerMinute, 2),
      showSeparate: true,
    },
    {
      name: t('blockchain.transactions_last_24hrs'),
      value: handleBigNumber(statistics.transactionsLast24Hrs, 2),
      showSeparate: false,
    },
  ]
}

const HomeHeaderTopPanel: FC = memo(() => {
  const ref = useRef<HTMLDivElement>(null)
  const { t } = useTranslation()
  const { height: resizedHeight } = useResizeDetector({
    targetRef: ref,
    handleWidth: false,
  })
  const height = Math.round(resizedHeight ?? ref.current?.clientHeight ?? 0)
  const selfMarginTop = 20
  // TODO: This does not take into account the height of the Alert and Search when they appear,
  // so a dynamic `--headerHeight` variable may be needed.
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

  useShowSearchBarInHeader(!isFullDisplayInScreen)

  return (
    <div ref={ref} className={styles.homeHeaderTopPanel}>
      <div className={styles.title}>{t('common.ckb_explorer')}</div>
      <div className={styles.search}>{isFullDisplayInScreen && <Search hasButton />}</div>
    </div>
  )
})

const BlockList: FC<{
  blocks: {
    number: number
    timestamp: number
    liveCellChanges: string
    reward: string
    transactionsCount: number
    minerHash: string
  }[]
}> = memo(({ blocks }) => {
  return blocks.length > 0 ? (
    <>
      {blocks.map((block, index) => (
        <div key={block.number}>
          <BlockCardItem block={block} isDelayBlock={index < DELAY_BLOCK_NUMBER} />
          {blocks.length - 1 !== index && <div className="blockCardSeparate" />}
        </div>
      ))}
    </>
  ) : (
    <Loading />
  )
})

const TransactionList: FC<{
  transactions: {
    transactionHash: string
    blockNumber: string | number
    blockTimestamp: string | number
    capacityInvolved: string
    liveCellChanges: string
  }[]
  tipBlockNumber: number
}> = memo(({ transactions, tipBlockNumber }) => {
  return transactions.length > 0 ? (
    <>
      {transactions.map((transaction, index) => (
        <div key={transaction.transactionHash}>
          <TransactionCardItem transaction={transaction} tipBlockNumber={tipBlockNumber} />
          {transactions.length - 1 !== index && <div className="transactionCardSeparate" />}
        </div>
      ))}
    </>
  ) : (
    <Loading />
  )
})

export default () => {
  const isMobile = useIsMobile()
  const {
    t,
    i18n: { language },
  } = useTranslation()
  const isXL = useIsExtraLarge()
  const history = useHistory<RouteState>()
  const tipBlockNumber = useLatestBlockNumber()

  const blocksQuery = useQuery(
    ['latest_blocks'],
    async () => {
      // Using the size of list pages to request will be more friendly to the data reuse of the list pages.
      const { data, meta } = await explorerService.api.fetchLatestBlocks(ListPageParams.PageSize)
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
      const { transactions, total } = await explorerService.api.fetchLatestTransactions(ListPageParams.PageSize)
      return {
        transactions,
        total,
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
  const { isActivated: nodeConnectModeActivated } = useCKBNode()
  const nodeLatestBlocks = useNodeLatestBlocks()
  const nodeLatestTransactions = useNodeLatestTransactions()
  const { currentEpoch, targetEpoch } = useSingleHalving()
  const isHalvingHidden =
    !currentEpoch ||
    (currentEpoch > targetEpoch + 6 && // 6 epochs(1 day) after halving
      currentEpoch < targetEpoch + EPOCHS_PER_HALVING - 180) // 180 epochs(30 days) before next halving

  const blockchainDataList = useBlockchainDataList(isMobile, isXL)

  return (
    <Content>
      {isMainnet() && !isHalvingHidden ? <HalvingBanner /> : <Banner />}
      <div className="container">
        <HomeHeaderTopPanel />
        {!nodeConnectModeActivated && (
          <>
            <div className={`${styles.homeStatisticTopPanel} ${styles.afterHardFork}`}>
              <div className={styles.homeStatisticLeftPanel}>
                <div className={styles.homeStatisticLeftData}>
                  <StatisticItem blockchain={blockchainDataList[0]} isFirst />
                  <StatisticItem blockchain={blockchainDataList[1]} />
                </div>
                <div className={styles.homeStatisticLeftChart}>
                  <AverageBlockTimeChart />
                </div>
              </div>
              <div className={styles.homeStatisticRightPanel}>
                <div className={styles.homeStatisticRightData}>
                  <StatisticItem blockchain={blockchainDataList[2]} isFirst />
                  <StatisticItem blockchain={blockchainDataList[3]} />
                </div>
                <div className={styles.homeStatisticRightChart}>
                  <HashRateChart />
                </div>
              </div>
            </div>
            <div className={styles.homeStatisticBottomPanel}>
              {!isXL ? (
                blockchainDataList
                  .slice(4)
                  .map((data: BlockchainData) => <BlockchainItem blockchain={data} key={data.name} />)
              ) : (
                <>
                  <div className={styles.blockchainItemRow}>
                    {blockchainDataList.slice(4, 6).map((data: BlockchainData) => (
                      <BlockchainItem blockchain={data} key={data.name} />
                    ))}
                  </div>
                  <div className={styles.blockchainItemRowSeparate} />
                  <div className={styles.blockchainItemRow}>
                    {blockchainDataList.slice(6).map((data: BlockchainData) => (
                      <BlockchainItem blockchain={data} key={data.name} />
                    ))}
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
      <HomeTablePanel className="container">
        <BlockPanel>
          <TableHeaderPanel>
            <img src={LatestBlocksIcon} alt="latest blocks" />
            <span>{t('home.latest_blocks')}</span>
          </TableHeaderPanel>
          <BlockList blocks={nodeConnectModeActivated ? nodeLatestBlocks : blocks} />
          <TableMorePanel
            onClick={() => {
              history.push(
                `/${language}/block/list`,
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
            <span>{t('home.latest_transactions')}</span>
          </TableHeaderPanel>
          <TransactionList
            transactions={nodeConnectModeActivated ? nodeLatestTransactions : transactions}
            tipBlockNumber={tipBlockNumber}
          />
          <TableMorePanel
            onClick={() => {
              history.push(
                `/${language}/transaction/list`,
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
