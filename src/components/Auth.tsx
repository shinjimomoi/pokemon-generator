import React, { useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/auth';
import * as firebaseui from 'firebaseui'; // Import all named exports

const AuthComponent: React.FC = () => {
  useEffect(() => {
    const uiConfig = {
      signInSuccessUrl: '/',
      signInOptions: [
        // Add your sign-in options here
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        // Add more providers as needed
      ],
    };

    const ui = new firebaseui.auth.AuthUI(firebase.auth()); // Create instance with firebase.auth()
    ui.start('#firebaseui-auth-container', uiConfig);

    return () => {
      ui.delete(); // Clean up the UI instance
    };
  }, []);

  return (
    <div>
      <h1>Sign In</h1>
      <div id="firebaseui-auth-container"></div>
    </div>
  );
};

export default AuthComponent;
