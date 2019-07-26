export const todoEditRequest = newTodo => {
  return {
    type: 'TODO_EDIT_REQUEST',
    payload: newTodo
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

export const todoDeleteRequest = tid => {
  return {
    type: 'TODO_DELETE_REQUEST',
    payload: tid
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
