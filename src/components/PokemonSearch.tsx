import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PokemonCard from './PokemonCard';
import { PokemonData } from "../types";

const PokemonSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredPokemon, setFilteredPokemon] = useState<PokemonData[]>([]);
  const [speciesList, setSpeciesList] = useState<{ name: string; url: string }[]>([]);

  useEffect(() => {
    // Fetch the list of all Pokémon species names
    const fetchAllSpecies = async () => {
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon-species?limit=898');
        setSpeciesList(response.data.results);
      } catch (error) {
        console.error("Error fetching Pokémon species:", error);
      }
    };

    fetchAllSpecies();
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      setFilteredPokemon([]);
    } else {
      const filteredSpecies = speciesList.filter(species =>
        species.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

      const fetchFilteredPokemonData = async () => {
        try {
          const pokemonData = await Promise.all(
            filteredSpecies.map(async species => {
              const response = await axios.get(species.url.replace('pokemon-species', 'pokemon'));
              return response.data;
            })
          );
          setFilteredPokemon(pokemonData);
          console.log(pokemonData, "pokemondata")
        } catch (error) {
          console.error("Error fetching Pokémon data:", error);
        }
      };

      fetchFilteredPokemonData();
    }
  }, [searchQuery, speciesList]);

  return (
    <div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search Pokémon by name"
      />
      <ul>
        {filteredPokemon.map(pokemon => (
          <li key={pokemon.id}>
            <PokemonCard
                  hp={pokemon.stats[0].base_stat}
                  imgSrc={pokemon.sprites.front_default}
                  pokeName={pokemon.name}
                  statAttack={pokemon.stats[1].base_stat}
                  statDefense={pokemon.stats[2].base_stat}
                  statSpeed={pokemon.stats[5].base_stat}
                  types={pokemon.types}
                />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PokemonSearch;
