export const forgotPasswordOnChangeEmail = (email) => {
  return {
    type: 'FORGOT_PASSWORD_ON_CHANGE_EMAIL',
    payload: email
  };
};

export const forgotPasswordSendLinkRequest = () => {
  return {
    type: 'FORGOT_PASSWORD_SEND_LINK_REQUEST'
  };
};

export const forgotPasswordSendLinkSuccess = () => {
  return {
    type: 'FORGOT_PASSWORD_SEND_LINK_SUCCESS'
  };
};

export const forgotPasswordSendLinkFailure = () => {
  return {
    type: 'FORGOT_PASSWORD_SEND_LINK_FAILURE'
  };
};
