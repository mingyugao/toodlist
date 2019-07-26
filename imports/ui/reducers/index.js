import { combineReducers } from 'redux';
import forgotPasswordReducer from './ForgotPassword';
import homeReducer from './Home';
import signInReducer from './SignIn';
import signUpReducer from './SignUp';

const appReducer = combineReducers({
  forgotPassword: forgotPasswordReducer,
  home: homeReducer,
  signIn: signInReducer,
  signUp: signUpReducer
});

const rootReducer = (state, action) => {
  if (action.type === 'SIGN_OUT') {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
