import React, { useState } from 'react';
import { getRandomInt } from '../common';
import { get, getDatabase, push, ref, set } from 'firebase/database';
import { useFetchPokemon } from '../useFetchPokemon';
import { auth } from '../firebase';
import Button from './Button';
import Pokemons from './Pokemons';
import SlotMachine from './SlotMachine';

const Game: React.FC = () => {
  const [switchTab, setSwitchTab] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  const showPokemons = () => {
    setSwitchTab(!switchTab);
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
        let userBalanceRef = ref(db, `users/${userUID}/balance`);
        await push(userPokemonRef, data.id);
        // Fetch current user balance
        const snapshot = await get(userBalanceRef);
        const currentBalance = snapshot.val();

        // Update user balance by adding 500
        const newBalance = (currentBalance || 0) + 500;

        // Set the new balance in the database
        await set(userBalanceRef, newBalance);
      }
    } catch (error) {
      console.error("Error fetching Pokémon:", error);
    } finally {
      setLoading(false);
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
            <div className="spinner"></div>
          ) : (
            <SlotMachine handleFetchPokemon={handleFetchPokemon} />
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
