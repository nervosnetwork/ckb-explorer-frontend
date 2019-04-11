import React from 'react'
import { Router, Route, Redirect, Switch } from 'react-router-dom'
import browserHistory from './history'
import Home from '../pages/Home'
import Block from '../pages/BlockDetail'
import BlockList from '../pages/BlockList'
import Transaction from '../pages/Transaction'
import Address from '../pages/Address'
import NotFoundPage from '../pages/404'
import SearchFail from '../pages/SearchFail'

export default () => {
  return (
    <Router history={browserHistory}>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/block/:hash" exact component={Block} />
        <Route path="/blocklist/:pageNo?/:pageSize?" exact component={BlockList} />
        <Route path="/transaction/:hash" exact component={Transaction} />
        <Route path="/address/:address/:pageNo?/:pageSize?" exact component={Address} />
        <Route path="/search/fail" exact component={SearchFail} />
        <Route path="/404" exact component={NotFoundPage} />
        <Redirect from="*" to="/404" />
      </Switch>
    </Router>
  )
}
