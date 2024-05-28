import React, { useState } from 'react';
import Button from './Button';
import PokemonCard from './Card';
import Pokemons from './Pokemons';
import fetchPokemon from './FetchPokemon';
import { getRandomInt } from '../common';
import { PokemonData } from '../types';
import { getDatabase, push, ref } from 'firebase/database';

const Page: React.FC = () => {
  const [switchTab, setSwitchTab] = useState<boolean>(false);
  const [genBtn, setGenBtn] = useState<boolean>(true);
  const [pokemon, setPokemon] = useState<PokemonData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [tryAgain, setTryAgain] = useState<boolean>(false);
  const [winningMsg, setWinningMsg] = useState<boolean>(false);

  const showPokemons = () => {
    setSwitchTab(!switchTab);
  }
  
  const play = () => {
    let num = getRandomInt(1);
    if (num === 0) {
      handleFetchPokemon()
    } else {
      setTryAgain(true); // Set try again state to true
      setPokemon(null);
      setGenBtn(false);
    }
  }

  const handleFetchPokemon = async () => {
    setLoading(true); // Set loading to true when fetching starts
    try {
      const data = await fetchPokemon();
      setGenBtn(false);
      setTryAgain(false);
      setPokemon(data);

      const db = getDatabase();
      const newPokemonRef = ref(db, `pokemon`);
      await push(newPokemonRef, data.id);
    } catch (error) {
      console.error('Error fetching Pokémon:', error);
    } finally {
      setLoading(false); // Set loading back to false when fetching completes (whether successful or not)
      setWinningMsg(true)
      setTimeout(() => {
        setWinningMsg(false)
      }, 3200);
    }
  };

  return (
    <div>
      <h1>Card Generator</h1>
      <p>You can play once a day to get a card.</p>
      <Button onClick={showPokemons} text={switchTab ? "My Cards Collection" : "Play to get a new card" } className='my-cards' />
      <div className={switchTab ? 'hidden' : ''}>
        <Pokemons/>
      </div>
      <div className={switchTab ? '' : 'hidden'}>
      {loading ? (
        <div className="spinner"></div> // Display the spinner component
      ) : (
        <>
          {pokemon ? (
            <div className='card-container'>
              <PokemonCard
                hp={pokemon.stats[0].base_stat}
                imgSrc={pokemon.sprites.front_default}
                pokeName={pokemon.name}
                statAttack={pokemon.stats[1].base_stat}
                statDefense={pokemon.stats[2].base_stat}
                statSpeed={pokemon.stats[5].base_stat}
                types={pokemon.types}
              />
              <h2 className={`win-msg ${winningMsg ? '' : 'hidden'}`}>You got a new card! <br/>It was added to your cards collection.</h2>
            </div>
          ) : (
            tryAgain && <div>Try again next time</div>
          )}
          <Button onClick={play} text="Play" className={`generate ${genBtn ? '' : 'hidden'}`} />
        </>
      )}
      </div>
    </div>
  );
};

export default Page;