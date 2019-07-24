import { combineReducers } from 'redux';
import signInReducer from './SignIn';
import forgotPasswordReducer from './ForgotPassword';
import signUpReducer from './SignUp';
import homeReducer from './Home';

const appReducer = combineReducers({
  signIn: signInReducer,
  forgotPassword: forgotPasswordReducer,
  signUp: signUpReducer,
  home: homeReducer
});

const rootReducer = (state, action) => {
  if (action.type === 'SIGN_OUT') {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
