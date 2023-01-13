import { useEffect, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import 'default-passive-events'
import { Tooltip } from 'antd'
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
  getStatisticDifficultyUncleRateEpoch,
  getStatisticDifficulty,
  getStatisticHashRate,
  getStatisticUncleRate,
  getStatisticMinerAddressDistribution,
} from '../../service/app/charts/mining'
import {
  getStatisticTotalDaoDeposit,
  getStatisticNewDaoDeposit,
  getStatisticCirculationRatio,
} from '../../service/app/charts/nervosDao'
import { useDispatch } from '../../contexts/providers'
import i18n from '../../utils/i18n'
import HelpIcon from '../../assets/qa_help.png'
import { DifficultyHashRateChart } from './mining/DifficultyHashRate'
import { DifficultyUncleRateEpochChart } from './mining/DifficultyUncleRateEpoch'
import { TransactionCountChart } from './activities/TransactionCount'
import { AddressCountChart } from './activities/AddressCount'
import { CellCountChart } from './activities/CellCount'
import { TotalDaoDepositChart } from './nervosDao/TotalDaoDeposit'
import { ChartsPanel, ChartCardPanel, ChartsTitle, ChartsContent } from './styled'
import { AddressBalanceRankChart } from './activities/AddressBalanceRank'
import { DifficultyChart } from './mining/Difficulty'
import { HashRateChart } from './mining/HashRate'
import { UncleRateChart } from './mining/UncleRate'
import { BalanceDistributionChart } from './activities/BalanceDistribution'
import { TxFeeHistoryChart } from './activities/TxFeeHistory'
import { BlockTimeDistributionChart } from './block/BlockTimeDistribution'
import {
  getStatisticBlockTimeDistribution,
  getStatisticEpochTimeDistribution,
  getStatisticAverageBlockTimes,
} from '../../service/app/charts/block'
import { EpochTimeDistributionChart } from './block/EpochTimeDistribution'
import { NewDaoDepositChart } from './nervosDao/NewDaoDeposit'
import { CirculationRatioChart } from './nervosDao/CirculationRatio'
import { AverageBlockTimeChart } from './block/AverageBlockTime'
import { TotalSupplyChart } from './monetary/TotalSupply'
import {
  getStatisticTotalSupply,
  getStatisticAnnualPercentageCompensation,
  getStatisticSecondaryIssuance,
  getStatisticInflationRate,
  getStatisticLiquidity,
} from '../../service/app/charts/monetary'
import { AnnualPercentageCompensationChart } from './monetary/AnnualPercentageCompensation'
import { SecondaryIssuanceChart } from './monetary/SecondaryIssuance'
import { InflationRateChart } from './monetary/InflationRate'
import { LiquidityChart } from './monetary/Liquidity'
import { MinerAddressDistributionChart } from './mining/MinerAddressDistribution'
import { useIsMobile } from '../../utils/hook'

interface ChartData {
  title: string
  chart: ReactNode
  path: string
  description?: string
}

interface ChartCategory {
  category: string
  charts: ChartData[]
}

const ChartTitle = ({ chartData }: { chartData: ChartData }) => (
  <div className="chart__card__title__penal">
    <div className="chart__card_title">{chartData.title}</div>
    {chartData.description && (
      <Tooltip placement="bottom" title={chartData.description}>
        <img src={HelpIcon} alt="chart help" />
      </Tooltip>
    )}
  </div>
)

const ChartCard = ({ chartData }: { chartData: ChartData }) => {
  const isMobile = useIsMobile()
  return (
    <ChartCardPanel>
      {isMobile && <ChartTitle chartData={chartData} />}
      <Link to={chartData.path}>
        {!isMobile && <ChartTitle chartData={chartData} />}
        <div className="chart__card_body">{chartData.chart}</div>
      </Link>
    </ChartCardPanel>
  )
}

const NullEvent = () => {}

