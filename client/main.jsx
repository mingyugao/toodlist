import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import reducers from '/imports/ui/reducers';
import AppRouter from '/imports/startup/client/AppRouter';

const theme = createMuiTheme({});

Meteor.startup(() => {
  render(
    <Provider store={createStore(reducers)}>
      <MuiThemeProvider theme={theme}>
        <AppRouter />
      </MuiThemeProvider>
    </Provider>,
    document.getElementById('react-target')
  );
});
