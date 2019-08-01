const settingsReducer = (
  state = {
    visible: false
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
    default:
      return state;
  }
};

export default settingsReducer;
