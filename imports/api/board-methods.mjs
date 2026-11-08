const colors = new Set([
  'white',
  'blue',
  'purple',
  'pink',
  'red',
  'orange',
  'yellow',
  'green'
]);

// Do not fetch services: it contains password hashes and session tokens.
const fields = {
  emails: 1,
  avatarSrc: 1,
  todos: 1,
  columns: 1,
  columnOrder: 1,
  boardRevision: 1
};

export function createBoardMethods(users, AppError) {
  const fail = (code, reason) => {
    throw new AppError(code, reason);
  };

  function text(value, name, max, allowEmpty = false) {
    if (
      typeof value !== 'string' ||
      value.length > max ||
      (!allowEmpty && !value.trim())
    ) {
      fail(400, `Invalid ${name}.`);
    }
    return value;
  }

  function id(value) {
    if (
      typeof value !== 'string' ||
      !/^[a-zA-Z0-9_-]{1,64}$/.test(value) ||
      ['__proto__', 'prototype', 'constructor'].includes(value)
    ) {
      fail(400, 'Invalid item ID.');
    }
    return value;
  }

  function object(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      fail(400, 'Invalid request.');
    }
    return value;
  }

  function color(value) {
    if (!colors.has(value)) fail(400, 'Invalid list color.');
    return value;
  }

  function board(user) {
    return {
      avatarSrc: user.avatarSrc || '',
      todos: user.todos || {},
      columns: user.columns || {},
      columnOrder: user.columnOrder || []
    };
  }

  async function read(context) {
    if (typeof context.userId !== 'string' || !context.userId) {
      fail(401, 'Please sign in.');
    }
    const user = await users.findOneAsync(context.userId, { fields });
    if (!user) fail(401, 'Please sign in again.');
    return user;
  }

  function existing(items, key) {
    id(key);
    if (!Object.hasOwn(items, key)) fail(404, 'Item no longer exists.');
    return items[key];
  }

  async function mutate(context, change) {
    // Compare-and-set prevents concurrent tabs from overwriting completed edits.
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const user = await read(context);
      const next = board(user);
      change(next);
      const selector = {
        _id: context.userId,
        boardRevision:
          user.boardRevision === undefined
            ? { $exists: false }
            : user.boardRevision
      };
      const updated = await users.updateAsync(selector, {
        $set: next,
        $inc: { boardRevision: 1 }
      });
      if (updated === 1) return next;
    }
    fail(409, 'Your board changed. Please try again.');
  }

  function index(value, max) {
    if (!Number.isInteger(value) || value < 0 || value > max) {
      fail(400, 'Invalid item position.');
    }
    return value;
  }

  return {
    async getUserData() {
      const user = await read(this);
      return {
        emails: (user.emails || []).map(({ address }) => ({ address })),
        ...board(user)
      };
    },

    async updateAvatarSrc(avatarSrc) {
      text(avatarSrc, 'avatar URL', 2048, true);
      if (avatarSrc) {
        let url;
        try {
          url = new URL(avatarSrc);
        } catch {
          fail(400, 'Invalid avatar URL.');
        }
        if (url.protocol !== 'https:' || url.username || url.password) {
          fail(400, 'Use an HTTPS image URL without credentials.');
        }
      }
      return mutate(this, (next) => {
        next.avatarSrc = avatarSrc;
      });
    },

    async createTodolist(newColumn) {
      object(newColumn);
      const cid = id(newColumn.id);
      const title = text(newColumn.title, 'list title', 200);
      const listColor = color(newColumn.color || 'white');
      if (!Array.isArray(newColumn.todoIds) || newColumn.todoIds.length) {
        fail(400, 'New lists must be empty.');
      }
      return mutate(this, (next) => {
        if (Object.hasOwn(next.columns, cid)) fail(409, 'List already exists.');
        if (next.columnOrder.length >= 100)
          fail(400, 'Maximum of 100 lists reached.');
        next.columns[cid] = { id: cid, title, color: listColor, todoIds: [] };
        next.columnOrder.push(cid);
      });
    },

    async updateTitle(cid, title) {
      text(title, 'list title', 200);
      return mutate(this, (next) => {
        existing(next.columns, cid).title = title;
      });
    },

    async updateColor(cid, value) {
      color(value);
      return mutate(this, (next) => {
        existing(next.columns, cid).color = value;
      });
    },

    async deleteTodolist(cid) {
      return mutate(this, (next) => {
        const column = existing(next.columns, cid);
        for (const tid of column.todoIds) delete next.todos[tid];
        delete next.columns[cid];
        next.columnOrder = next.columnOrder.filter((key) => key !== cid);
      });
    },

    async createTodo(cid, newTodo) {
      object(newTodo);
      const tid = id(newTodo.id);
      const content = text(newTodo.content, 'todo text', 5000);
      return mutate(this, (next) => {
        const column = existing(next.columns, cid);
        if (Object.hasOwn(next.todos, tid)) fail(409, 'Todo already exists.');
        if (Object.keys(next.todos).length >= 1000)
          fail(400, 'Maximum of 1000 todos reached.');
        next.todos[tid] = { id: tid, content };
        column.todoIds.push(tid);
      });
    },

    async editTodo(todo) {
      object(todo);
      text(todo.content, 'todo text', 5000);
      return mutate(this, (next) => {
        existing(next.todos, todo.id).content = todo.content;
      });
    },

    async deleteTodo(tid) {
      return mutate(this, (next) => {
        existing(next.todos, tid);
        delete next.todos[tid];
        for (const column of Object.values(next.columns)) {
          column.todoIds = column.todoIds.filter((key) => key !== tid);
        }
      });
    },

    async dragAndDrop(result) {
      object(result);
      const { draggableId, source, destination, type } = result;
      if (!destination) return board(await read(this));
      id(draggableId);
      object(source);
      object(destination);
      if (type !== 'column' && type !== 'todo') fail(400, 'Invalid drag type.');

      return mutate(this, (next) => {
        let from;
        let to;
        if (type === 'column') {
          if (
            source.droppableId !== 'main-droppable-container' ||
            destination.droppableId !== 'main-droppable-container'
          ) {
            fail(400, 'Invalid list destination.');
          }
          from = next.columnOrder;
          to = from;
        } else {
          existing(next.todos, draggableId);
          from = existing(next.columns, source.droppableId).todoIds;
          to = existing(next.columns, destination.droppableId).todoIds;
        }
        index(source.index, from.length - 1);
        index(destination.index, to.length - (from === to ? 1 : 0));
        if (from[source.index] !== draggableId) {
          fail(409, 'The item moved. Please try again.');
        }
        from.splice(source.index, 1);
        to.splice(destination.index, 0, draggableId);
      });
    }
  };
}
