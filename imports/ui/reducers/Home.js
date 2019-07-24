const homeReducer = (
  state = {
    todos: {
      todo1: { id: 'todo1', content: 'Take out the garbage' },
      todo2: { id: 'todo2', content: 'Pet the himbs' },
      todo3: { id: 'todo3', content: 'Eat dinner' }
    },
    columns: {
      column1: {
        id: 'column1',
        title: 'my todos for today',
        taskIds: ['todo1', 'todo2', 'todo3']
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
  }
  return state;
};

export default homeReducer;
