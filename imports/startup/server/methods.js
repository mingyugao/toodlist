Meteor.methods({
  getUserData: userId => {
    const user = Meteor.users.findOne(userId);
    if (user.todos === undefined) {
      Meteor.users.update(userId, {
        $set: { todos: {}, columns: {}, columnOrder: [] }
      });
    }
    return {
      ...user,
      todos: user.todos || {},
      columns: user.columns || {},
      columnOrder: user.columnOrder
    };
  },
  createTodolist: (userId, newColumn) => {
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
