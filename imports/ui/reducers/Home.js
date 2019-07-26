const homeReducer = (
  state = {
    todos: {},
    columns: {},
    columnOrder: []
  },
  action
) => {
  if (action.type === 'HOME_GET_TODOS_SUCCESS') {
    return {
      ...state,
      ...action.payload
    };
  } else if (action.type === 'HOME_CREATE_TODOLIST_REQUEST') {
    return {
      ...state,
      columns: {
        ...state.columns,
        [action.payload.id]: action.payload
      },
      columnOrder: [ ...state.columnOrder, action.payload.id ]
    };
  } else if (action.type === 'COLUMN_UPDATE_TITLE_REQUEST') {
    const { cid, title } = action.payload;
    return {
      ...state,
      columns: {
        ...state.columns,
        [cid]: { ...state.columns[cid], title }
      }
    };
  } else if (action.type === 'COLUMN_DELETE_TODOLIST_REQUEST') {
    const cid = action.payload;

    const todoIdsToDelete = [ ...state.columns[cid].todoIds ];
    const newTodos = { ...state.todos };
    Object.keys(newTodos).forEach(tid => {
      if (todoIdsToDelete.map(tid => tid.toString()).includes(tid)) {
        delete newTodos[tid];
      }
    });

    const newColumns = { ...state.columns };
    delete newColumns[cid];

    const newColumnOrder = state.columnOrder.filter(c => c !== cid);

    return {
      ...state,
      todos: newTodos,
      columns: newColumns,
      columnOrder: newColumnOrder
    }
  } else if (action.type === 'HOME_DRAG_AND_DROP_REQUEST') {
    const {
      draggableId,
      source,
      destination
    } = action.payload;

    const sourceColumn = state.columns[source.droppableId];
    const newSourceTodoIds = [ ...sourceColumn.todoIds ];
    newSourceTodoIds.splice(source.index, 1);
    const newSourceColumn = { ...sourceColumn, todoIds: newSourceTodoIds };

    const destinationColumn = state.columns[destination.droppableId];
    const newDestinationTodoIds = source.droppableId === destination.droppableId
      ? newSourceTodoIds
      : [ ...destinationColumn.todoIds ];
    newDestinationTodoIds.splice(destination.index, 0, draggableId);
    const newDestinationColumn = {
      ...destinationColumn,
      todoIds: newDestinationTodoIds
    };

    return {
      ...state,
      columns: {
        ...state.columns,
        [newSourceColumn.id]: newSourceColumn,
        [newDestinationColumn.id]: newDestinationColumn
      }
    };
  } else if (action.type === 'COLUMN_CREATE_TODO_REQUEST') {
    const { cid, newTodo } = action.payload;

    const newTodos = {
      ...state.todos,
      [newTodo.id]: newTodo
    };

    const newColumns = { ...state.columns };
    newColumns[cid].todoIds.push(newTodo.id);

    return {
      ...state,
      todos: newTodos,
      columns: newColumns
    };
  } else if (action.type === 'TODO_EDIT_REQUEST') {
    const { id } = action.payload;
    return {
      ...state,
      todos: {
        ...state.todos,
        [id]: action.payload
      }
    };
  } else if (action.type === 'TODO_DELETE_REQUEST') {
    const tid = action.payload;
    const newTodos = { ...state.todos };
    delete newTodos[tid]
    const newColumns = { ...state.columns };

    Object.keys(newColumns).forEach(cid => {
      newColumns[cid].todoIds = newColumns[cid]
        .todoIds
        .filter(id => {
          return id !== tid;
        });
    });

    return {
      ...state,
      todos: newTodos,
      columns: newColumns
    };
  }
  return state;
};

export default homeReducer;