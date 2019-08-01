export const openSettings = () => {
  return {
    type: 'OPEN_SETTINGS'
  };
};

export const closeSettings = () => {
  return {
    type: 'CLOSE_SETTINGS'
  };
};

export const settingsChangeColumnColorRequest = (cid, color) => {
  return {
    type: 'SETTINGS_CHANGE_COLUMN_COLOR_REQUEST',
    payload: { cid, color }
  };
};

export const settingsChangeColumnColorSuccess = () => {
  return {
    type: 'SETTINGS_CHANGE_COLUMN_COLOR_SUCCESS'
  };
};

export const settingsChangeColumnColorFailure = () => {
  return {
    type: 'SETTINGS_CHANGE_COLUMN_COLOR_FAILURE'
  };
};
