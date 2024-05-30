import React, { useState, useEffect } from 'react';
import './App.css';
import Page from './components/Page';
import Auth from './components/Auth';
import { auth } from './firebase';
import firebase from 'firebase/compat/app';
import Navbar from './components/Navbar';

const App: React.FC = () => {
  const [user, setUser] = useState<firebase.User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      console.log('User authenticated:', authUser);
      setUser(authUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);


  if (loading) {
    return <div className="spinner"></div>
  }

  return (
    <div className="App">
      <Navbar />
      {user ? <Page /> : <Auth />}
    </div>
  );
};

export default App;
