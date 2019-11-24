import React from 'react';
import { withStyles } from '@material-ui/styles';
import { Link, Redirect } from 'react-router-dom';
import Typography from 'antd/lib/typography';
import SignUpForm from '../components/SignUpForm';

const styles = theme => ({
  root: {
    padding: '8em 0 0',
    '& > div': {
      width: '32em',
      height: '38em',
      margin: 'auto',
      padding: '4em 6em',
      backgroundColor: 'white',
      border: '1px solid #dddddd',
      borderRadius: '5px',
      textAlign: 'center'
    }
  }
});

const SignUp = ({
  classes
}) => {
  if (Meteor.userId()) {
    return <Redirect to="/" />
  }

  return (
    <div id="sign-up" className={classes.root}>
      <div>
        <Typography.Title>toodlist</Typography.Title>
        <SignUpForm />
        <Link to="/">
          I already have an account!
        </Link>
      </div>
    </div>
  );
};

export default withStyles(styles)(SignUp);
