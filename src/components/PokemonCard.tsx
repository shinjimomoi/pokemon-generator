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
  isNewCard?: boolean;
  onClick?: () => void;
}

const PokemonCard: React.FC<Props> = ({ hp, imgSrc, pokeName, statAttack, statDefense, statSpeed, types, isNewCard, onClick }) => {
  const [cardColor, setCardColor] = useState('#242424');

  useEffect(() => {
    if (types.length > 0) {
      styleCard(types[0].type.name);
    }
  }, [types]);

  const styleCard = (type: string) => {
    const color = colorCard(type) || '#ffffff';
    setCardColor(color);
  };

  const renderTypes = () => {
    return types.map((item, index) => (
      <span key={index} style={{ color: cardColor }}>
        {capitalizeFirstLetter(item.type.name)}
      </span>
    ));
  };

  return (
    <div id="card" style={{ background: `radial-gradient(circle at 50% 0%, ${cardColor} 36%, #404060 36%)` }} onClick={onClick}>
      {isNewCard && (
        <div className="ribbon ribbon-top-left">
          <span>New</span>
        </div>
      )}
      <p className="hp">
        <span>HP</span>
        {hp}
      </p>
      <img src={imgSrc} alt={pokeName} />
      <h2 className="poke-name">{capitalizeFirstLetter(pokeName)}</h2>
      <div className="types">{renderTypes()}</div>
      <div className="stats">
        <div>
          <h3>{statAttack}</h3>
          <p style={{ color: cardColor }}>Attack</p>
        </div>
        <div>
          <h3>{statDefense}</h3>
          <p style={{ color: cardColor }}>Defense</p>
        </div>
        <div>
          <h3>{statSpeed}</h3>
          <p style={{ color: cardColor }}>Speed</p>
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;
