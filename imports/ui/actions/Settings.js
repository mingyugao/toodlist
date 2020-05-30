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

export const settingsOnChangeEmail = (email) => {
  return {
    type: 'SETTINGS_ON_CHANGE_EMAIL',
    payload: email
  };
};

export const settingsUpdateEmailRequest = () => {
  return {
    type: 'SETTINGS_UPDATE_EMAIL_REQUEST'
  };
};

export const settingsUpdateEmailSuccess = () => {
  return {
    type: 'SETTINGS_UPDATE_EMAIL_SUCCESS'
  };
};

export const settingsUpdateEmailFailure = () => {
  return {
    type: 'SETTINGS_UPDATE_EMAIL_FAILURE'
  };
};

export const settingsOnChangeAvatarSrc = (avatarSrc) => {
  return {
    type: 'SETTINGS_ON_CHANGE_AVATAR_SRC',
    payload: avatarSrc
  };
};

export const settingsUpdateAvatarSrcRequest = (avatarSrc) => {
  return {
    type: 'SETTINGS_UPDATE_AVATAR_SRC_REQUEST',
    payload: avatarSrc
  };
};

export const settingsUpdateAvatarSrcSuccess = () => {
  return {
    type: 'SETTINGS_UPDATE_AVATAR_SRC_SUCCESS'
  };
};

export const settingsUpdateAvatarSrcFailure = () => {
  return {
    type: 'SETTINGS_UPDATE_AVATAR_SRC_FAILURE'
  };
};

export const settingsUpdateColumnColorRequest = (cid, color) => {
  return {
    type: 'SETTINGS_UPDATE_COLUMN_COLOR_REQUEST',
    payload: { cid, color }
  };
};

export const settingsUpdateColumnColorSuccess = () => {
  return {
    type: 'SETTINGS_UPDATE_COLUMN_COLOR_SUCCESS'
  };
};

export const settingsUpdateColumnColorFailure = () => {
  return {
    type: 'SETTINGS_UPDATE_COLUMN_COLOR_FAILURE'
  };
};
