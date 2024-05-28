import axios from 'axios';
import { PokemonData } from '../types';

const fetchPokemon = async (id?: number): Promise<PokemonData> => {
  let randomId: number;
  if (id) {
    randomId = id;
  } else {
    randomId = Math.floor(Math.random() * 898) + 1;
  }
  const response = await axios.get<PokemonData>(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
  return response.data;
};

export default fetchPokemon;