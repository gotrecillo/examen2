export function editUser(name, picture, callback) {
  return (dispatch, getState) => {
    const { firebase, auth } = getState();
    firebase.child(`users/${auth.id}`)
      .set({ name, picture: picture || null }, error => {
        if (error) {
          console.error('ERROR @ updatePoll :', error); // eslint-disable-line no-console
      } else {
        callback();
      }
    });
  };
}
