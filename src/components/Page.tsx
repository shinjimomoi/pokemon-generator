import React from 'react';
// import Game from './Game';
import PokemonMarket from './PokemonMarket';
import Pokemons from './Pokemons';
import SlotMachine from './SlotMachine';

interface PageProps {
  activeSection: string;
}

const Page: React.FC<PageProps> = ({ activeSection }) => {
  return (
    <div className="container">
      {/* <h1>Pokeslot</h1> */}
      {/* <p>You can play and get a card!</p> */}
      {activeSection === 'game' && <SlotMachine /> }
      {activeSection === 'shop' && <PokemonMarket /> }
      {activeSection === 'mypage' && <Pokemons /> }
    </div>
  );
};

export default Page;