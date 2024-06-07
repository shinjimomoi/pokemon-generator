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

const getShopVisitedTime = async () => {
  try {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const userUID = currentUser.uid;
      const db = getDatabase();
      const userTimestampRef = ref(db, `users/${userUID}/visited`);
      
      // Fetch current user balance
      const snapshot = await get(userTimestampRef);
      const currentVisitedTimestamp = snapshot.val();
      return currentVisitedTimestamp;
    }
  } catch(e) {
    // console.log("Local Storage is full, Please empty data");
  }
};

const resetShopAndAddVisitedTime = async (pokemons: PokemonData[], bought?:false) => {
  try {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const userUID = currentUser.uid;
      const db = getDatabase();

      // Update shop collection
      const userShopRef = ref(db, `users/${userUID}/shop`);
      await set(userShopRef, pokemons);

      if (!bought) {
        // Add visited timestamp
        const userTimestampRef = ref(db, `users/${userUID}/visited`);
        await set(userTimestampRef, Date.now());
      }
    }
  } catch (error) {
    console.error("Error resetting shop and adding visited time:", error);
  }
};

const getShop = async () => {
  try {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const userUID = currentUser.uid;
      const db = getDatabase();
      const userShopRef = ref(db, `users/${userUID}/shop`);
      
      // Fetch current user balance
      const snapshot = await get(userShopRef);
      const currentShop = snapshot.val();
      return currentShop;
    }
  } catch(e) {
    // console.log("Local Storage is full, Please empty data");
  }
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
      console.log(currentBalance, "currentBalance")
      console.log(amount, "amount")
      if ((currentBalance + amount) < 0) {
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



export { getPokemonData, useFetchPokemon, addPokemon, changeBalance, resetShopAndAddVisitedTime, getShopVisitedTime, getShop };