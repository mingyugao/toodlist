import { combineReducers } from 'redux';
import signInReducer from './SignIn';
import signUpReducer from './SignUp';
import forgotPasswordReducer from './ForgotPassword';
import homeReducer from './Home';
import settingsReducer from './Settings';

const appReducer = combineReducers({
  signIn: signInReducer,
  signUp: signUpReducer,
  forgotPassword: forgotPasswordReducer,
  home: homeReducer,
  settings: settingsReducer
});

const rootReducer = (state, action) => {
  if (action.type === 'SIGN_OUT') {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
