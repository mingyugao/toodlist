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
