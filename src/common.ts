/**
 * Capitalizes the first letter of the given string.
 * @param str - The string to capitalize.
 * @returns The string with the first letter capitalized.
 */
export const capitalizeFirstLetter = (str: string): string => {
  if (str.length === 0) return "";
  return str[0].toUpperCase() + str.substring(1);
};

export const colorCard = (str: string): string | undefined => {
  const typeColors: Record<string, string> = {
    normal: '#A8A878',
    fighting: '#C03028',
    flying: '#A890F0',
    poison: '#e63ce6',
    ground: '#E0C068',
    rock: '#B8A038',
    bug: '#A8B820',
    ghost: '#705898',
    steel: '#B8B8D0',
    fire: '#F08030',
    water: '#6890F0',
    grass: '#78C850',
    electric: '#F8D030',
    psychic: '#F85888',
    ice: '#98D8D8',
    dragon: '#7038F8',
    dark: '#705848',
    fairy: '#EE99AC',
    stellar: '#FFD700',
    unknown: '#FFFFFF'
  };
  return typeColors[str];
};

export const getRandomInt = (max:number) => {
  return Math.floor(Math.random() * max);
}

export * from './common';
