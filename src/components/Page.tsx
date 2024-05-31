import React, { useState } from 'react';
import Button from './Button';
import Pokemons from './Pokemons';
import { fetchPokemon } from './FetchPokemon';
import { getRandomInt } from '../common';
import { getDatabase, push, ref } from 'firebase/database';
import { auth } from '../firebase';

const Page: React.FC = () => {
  const [switchTab, setSwitchTab] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [losingMsgs, setLosingMsgs] = useState<boolean[]>([false, false, false]);
  const [winningMsgs, setwinningMsgs] = useState<boolean[]>([false, false, false]);
  const [newCard, setNewCard] = useState<boolean>(false);

  const showPokemons = () => {
    setSwitchTab(!switchTab);
  };

  const play = (index: number) => {
    const num = getRandomInt(5);
    if (num === 0) {
      setwinningMsgs(prevMsgs => {
        const newMsgs = [...prevMsgs];
        newMsgs[index] = true;
        return newMsgs;
      });
      setTimeout(() => {
        setwinningMsgs(prevMsgs => {
          const newMsgs = [...prevMsgs];
          newMsgs[index] = false;
          return newMsgs;
        });
        handleFetchPokemon();
      }, 1200);
    } else {
      setTimeout(() => {
        setLosingMsgs(prevMsgs => {
          const newMsgs = [...prevMsgs];
          newMsgs[index] = true;
          return newMsgs;
        }); // Set try again state to true for the clicked button
      }, 500);
      setTimeout(() => {
        setLosingMsgs(prevMsgs => {
          const newMsgs = [...prevMsgs];
          newMsgs[index] = false;
          return newMsgs;
        });
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
      setNewCard(true);
      setSwitchTab(true);
    }
  };

  const getButtonText = (index: number) => {
    if (losingMsgs[index]) {
      return "Try again!";
    } else if (winningMsgs[index]) {
      return "You won!";
    } else {
      return "?";
    }
  };

  return (
    <div className='container'>
      <h1>Card Generator</h1>
      <p>You can play once a day to get a card.</p>
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
            <div className="card-container flex">
              {[0, 1, 2].map((index) => (
                <Button
                  key={index}
                  onClick={() => play(index)}
                  text={getButtonText(index)}
                  className={`generate`}
                />
              ))}
              {/* <h2 className={`lose-msg ${losingMsgs ? "" : "hidden"}`}>
                You did not win <br />
                Try again!
              </h2> */}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Page;
