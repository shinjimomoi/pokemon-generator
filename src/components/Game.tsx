// Game.tsx
import React, { useState } from 'react';
import { getRandomInt } from '../common';
import { getDatabase, push, ref } from 'firebase/database';
import { fetchPokemon } from './FetchPokemon';
import { auth } from '../firebase';
import Card from './Card';
import Pokemons from './Pokemons';
import Button from './Button';

const Game: React.FC = () => {
  const [switchTab, setSwitchTab] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [losingMsgs, setLosingMsgs] = useState<boolean[]>([false, false, false]);
  const [winningMsgs, setWinningMsgs] = useState<boolean[]>([false, false, false]);
  const [newCard, setNewCard] = useState<boolean>(false);

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
    const num = getRandomInt(5);
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
      const data = await fetchPokemon();
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userUID = currentUser.uid;
        const db = getDatabase();
        const userPokemonRef = ref(db, `users/${userUID}/pokemon`);
        await push(userPokemonRef, data.id);
      }
    } catch (error) {
      console.error("Error fetching Pokémon:", error);
    } finally {
      setLoading(false);
      setNewCard(true);
      setSwitchTab(true);
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
          <Pokemons newCard={newCard ? true : false} />
        </div>
      ) : (
        <div>
          {loading ? (
            <div className="spinner"></div>
          ) : (
            <div className="flex cards">
              {[0, 1, 2].map((index) => (
                <Card
                  key={index}
                  index={index}
                  losingMsgs={losingMsgs}
                  winningMsgs={winningMsgs}
                  play={play}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Game;
