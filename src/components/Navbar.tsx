import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import Button from './Button';
import useFetchBalance from '../useFetchBalance';

interface NavbarProps {
  setActiveSection: React.Dispatch<React.SetStateAction<string>>;
  activeSection: string;
}

const Navbar: React.FC<NavbarProps> = ({ setActiveSection, activeSection }) => {
  const [theme, setTheme] = useState<string>('dark');
  const balance = useFetchBalance();

  const signout = () => {
    firebase.auth().signOut();
  };

  const handleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleSection = () => {
    const newSection = activeSection === 'game' ? 'market' : 'game';
    setActiveSection(newSection);
  };

  return (
    <nav className="navbar">
      <div className='balance'>
        <h3 className="pokemon-count">${balance || 0}</h3>
      </div>
      <div className='btns'>
        <Button onClick={handleSection} text={activeSection === 'game' ? 'Market' : 'Game'} className="signout" />
        <Button onClick={handleTheme} text={theme === 'light' ? 'Dark' : 'Light'} className="signout" />
        <Button onClick={signout} text="Signout" className="signout" />
      </div>
    </nav>
  );
};

export default Navbar;