import React, { useState } from 'react';
import { get, getDatabase, push, ref, set } from 'firebase/database';
import { useFetchPokemon } from '../useFetchPokemon';
import { auth } from '../firebase';
import Button from './Button';
import Pokemons from './Pokemons';
import SlotMachine from './SlotMachine';
import Loading from './Loading';

const Game: React.FC = () => {
  const [switchTab, setSwitchTab] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  const showPokemons = () => {
    setSwitchTab(!switchTab);
  };

  const deductBalance = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userUID = currentUser.uid;
        const db = getDatabase();
        const userBalanceRef = ref(db, `users/${userUID}/balance`);
        
        // Fetch current user balance
        const snapshot = await get(userBalanceRef);
        const currentBalance = snapshot.val();

        // Deduct balance by 1 unit
        const newBalance = (currentBalance || 0) - 100;

        // Set the new balance in the database
        await set(userBalanceRef, newBalance);
      }
    } catch (error) {
      console.error('Error deducting balance:', error);
    }
  };
  
  const addBalance = async (value:number) => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userUID = currentUser.uid;
        const db = getDatabase();
        const userBalanceRef = ref(db, `users/${userUID}/balance`);
        
        // Fetch current user balance
        const snapshot = await get(userBalanceRef);
        const currentBalance = snapshot.val();

        // Deduct balance by 1 unit
        const newBalance = (currentBalance || 0) + value;

        // Set the new balance in the database
        await set(userBalanceRef, newBalance);
      }
    } catch (error) {
      console.error('Error deducting balance:', error);
    }
  };

  const handleFetchPokemon = async () => {
    setLoading(true);
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const data = await useFetchPokemon();
        const userUID = currentUser.uid;
        const db = getDatabase();
        const userPokemonRef = ref(db, `users/${userUID}/pokemon`);
        await push(userPokemonRef, data.id);
      }
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
      console.log("should switch tab!")
      setSwitchTab(true); // Switch to the collection view after fetching the Pokémon
    }
  };

  return (
    <div>
      {switchTab ? (
        <div className="card-container">
          <Pokemons />
        </div>
      ) : (
        <div>
          {loading ? (
            <Loading message="Loading cards..."/>
          ) : (
            <SlotMachine handleFetchPokemon={handleFetchPokemon} deductBalance={deductBalance} addBalance={addBalance} />
          )}
        </div>
      )}
      <Button
        onClick={showPokemons}
        text={switchTab ? "Play to get a new card" : "Go to my Collection"}
        className="my-cards"
      />
    </div>
  );
};

export default Game;
