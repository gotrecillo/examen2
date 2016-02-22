import { SET_USER } from './action-types';

export function registerListeners(id) {
  return (dispatch, getState) => {
    const { firebase } = getState();
    const ref = firebase.child(`users/${id}`);
    ref.on('value', snap => {
      if (snap.exists()){
        dispatch({type: SET_USER, user: snap.val() });
      }
    });
  };
}

export function unregisterListeners(id) {
  return (dispatch, getState) => {
    const { firebase } = getState();
    const ref = firebase.child(`users/${id}`);
    ref.off();
    dispatch({type: SET_USER, user: {} });
  };
}

