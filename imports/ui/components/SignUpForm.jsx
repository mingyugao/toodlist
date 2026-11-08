import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Accounts } from 'meteor/accounts-base';
import React from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import clsx from 'clsx';
import { withStyles } from '@mui/styles';
import Button from 'antd/lib/button';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import message from 'antd/lib/message';
import { signUpRequest, signUpSuccess, signUpFailure } from '../actions/SignUp';

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

function SignUpForm({ className, classes, isLoading, signUp }) {
  const history = useHistory();
  return (
    <Form
      className={clsx(className, classes.root)}
      onFinish={({ email, password }) =>
        signUp(email.trim(), password, history)
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
        rules={[
          { required: true, message: 'Please enter your password.' },
          { min: 8, message: 'Password must be at least 8 characters.' }
        ]}
      >
        <Input.Password
          aria-label="Password"
          autoComplete="new-password"
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
          Create Account
        </Button>
      </Form.Item>
    </Form>
  );
}

const mapStateToProps = (state) => {
  return {
    isLoading: state.signUp.isLoading
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    signUp: (email, password, history) => {
      dispatch(signUpRequest());
      Accounts.createUser({ email, password }, (err) => {
        if (err) {
          dispatch(signUpFailure());
          return message.error(
            err.reason || 'Could not create your account. Please try again.'
          );
        } else {
          dispatch(signUpSuccess());
          history.push('/');
        }
      });
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(SignUpForm));
