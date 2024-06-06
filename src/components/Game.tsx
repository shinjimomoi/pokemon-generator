import React, { useState } from 'react';
import { useFetchPokemon, addPokemon } from '../pokemonService';
import Button from './Button';
import Pokemons from './Pokemons';
import SlotMachine from './SlotMachine';

const Game: React.FC = () => {
  const [switchTab, setSwitchTab] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  const showPokemons = () => {
    setSwitchTab(!switchTab);
  };

  const handleGetPokemon = async () => {
      const data = await useFetchPokemon();
      addPokemon(data);
      setSwitchTab(true);
  };

  return (
    <div>
      {switchTab ? (
        <div className="card-container">
          <Pokemons />
        </div>
      ) : (
        <div>
          <SlotMachine handleGetPokemon={handleGetPokemon} />
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
