const settingsReducer = (
  state = {
    visible: false,
    email: '',
    avatarSrc: ''
  },
  action
) => {
  switch (action.type) {
    case 'OPEN_SETTINGS':
      return {
        ...state,
        visible: true
      };
    case 'CLOSE_SETTINGS':
      return {
        ...state,
        visible: false
      };
    case 'SETTINGS_ON_CHANGE_AVATAR_SRC':
      return {
        ...state,
        avatarSrc: action.payload
      };
    case 'SETTINGS_ON_CHANGE_EMAIL':
      return {
        ...state,
        email: action.payload
      };
    default:
      return state;
  }
};

export default settingsReducer;
