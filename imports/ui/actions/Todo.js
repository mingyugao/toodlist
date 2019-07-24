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

export const todoRemoveRequest = todo => {
  return {
    type: 'TODO_REMOVE_REQUEST',
    payload: todo
  };
};

export const todoRemoveSuccess = () => {
  return {
    type: 'TODO_REMOVE_SUCCESS'
  };
};

export const todoRemoveFailure = () => {
  return {
    type: 'TODO_REMOVE_FAILURE'
  };
};
