// Page.tsx
import React from 'react';
import Game from './Game';

const Page: React.FC = () => {
  return (
    <div className='container'>
      <h1>Card Generator</h1>
      <p>You can play once a day to get a card.</p>
      <Game />
    </div>
  );
};

export default Page;
