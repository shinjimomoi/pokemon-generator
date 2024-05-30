import firebase from 'firebase/compat/app';
import React from 'react';
import Button from './Button';

const Navbar: React.FC = () => {
  const signout = () => {
    firebase.auth().signOut()
  };

  return (
    <nav className='navbar'>
      <Button onClick={signout} text="Signout" className='signout'/>
    </nav>
  );
};

export default Navbar;
