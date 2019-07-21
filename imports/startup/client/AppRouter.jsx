import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import PrivateRoute from '../../ui/components/PrivateRoute';
import SignIn from '../../ui/pages/SignIn';
import ForgotPassword from '../../ui/pages/ForgotPassword';
import SignUp from '../../ui/pages/SignUp';
import Home from '../../ui/pages/Home';
import NotFound from '../../ui/pages/NotFound';

const browserHistory = createBrowserHistory();

const AppRouter = () => (
  <Router history={browserHistory}>
    <Switch>
      <Route path="/login" component={SignIn} />
      <Route path="/forgot_password" component={ForgotPassword} />
      <Route path="/signup" component={SignUp} />
      <PrivateRoute exact path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  </Router>
);

export default AppRouter;
