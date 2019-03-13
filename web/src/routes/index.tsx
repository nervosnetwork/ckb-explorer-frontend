import React from 'react'
import { Router, Route, Redirect, Switch } from 'react-router-dom'
import browserHistory from './history'
import Home from '../pages/home'
import Block from '../pages/block'
import Transaction from '../pages/transaction'
import Address from '../pages/address'

import NotFoundPage from '../pages/404'

export default () => {
  return (
    <Router history={browserHistory}>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/block" exact component={Block} />
        <Route path="/transaction" exact component={Transaction} />
        <Route path="/address" exact component={Address} />
        <Route path="/404" exact component={NotFoundPage} />
        <Redirect from="*" to="/404" />
      </Switch>
    </Router>
  )
}
