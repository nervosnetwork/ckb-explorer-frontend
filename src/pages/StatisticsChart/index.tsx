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
  getStatisticDifficultyHashRateUncleRate,
} from '../../service/app/statisticsChart'
import { useAppState, useDispatch } from '../../contexts/providers'
import i18n from '../../utils/i18n'
import { DifficultyHashRateChart } from './DifficultyHashRate'
import { DifficultyUncleRateChart } from './DifficultyUncleRate'
import { TransactionCountChart } from './TransactionCount'
import { AddressCountChart } from './AddressCount'
import { CellCountChart } from './CellCount'
import { TotalDaoDepositChart } from './TotalDaoDeposit'
import { ChartsPanel, ChartCardPanel } from './styled'
import { AddressBalanceRankChart } from './AddressBalanceRank'
import { DifficultyChart } from './Difficulty'
import { HashRateChart } from './HashRate'

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
    statisticDifficultyHashRateUncleRates,
    statisticAddressCounts,
    statisticTotalDaoDeposits,
    statisticCellCounts,
    statisticTransactionCounts,
    statisticAddressBalanceRanks,
  } = useAppState()

  const charts: ChartData[] = [
    {
      title: `${i18n.t('block.difficulty')} & ${i18n.t('block.hash_rate')}`,
      chart: <DifficultyHashRateChart statisticDifficultyHashRates={statisticDifficultyHashRates} isThumbnail />,
      path: '/charts/difficulty_hash_rate',
    },
    {
      title: `${i18n.t('block.difficulty')} & ${i18n.t('block.uncle_rate')}`,
      chart: <DifficultyUncleRateChart statisticDifficultyUncleRates={statisticDifficultyUncleRates} isThumbnail />,
      path: '/charts/difficulty_uncle_rate',
    },
    {
      title: `${i18n.t('block.difficulty')}`,
      chart: (
        <DifficultyChart statisticDifficultyHashRateUncleRates={statisticDifficultyHashRateUncleRates} isThumbnail />
      ),
      path: '/charts/difficulty',
    },
    {
      title: `${i18n.t('block.hash_rate')}`,
      chart: (
        <HashRateChart statisticDifficultyHashRateUncleRates={statisticDifficultyHashRateUncleRates} isThumbnail />
      ),
      path: '/charts/hash_rate',
    },
    {
      title: `${i18n.t('statistic.transaction_count')}`,
      chart: <TransactionCountChart statisticTransactionCounts={statisticTransactionCounts} isThumbnail />,
      path: '/charts/transaction_count',
    },
    {
      title: `${i18n.t('statistic.address_count')}`,
      chart: <AddressCountChart statisticAddressCounts={statisticAddressCounts} isThumbnail />,
      path: '/charts/address_count',
    },
    {
      title: i18n.t('statistic.cell_count'),
      chart: <CellCountChart statisticCellCounts={statisticCellCounts} isThumbnail />,
      path: '/charts/cell_count',
    },
    {
      title: `${i18n.t('statistic.total_dao_deposit')}`,
      chart: <TotalDaoDepositChart statisticTotalDaoDeposits={statisticTotalDaoDeposits} isThumbnail />,
      path: '/charts/total_dao_deposit',
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
      path: '/charts/address_balance_rank',
    },
  ]

  useEffect(() => {
    getStatisticDifficultyHashRate(dispatch)
    getStatisticDifficultyUncleRate(dispatch)
    getStatisticDifficultyHashRateUncleRate(dispatch)
    getStatisticAddressCount(dispatch)
    getStatisticCellCount(dispatch)
    getStatisticTransactionCount(dispatch)
    getStatisticTotalDaoDeposit(dispatch)
    getStatisticAddressBalanceRank(dispatch)
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
