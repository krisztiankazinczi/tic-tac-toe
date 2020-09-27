import { SET_USER } from "./action_types";

export const initialState = {
  username: Math.random(),
};

const reducer = (state, { type, payload }) => {
  switch (type) {
    case SET_USER:
      return {
        ...state,
        username: payload,
      };

    default:
      return state;
  }
};

export default reducer;
