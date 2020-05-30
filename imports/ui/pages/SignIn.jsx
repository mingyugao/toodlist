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
  // root: {
  //   [theme.breakpoints.down('sm')]: {
  //     height: '100%',
  //     padding: '3em 0 9em'
  //   },
  //   [theme.breakpoints.up('md')]: {
  //     padding: '8em 0 0'
  //   },
  //   '& > div': {
  //     backgroundColor: 'white',
  //     border: '1px solid #dddddd',
  //     textAlign: 'center',
  //     '& > img': {
  //       width: '2rem',
  //       margin: '0 0 1em'
  //     },
  //     [theme.breakpoints.down('sm')]: {
  //       height: '100%',
  //       margin: '0 2em',
  //       padding: '3em 3em',
  //       borderRadius: '0.5em'
  //     },
  //     [theme.breakpoints.up('md')]: {
  //       width: '32em',
  //       height: '38em',
  //       margin: 'auto',
  //       padding: '4em 6em',
  //       borderRadius: '5px'
  //     }
  //   }
  // }
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
