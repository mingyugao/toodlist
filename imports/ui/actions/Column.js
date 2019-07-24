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

export const columnCreateTodoRequest = (cid, todoContent) => {
  return {
    type: 'COLUMN_CREATE_TODO_REQUEST',
    payload: { cid, todoContent }
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
