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
  types: { type: { name: string } }[]; // Add types property here
}

const Page: React.FC = () => {
  const [pokemon, setPokemon] = useState<PokemonData | null>(null);

  const fetchPokemon = async () => {
    try {
      const randomId = Math.floor(Math.random() * 898) + 1;
      const response = await axios.get<PokemonData>(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
      setPokemon(response.data);
    } catch (error) {
      console.error('Error fetching Pokémon:', error);
    }
  };

  return (
    <div>
      <h1>Pokemon Card Generator</h1>
      <Button onClick={fetchPokemon} />
      {pokemon && (
        <PokemonCard
          hp={pokemon.stats[0].base_stat}
          imgSrc={pokemon.sprites.front_default}
          pokeName={pokemon.name}
          statAttack={pokemon.stats[1].base_stat}
          statDefense={pokemon.stats[2].base_stat}
          statSpeed={pokemon.stats[5].base_stat}
          types={pokemon.types} // Pass the types array directly
        />
      )}
    </div>
  );
};

export default Page;
