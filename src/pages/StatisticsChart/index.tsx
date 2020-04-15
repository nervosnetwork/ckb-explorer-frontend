import React, { useEffect, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import 'default-passive-events'
import Content from '../../components/Content'
import {
  getStatisticDifficultyHashRate,
  getStatisticDifficultyUncleRate,
  getStatisticAddressCount,
  getStatisticCellCount,
  getStatisticTransactionCount,
  getStatisticTotalDaoDeposit,
  getStatisticAddressBalanceRank,
  getStatisticDifficulty,
  getStatisticHashRate,
  getStatisticUncleRate,
  getStatisticBalanceDistribution,
} from '../../service/app/statisticsChart'
import { useAppState, useDispatch } from '../../contexts/providers'
import i18n from '../../utils/i18n'
import { DifficultyHashRateChart, initStatisticDifficultyHashRate } from './DifficultyHashRate'
import { DifficultyUncleRateChart, initStatisticDifficultyUncleRate } from './DifficultyUncleRate'
import { TransactionCountChart, initStatisticTransactionCount } from './TransactionCount'
import { AddressCountChart, initStatisticAddressCount } from './AddressCount'
import { CellCountChart, initStatisticCellCount } from './CellCount'
import { TotalDaoDepositChart, initStatisticTotalDaoDeposit } from './TotalDaoDeposit'
import { ChartsPanel, ChartCardPanel } from './styled'
import { AddressBalanceRankChart, initStatisticAddressBalanceRanks } from './AddressBalanceRank'
import { DifficultyChart, initStatisticDifficulty } from './Difficulty'
import { HashRateChart, initStatisticHashRate } from './HashRate'
import { UncleRateChart, initStatisticUncleRate } from './UncleRate'
import { BalanceDistributionChart, initStatisticBalanceDistribution } from './BalanceDistribution'

interface ChartData {
  title: string
  chart: ReactNode
  path: string
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
    statisticCellCounts,
    statisticTransactionCounts,
    statisticAddressBalanceRanks,
    statisticBalanceDistributions,
  } = useAppState()

  const charts: ChartData[] = [
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
      title: `${i18n.t('statistic.total_dao_deposit')}`,
      chart: <TotalDaoDepositChart statisticTotalDaoDeposits={statisticTotalDaoDeposits} isThumbnail />,
      path: '/charts/total-dao-deposit',
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
    initStatisticAddressBalanceRanks(dispatch)
    initStatisticBalanceDistribution(dispatch)
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
    getStatisticAddressBalanceRank(dispatch)
    getStatisticBalanceDistribution(dispatch)
  }, [dispatch])

  return (
    <Content>
      <ChartsPanel>
        {charts.map(chart => (
          <ChartCard chartData={chart} key={chart.title} />
        ))}
      </ChartsPanel>
    </Content>
  )
}
