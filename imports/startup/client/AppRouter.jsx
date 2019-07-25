import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import PrivateRoute from '../../ui/components/PrivateRoute';
import ForgotPassword from '../../ui/pages/ForgotPassword';
import Home from '../../ui/pages/Home';
import SignIn from '../../ui/pages/SignIn';
import SignUp from '../../ui/pages/SignUp';
import NotFound from '../../ui/pages/NotFound';

const browserHistory = createBrowserHistory();

const AppRouter = () => (
  <Router history={browserHistory}>
    <Switch>
      <Route path="/login" component={SignIn} />
      <Route path="/signup" component={SignUp} />
      <Route path="/forgot_password" component={ForgotPassword} />
      <PrivateRoute exact path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  </Router>
);

export default AppRouter;
