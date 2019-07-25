export const homeSignOut = () => {
  return {
    type: 'SIGN_OUT'
  };
};

export const homeDragAndDropRequest = result => {
  return {
    type: 'HOME_DRAG_AND_DROP_REQUEST',
    payload: result
  };
};

export const homeDragAndDropSuccess = () => {
  return {
    type: 'HOME_DRAG_AND_DROP_SUCCESS'
  };
};

export const homeDragAndDropFailure = () => {
  return {
    type: 'HOME_DRAG_AND_DROP_FAILURE'
  };
};

export const homeCreateTodolist = () => {
  return {
    type: 'HOME_CREATE_TODOLIST'
  };
};
