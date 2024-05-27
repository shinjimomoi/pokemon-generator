import React, { useState, useEffect } from 'react';
import { capitalizeFirstLetter, colorCard } from '../common';

interface Props {
  hp: number;
  imgSrc: string;
  pokeName: string;
  statAttack: number;
  statDefense: number;
  statSpeed: number;
  types: { type: { name: string } }[];
}

const Card: React.FC<Props> = ({ hp, imgSrc, pokeName, statAttack, statDefense, statSpeed, types }) => {
  const [cardColor, setCardColor] = useState('#242424');

  // Function to append types
  const renderTypes = () => {
    return types.map((item, index) => (
      <span key={index}>{capitalizeFirstLetter(item.type.name)}</span>
    ));
  };

  // Function to style card
  const styleCard = (type: string) => {
    // Determine color based on types or any other criteria
    const color = colorCard(type) || '#ffffff';  // Example color
    setCardColor(color);
  };

  useEffect(() => {
    if (types.length > 0) {
      styleCard(types[0].type.name); // Call the styleCard function when component mounts or types change
    }
  }, [types]);

  return (
    <div id="card" style={{ background: `radial-gradient(circle at 50% 0%, ${cardColor} 36%, #242424 36%)` }}>
      <p className="hp">
        <span>HP</span>
        {hp}
      </p>
      <img src={imgSrc} alt={pokeName} />
      <h2 className="poke-name">{capitalizeFirstLetter(pokeName)}</h2>
      <div className="types">
        {renderTypes()}
      </div>
      <div className="stats">
        <div>
          <h3>{statAttack}</h3>
          <p>Attack</p>
        </div>
        <div>
          <h3>{statDefense}</h3>
          <p>Defense</p>
        </div>
        <div>
          <h3>{statSpeed}</h3>
          <p>Speed</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
