import React, { useEffect, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import 'default-passive-events'
import Content from '../../components/Content'
import {
  getStatisticAddressCount,
  getStatisticCellCount,
  getStatisticTransactionCount,
  getStatisticAddressBalanceRank,
  getStatisticBalanceDistribution,
  getStatisticTxFeeHistory,
} from '../../service/app/charts/activities'
import {
  getStatisticDifficultyHashRate,
  getStatisticDifficultyUncleRate,
  getStatisticDifficulty,
  getStatisticHashRate,
  getStatisticUncleRate,
} from '../../service/app/charts/mining'
import {
  getStatisticTotalDaoDeposit,
  getStatisticNewDaoDeposit,
  getStatisticCirculationRatio,
} from '../../service/app/charts/nervosDao'
import { useAppState, useDispatch } from '../../contexts/providers'
import i18n from '../../utils/i18n'
import { DifficultyHashRateChart, initStatisticDifficultyHashRate } from './mining/DifficultyHashRate'
import { DifficultyUncleRateChart, initStatisticDifficultyUncleRate } from './mining/DifficultyUncleRate'
import { TransactionCountChart, initStatisticTransactionCount } from './activities/TransactionCount'
import { AddressCountChart, initStatisticAddressCount } from './activities/AddressCount'
import { CellCountChart, initStatisticCellCount } from './activities/CellCount'
import { TotalDaoDepositChart, initStatisticTotalDaoDeposit } from './nervosDao/TotalDaoDeposit'
import { ChartsPanel, ChartCardPanel, ChartsTitle, ChartsContent } from './styled'
import { AddressBalanceRankChart, initStatisticAddressBalanceRanks } from './activities/AddressBalanceRank'
import { DifficultyChart, initStatisticDifficulty } from './mining/Difficulty'
import { HashRateChart, initStatisticHashRate } from './mining/HashRate'
import { UncleRateChart, initStatisticUncleRate } from './mining/UncleRate'
import { BalanceDistributionChart, initStatisticBalanceDistribution } from './activities/BalanceDistribution'
import { TxFeeHistoryChart, initStatisticTxFeeHistory } from './activities/TxFeeHistory'
import { BlockTimeDistributionChart, initStatisticBlockTimeDistribution } from './block/BlockTimeDistribution'
import {
  getStatisticBlockTimeDistribution,
  getStatisticEpochTimeDistribution,
  getStatisticAverageBlockTimes,
} from '../../service/app/charts/block'
import { EpochTimeDistributionChart, initStatisticEpochTimeDistribution } from './block/EpochTimeDistribution'
import { NewDaoDepositChart, initStatisticNewDaoDeposit } from './nervosDao/NewDaoDeposit'
import { CirculationRatioChart, initStatisticCirculationRatio } from './nervosDao/CirculationRatio'
import { initStatisticAverageBlockTimes, AverageBlockTimeChart } from './block/AverageBlockTime'

interface ChartData {
  title: string
  chart: ReactNode
  path: string
}

interface ChartCategory {
  category: string
  charts: ChartData[]
}

const ChartCard = ({ chartData }: { chartData: ChartData }) => {
  return (
    <ChartCardPanel>
      <Link to={chartData.path}>
        <div className="chart__card_title">{chartData.title}</div>
        <div className="chart__card_body">{chartData.chart}</div>
      </Link>
    </ChartCardPanel>
  )
}

const NullEvent = () => {}

export default () => {
  const dispatch = useDispatch()
  const {
    statisticDifficultyHashRates,
    statisticDifficultyUncleRates,
    statisticDifficulties,
    statisticHashRates,
    statisticUncleRates,
    statisticAddressCounts,
    statisticTotalDaoDeposits,
    statisticNewDaoDeposits,
    // statisticNewDaoWithdraw,
    statisticCirculationRatios,
    statisticCellCounts,
    statisticTransactionCounts,
    statisticAddressBalanceRanks,
    statisticBalanceDistributions,
    statisticTxFeeHistories,
    statisticBlockTimeDistributions,
    // statisticOccupiedCapacities,
    statisticEpochTimeDistributions,
    statisticAverageBlockTimes,
    // statisticNewNodeCounts,
    // statisticNodeDistributions,
  } = useAppState()

  const charts: ChartCategory[] = [
    {
      category: i18n.t('statistic.category_block'),
      charts: [
        {
          title: `${i18n.t('statistic.block_time_distribution')}`,
          chart: (
            <BlockTimeDistributionChart statisticBlockTimeDistributions={statisticBlockTimeDistributions} isThumbnail />
          ),
          path: '/charts/block-time-distribution',
        },
        {
          title: `${i18n.t('statistic.epoch_time_distribution')}`,
          chart: (
            <EpochTimeDistributionChart statisticEpochTimeDistributions={statisticEpochTimeDistributions} isThumbnail />
          ),
          path: '/charts/epoch-time-distribution',
        },
        {
          title: `${i18n.t('statistic.average_block_time')}`,
          chart: <AverageBlockTimeChart statisticAverageBlockTimes={statisticAverageBlockTimes} isThumbnail />,
          path: '/charts/average-block-time',
        },
      ],
    },
    {
      category: i18n.t('statistic.category_mining'),
      charts: [
        {
          title: `${i18n.t('block.difficulty')} & ${i18n.t('block.hash_rate')}`,
          chart: <DifficultyHashRateChart statisticDifficultyHashRates={statisticDifficultyHashRates} isThumbnail />,
          path: '/charts/difficulty-hash-rate',
        },
        {
          title: `${i18n.t('block.difficulty')} & ${i18n.t('block.uncle_rate')}`,
          chart: <DifficultyUncleRateChart statisticDifficultyUncleRates={statisticDifficultyUncleRates} isThumbnail />,
          path: '/charts/difficulty-uncle-rate',
        },
        {
          title: `${i18n.t('block.difficulty')}`,
          chart: <DifficultyChart statisticDifficulties={statisticDifficulties} isThumbnail />,
          path: '/charts/difficulty',
        },
        {
          title: `${i18n.t('block.hash_rate')}`,
          chart: <HashRateChart statisticHashRates={statisticHashRates} isThumbnail />,
          path: '/charts/hash-rate',
        },
        {
          title: `${i18n.t('block.uncle_rate')}`,
          chart: <UncleRateChart statisticUncleRates={statisticUncleRates} isThumbnail />,
          path: '/charts/uncle-rate',
        },
      ],
    },
    {
      category: i18n.t('statistic.category_activities'),
      charts: [
        {
          title: `${i18n.t('statistic.transaction_count')}`,
          chart: <TransactionCountChart statisticTransactionCounts={statisticTransactionCounts} isThumbnail />,
          path: '/charts/transaction-count',
        },
        {
          title: `${i18n.t('statistic.address_count')}`,
          chart: <AddressCountChart statisticAddressCounts={statisticAddressCounts} isThumbnail />,
          path: '/charts/address-count',
        },
        {
          title: i18n.t('statistic.cell_count'),
          chart: <CellCountChart statisticCellCounts={statisticCellCounts} isThumbnail />,
          path: '/charts/cell-count',
        },
        {
          title: `${i18n.t('statistic.balance_ranking')}`,
          chart: (
            <AddressBalanceRankChart
              statisticAddressBalanceRanks={statisticAddressBalanceRanks}
              clickEvent={NullEvent}
              isThumbnail
            />
          ),
          path: '/charts/address-balance-rank',
        },
        {
          title: `${i18n.t('statistic.balance_distribution')}`,
          chart: <BalanceDistributionChart statisticBalanceDistributions={statisticBalanceDistributions} isThumbnail />,
          path: '/charts/balance-distribution',
        },
        {
          title: `${i18n.t('statistic.tx_fee_history')}`,
          chart: <TxFeeHistoryChart statisticTxFeeHistories={statisticTxFeeHistories} isThumbnail />,
          path: '/charts/tx-fee-history',
        },
        // {
        //   title: `${i18n.t('statistic.occupied_capacity')}`,
        //   chart: <OccupiedCapacityChart statisticOccupiedCapacities={statisticOccupiedCapacities} isThumbnail />,
        //   path: '/charts/occupied-capacity',
        // },
      ],
    },
    {
      category: i18n.t('blockchain.nervos_dao'),
      charts: [
        {
          title: `${i18n.t('statistic.total_dao_deposit_title')}`,
          chart: <TotalDaoDepositChart statisticTotalDaoDeposits={statisticTotalDaoDeposits} isThumbnail />,
          path: '/charts/total-dao-deposit',
        },
        {
          title: `${i18n.t('statistic.new_dao_deposit_title')}`,
          chart: <NewDaoDepositChart statisticNewDaoDeposits={statisticNewDaoDeposits} isThumbnail />,
          path: '/charts/new-dao-deposit',
        },
        // {
        //   title: `${i18n.t('statistic.new_dao_withdraw')}`,
        //   chart: <NewDaoWithdrawChart statisticNewDaoWithdraw={statisticNewDaoWithdraw} isThumbnail />,
        //   path: '/charts/new-dao-withdraw',
        // },
        {
          title: `${i18n.t('statistic.circulation_ratio')}`,
          chart: <CirculationRatioChart statisticCirculationRatios={statisticCirculationRatios} isThumbnail />,
          path: '/charts/circulation-ratio',
        },
      ],
    },
    // {
    //   category: i18n.t('statistic.category_network'),
    //   charts: [
    //     {
    //       title: `${i18n.t('statistic.new_node_count')}`,
    //       chart: <NewNodeCountChart statisticNewNodeCounts={statisticNewNodeCounts} isThumbnail />,
    //       path: '/charts/new-node-count',
    //     },
    //     {
    //       title: `${i18n.t('statistic.node_distribution')}`,
    //       chart: <NodeDistributionChart statisticNodeDistributions={statisticNodeDistributions} isThumbnail />,
    //       path: '/charts/node-distribution',
    //     },
    //   ],
    // },
  ]

  useEffect(() => {
    initStatisticDifficultyHashRate(dispatch)
    initStatisticDifficultyUncleRate(dispatch)
    initStatisticDifficulty(dispatch)
    initStatisticHashRate(dispatch)
    initStatisticUncleRate(dispatch)
    initStatisticAddressCount(dispatch)
    initStatisticCellCount(dispatch)
    initStatisticTransactionCount(dispatch)
    initStatisticTotalDaoDeposit(dispatch)
    initStatisticNewDaoDeposit(dispatch)
    // initStatisticNewDaoWithdraw(dispatch)
    initStatisticCirculationRatio(dispatch)
    initStatisticAddressBalanceRanks(dispatch)
    initStatisticBalanceDistribution(dispatch)
    initStatisticTxFeeHistory(dispatch)
    initStatisticBlockTimeDistribution(dispatch)
    // initStatisticOccupiedCapacity(dispatch)
    initStatisticEpochTimeDistribution(dispatch)
    initStatisticAverageBlockTimes(dispatch)
    // initStatisticNewNodeCount(dispatch)
    // initStatisticNodeDistribution(dispatch)
  }, [dispatch])

  useEffect(() => {
    getStatisticDifficultyHashRate(dispatch)
    getStatisticDifficultyUncleRate(dispatch)
    getStatisticDifficulty(dispatch)
    getStatisticHashRate(dispatch)
    getStatisticUncleRate(dispatch)
    getStatisticAddressCount(dispatch)
    getStatisticCellCount(dispatch)
    getStatisticTransactionCount(dispatch)
    getStatisticTotalDaoDeposit(dispatch)
    getStatisticNewDaoDeposit(dispatch)
    // getStatisticNewDaoWithdraw(dispatch)
    getStatisticCirculationRatio(dispatch)
    getStatisticAddressBalanceRank(dispatch)
    getStatisticBalanceDistribution(dispatch)
    getStatisticTxFeeHistory(dispatch)
    getStatisticBlockTimeDistribution(dispatch)
    // getStatisticOccupiedCapacity(dispatch)
    getStatisticEpochTimeDistribution(dispatch)
    getStatisticAverageBlockTimes(dispatch)
    // getStatisticNewNodeCount(dispatch)
    // getStatisticNodeDistribution(dispatch)
  }, [dispatch])

  return (
    <Content>
      <ChartsContent>
        <ChartsTitle>{i18n.t('statistic.charts_title')}</ChartsTitle>
        {charts.map(chart => (
          <ChartsPanel key={chart.category}>
            <div className="charts__category__title">{chart.category}</div>
            <div className="charts__category__panel">
              {chart.charts.map(chart => (
                <ChartCard chartData={chart} key={chart.title} />
              ))}
            </div>
          </ChartsPanel>
        ))}
      </ChartsContent>
    </Content>
  )
}
