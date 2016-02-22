import {
  SET_POLLS,
  ADD_POLL_ERROR,
  REMOVE_POLL_ERROR
} from './action-types';

import { createActionConfirmation } from '../confirm';
import Firebase from 'firebase';

export function setPolls(polls) {
  return { type: SET_POLLS, polls };
}

export function addPoll(title) {
  return (dispatch, getState) => {
    const { firebase, auth } = getState();
    const newPollRef = firebase.child('polls')
      .push({ title, createdAt: Firebase.ServerValue.TIMESTAMP, state: 'locked' }, error => {
        if (error) {
          console.error('ERROR @ addPoll :', error); // eslint-disable-line no-console
          dispatch({
            type: ADD_POLL_ERROR,
            payload: error,
        });
      } else {
        const pollId = newPollRef.key();
        const userId = auth.id;
        firebase.child(`myPolls/${userId}/${pollId}`).set({ state: 'locked' });
      }
    });
  };
}


export function unlockPoll(idPoll) {
  return (dispatch, getState) => {
    const { firebase, auth } = getState();
    firebase.child(`polls/${idPoll}/state`).set('unlocked', error => {
        if (error) {
          console.error('ERROR @ unlockPoll :', error); // eslint-disable-line no-console
          dispatch({
            type: ADD_POLL_ERROR,
            payload: error,
        });
      } else {
        const userId = auth.id;
        firebase.child(`myPolls/${userId}/${idPoll}`).set({ state: 'unlocked' });
      }
    });
  };
}

export function closePoll(idPoll) {
  return (dispatch, getState) => {
    const { firebase, auth } = getState();
    firebase.child(`polls/${idPoll}/state`).set('closed', error => {
        if (error) {
          console.error('ERROR @ unlockPoll :', error); // eslint-disable-line no-console
          dispatch({
            type: ADD_POLL_ERROR,
            payload: error,
        });
      } else {
        const userId = auth.id;
        firebase.child(`myPolls/${userId}/${idPoll}`).set({ state: 'closed' });
      }
    });
  };
}

export function removePoll(pollId, pollTitle) {
  return (dispatch, getState) => {
    dispatch(createActionConfirmation(`Are you sure you want to delete de poll with title "${pollTitle}"?`, () => {
      const { firebase, auth } = getState();
      firebase.child(`polls/${pollId}`)
        .remove(error => {
          if (error) {
            console.error('ERROR @ removePoll :', error); // eslint-disable-line no-console
            dispatch({
              type: REMOVE_POLL_ERROR,
              payload: error,
            });
          } else {
            const userId = auth.id;
            firebase.child(`myPolls/${userId}/${pollId}`).remove();
          }
        });
    }));
  };
}

