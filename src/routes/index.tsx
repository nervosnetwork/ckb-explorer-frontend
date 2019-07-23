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
import Address from '../pages/Address'
import NotFoundPage from '../pages/404'
import SearchFail from '../pages/SearchFail'
import Maintain from '../pages/Maintain'
import Sheet from '../components/Sheet'
import StatisticsChart from '../pages/StatisticsChart'
import { ComponentActions, AppDispatch } from '../contexts/providers/reducer'

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
    name: 'LockHash',
    path: '/lockhash/:hash',
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
    name: 'Transaction',
    path: '/transaction/:hash',
    exact: true,
    comp: Transaction,
  },
  {
    name: 'Charts',
    path: '/charts',
    exact: true,
    comp: StatisticsChart,
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

export default ({ dispatch }: React.PropsWithoutRef<{ dispatch: AppDispatch }>) => {
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
          dispatch({
            type: ComponentActions.HaveSearchBar,
            payload: {
              haveSearchBar: hasSearch(props.location.pathname),
            },
          })
          return (
            <Page>
              <React.Fragment>
                <Header dispatch={dispatch} />
                <Sheet />
                <Switch location={props.location}>
                  {containers.map(container => {
                    return (
                      <Route
                        {...container}
                        key={container.name}
                        render={routeProps => <container.comp {...routeProps} dispatch={dispatch} />}
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
