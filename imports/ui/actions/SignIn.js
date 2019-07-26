export const signInOnChangeEmail = email => {
  return {
    type: 'SIGN_IN_ON_CHANGE_EMAIL',
    payload: email
  };
};

export const signInOnChangePassword = password => {
  return {
    type: 'SIGN_IN_ON_CHANGE_PASSWORD',
    payload: password
  };
};

export const signInRequest = () => {
  return {
    type: 'SIGN_IN_REQUEST'
  };
};

export const signInSuccess = () => {
  return {
    type: 'SIGN_IN_SUCCESS'
  };
};

export const signInFailure = () => {
  return {
    type: 'SIGN_IN_FAILURE'
  };
};
