import React from 'react';
import Game from './Game';
import PokemonMarket from './PokemonMarket';

interface PageProps {
  activeSection: string;
}

const Page: React.FC<PageProps> = ({ activeSection }) => {
  return (
    <div className="container">
      <h1>Pokeslot</h1>
      {/* <p>You can play and get a card!</p> */}
      {activeSection === 'game' ? <Game /> : <PokemonMarket />}
    </div>
  );
};

export default Page;