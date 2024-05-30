import firebase, { auth } from './firebase';
import * as firebaseui from 'firebaseui';

const uiConfig = {
  callbacks: {
    // signInSuccessWithAuthResult: (authResult: firebase.auth.UserCredential, redirectUrl: string) => {
    //   // User successfully signed in.
    //   return true;
    // },
    uiShown: () => {
      // The widget is rendered. Hide the loader.
      const loader = document.getElementById('loader');
      if (loader) {
        loader.style.display = 'none';
      }
    },
  },
  signInFlow: 'popup',
  signInSuccessUrl: '/', // Adjust the redirect URL as needed
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
  ],
  tosUrl: '<your-tos-url>',
  privacyPolicyUrl: '<your-privacy-policy-url>',
};

const ui = new firebaseui.auth.AuthUI(auth);

export const startFirebaseUI = (elementId: string) => {
  ui.start(elementId, uiConfig);
  console.log('FirebaseUI started.');
};
