import firebase from 'firebase/compat/app';
import React, { useState } from 'react';
import Button from './Button';

const Navbar: React.FC = () => {
  const [theme, setTheme] = useState<string>("dark")

  const signout = () => {
    firebase.auth().signOut()
  };

  const handleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <nav className='navbar'>
      <Button onClick={signout} text="Signout" className='signout'/>
      <Button onClick={handleTheme} text={`${theme === "light" ? "Dark" : "Light"}`} className='signout'/>
    </nav>
  );
};

export default Navbar;
