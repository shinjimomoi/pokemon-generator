export interface PokemonData {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
  stats: {
    base_stat: number;
  }[];
  types: { type: { name: string } }[];
}