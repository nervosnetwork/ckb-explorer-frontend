import { Suspense, lazy, Component, FC } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
  RouteProps,
  useRouteMatch,
  useParams,
} from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Page from '../components/Page'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { isChainTypeError } from '../utils/chain'
import { SupportedLngs } from '../utils/i18n'
import { useSyncEffect } from '../hooks'

const Home = lazy(() => import('../pages/Home'))
const Block = lazy(() => import('../pages/BlockDetail'))
const BlockList = lazy(() => import('../pages/BlockList'))
const Transaction = lazy(() => import('../pages/Transaction'))
const TransactionList = lazy(() => import('../pages/TransactionList'))
const Address = lazy(() => import('../pages/Address'))
const ScriptPage = lazy(() => import('../pages/Script'))
const UDT = lazy(() => import('../pages/UDT'))
const NftCollections = lazy(() => import('../pages/NftCollections'))
const NftCollectionInfo = lazy(() => import('../pages/NftCollectionInfo'))
const NftInfo = lazy(() => import('../pages/NftInfo'))
const NervosDao = lazy(() => import('../pages/NervosDao'))
const NotFoundPage = lazy(() => import('../pages/404'))
const ErrorPage = lazy(() => import('../pages/Error'))
const SearchFail = lazy(() => import('../pages/SearchFail'))
const StatisticsChart = lazy(() => import('../pages/StatisticsChart'))
const Tokens = lazy(() => import('../pages/Tokens'))
const Xudts = lazy(() => import('../pages/Xudts'))
const Xudt = lazy(() => import('../pages/Xudt'))
const Halving = lazy(() => import('../pages/Halving'))
const DifficultyHashRateChart = lazy(() => import('../pages/StatisticsChart/mining/DifficultyHashRate'))
const DifficultyUncleRateEpochChart = lazy(() => import('../pages/StatisticsChart/mining/DifficultyUncleRateEpoch'))
const DifficultyChart = lazy(() => import('../pages/StatisticsChart/mining/Difficulty'))
const HashRateChart = lazy(() => import('../pages/StatisticsChart/mining/HashRate'))
const UncleRateChart = lazy(() => import('../pages/StatisticsChart/mining/UncleRate'))
const MinerAddressDistributionChart = lazy(() => import('../pages/StatisticsChart/mining/MinerAddressDistribution'))
const MinerVersionDistributionChart = lazy(() => import('../pages/StatisticsChart/mining/MinerVersionDistribution'))
const TransactionCountChart = lazy(() => import('../pages/StatisticsChart/activities/TransactionCount'))
const AddressCountChart = lazy(() => import('../pages/StatisticsChart/activities/AddressCount'))
const CellCountChart = lazy(() => import('../pages/StatisticsChart/activities/CellCount'))
const ContractResourceDistributedChart = lazy(
  () => import('../pages/StatisticsChart/activities/ContractResourceDistributed'),
)
const AddressBalanceRankChart = lazy(() => import('../pages/StatisticsChart/activities/AddressBalanceRank'))
const BalanceDistributionChart = lazy(() => import('../pages/StatisticsChart/activities/BalanceDistribution'))
const TxFeeHistoryChart = lazy(() => import('../pages/StatisticsChart/activities/TxFeeHistory'))
const BlockTimeDistributionChart = lazy(() => import('../pages/StatisticsChart/block/BlockTimeDistribution'))
const EpochTimeDistributionChart = lazy(() => import('../pages/StatisticsChart/block/EpochTimeDistribution'))
const AverageBlockTimeChart = lazy(() => import('../pages/StatisticsChart/block/AverageBlockTime'))
const TotalDaoDepositChart = lazy(() => import('../pages/StatisticsChart/nervosDao/TotalDaoDeposit'))
const NewDaoDepositChart = lazy(() => import('../pages/StatisticsChart/nervosDao/NewDaoDeposit'))
const CirculationRatioChart = lazy(() => import('../pages/StatisticsChart/nervosDao/CirculationRatio'))
const TotalSupplyChart = lazy(() => import('../pages/StatisticsChart/monetary/TotalSupply'))
const AnnualPercentageCompensationChart = lazy(
  () => import('../pages/StatisticsChart/monetary/AnnualPercentageCompensation'),
)
const SecondaryIssuanceChart = lazy(() => import('../pages/StatisticsChart/monetary/SecondaryIssuance'))
const InflationRateChart = lazy(() => import('../pages/StatisticsChart/monetary/InflationRate'))
const LiquidityChart = lazy(() => import('../pages/StatisticsChart/monetary/Liquidity'))
const ScriptList = lazy(() => import('../pages/ScriptList'))
const FeeRateTracker = lazy(() => import('../pages/FeeRateTracker'))
const ExportTransactions = lazy(() => import('../pages/ExportTransactions'))

