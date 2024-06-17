import { ReactNode } from 'react'
import 'default-passive-events'
import { useTranslation } from 'react-i18next'
import Content from '../../components/Content'
import { isMainnet } from '../../utils/chain'
import { DifficultyHashRateChart } from './mining/DifficultyHashRate'
import { DifficultyUncleRateEpochChart } from './mining/DifficultyUncleRateEpoch'
import { TransactionCountChart } from './activities/TransactionCount'
import { AddressCountChart } from './activities/AddressCount'
import { CellCountChart } from './activities/CellCount'
import { CkbHodlWaveChart } from './activities/CkbHodlWave'
import { TotalDaoDepositChart } from './nervosDao/TotalDaoDeposit'
import { ChartsPanel, ChartCardPanel, ChartsTitle, ChartsContent } from './styled'
import { AddressBalanceRankChart } from './activities/AddressBalanceRank'
import { DifficultyChart } from './mining/Difficulty'
import { HashRateChart } from './mining/HashRate'
import { UncleRateChart } from './mining/UncleRate'
import { BalanceDistributionChart } from './activities/BalanceDistribution'
import { ContractResourceDistributedChart } from './activities/ContractResourceDistributed'
import { TxFeeHistoryChart } from './activities/TxFeeHistory'
import { BlockTimeDistributionChart } from './block/BlockTimeDistribution'
import { EpochTimeDistributionChart } from './block/EpochTimeDistribution'
import { NewDaoDepositChart } from './nervosDao/NewDaoDeposit'
import { CirculationRatioChart } from './nervosDao/CirculationRatio'
import { AverageBlockTimeChart } from './block/AverageBlockTime'
import { TotalSupplyChart } from './monetary/TotalSupply'
import { AnnualPercentageCompensationChart } from './monetary/AnnualPercentageCompensation'
import { SecondaryIssuanceChart } from './monetary/SecondaryIssuance'
import { InflationRateChart } from './monetary/InflationRate'
import { LiquidityChart } from './monetary/Liquidity'
import { MinerAddressDistributionChart } from './mining/MinerAddressDistribution'
import { MinerVersionDistributionChart } from './mining/MinerVersionDistribution'
import { NodeCountryDistributionChart } from './mining/NodeCountryDistribution'
import NodeGeoDistributionChart from './mining/NodeGeoDistribution'
import { useIsMobile } from '../../hooks'
import { HelpTip } from '../../components/HelpTip'
import { Link } from '../../components/Link'

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
  <div className="chartCardTitlePenal">
    <div className="chartCardTitle">{chartData.title}</div>
    {chartData.description && (
      <HelpTip placement="bottom" title={chartData.description} iconProps={{ alt: 'chart help' }} />
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
        <div className="chartCardBody">{chartData.chart}</div>
      </Link>
    </ChartCardPanel>
  )
}

