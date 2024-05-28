import { useEffect, useState } from "react";
import cong from "../config";
import { getDatabase, ref, onValue } from "firebase/database";
import fetchPokemon from "./FetchPokemon"; 
import PokemonCard from "./Card"; 
import { PokemonData } from "../types";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const Pokemons = () => {

  const [pokemons, setPokemons] = useState<PokemonData[] | null>(null);

  useEffect(() => {
    // Initialize the Firebase database with the provided configuration
    const database = getDatabase(cong);
    console.log(database, "database??")
    console.log(ref, "ref??")
    
    // Reference to the specific collection in the database
    const collectionRef = ref(database, "pokemon");
    console.log(collectionRef, "collectionRef??")


    // Function to fetch data from the database
    const fetchData = () => {
      // Listen for changes in the collection
      onValue(collectionRef, async (snapshot) => { 
        const dataItem = snapshot.val();
        console.log(dataItem, "display item")

        // Check if dataItem exists
        if (dataItem) {
          // Convert the object values into an array
          const itemsArray: number[] = Object.values(dataItem);
          const fetchedPokemons = await Promise.all(
            itemsArray.map((id) => fetchPokemon(id))
          );
          console.log(fetchedPokemons, "pokemons fetch")
          setPokemons(fetchedPokemons);
        }
      });
    };

    // Fetch data when the component mounts
    fetchData();
  }, []);

  return (
    <Swiper spaceBetween={50}
            slidesPerView={1}
            onSlideChange={() => console.log('slide change')}
            onSwiper={(swiper) => console.log(swiper)}
            loop={true}
            pagination={{
              clickable: true,
            }}
          >
      {pokemons && pokemons.map((pokemon, index) => (
        <li key={index}>
          <SwiperSlide key={index} className="col-md-4 mb-4">
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
  );
};

export default Pokemons;