import axios from 'axios';
import { PokemonData } from './types';
import { get, getDatabase, push, ref, set } from 'firebase/database';
import { auth } from './firebase';

const useFetchPokemon = async (id?: number): Promise<PokemonData> => {
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
    // console.log("fetching from local storage")
    return JSON.parse(cachedData);
  }

  // If not, fetch from API
  const data = await useFetchPokemon(id);

  try {
    // Store fetched data in local storage
    localStorage.setItem(`pokemon_${id}`, JSON.stringify(data));
  } catch(e) {
    // console.log("Local Storage is full, Please empty data");
  }
  return data;
};

const addPokemon = async(pokemon: PokemonData) => {
  console.log(`adding ${pokemon.name} to collection`)
  try {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const userUID = currentUser.uid;
      const db = getDatabase();
      const userPokemonRef = ref(db, `users/${userUID}/pokemon`);
      await push(userPokemonRef, pokemon.id);
    }    
  } catch (error) {
    console.error("Error adding pokemon to collection:", error)
  }
};

const changeBalance = async(amount: number) => {
  console.log(`deducting ${amount} from balance`)
  try {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const userUID = currentUser.uid;
      const db = getDatabase();
      const userBalanceRef = ref(db, `users/${userUID}/balance`);
      
      // Fetch current user balance
      const snapshot = await get(userBalanceRef);
      const currentBalance = snapshot.val();

      // Check if the user has enough balance
      if (currentBalance < amount) {
        console.error('Insufficient balance');
        return false;
      }

      console.log(amount,"amount")
  
      // Deduct balance by amount from param
      const newBalance = (currentBalance || 0) + amount;
  
      // Set the new balance in the database
      await set(userBalanceRef, newBalance);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error deducting from balance:", error)
  }
};



export { getPokemonData, useFetchPokemon, addPokemon, changeBalance };