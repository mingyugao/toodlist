import React from 'react';
import { connect } from 'react-redux';
import Typography from 'antd/lib/typography';
import Input from 'antd/lib/input';
import Button from 'antd/lib/button';
import { Link } from 'react-router-dom';
import notification from 'antd/lib/notification';
import {
  signUpOnChangeEmail as onChangeEmail,
  signUpOnChangePassword as onChangePassword,
  signUpRequest,
  signUpSuccess,
  signUpFailure
} from '../actions';

const { Title } = Typography;

const SignUp = ({
  history,
  email,
  password,
  isLoading,
  onChangeEmail,
  onChangePassword,
  signUp
}) => (
  <div id="sign-up">
    <Title>Sign Up</Title>
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
    <Button
      loading={isLoading}
      type="primary"
      onClick={() => signUp(email, password, history)}
    >
      Sign Up
    </Button>
    <Link to="/">
      Sign In
    </Link>
  </div>
);

const mapStateToProps = state => {
  return {
    email: state.signUp.email,
    password: state.signUp.password,
    isLoading: state.signUp.isLoading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onChangeEmail: email => dispatch(onChangeEmail(email)),
    onChangePassword: password => dispatch(onChangePassword(password)),
    signUp: (email, password, history) => {
      if (!email || !password) {
        return notification.error({
          message: 'Your request failed to complete.',
          description: 'Email and password cannot be blank.'
        });
      }
      dispatch(signUpRequest());
      Accounts.createUser({ email, password }, err => {
        if (err) {
          dispatch(signUpFailure());
          return notification.error({
            message: 'Your request failed to complete.',
            description: 'This email already exists.'
          });
        } else {
          dispatch(signUpSuccess());
          history.push('/');
        }
      });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
