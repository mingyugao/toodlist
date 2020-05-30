import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import { PrivateRoute } from '../../ui/components';
import { Home, SignIn, SignUp } from '../../ui/pages';

const browserHistory = createBrowserHistory();

function AppRouter() {
  return (
    <Router history={browserHistory}>
      <Switch>
        <Route path="/login" component={SignIn} />
        <Route path="/signup" component={SignUp} />
        <PrivateRoute exact path="/" component={Home} />
      </Switch>
    </Router>
  );
}

export default AppRouter;
