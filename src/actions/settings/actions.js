export function editUser(user, callback) {
  return (dispatch, getState) => {
    const { firebase, auth } = getState();
    firebase.child(`users/${auth.id}`)
      .set(user, error => {
        if (error) {
          console.error('ERROR @ updatePoll :', error); // eslint-disable-line no-console
      } else {
        callback();
      }
    });
  };
}
