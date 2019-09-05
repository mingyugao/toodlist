Meteor.methods({
  getUserData: userId => {
    console.log('getUserData', 'userId', userId);
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
    console.log('updateAvatarSrc', 'userId', userId, 'avatarSrc', avatarSrc);
    const user = Meteor.users.findOne(userId);
    Meteor.users.update(userId, {
      $set: { avatarSrc }
    }, err => {
      if (err) return err;
    });
  },
  createTodolist: (userId, newColumn) => {
    console.log('createTodolist', 'userId', userId, 'newColumn', newColumn);
    const user = Meteor.users.findOne(userId);
    Meteor.users.update(userId, {
      $set: {
        columns: {
          ...user.columns,
          [newColumn.id]: newColumn
        },
        columnOrder: [ ...user.columnOrder, newColumn.id ]
      }
    }, err => {
      if (err) return err;
    });
  },
  updateTitle: (userId, cid, title) => {
    console.log('updateTitle', 'userId', userId, 'cid', cid, 'title', title);
    const user = Meteor.users.findOne(userId);
    Meteor.users.update(userId, {
      $set: {
        columns: {
          ...user.columns,
          [cid]: { ...user.columns[cid], title }
        }
      }
    }, err => {
      if (err) return err;
    });
  },
  updateColor: (userId, cid, color) => {
    console.log('updateColor', 'userId', userId, 'cid', cid, 'color', color);
    const user = Meteor.users.findOne(userId);
    Meteor.users.update(userId, {
      $set: {
        columns: {
          ...user.columns,
          [cid]: { ...user.columns[cid], color }
        }
      }
    }, err => {
      if (err) return err;
    });
  },
  deleteTodolist: (userId, cid) => {
    console.log('deleteTodolist', 'userId', userId, 'cid', cid);
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

    Meteor.users.update(userId, {
      $set: {
        todos: newTodos,
        columns: newColumns,
        columnOrder: newColumnOrder
      }
    }, err => {
      if (err) return err;
    });
  },
  createTodo: (userId, cid, newTodo) => {
    console.log('createTodo', 'userId', userId, 'cid', cid, 'newTodo', newTodo);
    const user = Meteor.users.findOne(userId);

    const newTodos = {
      ...user.todos,
      [newTodo.id]: newTodo
    };

    const newColumns = { ...user.columns };
    newColumns[cid].todoIds.push(newTodo.id);

    Meteor.users.update(userId, {
      $set: {
        todos: newTodos,
        columns: newColumns
      }
    }, err => {
      if (err) return err;
    });
  },
  editTodo: (userId, todo) => {
    console.log('editTodo', 'userId', userId, 'todo', todo);
    const user = Meteor.users.findOne(userId);
    Meteor.users.update(userId, {
      $set: {
        todos: {
          ...user.todos,
          [todo.id]: todo
        }
      }
    }, err => {
      if (err) return err;
    });
  },
  deleteTodo: (userId, tid) => {
    console.log('deleteTodo', 'userId', userId, 'tid', tid);
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

    Meteor.users.update(userId, {
      $set: {
        todos: newTodos,
        columns: newColumns
      }
    }, err => {
      if (err) return err;
    });
  },
  dragAndDrop: (userId, result) => {
    console.log('dragAndDrop', 'userId', userId, 'result', result);
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

      Meteor.users.update(userId, {
        $set: {
          columnOrder: newColumnOrder
        }
      }, err => {
        if (err) return err;
      });
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

      Meteor.users.update(userId, {
        $set: {
          columns: {
            ...user.columns,
            [newSourceColumn.id]: newSourceColumn,
            [newDestinationColumn.id]: newDestinationColumn
          }
        }
      }, err => {
        if (err) return err;
      });
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
