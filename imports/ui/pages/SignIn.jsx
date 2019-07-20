import React from 'react';
import { connect } from 'react-redux';
import Typography from 'antd/lib/typography';
import Input from 'antd/lib/input';
import Button from 'antd/lib/button';
import { Link } from 'react-router-dom';
import notification from 'antd/lib/notification';
import {
  signInOnChangeEmail as onChangeEmail,
  signInOnChangePassword as onChangePassword,
  signInRequest,
  signInSuccess,
  signInFailure
} from '../actions';

const { Title } = Typography;

const SignIn = ({
  history,
  email,
  password,
  isLoading,
  onChangeEmail,
  onChangePassword,
  signIn
}) => (
  <div id="sign-in">
    <Title>Sign In</Title>
    <Input
      placeholder="Email"
      value={email}
      onChange={e => onChangeEmail(e.target.value)}
    />
    <Input.Password
      placeholder="Password"
      value={password}
      onChange={e => onChangePassword(e.target.value)}
    />
    <Link to="/forgot_password">
      Forgot password?
    </Link>
    <Button
      loading={isLoading}
      type="primary"
      onClick={() => signIn(email, password, history)}
    >
      Sign In
    </Button>
    <Link to="/signup">
      Create an account
    </Link>
  </div>
);

const mapStateToProps = state => {
  return {
    email: state.signIn.email,
    password: state.signIn.password,
    isLoading: state.signIn.isLoading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onChangeEmail: email => dispatch(onChangeEmail(email)),
    onChangePassword: password => dispatch(onChangePassword(password)),
    signIn: (email, password, history) => {
      if (!email || !password) {
        return notification.error({
          message: 'Your request failed to complete.',
          description: 'Email and password cannot be blank.'
        });
      }
      dispatch(signInRequest());
      Meteor.loginWithPassword({ email }, password, err => {
        if (err) {
          dispatch(signInFailure());
          return notification.error({
            message: 'Your request failed to complete.',
            description: 'Please make sure your email and password are correct.'
          });
        } else {
          dispatch(signInSuccess());
          history.push('/');
        }
      });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
