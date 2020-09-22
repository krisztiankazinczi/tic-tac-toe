import { SET_USER } from './action_types';

export const setUser = (payload) => {
  return {
    type: SET_USER,
    payload
  }
}