const useChartsData = () => {
  const { t } = useTranslation()
  return (): ChartCategory[] => [
    {
      category: t('statistic.category_activities'),
      charts: [
        {
          title: `${t('statistic.top_50_holders')}`,
          chart: <AddressBalanceRankChart isThumbnail />,
          path: '/charts/address-balance-rank',
          description: t('statistic.balance_ranking_description'),
        },
        {
          title: `${t('statistic.transaction_count')}`,
          chart: <TransactionCountChart isThumbnail />,
          path: '/charts/transaction-count',
        },
        {
          title: `${t('statistic.address_count')}`,
          chart: <AddressCountChart isThumbnail />,
          path: '/charts/address-count',
          description: t('statistic.address_count_description_description'),
        },
        {
          title: t('statistic.cell_count'),
          chart: <CellCountChart isThumbnail />,
          path: '/charts/cell-count',
        },
        ...(isMainnet()
          ? [
              {
                title: t('statistic.ckb_hodl_wave'),
                chart: <CkbHodlWaveChart isThumbnail />,
                path: '/charts/ckb-hodl-wave',
              },
            ]
          : []),
        {
          title: `${t('statistic.balance_distribution')}`,
          chart: <BalanceDistributionChart isThumbnail />,
          path: '/charts/balance-distribution',
          description: t('statistic.balance_distribution_description'),
        },
        {
          title: `${t('statistic.tx_fee_history')}`,
          chart: <TxFeeHistoryChart isThumbnail />,
          path: '/charts/tx-fee-history',
          description: t('statistic.tx_fee_description'),
        },
        {
          title: `${t('statistic.contract_resource_distributed')}`,
          chart: <ContractResourceDistributedChart isThumbnail />,
          path: '/charts/contract-resource-distributed',
          description: t('statistic.contract_resource_distributed_description'),
        },
      ],
    },
    {
      category: t('statistic.category_block'),
      charts: [
        {
          title: `${t('statistic.block_time_distribution')}`,
          chart: <BlockTimeDistributionChart isThumbnail />,
          path: '/charts/block-time-distribution',
          description: t('statistic.block_time_distribution_description'),
        },
        {
          title: `${t('statistic.epoch_time_distribution')}`,
          chart: <EpochTimeDistributionChart isThumbnail />,
          path: '/charts/epoch-time-distribution',
          description: t('statistic.epoch_time_distribution_description'),
        },
        {
          title: `${t('statistic.average_block_time')}`,
          chart: <AverageBlockTimeChart isThumbnail />,
          path: '/charts/average-block-time',
          description: t('statistic.average_block_time_description'),
        },
      ],
    },
    {
      category: t('statistic.category_mining'),
      charts: [
        {
          title: `${t('block.difficulty')} & ${t('block.hash_rate')} & ${t('block.uncle_rate')}`,
          chart: <DifficultyHashRateChart isThumbnail />,
          path: '/charts/difficulty-hash-rate',
        },
        {
          title: `${t('block.epoch_time')} & ${t('block.epoch_length')}`,
          chart: <DifficultyUncleRateEpochChart isThumbnail />,
          path: '/charts/epoch-time-length',
        },
        {
          title: `${t('block.difficulty')}`,
          chart: <DifficultyChart isThumbnail />,
          path: '/charts/difficulty',
        },
        {
          title: `${t('block.hash_rate')}`,
          chart: <HashRateChart isThumbnail />,
          path: '/charts/hash-rate',
          description: t('glossary.hash_rate'),
        },
        {
          title: `${t('block.uncle_rate')}`,
          chart: <UncleRateChart isThumbnail />,
          path: '/charts/uncle-rate',
          description: t('statistic.uncle_rate_description'),
        },
        {
          title: `${t('statistic.miner_addresses_rank')}`,
          chart: <MinerAddressDistributionChart isThumbnail />,
          path: '/charts/miner-address-distribution',
        },
        {
          title: `${t('statistic.miner_version_distribution')}`,
          chart: <MinerVersionDistributionChart isThumbnail />,
          path: '/charts/miner-version-distribution',
        },
        {
          title: `${t('statistic.node_country_distribution')}`,
          chart: <NodeCountryDistributionChart isThumbnail />,
          path: '/charts/node-country-distribution',
        },
        {
          title: `${t('statistic.node_geo_distribution')}`,
          chart: <NodeGeoDistributionChart isThumbnail />,
          path: '/charts/node-geo-distribution',
        },
      ],
    },
    {
      category: t('blockchain.nervos_dao'),
      charts: [
        {
          title: `${t('statistic.total_dao_deposit_title')}`,
          chart: <TotalDaoDepositChart isThumbnail />,
          path: '/charts/total-dao-deposit',
          description: t('statistic.total_dao_deposit_description'),
        },
        {
          title: `${t('statistic.new_dao_deposit_title')}`,
          chart: <NewDaoDepositChart isThumbnail />,
          path: '/charts/new-dao-deposit',
        },
        {
          title: `${t('statistic.circulation_ratio')}`,
          chart: <CirculationRatioChart isThumbnail />,
          path: '/charts/circulation-ratio',
          description: t('statistic.deposit_to_circulation_ratio_description'),
        },
      ],
    },
    {
      category: t('statistic.category_monetary'),
      charts: [
        {
          title: `${t('statistic.total_supply')}`,
          chart: <TotalSupplyChart isThumbnail />,
          path: '/charts/total-supply',
          description: t('statistic.total_supply_description'),
        },
        {
          title: `${t('statistic.nominal_apc')}`,
          chart: <AnnualPercentageCompensationChart isThumbnail />,
          path: '/charts/nominal-apc',
          description: t('statistic.nominal_rpc_description'),
        },
        {
          title: `${t('nervos_dao.secondary_issuance')}`,
          chart: <SecondaryIssuanceChart isThumbnail />,
          path: '/charts/secondary-issuance',
          description: t('statistic.secondary_issuance_description'),
        },
        {
          title: `${t('statistic.inflation_rate')}`,
          chart: <InflationRateChart isThumbnail />,
          path: '/charts/inflation-rate',
          description: t('statistic.inflation_rate_description'),
        },
        {
          title: `${t('statistic.liquidity')}`,
          chart: <LiquidityChart isThumbnail />,
          path: '/charts/liquidity',
        },
      ],
    },
  ]
}

export default () => {
  const { t } = useTranslation()
  const chartsData = useChartsData()
  return (
    <Content>
      <ChartsContent className="container">
        <ChartsTitle>{t('statistic.charts_title')}</ChartsTitle>
        {chartsData().map(chartData => (
          <ChartsPanel key={chartData.category}>
            <div className="chartsCategoryTitle">{chartData.category}</div>
            <div className="chartsCategoryPanel">
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
