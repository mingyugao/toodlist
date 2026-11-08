import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import clsx from 'clsx';
import { Paper } from '@mui/material';
import { withStyles } from '@mui/styles';
import Logo from './Logo';
import Loading from './Loading';

const styles = (theme) => ({
  root: {
    [theme.breakpoints.down('md')]: {
      height: `${window.innerHeight}px`,
      padding: theme.spacing(1)
    },
    [theme.breakpoints.up('md')]: {
      height: '100%',
      padding: theme.spacing(12, 0)
    }
  },
  paper: {
    [theme.breakpoints.down('md')]: {
      height: '100%',
      padding: theme.spacing(12, 4)
    },
    [theme.breakpoints.up('md')]: {
      width: '400px',
      height: '500px',
      margin: theme.spacing(0, 'auto'),
      padding: theme.spacing(4, 8)
    }
  }
});

function AuthPage({ children, className, classes }) {
  const { userId, loggingIn } = useTracker(() => ({
    userId: Meteor.userId(),
    loggingIn: Meteor.loggingIn()
  }));
  if (loggingIn) return <Loading />;
  if (userId) {
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
