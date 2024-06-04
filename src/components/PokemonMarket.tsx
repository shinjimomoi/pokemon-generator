import React, { useState, useEffect } from 'react';
import { useFetchPokemon } from '../useFetchPokemon';
import PokemonCard from './PokemonCard';
import { PokemonData } from "../types";
import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

const PokemonMarket: React.FC = () => {
  const [pokemons, setPokemons] = useState<PokemonData[]>([]);
  const swiperRef = useRef<any | null>(null);

  const handleFetchPokemon = async () => {
    const cardNumber = 5;
    const data:PokemonData[] = []
  
    for (let i = 0; i < cardNumber; i++) {
      const pokemon = await useFetchPokemon();
      data.push(pokemon);
    }

    setPokemons(data) // Uncomment this if you have a state to set the pokemons
  };

  useEffect(() => {
    handleFetchPokemon()
  },[])
    
  return (
    <>
      <h2>Cards to buy</h2>
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
    </>
  );
};

export default PokemonMarket;
