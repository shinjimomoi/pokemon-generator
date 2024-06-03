// Page.tsx
import React from 'react';
import Game from './Game';

const Page: React.FC = () => {
  return (
    <div className='container'>
      <h1>Pokeslot</h1>
      <p>You can play and get a card!</p>
      <Game />
    </div>
  );
};

export default Page;
