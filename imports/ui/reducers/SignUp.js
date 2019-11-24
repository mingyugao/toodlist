const signUpReducer = (
  state = {
    isLoading: false
  },
  action
) => {
  switch (action.type) {
    case 'SIGN_UP_REQUEST':
      return {
        ...state,
        isLoading: true
      };
    case 'SIGN_UP_SUCCESS':
      return {
        ...state,
        isLoading: false
      };
    case 'SIGN_UP_FAILURE':
      return {
        ...state,
        isLoading: false
      };
    default:
      return state;
  }
};

export default signUpReducer;
