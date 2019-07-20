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
