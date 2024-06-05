import React, { useState, useEffect } from 'react';
import { useFetchPokemon } from '../useFetchPokemon';
import PokemonCard from './PokemonCard';
import Loading from './Loading';
import { PokemonData } from "../types";
import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Button from './Button';

const PokemonMarket: React.FC = () => {
  const [pokemons, setPokemons] = useState<PokemonData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const swiperRef = useRef<any | null>(null);

  const handleFetchPokemon = async () => {
    setPokemons([]);
    setLoading(true);
    setError(null); // Reset error state before fetching data

    const cardNumber = 5;
    const data: PokemonData[] = [];

    try {
      for (let i = 0; i < cardNumber; i++) {
        const pokemon = await useFetchPokemon();
        data.push(pokemon);
      }

      setPokemons(data); // Set the fetched pokemons
    } catch (err) {
      setError("Failed to fetch Pokémon data. Please try again.");
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  useEffect(() => {
    handleFetchPokemon()
  },[])

  const BuyPokemon = () => {
    console.log("buy this one")
  }
    
  return (
    <>
      <h2>Cards to buy</h2>
      {loading ? (
        <Loading message="Loading cards..."/>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div>
          <p className="pokemon-count">Choose your card.</p>
          <Swiper
            ref={swiperRef}
            spaceBetween={50}
            slidesPerView={1}
            onSlideChange={() => console.log("slide change")}
            onSwiper={(swiper) => console.log(swiper)}
            loop={true}
          >
            {pokemons &&
              pokemons.map((pokemon, index) => (
                <li key={index}>
                  <SwiperSlide key={index} className="col-md-4 mb-4 blur">
                    <PokemonCard
                      hp={pokemon.stats[0].base_stat}
                      imgSrc={pokemon.sprites.front_default}
                      pokeName={pokemon.name}
                      statAttack={pokemon.stats[1].base_stat}
                      statDefense={pokemon.stats[2].base_stat}
                      statSpeed={pokemon.stats[5].base_stat}
                      types={pokemon.types}
                    />
                  </SwiperSlide>
                </li>
              ))}
          </Swiper>
          <Button onClick={BuyPokemon} text={"Buy"} className={"buy"} />
        </div>
      )}
    </>
  );
};

export default PokemonMarket;
