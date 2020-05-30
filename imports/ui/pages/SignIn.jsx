import React from 'react';
import { withStyles } from '@material-ui/styles';
import { Link, Redirect } from 'react-router-dom';
import Typography from 'antd/lib/typography';
import SignInForm from '../components/SignInForm';

const styles = (theme) => ({
  root: {
    [theme.breakpoints.down('sm')]: {
      height: '100%',
      padding: '3em 0 9em'
    },
    [theme.breakpoints.up('md')]: {
      padding: '8em 0 0'
    },
    '& > div': {
      backgroundColor: 'white',
      border: '1px solid #dddddd',
      textAlign: 'center',
      '& > img': {
        width: '2rem',
        margin: '0 0 1em'
      },
      [theme.breakpoints.down('sm')]: {
        height: '100%',
        margin: '0 2em',
        padding: '3em 3em',
        borderRadius: '0.5em'
      },
      [theme.breakpoints.up('md')]: {
        width: '32em',
        height: '38em',
        margin: 'auto',
        padding: '4em 6em',
        borderRadius: '5px'
      }
    }
  }
});

const SignIn = ({ classes }) => {
  if (Meteor.userId()) {
    return <Redirect to="/" />;
  }

  return (
    <div id="sign-in" className={classes.root}>
      <div>
        <img src="/favicon.ico" alt="logo" />
        <Typography.Title>toodlist</Typography.Title>
        <SignInForm />
        Or
        <Link to="/signup">&nbsp;create an account!</Link>
      </div>
    </div>
  );
};

export default withStyles(styles)(SignIn);
