import { useEffect, useRef, Suspense, lazy } from 'react'
import { BrowserRouter as Router, Route, Redirect, Switch, useLocation } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import Page from '../components/Page'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Sheet from '../components/Sheet'

import { useDispatch, useAppState } from '../contexts/providers'
import { ComponentActions } from '../contexts/actions'
import { isMobile } from '../utils/screen'
import { isChainTypeError, isMainnet } from '../utils/chain'
import Alert from '../components/Alert'
import CONFIG from '../config'

const Home = lazy(() => import('../pages/Home'))
const Block = lazy(() => import('../pages/BlockDetail'))
const BlockList = lazy(() => import('../pages/BlockList'))
const Transaction = lazy(() => import('../pages/Transaction'))
const TransactionList = lazy(() => import('../pages/TransactionList'))
const Address = lazy(() => import('../pages/Address'))
const SimpleUDT = lazy(() => import('../pages/SimpleUDT'))
const NervosDao = lazy(() => import('../pages/NervosDao'))
const NotFoundPage = lazy(() => import('../pages/404'))
const SearchFail = lazy(() => import('../pages/SearchFail'))
const StatisticsChart = lazy(() => import('../pages/StatisticsChart'))
const Tokens = lazy(() => import('../pages/Tokens'))
const DifficultyHashRateChart = lazy(() => import('../pages/StatisticsChart/mining/DifficultyHashRate'))
const DifficultyUncleRateEpochChart = lazy(() => import('../pages/StatisticsChart/mining/DifficultyUncleRateEpoch'))
const DifficultyChart = lazy(() => import('../pages/StatisticsChart/mining/Difficulty'))
const HashRateChart = lazy(() => import('../pages/StatisticsChart/mining/HashRate'))
const UncleRateChart = lazy(() => import('../pages/StatisticsChart/mining/UncleRate'))
const MinerAddressDistributionChart = lazy(() => import('../pages/StatisticsChart/mining/MinerAddressDistribution'))
const TransactionCountChart = lazy(() => import('../pages/StatisticsChart/activities/TransactionCount'))
const AddressCountChart = lazy(() => import('../pages/StatisticsChart/activities/AddressCount'))
const CellCountChart = lazy(() => import('../pages/StatisticsChart/activities/CellCount'))
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

const Containers: CustomRouter.Route[] = [
  {
    name: 'Home',
    path: '/',
    exact: true,
    comp: Home,
  },
  {
    name: 'BlockList',
    path: '/block/list',
    exact: true,
    comp: BlockList,
  },
  {
    name: 'Address',
    path: '/address/:address',
    exact: true,
    comp: Address,
  },
  {
    name: 'Block',
    path: '/block/:param',
    exact: true,
    comp: Block,
  },
  {
    name: 'TransactionList',
    path: '/transaction/list',
    exact: true,
    comp: TransactionList,
  },
  {
    name: 'Transaction',
    path: '/transaction/:hash',
    exact: true,
    comp: Transaction,
  },
  {
    name: 'SimpleUDT',
    path: '/sudt/:hash',
    exact: true,
    comp: SimpleUDT,
  },
  {
    name: 'NervosDao',
    path: '/nervosdao',
    exact: true,
    comp: NervosDao,
  },
  {
    name: 'Tokens',
    path: '/tokens',
    exact: true,
    comp: Tokens,
  },
  {
    name: 'Charts',
    path: '/charts',
    exact: true,
    comp: StatisticsChart,
  },
  {
    name: 'DifficultyHashRateChart',
    path: '/charts/difficulty-hash-rate',
    exact: true,
    comp: DifficultyHashRateChart,
  },
  {
    name: 'DifficultyUncleRateEpochChart',
    path: '/charts/difficulty-uncle-rate',
    exact: true,
    comp: DifficultyUncleRateEpochChart,
  },
  {
    name: 'DifficultyChart',
    path: '/charts/difficulty',
    exact: true,
    comp: DifficultyChart,
  },
  {
    name: 'HashRateChart',
    path: '/charts/hash-rate',
    exact: true,
    comp: HashRateChart,
  },
  {
    name: 'UncleRateChart',
    path: '/charts/uncle-rate',
    exact: true,
    comp: UncleRateChart,
  },
  {
    name: 'MinerAddressDistributionChart',
    path: '/charts/miner-address-distribution',
    exact: true,
    comp: MinerAddressDistributionChart,
  },
  {
    name: 'TransactionCountChart',
    path: '/charts/transaction-count',
    exact: true,
    comp: TransactionCountChart,
  },
  {
    name: 'AddressCountChart',
    path: '/charts/address-count',
    exact: true,
    comp: AddressCountChart,
  },
  {
    name: 'TotalDaoDepositChart',
    path: '/charts/total-dao-deposit',
    exact: true,
    comp: TotalDaoDepositChart,
  },
  {
    name: 'NewDaoDepositChart',
    path: '/charts/new-dao-deposit',
    exact: true,
    comp: NewDaoDepositChart,
  },
  {
    name: 'CirculationRatioChart',
    path: '/charts/circulation-ratio',
    exact: true,
    comp: CirculationRatioChart,
  },
  {
    name: 'CellCountChart',
    path: '/charts/cell-count',
    exact: true,
    comp: CellCountChart,
  },
  {
    name: 'AddressBalanceRankChart',
    path: '/charts/address-balance-rank',
    exact: true,
    comp: AddressBalanceRankChart,
  },
  {
    name: 'BalanceDistributionChart',
    path: '/charts/balance-distribution',
    exact: true,
    comp: BalanceDistributionChart,
  },
  {
    name: 'TxFeeHistoryChart',
    path: '/charts/tx-fee-history',
    exact: true,
    comp: TxFeeHistoryChart,
  },
  {
    name: 'BlockTimeDistributionChart',
    path: '/charts/block-time-distribution',
    exact: true,
    comp: BlockTimeDistributionChart,
  },
  {
    name: 'AverageBlockTimeChart',
    path: '/charts/average-block-time',
    exact: true,
    comp: AverageBlockTimeChart,
  },
  {
    name: 'EpochTimeDistributionChart',
    path: '/charts/epoch-time-distribution',
    exact: true,
    comp: EpochTimeDistributionChart,
  },
  {
    name: 'TotalSupplyChart',
    path: '/charts/total-supply',
    exact: true,
    comp: TotalSupplyChart,
  },
  {
    name: 'AnnualPercentageCompensationChart',
    path: '/charts/nominal-apc',
    exact: true,
    comp: AnnualPercentageCompensationChart,
  },
  {
    name: 'SecondaryIssuanceChart',
    path: '/charts/secondary-issuance',
    exact: true,
    comp: SecondaryIssuanceChart,
  },
  {
    name: 'InflationRateChart',
    path: '/charts/inflation-rate',
    exact: true,
    comp: InflationRateChart,
  },
  {
    name: 'LiquidityChart',
    path: '/charts/liquidity',
    exact: true,
    comp: LiquidityChart,
  },
  {
    name: 'SearchFail',
    path: '/search/fail',
    exact: true,
    comp: SearchFail,
  },
  {
    name: '404',
    path: '/404',
    exact: true,
    comp: NotFoundPage,
  },
]

