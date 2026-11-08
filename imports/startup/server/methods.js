import { Meteor } from 'meteor/meteor';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { createBoardMethods } from '../../api/board-methods.mjs';

export const boardMethods = createBoardMethods(Meteor.users, Meteor.Error);

Meteor.methods(boardMethods);

DDPRateLimiter.addRule(
  {
    type: 'method',
    name: (name) => Object.hasOwn(boardMethods, name),
    connectionId: () => true
  },
  120,
  60 * 1000
);
