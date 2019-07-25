export const todoEditRequest = todo => {
  return {
    type: 'TODO_EDIT_REQUEST',
    payload: todo
  };
};

export const todoEditSuccess = () => {
  return {
    type: 'TODO_EDIT_SUCCESS'
  };
};

export const todoEditFailure = () => {
  return {
    type: 'TODO_EDIT_FAILURE'
  };
};

export const todoDeleteRequest = todo => {
  return {
    type: 'TODO_DELETE_REQUEST',
    payload: todo
  };
};

export const todoDeleteSuccess = () => {
  return {
    type: 'TODO_DELETE_SUCCESS'
  };
};

export const todoDeleteFailure = () => {
  return {
    type: 'TODO_DELETE_FAILURE'
  };
};
