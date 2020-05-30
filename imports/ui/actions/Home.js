export const homeSignOut = () => {
  return {
    type: 'SIGN_OUT'
  };
};

export const homeGetUserDataRequest = () => {
  return {
    type: 'HOME_GET_USER_DATA_REQUEST'
  };
};

export const homeGetUserDataSuccess = (data) => {
  return {
    type: 'HOME_GET_USER_DATA_SUCCESS',
    payload: data
  };
};

export const homeGetUserDataFailure = () => {
  return {
    type: 'HOME_GET_USER_DATA_FAILURE'
  };
};

export const homeDragAndDropRequest = (result) => {
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

export const homeCreateTodolistRequest = (column) => {
  return {
    type: 'HOME_CREATE_TODOLIST_REQUEST',
    payload: column
  };
};

export const homeCreateTodolistSuccess = () => {
  return {
    type: 'HOME_CREATE_TODOLIST_SUCCESS'
  };
};

export const homeCreateTodolistFailure = () => {
  return {
    type: 'HOME_CREATE_TODOLIST_FAILURE'
  };
};
