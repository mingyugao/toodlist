import { combineReducers } from 'redux';

const signInReducer = (
  state = {
    email: '',
    password: '',
    isLoading: false
  },
  action
) => {
  switch (action.type) {
    case 'SIGN_IN_ON_CHANGE_EMAIL':
      return {
        ...state,
        email: action.payload
      };
    case 'SIGN_IN_ON_CHANGE_PASSWORD':
      return {
        ...state,
        password: action.payload
      };
    case 'SIGN_IN_REQUEST':
      return {
        ...state,
        isLoading: true
      };
    case 'SIGN_IN_SUCCESS':
      return {
        ...state,
        email: '',
        password: '',
        isLoading: false
      };
    case 'SIGN_IN_FAILURE':
      return {
        ...state,
        isLoading: false
      };
    default:
      return state;
  }
};

const signUpReducer = (
  state = {
    email: '',
    password: '',
    isLoading: false
  },
  action
) => {
  switch (action.type) {
    case 'SIGN_UP_ON_CHANGE_EMAIL':
      return {
        ...state,
        email: action.payload
      };
    case 'SIGN_UP_ON_CHANGE_PASSWORD':
      return {
        ...state,
        password: action.payload
      };
    case 'SIGN_UP_REQUEST':
      return {
        ...state,
        isLoading: true
      };
    case 'SIGN_UP_SUCCESS':
      return {
        ...state,
        email: '',
        password: '',
        isLoading: false
      };
    case 'SIGN_UP_FAILURE':
      return {
        ...state,
        isLoading: false
      };
    default:
      return state;
  }
};

export default combineReducers({
  signIn: signInReducer,
  signUp: signUpReducer
});
