import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducers from '/imports/ui/reducers';
import AppRouter from '/imports/startup/client/AppRouter';

Meteor.startup(() => {
  render(
    <Provider store={createStore(reducers)}>
      <AppRouter />
    </Provider>,
    document.getElementById('react-target')
  );
});
