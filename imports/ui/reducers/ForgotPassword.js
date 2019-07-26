const forgotPasswordReducer = (
  state = {
    email: '',
    isLoading: false,
    isSent: false
  },
  action
) => {
  switch (action.type) {
    case 'FORGOT_PASSWORD_ON_CHANGE_EMAIL':
      return {
        ...state,
        email: action.payload
      };
    case 'FORGOT_PASSWORD_SEND_LINK_REQUEST':
      return {
        ...state,
        isLoading: true
      };
    case 'FORGOT_PASSWORD_SEND_LINK_SUCCESS':
      return {
        ...state,
        email: '',
        isLoading: false,
        isSent: true
      };
    case 'FORGOT_PASSWORD_SEND_LINK_FAILURE':
      return {
        ...state,
        isLoading: false
      };
    default:
      return state;
  }
};

export default forgotPasswordReducer;
