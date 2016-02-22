import { SET_USER } from '../actions/menu';

export default function authReducer(state = {}, action) {
  switch (action.type) {
    case SET_USER:
      return action.user;
    default:
      return state;
  }
}
