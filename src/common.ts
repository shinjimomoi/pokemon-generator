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
    normal: '#987654',
    fighting: '#987654',
    flying: '#987654',
    poison: '#987654',
    ground: '#987654',
    rock: '#987654',
    bug: '#987654',
    ghost: '#987654',
    steel: '#987654',
    fire: '#987654',
    water: '#987654',
    grass: '#987654',
    electric: '#987654',
    psychic: '#987654',
    ice: '#987654',
    dragon: '#987654',
    dark: '#987654',
    fairy: '#987654',
    stellar: '#987654',
    unknown: '#FFFFFF'
  };
  return typeColors[str];
};

export const getRandomInt = (max:number) => {
  return Math.floor(Math.random() * max);
}

export * from './common';