const routes: RouteProps[] = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/halving',
    component: Halving,
  },
  {
    path: '/block/list',
    component: BlockList,
  },
  {
    path: '/address/:address',
    render: routeProps => {
      const { pathname } = routeProps.location
      if (isChainTypeError(pathname.substring(pathname.lastIndexOf('/') + 1))) {
        return <SearchFail {...routeProps} address={pathname.substring(pathname.lastIndexOf('/') + 1)} />
      }
      return <Address />
    },
  },
  {
    path: '/script/:codeHash/:hashType/:tab?',
    component: ScriptPage,
  },
  {
    path: '/block/:param',
    component: Block,
  },
  {
    path: '/transaction/list',
    component: TransactionList,
  },
  {
    path: '/transaction/:hash',
    component: Transaction,
  },
  {
    path: '/xudt/:hash',
    component: Xudt,
  },
  {
    path: '/sudt/:hash',
    component: UDT,
  },
  {
    path: '/inscription/:hash',
    render: routeProps => {
      return <UDT {...routeProps} isInscription />
    },
  },
  {
    path: '/nft-collections',
    component: NftCollections,
  },
  {
    path: '/nft-collections/:id',
    component: NftCollectionInfo,
  },
  {
    path: '/nft-info/:collection/:id',
    component: NftInfo,
  },
  {
    path: '/nervosdao',
    component: NervosDao,
  },
  {
    path: '/xudts',
    component: Xudts,
  },
  {
    path: '/tokens',
    component: Tokens,
  },
  {
    path: '/inscriptions',
    render: routeProps => {
      return <Tokens {...routeProps} isInscription />
    },
  },
  {
    path: '/charts',
    component: StatisticsChart,
  },
  {
    path: '/charts/difficulty-hash-rate',
    component: DifficultyHashRateChart,
  },
  {
    path: '/charts/epoch-time-length',
    component: DifficultyUncleRateEpochChart,
  },
  {
    path: '/charts/difficulty',
    component: DifficultyChart,
  },
  {
    path: '/charts/hash-rate',
    component: HashRateChart,
  },
  {
    path: '/charts/uncle-rate',
    component: UncleRateChart,
  },
  {
    path: '/charts/miner-address-distribution',
    component: MinerAddressDistributionChart,
  },
  {
    path: '/charts/miner-version-distribution',
    component: MinerVersionDistributionChart,
  },
  {
    path: '/charts/transaction-count',
    component: TransactionCountChart,
  },
  {
    path: '/charts/address-count',
    component: AddressCountChart,
  },
  {
    path: '/charts/total-dao-deposit',
    component: TotalDaoDepositChart,
  },
  {
    path: '/charts/new-dao-deposit',
    component: NewDaoDepositChart,
  },
  {
    path: '/charts/circulation-ratio',
    component: CirculationRatioChart,
  },
  {
    path: '/charts/cell-count',
    component: CellCountChart,
  },
  {
    path: '/charts/address-balance-rank',
    component: AddressBalanceRankChart,
  },
  {
    path: '/charts/balance-distribution',
    component: BalanceDistributionChart,
  },
  {
    path: '/charts/tx-fee-history',
    component: TxFeeHistoryChart,
  },
  {
    path: '/charts/contract-resource-distributed',
    component: ContractResourceDistributedChart,
  },

  {
    path: '/charts/block-time-distribution',
    component: BlockTimeDistributionChart,
  },
  {
    path: '/charts/average-block-time',
    component: AverageBlockTimeChart,
  },
  {
    path: '/charts/epoch-time-distribution',
    component: EpochTimeDistributionChart,
  },
  {
    path: '/charts/total-supply',
    component: TotalSupplyChart,
  },
  {
    path: '/charts/nominal-apc',
    component: AnnualPercentageCompensationChart,
  },
  {
    path: '/charts/secondary-issuance',
    component: SecondaryIssuanceChart,
  },
  {
    path: '/charts/inflation-rate',
    component: InflationRateChart,
  },
  {
    path: '/charts/liquidity',
    component: LiquidityChart,
  },
  {
    path: '/search/fail',
    component: SearchFail,
  },
  {
    path: '/scripts',
    component: ScriptList,
  },
  {
    path: '/fee-rate-tracker',
    component: FeeRateTracker,
  },
  {
    path: '/404',
    component: NotFoundPage,
  },
  {
    path: '/error',
    component: ErrorPage,
  },
  {
    path: '/export-transactions',
    component: ExportTransactions,
  },
]

type PageErrorBoundaryState = {
  error?: Error | null
  info: {
    componentStack?: string
  }
}

type PageErrorBoundaryProps = React.PropsWithChildren<{}>

class PageErrorBoundary extends Component<PageErrorBoundaryProps, PageErrorBoundaryState> {
  constructor(props: PageErrorBoundaryProps) {
    super(props)

    this.state = {
      error: null,
      info: {
        componentStack: '',
      },
    }
  }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  // TODO Take note that it is possible for components outside the PageErrorBoundary to trigger a change in children, resulting in unknown issues.
  componentDidUpdate(prevProps: PageErrorBoundaryProps) {
    if (prevProps !== this.props) {
      this.setState({ error: null, info: { componentStack: '' } })
    }
  }

  componentDidCatch(error: Error | null, info: React.ErrorInfo) {
    this.setState({ error, info })
  }

  render() {
    const { error, info } = this.state
    const { children } = this.props

    if (error) {
      return <ErrorPage errorMessage={error.toString()} errorDescription={info.componentStack} />
    }

    return children
  }
}

const ComponentInContextProvided: FC = () => {
  const [, i18n] = useTranslation()
  const { path } = useRouteMatch()
  // TODO: The default value here could be automatically detected from the browser.
  const { locale = 'en' } = useParams<{ locale?: string }>()

  useSyncEffect(() => i18n.init({ lng: locale }), [i18n, locale])

  return (
    <Page>
      <Header />
      <Suspense fallback={<span />}>
        <PageErrorBoundary>
          <Switch>
            {routes.map((route, idx) => (
              // `routes` is immutable, so using idx as the key has no impact.
              // eslint-disable-next-line react/no-array-index-key
              <Route key={idx} exact {...route} path={`${path}${route.path}`} />
            ))}
            <Redirect from="*" to={`${locale != null ? `/${locale}` : ''}/404`} />
          </Switch>
        </PageErrorBoundary>
        <Footer />
      </Suspense>
    </Page>
  )
}

export default () => {
  return (
    <Router>
      <Switch>
        <Route path={`/:locale(${SupportedLngs.join('|')})?`}>
          <ComponentInContextProvided />
        </Route>
      </Switch>
    </Router>
  )
}
