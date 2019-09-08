Meteor.methods({
  getUserData: userId => {
    if (!userId) throw new Error();
    const user = Meteor.users.findOne(userId);
    if (user.todos === undefined) {
      Meteor.users.update(userId, {
        $set: {
          avatarSrc: '',
          todos: {},
          columns: {},
          columnOrder: []
        }
      });
    }
    return {
      ...user,
      avatarSrc: user.avatarSrc || '',
      todos: user.todos || {},
      columns: user.columns || {},
      columnOrder: user.columnOrder || []
    };
  },
  updateAvatarSrc: (userId, avatarSrc) => {
    const user = Meteor.users.findOne(userId);
    try {
      Meteor.users.update(userId, {
        $set: { avatarSrc }
      });
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  },
  createTodolist: (userId, newColumn) => {
    const user = Meteor.users.findOne(userId);
    try {
      Meteor.users.update(userId, {
        $set: {
          columns: {
            ...user.columns,
            [newColumn.id]: newColumn
          },
          columnOrder: [ ...user.columnOrder, newColumn.id ]
        }
      });
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  },
  updateTitle: (userId, cid, title) => {
    const user = Meteor.users.findOne(userId);
    try {
      Meteor.users.update(userId, {
        $set: {
          columns: {
            ...user.columns,
            [cid]: { ...user.columns[cid], title }
          }
        }
      });
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  },
  updateColor: (userId, cid, color) => {
    const user = Meteor.users.findOne(userId);
    try {
      Meteor.users.update(userId, {
        $set: {
          columns: {
            ...user.columns,
            [cid]: { ...user.columns[cid], color }
          }
        }
      });
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  },
  deleteTodolist: (userId, cid) => {
    const user = Meteor.users.findOne(userId);

    const todoIdsToDelete = [ ...user.columns[cid].todoIds ];
    const newTodos = { ...user.todos };
    Object.keys(newTodos).forEach(tid => {
      if (todoIdsToDelete.map(tid => tid.toString()).includes(tid)) {
        delete newTodos[tid];
      }
    });

    const newColumns = { ...user.columns };
    delete newColumns[cid];

    const newColumnOrder = user.columnOrder.filter(c => c !== cid);

    try {
      Meteor.users.update(userId, {
        $set: {
          todos: newTodos,
          columns: newColumns,
          columnOrder: newColumnOrder
        }
      });
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  },
  createTodo: (userId, cid, newTodo) => {
    const user = Meteor.users.findOne(userId);

    const newTodos = {
      ...user.todos,
      [newTodo.id]: newTodo
    };

    const newColumns = { ...user.columns };
    newColumns[cid].todoIds.push(newTodo.id);

    try {
      Meteor.users.update(userId, {
        $set: {
          todos: newTodos,
          columns: newColumns
        }
      });
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  },
  editTodo: (userId, todo) => {
    const user = Meteor.users.findOne(userId);
    try {
      Meteor.users.update(userId, {
        $set: {
          todos: {
            ...user.todos,
            [todo.id]: todo
          }
        }
      });
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  },
  deleteTodo: (userId, tid) => {
    const user = Meteor.users.findOne(userId);

    const newTodos = { ...user.todos };
    delete newTodos[tid]
    const newColumns = { ...user.columns };

    Object.keys(newColumns).forEach(cid => {
      newColumns[cid].todoIds = newColumns[cid]
        .todoIds
        .filter(id => {
          return id !== tid;
        });
    });

    try {
      Meteor.users.update(userId, {
        $set: {
          todos: newTodos,
          columns: newColumns
        }
      });
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  },
  dragAndDrop: (userId, result) => {
    const user = Meteor.users.findOne(userId);

    const {
      draggableId,
      source,
      destination,
      type
    } = result;

    if (type === 'column') {
      const newColumnOrder = [ ...user.columnOrder ];
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);

      try {
        Meteor.users.update(userId, {
          $set: {
            columnOrder: newColumnOrder
          }
        });
      } catch (e) {
        console.log(e);
        throw new Error();
      }
    } else {
      const sourceColumn = user.columns[source.droppableId];
      const newSourceTodoIds = [ ...sourceColumn.todoIds ];
      newSourceTodoIds.splice(source.index, 1);
      const newSourceColumn = { ...sourceColumn, todoIds: newSourceTodoIds };

      const destinationColumn = user.columns[destination.droppableId];
      const newDestinationTodoIds = source.droppableId === destination.droppableId
        ? newSourceTodoIds
        : [ ...destinationColumn.todoIds ];
      newDestinationTodoIds.splice(destination.index, 0, draggableId);
      const newDestinationColumn = {
        ...destinationColumn,
        todoIds: newDestinationTodoIds
      };

      try {
        Meteor.users.update(userId, {
          $set: {
            columns: {
              ...user.columns,
              [newSourceColumn.id]: newSourceColumn,
              [newDestinationColumn.id]: newDestinationColumn
            }
          }
        });
      } catch (e) {
        console.log(e);
        throw new Error();
      }
    }
  },
  sendPasswordResetLink: email => {
    const user = Accounts.findUserByEmail(email);
    if (user) {
      Accounts.sendResetPasswordEmail(user._id);
    } else {
      throw new Error();
    }
  }
});
