import { Meteor } from 'meteor/meteor';
import { store } from './store';

// Preserve the existing callback-based UI while using Meteor 3's promise API.
// Apply the server's board after each mutation, including a refresh on failure,
// so rejected optimistic changes cannot masquerade as saved data.
let pending = Promise.resolve();

export const waitForPendingMethods = () => pending;

export function callMethod(name, ...args) {
  const callback = args.pop();
  const userId = Meteor.userId();
  pending = pending.then(async () => {
    if (Meteor.userId() !== userId) return;
    try {
      const result = await Meteor.callAsync(name, ...args);
      if (Meteor.userId() !== userId) return;
      if (name !== 'getUserData') {
        store.dispatch({ type: 'HOME_GET_USER_DATA_SUCCESS', payload: result });
      }
      callback(null, result);
    } catch (error) {
      if (Meteor.userId() !== userId) return;
      callback(error);
      if (name !== 'getUserData') {
        try {
          const data = await Meteor.callAsync('getUserData');
          if (Meteor.userId() === userId) {
            store.dispatch({
              type: 'HOME_GET_USER_DATA_SUCCESS',
              payload: {
                ...data,
                email: data.emails[0]?.address || ''
              }
            });
          }
        } catch {
          // The original request error is already displayed by the caller.
        }
      }
    }
  });
}
