import React, { useEffect } from 'react';
import { startFirebaseUI } from '../firebaseui'; // Adjust the import path as necessary

const Auth: React.FC = () => {

  useEffect(() => {
    startFirebaseUI('#firebaseui-auth-container');
  });

  return (
    <div>
      <h1>Card Generator</h1>
      <div id="firebaseui-auth-container"></div>
    </div>
  );
};

export default Auth;
