export const columnUpdateTitleRequest = (cid, title) => {
  return {
    type: 'COLUMN_UPDATE_TITLE_REQUEST',
    payload: { cid, title }
  };
};

export const columnUpdateTitleSuccess = () => {
  return {
    type: 'COLUMN_UPDATE_TITLE_SUCCESS'
  };
};

export const columnUpdateTitleFailure = () => {
  return {
    type: 'COLUMN_UPDATE_TITLE_FAILURE'
  };
};

export const columnDeleteTodolistRequest = cid => {
  return {
    type: 'COLUMN_DELETE_TODOLIST_REQUEST',
    payload: cid
  };
};

export const columnDeleteTodolistSuccess = () => {
  return {
    type: 'COLUMN_DELETE_TODOLIST_SUCCESS'
  };
};

export const columnDeleteTodolistFailure = () => {
  return {
    type: 'COLUMN_DELETE_TODOLIST_FAILURE'
  };
};

export const columnCreateTodoRequest = (cid, newTodo) => {
  return {
    type: 'COLUMN_CREATE_TODO_REQUEST',
    payload: { cid, newTodo }
  }
};

export const columnCreateTodoSuccess = () => {
  return {
    type: 'COLUMN_CREATE_TODO_SUCCESS'
  }
};

export const columnCreateTodoFailure = () => {
  return {
    type: 'COLUMN_CREATE_TODO_FAILURE'
  }
};
