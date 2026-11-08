import { combineReducers } from 'redux';
import homeReducer from './Home';
import settingsReducer from './Settings';
import signInReducer from './SignIn';
import signUpReducer from './SignUp';

const appReducer = combineReducers({
  home: homeReducer,
  settings: settingsReducer,
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
