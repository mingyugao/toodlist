import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import Button from 'antd/lib/button';
import Form from 'antd/lib/form';
import Icon from 'antd/lib/icon';
import Input from 'antd/lib/input';
import message from 'antd/lib/message';
import {
  signInRequest,
  signInSuccess,
  signInFailure
} from '../actions/SignIn';

const SignInForm = Form.create({})(({
  form,
  history,
  isLoading,
  signIn
}) => {
  const { getFieldDecorator } = form;

  const handleSubmit = e => {
    e.preventDefault();
    form.validateFields((err, { email, password }) => {
      if (!err) {
        signIn(email, password, history);
      }
    });
  };

  return (
    <Form onSubmit={e => handleSubmit(e)}>
      <Form.Item>
        {getFieldDecorator('email', {
          rules: [
            {
              required: true,
              message: 'Please enter your email.'
            },
            {
              type: 'email',
              message: 'Email is not valid.'
            }
          ]
        })(
          <Input
            placeholder="Email"
            prefix={<Icon type="mail" />}
          />
        )}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator('password', {
          rules: [{
            required: true,
            message: 'Please enter your password.'
          }]
        })(
          <Input.Password
            placeholder="Password"
            prefix={<Icon type="lock" />}
          />
        )}
      </Form.Item>
      <Form.Item>
        <Link to="/forgot_password">
          Forgot password?
        </Link>
        <Button
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
});

const mapStateToProps = state => {
  return {
    isLoading: state.signIn.isLoading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    signIn: (email, password, history) => {
      dispatch(signInRequest());
      Meteor.loginWithPassword({ email }, password, err => {
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
)(withRouter(SignInForm));
