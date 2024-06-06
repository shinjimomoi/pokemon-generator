import React, { useState } from 'react';
import { get, getDatabase, push, ref, set } from 'firebase/database';
import { useFetchPokemon } from '../pokemonService';
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