const chartsData = (): ChartCategory[] => [
  {
    category: i18n.t('statistic.category_block'),
    charts: [
      {
        title: `${i18n.t('statistic.block_time_distribution')}`,
        chart: <BlockTimeDistributionChart isThumbnail />,
        path: '/charts/block-time-distribution',
        description: i18n.t('statistic.block_time_distribution_description'),
      },
      {
        title: `${i18n.t('statistic.epoch_time_distribution')}`,
        chart: <EpochTimeDistributionChart isThumbnail />,
        path: '/charts/epoch-time-distribution',
        description: i18n.t('statistic.epoch_time_distribution_description'),
      },
      {
        title: `${i18n.t('statistic.average_block_time')}`,
        chart: <AverageBlockTimeChart isThumbnail />,
        path: '/charts/average-block-time',
        description: i18n.t('statistic.average_block_time_description'),
      },
    ],
  },
  {
    category: i18n.t('statistic.category_mining'),
    charts: [
      {
        title: `${i18n.t('block.difficulty')} & ${i18n.t('block.hash_rate')} & ${i18n.t('block.uncle_rate')}`,
        chart: <DifficultyHashRateChart isThumbnail />,
        path: '/charts/difficulty-hash-rate',
      },
      {
        title: `${i18n.t('block.epoch_time')} & ${i18n.t('block.epoch_length')}`,
        chart: <DifficultyUncleRateEpochChart isThumbnail />,
        path: '/charts/epoch-time-length',
      },
      {
        title: `${i18n.t('block.difficulty')}`,
        chart: <DifficultyChart isThumbnail />,
        path: '/charts/difficulty',
      },
      {
        title: `${i18n.t('block.hash_rate')}`,
        chart: <HashRateChart isThumbnail />,
        path: '/charts/hash-rate',
      },
      {
        title: `${i18n.t('block.uncle_rate')}`,
        chart: <UncleRateChart isThumbnail />,
        path: '/charts/uncle-rate',
        description: i18n.t('statistic.uncle_rate_description'),
      },
      {
        title: `${i18n.t('statistic.miner_addresses_rank')}`,
        chart: <MinerAddressDistributionChart isThumbnail />,
        path: '/charts/miner-address-distribution',
      },
    ],
  },
  {
    category: i18n.t('statistic.category_activities'),
    charts: [
      {
        title: `${i18n.t('statistic.transaction_count')}`,
        chart: <TransactionCountChart isThumbnail />,
        path: '/charts/transaction-count',
      },
      {
        title: `${i18n.t('statistic.address_count')}`,
        chart: <AddressCountChart isThumbnail />,
        path: '/charts/address-count',
        description: i18n.t('statistic.address_count_description'),
      },
      {
        title: i18n.t('statistic.cell_count'),
        chart: <CellCountChart isThumbnail />,
        path: '/charts/cell-count',
      },
      {
        title: `${i18n.t('statistic.balance_ranking')}`,
        chart: <AddressBalanceRankChart clickEvent={NullEvent} isThumbnail />,
        path: '/charts/address-balance-rank',
        description: i18n.t('statistic.balance_ranking_description'),
      },
      {
        title: `${i18n.t('statistic.balance_distribution')}`,
        chart: <BalanceDistributionChart isThumbnail />,
        path: '/charts/balance-distribution',
        description: i18n.t('statistic.balance_distribution_description'),
      },
      {
        title: `${i18n.t('statistic.tx_fee_history')}`,
        chart: <TxFeeHistoryChart isThumbnail />,
        path: '/charts/tx-fee-history',
        description: i18n.t('statistic.tx_fee_description'),
      },
    ],
  },
  {
    category: i18n.t('blockchain.nervos_dao'),
    charts: [
      {
        title: `${i18n.t('statistic.total_dao_deposit_title')}`,
        chart: <TotalDaoDepositChart isThumbnail />,
        path: '/charts/total-dao-deposit',
        description: i18n.t('statistic.total_dao_deposit_description'),
      },
      {
        title: `${i18n.t('statistic.new_dao_deposit_title')}`,
        chart: <NewDaoDepositChart isThumbnail />,
        path: '/charts/new-dao-deposit',
      },
      {
        title: `${i18n.t('statistic.circulation_ratio')}`,
        chart: <CirculationRatioChart isThumbnail />,
        path: '/charts/circulation-ratio',
        description: i18n.t('statistic.deposit_to_circulation_ratio_description'),
      },
    ],
  },
  {
    category: i18n.t('statistic.category_monetary'),
    charts: [
      {
        title: `${i18n.t('statistic.total_supply')}`,
        chart: <TotalSupplyChart isThumbnail />,
        path: '/charts/total-supply',
        description: i18n.t('statistic.total_supply_description'),
      },
      {
        title: `${i18n.t('statistic.nominal_apc')}`,
        chart: <AnnualPercentageCompensationChart isThumbnail />,
        path: '/charts/nominal-apc',
        description: i18n.t('statistic.nominal_rpc_description'),
      },
      {
        title: `${i18n.t('nervos_dao.secondary_issuance')}`,
        chart: <SecondaryIssuanceChart isThumbnail />,
        path: '/charts/secondary-issuance',
        description: i18n.t('statistic.secondary_issuance_description'),
      },
      {
        title: `${i18n.t('statistic.inflation_rate')}`,
        chart: <InflationRateChart isThumbnail />,
        path: '/charts/inflation-rate',
        description: i18n.t('statistic.inflation_rate_description'),
      },
      {
        title: `${i18n.t('statistic.liquidity')}`,
        chart: <LiquidityChart isThumbnail />,
        path: '/charts/liquidity',
      },
    ],
  },
]

export default () => {
  const dispatch = useDispatch()

  useEffect(() => {
    getStatisticDifficultyHashRate(dispatch)
    getStatisticDifficultyUncleRateEpoch(dispatch)
    getStatisticDifficulty(dispatch)
    getStatisticHashRate(dispatch)
    getStatisticUncleRate(dispatch)
    getStatisticMinerAddressDistribution(dispatch)
    getStatisticAddressCount(dispatch)
    getStatisticCellCount(dispatch)
    getStatisticTransactionCount(dispatch)
    getStatisticTotalDaoDeposit(dispatch)
    getStatisticNewDaoDeposit(dispatch)
    getStatisticCirculationRatio(dispatch)
    getStatisticAddressBalanceRank(dispatch)
    getStatisticBalanceDistribution(dispatch)
    getStatisticTxFeeHistory(dispatch)
    getStatisticBlockTimeDistribution(dispatch)
    getStatisticEpochTimeDistribution(dispatch)
    getStatisticAverageBlockTimes(dispatch)
    getStatisticTotalSupply(dispatch)
    getStatisticAnnualPercentageCompensation(dispatch)
    getStatisticSecondaryIssuance(dispatch)
    getStatisticInflationRate(dispatch)
    getStatisticLiquidity(dispatch)
  }, [dispatch])

  return (
    <Content>
      <ChartsContent className="container">
        <ChartsTitle>{i18n.t('statistic.charts_title')}</ChartsTitle>
        {chartsData().map(chartData => (
          <ChartsPanel key={chartData.category}>
            <div className="charts__category__title">{chartData.category}</div>
            <div className="charts__category__panel">
              {chartData.charts.map(chart => (
                <ChartCard chartData={chart} key={chart.title} />
              ))}
            </div>
          </ChartsPanel>
        ))}
      </ChartsContent>
    </Content>
  )
}
