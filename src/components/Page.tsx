import React, { useState } from 'react';
import Button from './Button';
import Pokemons from './Pokemons';
import { fetchPokemon } from './FetchPokemon';
import { getRandomInt } from '../common';
import { getDatabase, push, ref } from 'firebase/database';
import { auth } from '../firebase';

const Page: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [losingMsg, setLosingMsg] = useState<boolean>(false);
  const [winningMsg, setWinningMsg] = useState<boolean>(false);
  const [newCard, setNewCard] = useState<boolean>(false);

  const play = () => {
    const num = getRandomInt(1);
    if (num === 0) {
      handleFetchPokemon();
    } else {
      setLosingMsg(true); // Set try again state to true
      setTimeout(() => {
        setLosingMsg(false);
      }, 3200);
    }
  };

  const handleFetchPokemon = async () => {
    setLoading(true); // Set loading to true when fetching starts
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
      setLoading(false); // Set loading back to false when fetching completes (whether successful or not)
      setWinningMsg(true);
      setNewCard(true);
      setTimeout(() => {
        setWinningMsg(false);
      }, 2000);
    }
  };

  return (
    <div className='container'>
      <h1>Card Generator</h1>
      <p>You can play once a day to get a card.</p>
      <Button
        onClick={play}
        text="Play"
        className="my-cards"
      />
      <div className="card-container">
        <Pokemons newCard={newCard ? true : false} />
        <h2 className={`win-msg ${winningMsg ? "" : "hidden"}`}>
          You got a new card! <br />
          It was added to your cards collection.
        </h2>
      </div>
      <div>
        {loading ? (
          <div className="spinner"></div>
        ) : (
          <div className="card-container">
            <h2 className={`lose-msg ${losingMsg ? "" : "hidden"}`}>
              You did not win <br />
              Try again!
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
