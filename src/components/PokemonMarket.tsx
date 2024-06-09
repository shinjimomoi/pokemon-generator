import React, { useState, useEffect } from 'react';
import { useFetchPokemon, addPokemon, changeBalance, resetShopAndAddVisitedTime, getShopVisitedTime, getShop } from '../pokemonService';
import PokemonCard from './PokemonCard';
import Loading from './Loading';
import { PokemonData } from "../types";
import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Button from './Button';
import { capitalizeFirstLetter } from '../common';

const PokemonMarket: React.FC = () => {
  const [pokemons, setPokemons] = useState<PokemonData[]>([]);
  const [buyingMsg, setBuyingMsg] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const swiperRef = useRef<any | null>(null);

  const fetchFivePokemons = async () => {
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

      // setPokemons(data); // Set the fetched pokemons
      resetShopAndAddVisitedTime(data)
    } catch (err) {
      setError("Failed to fetch Pokémon data. Please try again.");
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 800);
    }
  };

  const removeOnePokemon = async (pokemon: PokemonData | null) => {
    setLoading(true);
    setError(null); // Reset error state before fetching data
    try {
      setPokemons(prevPokemons => prevPokemons.filter(p => p.id !== pokemon?.id));
    } catch (err) {
      setError("Failed to fetch Pokémon data. Please try again.");
    } finally {
      console.log(pokemons, "pokemons array after removing")
      setTimeout(() => {
        setLoading(false);
      }, 1200);
    }
  };

  const fetchPokemonsIfNeeded = async () => {
    try {
      const currentVisitedTimestamp = await getShopVisitedTime();
      const currentTime = Date.now();
      const tenMinutes = 10 * 1000;
      if (!currentVisitedTimestamp || currentTime - currentVisitedTimestamp >= tenMinutes) {
        await fetchFivePokemons();
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching pokemons:", error);
      setError("Failed to fetch Pokémon data. Please try again.");
      setLoading(false);
    } finally {
      const fetchedPokemons = await getShop();
      setPokemons(fetchedPokemons);
    }
  };

  useEffect(() => {
    fetchPokemonsIfNeeded();
  },[])

  const BuyPokemon = async() => {
    if(selectedPokemon) {
      const balanceChanged = await changeBalance(-3000);
      if (!balanceChanged) {
        console.error('Insufficient balance');
        setBuyingMsg('Insufficient money to buy this Pokémon.');
        setTimeout(() => {
          setBuyingMsg('');        
        }, 1200);
        return;
      }
      const {name} = selectedPokemon
      addPokemon(selectedPokemon);
      resetShopAndAddVisitedTime(pokemons.filter((pok: PokemonData) => pok !== selectedPokemon));
      removeOnePokemon(selectedPokemon);
      setBuyingMsg(`You got ${capitalizeFirstLetter(name)}. Adding to your collection`)
      setTimeout(() => {
        setBuyingMsg('');        
      }, 1200);
    } 
  }

  const handleSlideChange = (swiper: any) => {
    const activeIndex = swiper.realIndex;
    setSelectedPokemon(pokemons[activeIndex]);
  };

  return (
    <>
      <h1>Shop</h1>
      {loading ? (
        <Loading message={buyingMsg}/>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div>
        {pokemons && pokemons.length > 0 ? (
          <>
            <p className="pokemon-count">Choose your card.</p>
            <Swiper
              ref={swiperRef}
              spaceBetween={50}
              slidesPerView={1}
              onSlideChange={handleSlideChange}
              onSwiper={(swiper) => setSelectedPokemon(pokemons[swiper.realIndex])} // Set initial selected Pokemon
              loop={true}
            >
              {pokemons.map((pokemon, index) => (
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
        ) : (
          <h3>All pokemons were sold, come back later</h3>
        )}
        {buyingMsg && <h2 className="msg">{buyingMsg}</h2>}
        <Button onClick={BuyPokemon} text={"Buy"} className={"buy"} />
      </div>
      )}
    </>
  );
};

export default PokemonMarket;
