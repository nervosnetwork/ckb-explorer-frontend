import React, { useEffect, useRef } from 'react'
import { Router, Route, Redirect, Switch } from 'react-router-dom'
import browserHistory from './history'

import Page from '../components/Page'
import Header from '../components/Header'
import Footer from '../components/Footer'

import Home from '../pages/Home'
import Block from '../pages/BlockDetail'
import BlockList from '../pages/BlockList'
import Transaction from '../pages/Transaction'
import TransactionList from '../pages/TransactionList'
import Address from '../pages/Address'
import SimpleUDT from '../pages/SimpleUDT'
import NervosDao from '../pages/NervosDao'
import NotFoundPage from '../pages/404'
import SearchFail from '../pages/SearchFail'
import Maintain from '../pages/Maintain'
import Sheet from '../components/Sheet'
import StatisticsChart from '../pages/StatisticsChart/index'
import DifficultyHashRateChart from '../pages/StatisticsChart/mining/DifficultyHashRate'
import DifficultyUncleRateChart from '../pages/StatisticsChart/mining/DifficultyUncleRate'
import DifficultyChart from '../pages/StatisticsChart/mining/Difficulty'
import TransactionCountChart from '../pages/StatisticsChart/activities/TransactionCount'
import AddressCountChart from '../pages/StatisticsChart/activities/AddressCount'
import TotalDaoDepositChart from '../pages/StatisticsChart/nervosDao/TotalDaoDeposit'
import NewDaoDepositChart from '../pages/StatisticsChart/nervosDao/NewDaoDeposit'
import CirculationRatioChart from '../pages/StatisticsChart/nervosDao/CirculationRatio'
import CellCountChart from '../pages/StatisticsChart/activities/CellCount'
import AddressBalanceRankChart from '../pages/StatisticsChart/activities/AddressBalanceRank'
import HashRateChart from '../pages/StatisticsChart/mining/HashRate'
import UncleRateChart from '../pages/StatisticsChart/mining/UncleRate'
import { useDispatch, useAppState } from '../contexts/providers'
import { ComponentActions } from '../contexts/actions'
import { isMobile } from '../utils/screen'
import BalanceDistributionChart from '../pages/StatisticsChart/activities/BalanceDistribution'
import TxFeeHistoryChart from '../pages/StatisticsChart/activities/TxFeeHistory'
import BlockTimeDistributionChart from '../pages/StatisticsChart/block/BlockTimeDistribution'
import EpochTimeDistributionChart from '../pages/StatisticsChart/block/EpochTimeDistribution'
import AverageBlockTimeChart from '../pages/StatisticsChart/block/AverageBlockTime'

const hasSearch = (pathname: string) => {
  return pathname !== '/search/fail' && pathname !== '/maintain'
}

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
    name: 'DifficultyUncleRateChart',
    path: '/charts/difficulty-uncle-rate',
    exact: true,
    comp: DifficultyUncleRateChart,
  },
  {
    name: 'Difficulty',
    path: '/charts/difficulty',
    exact: true,
    comp: DifficultyChart,
  },
  {
    name: 'HashRate',
    path: '/charts/hash-rate',
    exact: true,
    comp: HashRateChart,
  },
  {
    name: 'UncleRate',
    path: '/charts/uncle-rate',
    exact: true,
    comp: UncleRateChart,
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
  // {
  //   name: 'NewDaoWithdrawChart',
  //   path: '/charts/new-dao-Withdraw',
  //   exact: true,
  //   comp: NewDaoWithdrawChart,
  // },
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
  // {
  //   name: 'OccupiedCapacityChart',
  //   path: '/charts/occupied-capacity',
  //   exact: true,
  //   comp: OccupiedCapacityChart,
  // },
  {
    name: 'EpochTimeDistributionChart',
    path: '/charts/epoch-time-distribution',
    exact: true,
    comp: EpochTimeDistributionChart,
  },
  // {
  //   name: 'NewNodeCountChart',
  //   path: '/charts/new-node-count',
  //   exact: true,
  //   comp: NewNodeCountChart,
  // },
  // {
  //   name: 'NodeDistributionChart',
  //   path: '/charts/node-distribution',
  //   exact: true,
  //   comp: NodeDistributionChart,
  // },
  {
    name: 'SearchFail',
    path: '/search/fail',
    exact: true,
    comp: SearchFail,
  },
  {
    name: 'Maintain',
    path: '/maintain',
    exact: true,
    comp: Maintain,
  },
  {
    name: '404',
    path: '/404',
    exact: true,
    comp: NotFoundPage,
  },
]

const useRouter = (callback: Function) => {
  useEffect(() => {
    let currentUrl = `${browserHistory.location.pathname}${browserHistory.location.search}`
    const listen = browserHistory.listen((location: any) => {
      if (currentUrl !== `${location.pathname}${location.search}`) {
        callback()
      }
      currentUrl = `${location.pathname}${location.search}`
    })
    return () => {
      listen()
    }
  }, [callback])
}

const useRouterLocation = (callback: () => void) => {
  const savedCallback = useRef(() => {})
  useEffect(() => {
    savedCallback.current = callback
  })
  useEffect(() => {
    const currentCallback = () => {
      savedCallback.current()
    }
    const listen = browserHistory.listen(() => {
      currentCallback()
    })
    return () => {
      listen()
    }
  }, [])
}

export default () => {
  const dispatch = useDispatch()
  const { components } = useAppState()
  const { mobileMenuVisible } = components

  useRouter(() => {
    window.scrollTo(0, 0)
    dispatch({
      type: ComponentActions.UpdateHomeSearchBarVisible,
      payload: {
        homeSearchBarVisible: browserHistory.location.pathname === '/',
      },
    })
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
    <Router history={browserHistory}>
      <Route
        render={(props: any) => {
          return (
            <Page>
              <Header hasSearch={hasSearch(browserHistory.location.pathname)} />
              <Sheet />
              <Switch location={props.location}>
                {Containers.map(container => {
                  return (
                    <Route
                      {...container}
                      key={container.name}
                      render={routeProps => <container.comp {...routeProps} />}
                    />
                  )
                })}
                <Redirect from="*" to="/404" />
              </Switch>
              {!(isMobile() && mobileMenuVisible) && <Footer />}
            </Page>
          )
        }}
      />
    </Router>
  )
}
