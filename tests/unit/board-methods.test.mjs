import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createBoardMethods } from '../../imports/api/board-methods.mjs';

class AppError extends Error {
  constructor(error, reason) {
    super(reason);
    this.error = error;
  }
}

function setup() {
  const records = new Map(
    ['alice', 'bob'].map((key) => [
      key,
      {
        _id: key,
        emails: [{ address: `${key}@example.invalid`, verified: false }],
        services: {
          password: { bcrypt: 'private-hash' },
          resume: { loginTokens: ['private-token'] }
        }
      }
    ])
  );
  const users = {
    // Return secrets too, so tests verify the response whitelist independently
    // of MongoDB's field projection.
    async findOneAsync(key) {
      return structuredClone(records.get(key));
    },
    async updateAsync(selector, update) {
      const user = records.get(selector._id);
      const revision = selector.boardRevision;
      const matches =
        typeof revision === 'object'
          ? user.boardRevision === undefined
          : user.boardRevision === revision;
      if (!matches) return 0;
      Object.assign(user, structuredClone(update.$set));
      user.boardRevision =
        (user.boardRevision || 0) + update.$inc.boardRevision;
      return 1;
    }
  };
  const methods = createBoardMethods(users, AppError);
  const call = (name, ...args) =>
    methods[name].apply({ userId: 'alice' }, args);
  const list = (key) =>
    call('createTodolist', {
      id: key,
      title: key,
      color: 'white',
      todoIds: []
    });
  return { records, users, methods, call, list };
}

test('a new account receives an empty board without private account fields', async () => {
  const { call } = setup();
  assert.deepEqual(await call('getUserData'), {
    emails: [{ address: 'alice@example.invalid' }],
    avatarSrc: '',
    todos: {},
    columns: {},
    columnOrder: []
  });
});

test('all board methods reject signed-out callers', async () => {
  const { methods, records } = setup();
  const before = structuredClone(records);
  const cases = {
    getUserData: [],
    updateAvatarSrc: [''],
    createTodolist: [
      { id: 'list', title: 'List', todoIds: [], color: 'white' }
    ],
    updateTitle: ['list', 'Title'],
    updateColor: ['list', 'blue'],
    deleteTodolist: ['list'],
    createTodo: ['list', { id: 'todo', content: 'Task' }],
    editTodo: [{ id: 'todo', content: 'Task' }],
    deleteTodo: ['todo'],
    dragAndDrop: [{ destination: null }]
  };
  for (const [name, args] of Object.entries(cases)) {
    await assert.rejects(
      methods[name].apply({ userId: null }, args),
      { error: 401 },
      name
    );
  }
  assert.deepEqual(records, before);
});

test('caller-supplied user IDs cannot read or change another account', async () => {
  const { call, list, methods, records } = setup();
  const bobBefore = structuredClone(records.get('bob'));
  assert.equal(
    (await call('getUserData', 'bob')).emails[0].address,
    'alice@example.invalid'
  );
  await list('alice-list');
  await assert.rejects(
    methods.updateTitle.call({ userId: 'bob' }, 'alice-list', 'Stolen'),
    { error: 404 }
  );
  await assert.rejects(
    call('updateAvatarSrc', 'bob', 'https://example.com/avatar.png'),
    { error: 400 }
  );
  assert.deepEqual(records.get('bob'), bobBefore);
  assert.equal(records.get('alice').columns['alice-list'].title, 'alice-list');
});

test('lists and todos persist edits, colors, avatar changes and deletions', async () => {
  const { call, list, records } = setup();
  const services = structuredClone(records.get('alice').services);
  await list('work');
  await call('updateTitle', 'work', 'Work');
  await call('updateColor', 'work', 'blue');
  await call('updateAvatarSrc', 'https://example.com/avatar.png');
  await call('createTodo', 'work', {
    id: 'first',
    content: 'Original',
    ignored: 'untrusted'
  });
  await call('editTodo', { id: 'first', content: 'Edited' });
  const data = await call('getUserData');
  assert.deepEqual(data.todos.first, { id: 'first', content: 'Edited' });
  assert.equal(data.columns.work.title, 'Work');
  assert.equal(data.columns.work.color, 'blue');
  assert.equal(data.avatarSrc, 'https://example.com/avatar.png');
  await call('deleteTodo', 'first');
  assert.deepEqual((await call('getUserData')).columns.work.todoIds, []);
  await call('createTodo', 'work', { id: 'second', content: 'Also removed' });
  await call('deleteTodolist', 'work');
  const empty = await call('getUserData');
  assert.deepEqual(
    [empty.todos, empty.columns, empty.columnOrder],
    [{}, {}, []]
  );
  assert.deepEqual(records.get('alice').services, services);
});

