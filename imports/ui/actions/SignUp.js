export const signUpOnChangeEmail = email => {
  return {
    type: 'SIGN_UP_ON_CHANGE_EMAIL',
    payload: email
  };
};

export const signUpOnChangePassword = password => {
  return {
    type: 'SIGN_UP_ON_CHANGE_PASSWORD',
    payload: password
  };
};

export const signUpRequest = () => {
  return {
    type: 'SIGN_UP_REQUEST'
  };
};

export const signUpSuccess = () => {
  return {
    type: 'SIGN_UP_SUCCESS'
  };
};

export const signUpFailure = () => {
  return {
    type: 'SIGN_UP_FAILURE'
  };
};
