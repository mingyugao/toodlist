import assert from 'assert';
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { createBoardMethods } from '../imports/api/board-methods.mjs';

if (Meteor.isServer) {
  describe('board methods with MongoDB', function () {
    let alice;
    let bob;
    const methods = createBoardMethods(Meteor.users, Meteor.Error);

    beforeEach(async function () {
      alice = Random.id();
      bob = Random.id();
      for (const id of [alice, bob]) {
        await Meteor.users.insertAsync({
          _id: id,
          emails: [{ address: `${id}@example.invalid` }],
          services: { password: { bcrypt: 'test-only-secret' } }
        });
      }
    });

    afterEach(async function () {
      await Meteor.users.removeAsync({ _id: { $in: [alice, bob] } });
    });

    it('returns a fresh board without account secrets', async function () {
      const data = await methods.getUserData.call({ userId: alice });
      assert.deepStrictEqual(data.todos, {});
      assert.deepStrictEqual(data.columnOrder, []);
      assert.strictEqual(data.services, undefined);
      assert.strictEqual(data._id, undefined);
    });

    it('denies unauthenticated access and isolates user writes', async function () {
      await assert.rejects(methods.getUserData.call({ userId: null }), {
        error: 401
      });
      await methods.createTodolist.call(
        { userId: alice },
        {
          id: 'work',
          title: 'Work',
          color: 'white',
          todoIds: []
        }
      );
      await assert.rejects(
        methods.updateTitle.call({ userId: bob }, 'work', 'Other'),
        { error: 404 }
      );
      assert.strictEqual(
        (await Meteor.users.findOneAsync(alice)).columns.work.title,
        'Work'
      );
      assert.strictEqual(
        (await Meteor.users.findOneAsync(bob)).columns,
        undefined
      );
    });

    it('persists concurrent edits without overwriting other board changes', async function () {
      await Promise.all(
        ['first', 'second'].map((id) =>
          methods.createTodolist.call(
            { userId: alice },
            { id, title: id, color: 'white', todoIds: [] }
          )
        )
      );
      const data = await methods.getUserData.call({ userId: alice });
      assert.deepStrictEqual(data.columnOrder.sort(), ['first', 'second']);
      assert.strictEqual(
        (await Meteor.users.findOneAsync(alice)).services.password.bcrypt,
        'test-only-secret'
      );
    });
  });
}