test('dragging preserves every todo when reordering or moving between lists', async () => {
  const { call, list } = setup();
  await list('a');
  await list('b');
  await call('createTodo', 'a', { id: 'one', content: 'One' });
  await call('createTodo', 'a', { id: 'two', content: 'Two' });
  await call('dragAndDrop', {
    type: 'todo',
    draggableId: 'one',
    source: { droppableId: 'a', index: 0 },
    destination: { droppableId: 'a', index: 1 }
  });
  assert.deepEqual((await call('getUserData')).columns.a.todoIds, [
    'two',
    'one'
  ]);
  await call('dragAndDrop', {
    type: 'todo',
    draggableId: 'one',
    source: { droppableId: 'a', index: 1 },
    destination: { droppableId: 'b', index: 0 }
  });
  await call('dragAndDrop', {
    type: 'column',
    draggableId: 'a',
    source: { droppableId: 'main-droppable-container', index: 0 },
    destination: { droppableId: 'main-droppable-container', index: 1 }
  });
  const data = await call('getUserData');
  assert.deepEqual(data.columnOrder, ['b', 'a']);
  assert.deepEqual(data.columns.a.todoIds, ['two']);
  assert.deepEqual(data.columns.b.todoIds, ['one']);
  assert.deepEqual(Object.keys(data.todos).sort(), ['one', 'two']);
});

test('malformed input, object selectors, unsafe keys and stale moves do not alter data', async () => {
  const { call, list, records } = setup();
  await list('work');
  await call('createTodo', 'work', { id: 'one', content: 'One' });
  const before = structuredClone(records);
  for (const key of [
    '__proto__',
    'constructor',
    'prototype',
    'a.b',
    '$where',
    { $ne: null }
  ]) {
    await assert.rejects(call('deleteTodolist', key), { error: 400 });
  }
  for (const value of [
    null,
    [],
    { content: 'No ID' },
    { id: 'two', content: '' }
  ]) {
    await assert.rejects(call('createTodo', 'work', value), { error: 400 });
  }
  await assert.rejects(call('updateColor', 'work', 'arbitrary-class'), {
    error: 400
  });
  await assert.rejects(call('updateTitle', 'work', 'x'.repeat(201)), {
    error: 400
  });
  await assert.rejects(call('updateAvatarSrc', 'javascript:alert(1)'), {
    error: 400
  });
  await assert.rejects(
    call('createTodo', 'work', { id: 'one', content: 'Duplicate' }),
    { error: 409 }
  );
  await assert.rejects(
    call('dragAndDrop', {
      type: 'todo',
      draggableId: 'one',
      source: { droppableId: 'work', index: 2 },
      destination: { droppableId: 'work', index: 0 }
    }),
    { error: 400 }
  );
  assert.deepEqual(records, before);
});

test('concurrent writes retain both edits through revision retries', async () => {
  const { list, call } = setup();
  await Promise.all([list('one'), list('two')]);
  const data = await call('getUserData');
  assert.deepEqual(data.columnOrder.sort(), ['one', 'two']);
  assert.deepEqual(Object.keys(data.columns).sort(), ['one', 'two']);
});

test('missing accounts are rejected and canceled drags do not write', async () => {
  const { methods, records, call } = setup();
  await assert.rejects(methods.getUserData.call({ userId: 'missing' }), {
    error: 401
  });
  await call('dragAndDrop', { destination: null });
  assert.equal(records.get('alice').boardRevision, undefined);
});
