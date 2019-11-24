const signInReducer = (
  state = {
    isLoading: false
  },
  action
) => {
  switch (action.type) {
    case 'SIGN_IN_REQUEST':
      return {
        ...state,
        isLoading: true
      };
    case 'SIGN_IN_SUCCESS':
      return {
        ...state,
        isLoading: false
      };
    case 'SIGN_IN_FAILURE':
      return {
        ...state,
        isLoading: false
      };
    default:
      return state;
  }
};

export default signInReducer;
