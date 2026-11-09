import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAppSession } from './AppSession';

function PrivateRoute({ component: Component, ...rest }) {
  const { userId, loggingIn, canShowBoard } = useAppSession();
  if (loggingIn) return null;
  return (
    <Route
      {...rest}
      render={(props) => {
        if (!userId) return <Redirect to="/login" />;
        return canShowBoard ? <Component {...props} /> : null;
      }}
    />
  );
}

export default PrivateRoute;
