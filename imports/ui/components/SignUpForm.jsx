import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import Button from 'antd/lib/button';
import Form from 'antd/lib/form';
import Icon from 'antd/lib/icon';
import Input from 'antd/lib/input';
import message from 'antd/lib/message';
import { signUpRequest, signUpSuccess, signUpFailure } from '../actions/SignUp';

const SignUpForm = Form.create({})(({ form, history, isLoading, signUp }) => {
  const { getFieldDecorator } = form;

  const handleSubmit = (e) => {
    e.preventDefault();
    form.validateFields((err, { email, password }) => {
      if (!err) {
        signUp(email, password, history);
      }
    });
  };

  return (
    <Form onSubmit={(e) => handleSubmit(e)}>
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
        })(<Input placeholder="Email" prefix={<Icon type="mail" />} />)}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator('password', {
          rules: [
            {
              required: true,
              message: 'Please enter your password.'
            },
            {
              min: 6,
              message: 'Password must be at least 6 characters.'
            }
          ]
        })(
          <Input.Password
            placeholder="Password"
            prefix={<Icon type="lock" />}
          />
        )}
      </Form.Item>
      <Form.Item>
        <Button loading={isLoading} type="primary" htmlType="submit" block>
          Create Account
        </Button>
      </Form.Item>
    </Form>
  );
});

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
          return message.error('This email has already been registered.');
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
)(withRouter(SignUpForm));
