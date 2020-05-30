import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Button from 'antd/lib/button';
import Icon from 'antd/lib/icon';
import Input from 'antd/lib/input';
import Typography from 'antd/lib/typography';
import message from 'antd/lib/message';
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
}) =>
  !Meteor.userId() ? (
    <div id="forgot-password">
      <div>
        <Title>Reset Password</Title>
        {!isSent && (
          <div>
            <Input
              defaultValue={defaultEmail}
              prefix={<Icon type="mail" />}
              placeholder="Email"
              onChange={(e) => onChangeEmail(e.target.value)}
              onPressEnter={() => sendPasswordResetLink(email)}
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
  ) : (
    <Redirect to="/" />
  );

const mapStateToProps = (state) => {
  return {
    defaultEmail: state.signIn.email,
    email: state.forgotPassword.email,
    isLoading: state.forgotPassword.isLoading,
    isSent: state.forgotPassword.isSent
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onChangeEmail: (email) => dispatch(onChangeEmail(email)),
    sendPasswordResetLink: (email) => {
      // TODO
      return message.error('Sorry, this feature is not implemented yet :(');
      // dispatch(forgotPasswordSendLinkRequest());
      // Meteor.call('sendPasswordResetLink', email, err => {
      //   if (err) {
      //     dispatch(forgotPasswordSendLinkFailure());
      //     return message.error(
      //       'There is no user registered under this email.'
      //     );
      //   } else {
      //     dispatch(forgotPasswordSendLinkSuccess());
      //   }
      // });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
