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
  const [initialSlide, setInitialSlide] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true); // New loading state
  const swiperRef = useRef<any | null>(null);

  useEffect(() => {
    const db = getDatabase(fire);
    const currentUser = auth.currentUser;

    if (currentUser) {
      const userUID = currentUser.uid;
      const collectionRef = ref(db, `users/${userUID}/pokemon`);

      const fetchData = () => {
        setLoading(true); // Set loading to true when fetching starts
        onValue(collectionRef, async (snapshot) => {
          const dataItem = snapshot.val();
          console.log(dataItem, "display item");

          if (dataItem) {
            const itemsArray: number[] = Object.values(dataItem);
            const fetchedPokemons = await Promise.all(
              itemsArray.map((id) => getPokemonData(id))
            );
            setInitialSlide(itemsArray.length);
            setPokemons(fetchedPokemons);
          } else {
            setPokemons([]); // No pokemons found
          }
          setLoading(false); // Set loading to false after fetching
        });
      };
      fetchData();
    } else {
      setLoading(false); // Set loading to false if no current user
    }
  }, [newCard]);

  if (loading) {
    return <div className="spinner"></div>; // Show spinner while loading
  }

  if (!loading && pokemons && pokemons.length === 0) {
    return <div>
      <p>No Pokémons yet</p>
    </div>; // Show message if no pokemons
  }

  return (
    <Swiper
      ref={swiperRef}
      spaceBetween={50}
      slidesPerView={1}
      initialSlide={newCard ? initialSlide : 0}
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
  );
};

export default Pokemons;
