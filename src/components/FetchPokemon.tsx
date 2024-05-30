import axios from 'axios';
import { PokemonData } from '../types';

const fetchPokemon = async (id?: number): Promise<PokemonData> => {
  console.log("fetching from pokemon api")
  let randomId: number;
  if (id) {
    randomId = id;
  } else {
    randomId = Math.floor(Math.random() * 251) + 1;
  }
  const response = await axios.get<PokemonData>(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
  return response.data;
};

// Function to get Pokemon data with local storage caching
const getPokemonData = async (id?: number) => {
  // Check if data is in local storage
  const cachedData = localStorage.getItem(`pokemon_${id}`);
  if (cachedData) {
    console.log("fetching from local storage")
    return JSON.parse(cachedData);
  }

  // If not, fetch from API
  const data = await fetchPokemon(id);

  try {
    // Store fetched data in local storage
    localStorage.setItem(`pokemon_${id}`, JSON.stringify(data));
  } catch(e) {
    console.log("Local Storage is full, Please empty data");
  }
  return data;
};

export { getPokemonData, fetchPokemon };