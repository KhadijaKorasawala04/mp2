export interface PokemonSummary {
  id: number
  name: string
}


export interface PokemonStat {
  name: string
  value: number
}

export interface PokemonDetail extends PokemonSummary {
  height: number
  weight: number
  baseExperience: number | null
  types: string[]
  abilities: string[]
  stats: PokemonStat[]
  description: string | null
}
