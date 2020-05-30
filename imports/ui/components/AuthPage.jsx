import React from 'react';
import { Redirect } from 'react-router-dom';
import clsx from 'clsx';
import { Paper, Typography, withStyles } from '@material-ui/core';
import Logo from './Logo';

const styles = (theme) => ({
  root: {
    height: '100%',
    padding: theme.spacing(12, 0)
  },
  paper: {
    width: '400px',
    height: '500px',
    margin: theme.spacing(0, 'auto'),
    padding: theme.spacing(4, 8)
  }
});

function AuthPage({ children, className, classes }) {
  if (Meteor.userId()) {
    return <Redirect to="/" />;
  }

  return (
    <div className={clsx(className, classes.root)}>
      <Paper className={classes.paper} variant="outlined">
        <Logo />
        {children}
      </Paper>
    </div>
  );
}

export default withStyles(styles)(AuthPage);
