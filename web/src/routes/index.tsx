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
import LockHash from '../pages/Address/LockHash'
import NotFoundPage from '../pages/404'
import SearchFail from '../pages/SearchFail'

export default () => {
  useEffect(() => {
    let currentUrl = `${browserHistory.location.pathname}${browserHistory.location.search}`
    const unlisten = browserHistory.listen((location: any) => {
      if (currentUrl !== `${location.pathname}${location.search}`) {
        const page = document.querySelector('.page') as HTMLDivElement
        page.scrollTop = 0
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
          const hasSearch: boolean = !(props.location.pathname === '/' || props.location.pathname === '/search/fail')
          return (
            <Page>
              <Header search={hasSearch} />
              <Switch location={props.location}>
                <Route path="/" exact component={Home} />
                <Route path="/block/list" exact component={BlockList} />
                <Route path="/block/:hash" exact component={Block} />
                <Route path="/transaction/:hash" exact component={Transaction} />
                <Route path="/address/:address" exact component={Address} />
                <Route path="/lockhash/:hash" exact component={LockHash} />
                <Route path="/search/fail" exact component={SearchFail} />
                <Route path="/404" exact component={NotFoundPage} />
                <Redirect from="*" to="/404" />
              </Switch>
              <Footer />
            </Page>
          )
        }}
      />
    </Router>
  )
}
