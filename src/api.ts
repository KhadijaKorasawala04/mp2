import axios from 'axios'
import type { PokemonDetail, PokemonSummary } from './types'

const api = axios.create({ baseURL: 'https://pokeapi.co/api/v2' })

export const POKEMON_COUNT = 1025 // base Pokémon only, no alternate forms


export const TYPES = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
]

interface NamedResource {
  name: string
  url: string
}

interface ListResponse {
  results: NamedResource[]
}

interface TypeResponse {
  pokemon: { pokemon: NamedResource }[]
}

interface PokemonResponse {
  id: number
  name: string
  height: number
  weight: number
  base_experience: number | null
  types: { type: NamedResource }[]
  abilities: { ability: NamedResource }[]
  stats: { base_stat: number; stat: NamedResource }[]
}

interface SpeciesResponse {
  flavor_text_entries: { flavor_text: string; language: NamedResource }[]
}

// Each request is made once
const cache = new Map<string, Promise<unknown>>()

function cached<T>(key: string, load: () => Promise<T>): Promise<T> {
  let request = cache.get(key) as Promise<T> | undefined
  if (!request) {
    request = load()
    request.catch(() => cache.delete(key))
    cache.set(key, request)
  }
  return request
}

function idFromUrl(url: string): number {
  return Number(url.split('/').filter(Boolean).pop())
}


export function getPokemonList(): Promise<PokemonSummary[]> {
  return cached('list', async () => {
    const { data } = await api.get<ListResponse>('/pokemon', {
      params: { limit: POKEMON_COUNT },
    })
    return data.results.map((p) => ({ id: idFromUrl(p.url), name: p.name }))
  })
}

export function getTypeIds(type: string): Promise<number[]> {
  return cached(`type/${type}`, async () => {
    const { data } = await api.get<TypeResponse>(`/type/${type}`)
    return data.pokemon
      .map((entry) => idFromUrl(entry.pokemon.url))
      .filter((id) => id <= POKEMON_COUNT) // drop alternate forms
  })
}

async function getDescription(id: number): Promise<string | null> {
  try {
    const { data } = await api.get<SpeciesResponse>(`/pokemon-species/${id}`)
    const entry = data.flavor_text_entries.findLast((e) => e.language.name === 'en')
    return entry ? entry.flavor_text.replace(/\s+/g, ' ') : null
  } catch {
    return null
  }
}

export function getPokemon(id: number): Promise<PokemonDetail> {
  return cached(`pokemon/${id}`, async () => {
    const [{ data }, description] = await Promise.all([
      api.get<PokemonResponse>(`/pokemon/${id}`),
      getDescription(id),
    ])
    return {
      id: data.id,
      name: data.name,
      height: data.height,
      weight: data.weight,
      baseExperience: data.base_experience,
      types: data.types.map((t) => t.type.name),
      abilities: data.abilities.map((a) => a.ability.name),
      stats: data.stats.map((s) => ({ name: s.stat.name, value: s.base_stat })),
      description,
    }
  })
}
