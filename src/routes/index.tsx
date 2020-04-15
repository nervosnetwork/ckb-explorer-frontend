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
import DifficultyHashRateChart from '../pages/StatisticsChart/DifficultyHashRate'
import DifficultyUncleRateChart from '../pages/StatisticsChart/DifficultyUncleRate'
import DifficultyChart from '../pages/StatisticsChart/Difficulty'
import TransactionCountChart from '../pages/StatisticsChart/TransactionCount'
import AddressCountChart from '../pages/StatisticsChart/AddressCount'
import TotalDaoDepositChart from '../pages/StatisticsChart/TotalDaoDeposit'
import CellCountChart from '../pages/StatisticsChart/CellCount'
import AddressBalanceRankChart from '../pages/StatisticsChart/AddressBalanceRank'
import HashRateChart from '../pages/StatisticsChart/HashRate'
import UncleRateChart from '../pages/StatisticsChart/UncleRate'
import { useDispatch, useAppState } from '../contexts/providers'
import { ComponentActions } from '../contexts/providers/reducer'
import { isMobile } from '../utils/screen'
import BalanceDistribution from '../pages/StatisticsChart/BalanceDistribution'

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
    comp: BalanceDistribution,
  },
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
