import { useEffect, useRef, useState } from "react";
import { auth, fire } from "../firebase";
import { getDatabase, ref, onValue, off } from "firebase/database";
import { getPokemonData } from "../useFetchPokemon";
import PokemonCard from "./PokemonCard";
import { PokemonData } from "../types";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Loading from "./Loading";

const Pokemons: React.FC = () => {
  const [pokemons, setPokemons] = useState<PokemonData[] | null>(null);
  const [initialSlide, setInitialSlide] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const swiperRef = useRef<any | null>(null);

  useEffect(() => {
    const db = getDatabase(fire);
    const currentUser = auth.currentUser;

    if (currentUser) {
      setLoading(true);
      const userUID = currentUser.uid;
      const pokemonCollectionRef = ref(db, `users/${userUID}/pokemon`);

      const fetchData = async () => {
        onValue(pokemonCollectionRef, async (snapshot) => {
          try {
            const dataItem = snapshot.val();
            console.log(dataItem, "display item");

            if (dataItem) {
              const itemsArray: number[] = Object.values(dataItem);
              const fetchedPokemons = await Promise.all(
                itemsArray.map(async (id) => {
                  return await getPokemonData(id);
                })
              );
              setInitialSlide(itemsArray.length);
              setPokemons(fetchedPokemons);
            } else {
              setPokemons([]);
            }
            setLoading(false);
          } catch (error) {
            setError("Failed to fetch Pokémon data. Please try again.");
            setTimeout(() => {
              setLoading(false);              
            }, 500);
          }
        });
      };

      fetchData();
    }

    return () => {
      if (currentUser) {
        off(ref(db, `users/${currentUser.uid}/pokemon`));
      }
    };
  }, []);

  return (
    <>
      <h2>My Cards</h2>
      {loading ? (
        <Loading message="Loading cards..." />
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div>
          <p className="pokemon-count">You have {pokemons?.length} Pokemon cards.</p>
          <Swiper
            ref={swiperRef}
            spaceBetween={50}
            slidesPerView={1}
            initialSlide={initialSlide ? initialSlide : 0}
            onSlideChange={() => console.log("slide change")}
            onSwiper={(swiper) => console.log(swiper)}
            loop={true}
          >
            {pokemons &&
              pokemons.map((pokemon, index) => (
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
              ))}
          </Swiper>
        </div>
      )}
    </>
  );
};

export default Pokemons;
