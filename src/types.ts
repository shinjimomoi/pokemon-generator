export interface PokemonData {
  name: string;
  sprites: {
    front_default: string;
  };
  stats: {
    base_stat: number;
  }[];
  types: { type: { name: string } }[];
}