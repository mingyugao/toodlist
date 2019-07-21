import { combineReducers } from 'redux';
import signInReducer from './SignIn';
import forgotPasswordReducer from './ForgotPassword';
import signUpReducer from './SignUp';

const appReducer = combineReducers({
  signIn: signInReducer,
  forgotPassword: forgotPasswordReducer,
  signUp: signUpReducer
});

const rootReducer = (state, action) => {
  if (action.type === 'SIGN_OUT') {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
