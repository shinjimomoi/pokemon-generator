import React, { useState } from 'react';
import Button from './Button';
import PokemonCard from './Card';
import Pokemons from './Pokemons';
import fetchPokemon from './FetchPokemon';
import { PokemonData } from '../types';

const Page: React.FC = () => {
  const [showGenerator, setShowGenerator] = useState<boolean>(false);
  const [pokemon, setPokemon] = useState<PokemonData | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // Add loading state

  const showPokemons = () => {
    setShowGenerator(!showGenerator);
  }

  const handleFetchPokemon = async () => {
    setLoading(true); // Set loading to true when fetching starts
    setTimeout(async () => {
      try {
        const data = await fetchPokemon();
        setPokemon(data);
      } catch (error) {
        console.error('Error fetching Pokémon:', error);
      } finally {
        setLoading(false); // Set loading back to false when fetching completes (whether successful or not)
      }
    }, 1000);
  };

  return (
    <div>
      <h1>Gen</h1>
      <Button onClick={showPokemons} text={showGenerator ? "My Cards" : "New Card" } className='my-cards' />
      <div className={showGenerator ? 'hidden' : ''}>
        <Pokemons/>
      </div>
      <div className={showGenerator ? '' : 'hidden'}>
      {loading ? (
        <div className="spinner"></div> // Display the spinner component
      ) : (
        <>
          {pokemon && (
            <PokemonCard
              hp={pokemon.stats[0].base_stat}
              imgSrc={pokemon.sprites.front_default}
              pokeName={pokemon.name}
              statAttack={pokemon.stats[1].base_stat}
              statDefense={pokemon.stats[2].base_stat}
              statSpeed={pokemon.stats[5].base_stat}
              types={pokemon.types}
            />
          )}
          <Button onClick={handleFetchPokemon} text="Generate" className='generate' />
        </>
      )}
      </div>
    </div>
  );
};

export default Page;
