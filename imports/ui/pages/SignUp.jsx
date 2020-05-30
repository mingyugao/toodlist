import React from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core';
import { AuthPage, SignUpForm } from '../components';

const styles = (theme) => ({
  root: {
    textAlign: 'center'
  },
  form: {
    margin: theme.spacing(4, 0)
  }
});

function SignUp({ classes }) {
  return (
    <AuthPage className={classes.root}>
      <SignUpForm className={classes.form} />
      <Link to="/">I already have an account!</Link>
    </AuthPage>
  );
}

export default withStyles(styles)(SignUp);
