import React, { useState, useEffect } from 'react';
import './App.css';
import Page from './components/Page';
import Auth from './components/Auth';
import { auth } from './firebase';
import firebase from 'firebase/compat/app';
import Navbar from './components/Navbar';
import Loading from './components/Loading';

const App: React.FC = () => {
  const [user, setUser] = useState<firebase.User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string>('game');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) { // Check balanceLoading state as well
    return <Loading message="Loading cards..."/>
  }

  return (
    <div className="App">
      {user ? <Navbar setActiveSection={setActiveSection} activeSection={activeSection} /> : null }
      {user ? <Page activeSection={activeSection} /> : <Auth />}
    </div>
  );
};

export default App;
