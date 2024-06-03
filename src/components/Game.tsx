import React, { useState } from 'react';
import { getRandomInt } from '../common';
import { getDatabase, push, ref } from 'firebase/database';
import { fetchPokemon } from './FetchPokemon';
import { auth } from '../firebase';
import Button from './Button';
import Pokemons from './Pokemons';
import SlotMachine from './SlotMachine';

const Game: React.FC = () => {
  const [switchTab, setSwitchTab] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [losingMsgs, setLosingMsgs] = useState<boolean[]>([false, false, false]);
  const [winningMsgs, setWinningMsgs] = useState<boolean[]>([false, false, false]);

  const showPokemons = () => {
    setSwitchTab(!switchTab);
  };

  const updateMessageState = (index: number, setState: React.Dispatch<React.SetStateAction<boolean[]>>, value: boolean, delay: number) => {
    setTimeout(() => {
      setState(prevMsgs => {
        const newMsgs = [...prevMsgs];
        newMsgs[index] = value;
        return newMsgs;
      });
    }, delay);
  };

  const play = (index: number) => {
    const num = getRandomInt(1);
    if (num === 0) {
      updateMessageState(index, setWinningMsgs, true, 0);
      updateMessageState(index, setWinningMsgs, false, 1200);
      setTimeout(() => {
        handleFetchPokemon();
      }, 1200);
    } else {
      updateMessageState(index, setLosingMsgs, true, 500);
      updateMessageState(index, setLosingMsgs, false, 1500);
    }
  };

  const handleFetchPokemon = async () => {
    setLoading(true);
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const data = await fetchPokemon();
        const userUID = currentUser.uid;
        const db = getDatabase();
        const userPokemonRef = ref(db, `users/${userUID}/pokemon`);
        await push(userPokemonRef, data.id);
      }
    } catch (error) {
      console.error("Error fetching Pokémon:", error);
    } finally {
      setLoading(false);
      setSwitchTab(true); // Switch to the collection view after fetching the Pokémon
    }
  };

  const getButtonText = (index: number) => {
    if (losingMsgs[index]) {
      return (
        <>
          Try<br />again!
        </>
      );
    } else if (winningMsgs[index]) {
      return (
        <>
          You<br />won!
        </>
      );
    } else {
      return "?";
    }
  };

  return (
    <div>
      <Button
        onClick={showPokemons}
        text={switchTab ? "Play to get a new card" : "Go to my Collection"}
        className="my-cards"
      />
      {switchTab ? (
        <div className="card-container">
          <Pokemons />
        </div>
      ) : (
        <div>
          {loading ? (
            <div className="spinner"></div>
          ) : (
            <SlotMachine handleFetchPokemon={handleFetchPokemon} />
          )}
        </div>
      )}
    </div>
  );
};

export default Game;
