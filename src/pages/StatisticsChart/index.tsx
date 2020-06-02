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
  getStatisticMinerAddressDistribution,
} from '../../service/app/charts/mining'
import {
  getStatisticTotalDaoDeposit,
  getStatisticNewDaoDeposit,
  getStatisticCirculationRatio,
} from '../../service/app/charts/nervosDao'
import { useAppState, useDispatch } from '../../contexts/providers'
import i18n from '../../utils/i18n'
import HelpIcon from '../../assets/qa_help.png'
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
import { BlockTimeDistributionChart } from './block/BlockTimeDistribution'
import {
  getStatisticBlockTimeDistribution,
  getStatisticEpochTimeDistribution,
  getStatisticAverageBlockTimes,
} from '../../service/app/charts/block'
import { EpochTimeDistributionChart } from './block/EpochTimeDistribution'
import { NewDaoDepositChart, initStatisticNewDaoDeposit } from './nervosDao/NewDaoDeposit'
import { CirculationRatioChart, initStatisticCirculationRatio } from './nervosDao/CirculationRatio'
import { AverageBlockTimeChart } from './block/AverageBlockTime'
import { TotalSupplyChart, initStatisticTotalSupply } from './monetary/TotalSupply'
import {
  getStatisticTotalSupply,
  getStatisticAnnualPercentageCompensation,
  getStatisticSecondaryIssuance,
  getStatisticInflationRate,
  getStatisticLiquidity,
} from '../../service/app/charts/monetary'
import {
  AnnualPercentageCompensationChart,
  initStatisticAnnualPercentageCompensation,
} from './monetary/AnnualPercentageCompensation'
import { SecondaryIssuanceChart, initStatisticSecondaryIssuance } from './monetary/SecondaryIssuance'
import { InflationRateChart, initStatisticInflationRate } from './monetary/InflationRate'
import { LiquidityChart, initStatisticLiquidity } from './monetary/Liquidity'
import { MinerAddressDistributionChart, initStatisticMinerAddressDistribution } from './mining/MinerAddressDistribution'
import { Tooltip } from 'antd'
import { isMobile } from '../../utils/screen'

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

const ChartTitle = ({ chartData }: { chartData: ChartData }) => {
  return (
    <div className="chart__card__title__penal">
      <div className="chart__card_title">{chartData.title}</div>
      {chartData.description && (
        <Tooltip placement="bottom" title={chartData.description}>
          <img src={HelpIcon} alt="chart help" />
        </Tooltip>
      )}
    </div>
  )
}

const ChartCard = ({ chartData }: { chartData: ChartData }) => {
  return (
    <ChartCardPanel>
      {isMobile() && <ChartTitle chartData={chartData} />}
      <Link to={chartData.path}>
        {!isMobile() && <ChartTitle chartData={chartData} />}
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
    statisticMinerAddresses,
    statisticAddressCounts,
    statisticTotalDaoDeposits,
    statisticNewDaoDeposits,
    statisticCirculationRatios,
    statisticCellCounts,
    statisticTransactionCounts,
    statisticAddressBalanceRanks,
    statisticBalanceDistributions,
    statisticTxFeeHistories,
    statisticTotalSupplies,
    statisticAnnualPercentageCompensations,
    statisticSecondaryIssuance,
    statisticInflationRates,
    statisticLiquidity,
  } = useAppState()

  const charts: ChartCategory[] = [
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
          description: i18n.t('statistic.uncle_rate_description'),
        },
        {
          title: `${i18n.t('statistic.miner_addresses_rank')}`,
          chart: <MinerAddressDistributionChart statisticMinerAddresses={statisticMinerAddresses} isThumbnail />,
          path: '/charts/miner-address-distribution',
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
          description: i18n.t('statistic.balance_ranking_description'),
        },
        {
          title: `${i18n.t('statistic.balance_distribution')}`,
          chart: <BalanceDistributionChart statisticBalanceDistributions={statisticBalanceDistributions} isThumbnail />,
          path: '/charts/balance-distribution',
          description: i18n.t('statistic.balance_distribution_description'),
        },
        {
          title: `${i18n.t('statistic.tx_fee_history')}`,
          chart: <TxFeeHistoryChart statisticTxFeeHistories={statisticTxFeeHistories} isThumbnail />,
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
          chart: <TotalDaoDepositChart statisticTotalDaoDeposits={statisticTotalDaoDeposits} isThumbnail />,
          path: '/charts/total-dao-deposit',
          description: i18n.t('statistic.total_dao_deposit_description'),
        },
        {
          title: `${i18n.t('statistic.new_dao_deposit_title')}`,
          chart: <NewDaoDepositChart statisticNewDaoDeposits={statisticNewDaoDeposits} isThumbnail />,
          path: '/charts/new-dao-deposit',
        },
        {
          title: `${i18n.t('statistic.circulation_ratio')}`,
          chart: <CirculationRatioChart statisticCirculationRatios={statisticCirculationRatios} isThumbnail />,
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
          chart: <TotalSupplyChart statisticTotalSupplies={statisticTotalSupplies} isThumbnail />,
          path: '/charts/total-supply',
          description: i18n.t('statistic.total_supply_description'),
        },
        {
          title: `${i18n.t('statistic.nominal_apc')}`,
          chart: (
            <AnnualPercentageCompensationChart
              statisticAnnualPercentageCompensations={statisticAnnualPercentageCompensations}
              isThumbnail
            />
          ),
          path: '/charts/nominal-apc',
          description: i18n.t('statistic.nominal_rpc_description'),
        },
        {
          title: `${i18n.t('nervos_dao.secondary_issuance')}`,
          chart: <SecondaryIssuanceChart statisticSecondaryIssuance={statisticSecondaryIssuance} isThumbnail />,
          path: '/charts/secondary-issuance',
          description: i18n.t('statistic.secondary_issuance_description'),
        },
        {
          title: `${i18n.t('statistic.inflation_rate')}`,
          chart: <InflationRateChart statisticInflationRates={statisticInflationRates} isThumbnail />,
          path: '/charts/inflation-rate',
          description: i18n.t('statistic.inflation_rate_description'),
        },
        {
          title: `${i18n.t('statistic.liquidity')}`,
          chart: <LiquidityChart statisticLiquidity={statisticLiquidity} isThumbnail />,
          path: '/charts/liquidity',
        },
      ],
    },
  ]

  useEffect(() => {
    initStatisticDifficultyHashRate(dispatch)
    initStatisticDifficultyUncleRate(dispatch)
    initStatisticDifficulty(dispatch)
    initStatisticHashRate(dispatch)
    initStatisticUncleRate(dispatch)
    initStatisticMinerAddressDistribution(dispatch)
    initStatisticAddressCount(dispatch)
    initStatisticCellCount(dispatch)
    initStatisticTransactionCount(dispatch)
    initStatisticTotalDaoDeposit(dispatch)
    initStatisticNewDaoDeposit(dispatch)
    initStatisticCirculationRatio(dispatch)
    initStatisticAddressBalanceRanks(dispatch)
    initStatisticBalanceDistribution(dispatch)
    initStatisticTxFeeHistory(dispatch)
    initStatisticTotalSupply(dispatch)
    initStatisticAnnualPercentageCompensation(dispatch)
    initStatisticSecondaryIssuance(dispatch)
    initStatisticInflationRate(dispatch)
    initStatisticLiquidity(dispatch)
  }, [dispatch])

  useEffect(() => {
    getStatisticDifficultyHashRate(dispatch)
    getStatisticDifficultyUncleRate(dispatch)
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
