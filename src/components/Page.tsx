import React, { useState } from 'react';
import axios from 'axios';
import Button from './Button';
import PokemonCard from './Card';

interface PokemonData {
  name: string;
  sprites: {
    front_default: string;
  };
  stats: {
    base_stat: number;
  }[];
  types: { type: { name: string } }[];
}

const Page: React.FC = () => {
  const [pokemon, setPokemon] = useState<PokemonData | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // Add loading state

  const fetchPokemon = async () => {
    setLoading(true); // Set loading to true when fetching starts
    setTimeout(async() => {
      try {

          const randomId = Math.floor(Math.random() * 898) + 1;
          const response = await axios.get<PokemonData>(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
          setPokemon(response.data);
        } catch (error) {
          console.error('Error fetching Pokémon:', error);
      } finally {
        setLoading(false); // Set loading back to false when fetching completes (whether successful or not)
      }
    }, 1000);
  };

  return (
    <div>
      <h1>Pokemon Card Generator</h1>
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
          <Button onClick={fetchPokemon} />
        </>
      )}
    </div>
  );
};

export default Page;
