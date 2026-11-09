import React, { createContext, useContext, useEffect, useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { useDispatch } from 'react-redux';
import message from 'antd/lib/message';
import { homeGetUserDataSuccess } from '../actions/Home';
import Loading from './Loading';

const SessionContext = createContext(null);

export const useAppSession = () => useContext(SessionContext);

export default function AppSession({ children }) {
  const { userId, loggingIn } = useTracker(() => ({
    userId: Meteor.userId(),
    loggingIn: Meteor.loggingIn()
  }));
  const dispatch = useDispatch();
  const [boardLoad, setBoardLoad] = useState({
    userId: null,
    status: 'idle'
  });

  useEffect(() => {
    let active = true;

    // Authentication changes invalidate the previous session's board and settings.
    // Startup status belongs to this request, independently of ordinary edits.
    dispatch({ type: 'SESSION_RESET' });
    setBoardLoad({ userId: null, status: 'idle' });

    if (userId && !loggingIn) {
      setBoardLoad({ userId, status: 'loading' });
      const loadBoard = async () => {
        try {
          const data = await Meteor.callAsync('getUserData');
          if (!active || Meteor.userId() !== userId) return;
          dispatch(
            homeGetUserDataSuccess({
              ...data,
              email: data.emails[0]?.address || ''
            })
          );
          setBoardLoad({ userId, status: 'ready' });
        } catch {
          if (!active || Meteor.userId() !== userId) return;
          setBoardLoad({ userId, status: 'error' });
          message.error(
            'Your board could not be loaded. Please refresh to try again.'
          );
        }
      };
      loadBoard();
    }

    // Also reject late responses after logging out and back into the same account.
    return () => {
      active = false;
    };
  }, [userId, loggingIn, dispatch]);

  const canShowBoard = Boolean(
    userId &&
    !loggingIn &&
    boardLoad.userId === userId &&
    boardLoad.status !== 'idle'
  );
  // Include the handoff before the effect starts the board request. The same
  // loader element stays mounted from authentication until the request settles.
  const isLoading = Boolean(
    loggingIn || (userId && (!canShowBoard || boardLoad.status === 'loading'))
  );

  return (
    <SessionContext.Provider value={{ userId, loggingIn, canShowBoard }}>
      <div inert={isLoading ? '' : undefined} aria-busy={isLoading}>
        {children}
      </div>
      {isLoading && <Loading />}
    </SessionContext.Provider>
  );
}
