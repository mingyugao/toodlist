import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Meteor } from 'meteor/meteor';
import React from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import clsx from 'clsx';
import { withStyles } from '@mui/styles';
import Button from 'antd/lib/button';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import message from 'antd/lib/message';
import { signInRequest, signInSuccess, signInFailure } from '../actions/SignIn';

const styles = (theme) => ({
  root: {
    textAlign: 'left',
    '& > div': {
      margin: theme.spacing(0, 0, 1)
    }
  },
  submitButton: {
    margin: theme.spacing(3, 0, 0)
  }
});

function SignInForm({ className, classes, isLoading, signIn }) {
  const history = useHistory();
  return (
    <Form
      className={clsx(className, classes.root)}
      onFinish={({ email, password }) =>
        signIn(email.trim(), password, history)
      }
    >
      <Form.Item
        name="email"
        rules={[
          { required: true, message: 'Please enter your email.' },
          { type: 'email', message: 'Email is not valid.' }
        ]}
      >
        <Input
          aria-label="Email"
          autoComplete="email"
          placeholder="Email"
          prefix={<MailOutlined />}
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Please enter your password.' }]}
      >
        <Input.Password
          aria-label="Password"
          autoComplete="current-password"
          placeholder="Password"
          prefix={<LockOutlined />}
        />
      </Form.Item>
      <Form.Item>
        <Button
          className={classes.submitButton}
          loading={isLoading}
          type="primary"
          htmlType="submit"
          block
        >
          Log In
        </Button>
      </Form.Item>
    </Form>
  );
}

const mapStateToProps = (state) => {
  return {
    isLoading: state.signIn.isLoading
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    signIn: (email, password, history) => {
      dispatch(signInRequest());
      Meteor.loginWithPassword({ email }, password, (err) => {
        if (err) {
          dispatch(signInFailure());
          return message.error('Email or password is incorrect.');
        } else {
          dispatch(signInSuccess());
          history.push('/');
        }
      });
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(SignInForm));
