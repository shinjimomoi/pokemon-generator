import React, { useState, useEffect } from 'react';
import { useFetchPokemon, addPokemon, changeBalance } from '../pokemonService';
import PokemonCard from './PokemonCard';
import Loading from './Loading';
import { PokemonData } from "../types";
import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Button from './Button';

const PokemonMarket: React.FC = () => {
  const [pokemons, setPokemons] = useState<PokemonData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const swiperRef = useRef<any | null>(null);


  const handleFetchPokemon = async () => {
    setPokemons([]);
    setLoading(true);
    setError(null); // Reset error state before fetching data

    const dailyCardNumber = 5;
    const data: PokemonData[] = [];

    try {
      for (let i = 0; i < dailyCardNumber; i++) {
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
    selectedPokemon && addPokemon(selectedPokemon);
    changeBalance(500);
  }

  const handleSlideChange = (swiper: any) => {
    const activeIndex = swiper.realIndex;
    setSelectedPokemon(pokemons[activeIndex]);
  };
  
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
            onSlideChange={handleSlideChange}
            onSwiper={(swiper) => setSelectedPokemon(pokemons[swiper.realIndex])} // Set initial selected Pokemon
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
                      // onClick={() => setSelectedPokemon(pokemon)} // Set selectedPokemon when clicked
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
