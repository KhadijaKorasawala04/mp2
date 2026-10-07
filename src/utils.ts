export function artworkUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
}


export function formatName(name: string): string {
  return name.replace(/-/g, ' ')
}