const useRouter = (callback: Function) => {
  const history = createBrowserHistory()
  useEffect(() => {
    let currentUrl = `${history.location.pathname}${history.location.search}`
    const listen = history.listen((location: any) => {
      if (currentUrl !== `${location.pathname}${location.search}`) {
        callback()
      }
      currentUrl = `${location.pathname}${location.search}`
    })
    return () => {
      listen()
    }
  }, [callback, history])
}

const useRouterLocation = (callback: () => void) => {
  const history = createBrowserHistory()
  const savedCallback = useRef(() => {})
  useEffect(() => {
    savedCallback.current = callback
  })
  useEffect(() => {
    const currentCallback = () => {
      savedCallback.current()
    }
    const listen = history.listen(() => {
      currentCallback()
    })
    return () => {
      listen()
    }
  }, [history])
}

const RouterComp = ({ container, routeProps }: { container: CustomRouter.Route; routeProps: any }) => {
  const { pathname = '' } = useLocation()
  if (container.name === 'Address' && isChainTypeError(pathname.substring(pathname.lastIndexOf('/') + 1))) {
    return <SearchFail {...routeProps} address={pathname.substring(pathname.lastIndexOf('/') + 1)} />
  }
  return <container.comp {...routeProps} />
}

export default () => {
  const dispatch = useDispatch()
  const { components } = useAppState()
  const { mobileMenuVisible } = components

  useRouter(() => {
    window.scrollTo(0, 0)
  })

  useRouterLocation(() => {
    if (mobileMenuVisible) {
      dispatch({
        type: ComponentActions.UpdateHeaderMobileMenuVisible,
        payload: {
          mobileMenuVisible: false,
        },
      })
    }
  })

  return (
    <Router basename={isMainnet() ? '/' : `/${CONFIG.TESTNET_NAME}`}>
      <Route
        render={(props: any) => (
          <Page>
            <Alert />
            <Header />
            <Sheet />
            <Suspense fallback={<span />}>
              <Switch location={props.location}>
                {Containers.map(container => (
                  <Route
                    {...container}
                    key={container.name}
                    render={routeProps => <RouterComp container={container} routeProps={routeProps} />}
                  />
                ))}
                <Redirect from="*" to="/404" />
              </Switch>
              {!(isMobile() && mobileMenuVisible) && <Footer />}
            </Suspense>
          </Page>
        )}
      />
    </Router>
  )
}
