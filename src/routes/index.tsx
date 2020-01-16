import React, { useEffect } from 'react'
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

const hasSearch = (pathname: string) => {
  return pathname !== '/search/fail' && pathname !== '/maintain'
}

export const containers: CustomRouter.Route[] = [
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
    path: '/charts/difficulty_hash_rate',
    exact: true,
    comp: DifficultyHashRateChart,
  },
  {
    name: 'DifficultyUncleRateChart',
    path: '/charts/difficulty_uncle_rate',
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
    name: 'TransactionCountChart',
    path: '/charts/transaction_count',
    exact: true,
    comp: TransactionCountChart,
  },
  {
    name: 'AddressCountChart',
    path: '/charts/address_count',
    exact: true,
    comp: AddressCountChart,
  },
  {
    name: 'TotalDaoDepositChart',
    path: '/charts/total_dao_deposit',
    exact: true,
    comp: TotalDaoDepositChart,
  },
  {
    name: 'CellCountChart',
    path: '/charts/cell_count',
    exact: true,
    comp: CellCountChart,
  },
  {
    name: 'AddressBalanceRankChart',
    path: '/charts/address_balance_rank',
    exact: true,
    comp: AddressBalanceRankChart,
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

export default () => {
  useEffect(() => {
    let currentUrl = `${browserHistory.location.pathname}${browserHistory.location.search}`
    const unlisten = browserHistory.listen((location: any) => {
      if (currentUrl !== `${location.pathname}${location.search}`) {
        window.scrollTo(0, 0)
      }
      currentUrl = `${location.pathname}${location.search}`
    })
    return () => {
      unlisten()
    }
  }, [])

  return (
    <Router history={browserHistory}>
      <Route
        render={(props: any) => {
          return (
            <Page>
              <React.Fragment>
                <Header hasSearch={hasSearch(browserHistory.location.pathname)} />
                <Sheet />
                <Switch location={props.location}>
                  {containers.map(container => {
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
                <Footer />
              </React.Fragment>
            </Page>
          )
        }}
      />
    </Router>
  )
}
