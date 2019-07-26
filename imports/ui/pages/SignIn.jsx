import React from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import Button from 'antd/lib/button';
import Icon from 'antd/lib/icon';
import Input from 'antd/lib/input';
import Typography from 'antd/lib/typography';
import notification from 'antd/lib/notification';
import {
  signInOnChangeEmail as onChangeEmail,
  signInOnChangePassword as onChangePassword,
  signInRequest,
  signInSuccess,
  signInFailure
} from '../actions/SignIn';

const { Title } = Typography;

const SignIn = ({
  history,
  email,
  password,
  isLoading,
  onChangeEmail,
  onChangePassword,
  signIn
}) => !Meteor.userId() ? (
  <div id="sign-in">
    <div>
      <Title>toodlist</Title>
      <div>
        <Input
          placeholder="Email"
          prefix={<Icon type="mail" />}
          value={email}
          onChange={e => onChangeEmail(e.target.value)}
          onPressEnter={() => signIn(email, password, history)}
        />
        <Input.Password
          placeholder="Password"
          prefix={<Icon type="lock" />}
          value={password}
          onChange={e => onChangePassword(e.target.value)}
          onPressEnter={() => signIn(email, password, history)}
        />
        <Link to="/forgot_password">
          Forgot password?
        </Link>
        <Button
          loading={isLoading}
          type="primary"
          block
          onClick={() => signIn(email, password, history)}
        >
          Log In
        </Button>
      </div>
      Or
      <Link to="/signup">
        &nbsp;create an account!
      </Link>
    </div>
  </div>
) : <Redirect to="/" />;

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
