import React from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core';
import { AuthPage, SignInForm } from '../components';

const styles = (theme) => ({
  root: {
    textAlign: 'center'
  },
  form: {
    margin: theme.spacing(4, 0)
  }
});

function SignIn({ classes }) {
  return (
    <AuthPage className={classes.root}>
      <SignInForm className={classes.form} />
      Or
      <Link to="/signup">&nbsp;create an account!</Link>
    </AuthPage>
  );
}

export default withStyles(styles)(SignIn);
