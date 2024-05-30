import { useEffect, useRef, useState } from "react";
import { auth, fire } from "../firebase";
import { getDatabase, ref, onValue } from "firebase/database";
import { getPokemonData } from "./FetchPokemon"; 
import PokemonCard from "./Card"; 
import { PokemonData } from "../types";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

interface Props {
  newCard: boolean;
}

const Pokemons: React.FC<Props> = ({ newCard }) => {
  const [pokemons, setPokemons] = useState<PokemonData[] | null>(null);
  const [lastSlide, setLastSlide] = useState<number>(0);
  const swiperRef = useRef<any | null>(null);

  useEffect(() => {
    // Initialize the Firebase database with the provided configuration
    const db = getDatabase(fire);

    const currentUser = auth.currentUser;
    if (currentUser) {
      const userUID = currentUser.uid;
      const collectionRef = ref(db, `users/${userUID}/pokemon`);

      const fetchData = () => {
        onValue(collectionRef, async (snapshot) => {
          const dataItem = snapshot.val();
          console.log(dataItem, "display item");

          if (dataItem) {
            // Convert the object values into an array
            const itemsArray: number[] = Object.values(dataItem);
            const fetchedPokemons = await Promise.all(
              itemsArray.map((id) => getPokemonData(id))
            );
            setLastSlide(itemsArray.length);
            setPokemons(fetchedPokemons);
            if (swiperRef.current) {
              console.log(swiperRef.current, "swiperRef.current")
              swiperRef.current.swiper.slideTo(itemsArray.length);
            }
          }
        });
      };
      fetchData();
    }
  }, [newCard]); // Watch for changes in newCard

  if (!pokemons || lastSlide === null) {
    return <div></div>;
  }

  return (
    <Swiper
      ref={swiperRef}
      spaceBetween={50}
      slidesPerView={1}
      onSlideChange={() => {}}
      onSwiper={(swiper) => {}}
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
  );
};

export default Pokemons;
