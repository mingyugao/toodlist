const homeReducer = (
  state = {
    todos: {},
    columns: {},
    columnOrder: []
  },
  action
) => {
  if (action.type === 'HOME_CREATE_TODOLIST') {
    const newColumnId = Date.now();
    const newColumn = {
      id: newColumnId,
      title: 'my todolist',
      todoIds: []
    };

    return {
      ...state,
      columns: {
        ...state.columns,
        [newColumnId]: newColumn
      },
      columnOrder: [ ...state.columnOrder, newColumnId ]
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
      reason,
      draggableId,
      source,
      destination
    } = action.payload;

    if (
      reason === 'CANCEL' ||
      !destination ||
      source.droppableId !== destination.droppableId
    ) return state;

    const column = state.columns[source.droppableId];
    const newTaskIds = [ ...column.todoIds ];
    newTaskIds.splice(source.index, 1);
    newTaskIds.splice(destination.index, 0, draggableId);
    const newColumn = { ...column, todoIds: newTaskIds };

    return {
      ...state,
      columns: {
        ...state.columns,
        [newColumn.id]: newColumn
      }
    };
  } else if (action.type === 'COLUMN_CREATE_TODO_REQUEST') {
    const { cid, todoContent } = action.payload;

    const newTodoId = Date.now();
    const newTodos = {
      ...state.todos,
      [newTodoId]: {
        id: newTodoId,
        content: todoContent
      }
    };

    const newColumns = { ...state.columns };
    newColumns[cid].todoIds.push(newTodoId);

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
    const newTodos = { ...state.todos };
    delete newTodos[action.payload.id]
    const newColumns = { ...state.columns };

    Object.keys(newColumns).forEach(cid => {
      newColumns[cid].todoIds = newColumns[cid]
        .todoIds
        .filter(tid => {
          return tid !== action.payload.id;
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
