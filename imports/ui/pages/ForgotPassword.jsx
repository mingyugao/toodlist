import React from 'react';
import { connect } from 'react-redux';
import Typography from 'antd/lib/typography';
import Input from 'antd/lib/input';
import Icon from 'antd/lib/icon';
import Button from 'antd/lib/button';
import notification from 'antd/lib/notification';
import {
  forgotPasswordOnChangeEmail as onChangeEmail,
  forgotPasswordSendLinkRequest,
  forgotPasswordSendLinkSuccess,
  forgotPasswordSendLinkFailure
} from '../actions/ForgotPassword';

const { Title, Paragraph } = Typography;

const ForgotPassword = ({
  defaultEmail,
  email,
  isLoading,
  isSent,
  onChangeEmail,
  sendPasswordResetLink
}) => (
  <div id="forgot-password">
    <div>
      <Title>Reset Password</Title>
      {!isSent && (
        <div>
          <Input
            defaultValue={defaultEmail}
            prefix={<Icon type="mail" />}
            placeholder="Email"
            onChange={e => onChangeEmail(e.target.value)}
          />
          <Button
            loading={isLoading}
            type="primary"
            onClick={() => sendPasswordResetLink(email)}
          >
            Send Password Reset Link
          </Button>
        </div>
      )}
      {isSent && (
        <div>
          <Icon type="check-circle" />
          <Paragraph>Link sent!</Paragraph>
        </div>
      )}
    </div>
  </div>
);

const mapStateToProps = state => {
  return {
    defaultEmail: state.signIn.email,
    email: state.forgotPassword.email,
    isLoading: state.forgotPassword.isLoading,
    isSent: state.forgotPassword.isSent
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onChangeEmail: email => dispatch(onChangeEmail(email)),
    sendPasswordResetLink: email => {
      if (!email) {
        return notification.error({
          message: 'Your request failed to complete.',
          description: 'Email cannot be empty.'
        });
      }
      dispatch(forgotPasswordSendLinkRequest());
      setTimeout(() => {
        dispatch(forgotPasswordSendLinkSuccess());
      }, 1000);
      // dispatch(forgotPasswordSendLinkRequest());
      // Meteor.call('sendPasswordResetLink', email, err => {
      //   if (err) {
      //     dispatch(forgotPasswordSendLinkFailure());
      //     return notification.error({
      //       message: 'Your request failed to complete.',
      //       description: 'There is no user registered under this email.'
      //     });
      //   } else {
      //     dispatch(forgotPasswordSendLinkSuccess());
      //   }
      // });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
