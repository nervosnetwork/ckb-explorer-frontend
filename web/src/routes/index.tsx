import React from 'react'
import { Router, Route, Redirect, Switch } from 'react-router-dom'
import browserHistory from './history'
import Home from '../pages/Home'
import Block from '../pages/Block'
import Transaction from '../pages/Transaction'
import Address from '../pages/Address'

import NotFoundPage from '../pages/404'

export default () => {
  return (
    <Router history={browserHistory}>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/block" exact component={Block} />
        <Route path="/transaction" exact component={Transaction} />
        <Route path="/address/:address" exact component={Address} />
        <Route path="/404" exact component={NotFoundPage} />
        <Redirect from="*" to="/404" />
      </Switch>
    </Router>
  )
}
