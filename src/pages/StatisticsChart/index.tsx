import React, { useEffect, useContext, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import Content from '../../components/Content'
import {
  getStatisticDifficultyHashRate,
  getStatisticDifficultyUncleRate,
  getStatisticAddressCount,
  getStatisticCellCount,
  getStatisticTransactionCount,
  getStatisticTotalDaoDeposit,
} from '../../service/app/statisticsChart'
import { StateWithDispatch } from '../../contexts/providers/reducer'
import { AppContext } from '../../contexts/providers'
import i18n from '../../utils/i18n'
import { DifficultyHashRateChart } from './DifficultyHashRate'
import { DifficultyUncleRateChart } from './DifficultyUncleRate'
import { TransactionCountChart } from './TransactionCount'
import { AddressCountChart } from './AddressCount'
import { CellCountChart } from './CellCount'
import { TotalDaoDepositChart } from './TotalDaoDeposit'
import { ChartsPanel, ChartCardPanel } from './styled'

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

export default ({ dispatch }: React.PropsWithoutRef<StateWithDispatch>) => {
  const {
    statisticDifficultyHashRates,
    statisticDifficultyUncleRates,
    statisticAddressCounts,
    statisticTotalDaoDeposits,
    statisticCellCounts,
    statisticTransactionCounts,
  } = useContext(AppContext)

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
  ]

  useEffect(() => {
    getStatisticDifficultyHashRate(dispatch)
    getStatisticDifficultyUncleRate(dispatch)
    getStatisticAddressCount(dispatch)
    getStatisticCellCount(dispatch)
    getStatisticTransactionCount(dispatch)
    getStatisticTotalDaoDeposit(dispatch)
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
