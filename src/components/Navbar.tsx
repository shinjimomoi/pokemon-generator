import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import Button from './Button';
import useFetchBalance from '../useFetchBalance';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faMoon, faPlay, faRightFromBracket, faSun, faUser } from '@fortawesome/free-solid-svg-icons';

interface NavbarProps {
  setActiveSection: React.Dispatch<React.SetStateAction<string>>;
  activeSection: string;
}

const sections = [
  { name: 'shop', icon: faCartShopping, text: 'Shop' },
  { name: 'game', icon: faPlay, text: 'Info' },
  { name: 'mypage', icon: faUser, text: 'Profile' },
  // Add more sections as needed
];

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

  // const handleSection = () => {
  //   const newSection = activeSection === 'game' ? 'market' : 'game';
  //   setActiveSection(newSection);
  // };

  return (
    <nav className="navbar">
      <div className='balance'>
        <h3 className="pokemon-count">${balance || 0}</h3>
      </div>
      <div className='btns'>

        {sections.map(section => (
          <Button
            key={section.name}
            onClick={() => setActiveSection(section.name)}
            text={<FontAwesomeIcon icon={section.icon} />}
            className={`signout ${activeSection === section.name ? 'active' : ''}`}
          />
        ))}
        
        <Button onClick={handleTheme} text={theme === 'light' ? <FontAwesomeIcon icon={faMoon}/> : <FontAwesomeIcon icon={faSun} />} className="signout" />
        <Button onClick={signout} text={<FontAwesomeIcon icon={faRightFromBracket}/>} className="signout" />
      </div>
    </nav>
  );
};

export default Navbar;