const homeReducer = (
  state = {
    todos: {
      todo1: { id: 'todo1', content: 'Take out the garbage' },
      todo2: { id: 'todo2', content: 'Pet the himbs' },
      todo3: { id: 'todo3', content: 'Eat dinner' },
      todo4: { id: 'todo4', content: 'patto the catto then hamb post and something else' }
    },
    columns: {
      column1: {
        id: 'column1',
        title: 'my todos for today',
        taskIds: ['todo1', 'todo2', 'todo3', 'todo4']
      }
    },
    columnOrder: ['column1']
  },
  action
) => {
  if (action.type === 'COLUMN_UPDATE_TITLE_REQUEST') {
    const { cid, title } = action.payload;
    return {
      ...state,
      columns: {
        ...state.columns,
        [cid]: { ...state.columns[cid], title }
      }
    };
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
    const newTaskIds = [ ...column.taskIds ];
    newTaskIds.splice(source.index, 1);
    newTaskIds.splice(destination.index, 0, draggableId);
    const newColumn = { ...column, taskIds: newTaskIds };

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
    newColumns[cid].taskIds.push(newTodoId);

    return {
      ...state,
      todos: newTodos,
      columns: newColumns
    };
  } else if (action.type === 'TODO_EDIT_REQUEST') {
    return {
      ...state,
    };
  } else if (action.type === 'TODO_REMOVE_REQUEST') {
    const newTodos = { ...state.todos };
    delete newTodos[action.payload.id]
    const newColumns = { ...state.columns };

    Object.keys(newColumns).forEach(cid => {
      newColumns[cid].taskIds = newColumns[cid]
        .taskIds
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
