import { useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getPokemon, POKEMON_COUNT } from '../api'
import Status from '../components/Status'
import { useAsync } from '../useAsync'
import { artworkUrl, formatName } from '../utils'
import styles from './DetailView.module.css'

// Highest base stat any Pokémon has (Blissey's HP).
const MAX_STAT = 255


export default function DetailView() {
  const id = Number(useParams().id)

  if (!Number.isInteger(id) || id < 1 || id > POKEMON_COUNT) {
    return (
      <>
        <h1>Pokémon not found</h1>
        <Link to="/" className={styles.back}>
          Back to the list
        </Link>
      </>
    )
  }

  return <PokemonDetails id={id} />
}


function PokemonDetails({ id }: { id: number }) {
  const load = useCallback(() => getPokemon(id), [id])
  const { data: pokemon, error } = useAsync(load)

  // wrap around at both ends
  const previous = id === 1 ? POKEMON_COUNT : id - 1
  const next = id === POKEMON_COUNT ? 1 : id + 1

  return (
    <>
      <div className={styles.pager}>
        <Link to={`/pokemon/${previous}`} className={styles.pagerLink}>
          ← Previous
        </Link>
        <Link to={`/pokemon/${next}`} className={styles.pagerLink}>
          Next →
        </Link>
      </div>

      {!pokemon ? (
        <Status error={error} />
      ) : (
        <article className={styles.card}>
          <img className={styles.image} src={artworkUrl(pokemon.id)} alt={formatName(pokemon.name)} />
          <div className={styles.info}>
            <h1 className={styles.name}>
              #{pokemon.id} {formatName(pokemon.name)}
            </h1>
            <ul className={styles.types}>
              {pokemon.types.map((type) => (
                <li key={type} className={`${styles.type} ${styles[type]}`}>
                  {type}
                </li>
              ))}
            </ul>
            {pokemon.description && <p className={styles.description}>{pokemon.description}</p>}

            <dl className={styles.attributes}>
              <dt>Height</dt>
              <dd>{(pokemon.height / 10).toFixed(1)} m</dd>
              <dt>Weight</dt>
              <dd>{(pokemon.weight / 10).toFixed(1)} kg</dd>
              <dt>Base experience</dt>
              <dd>{pokemon.baseExperience ?? 'Unknown'}</dd>
              <dt>Abilities</dt>
              <dd className={styles.capitalize}>{pokemon.abilities.map(formatName).join(', ')}</dd>
            </dl>

            <h2 className={styles.heading}>Base stats</h2>
            <dl className={styles.stats}>
              {pokemon.stats.map((stat) => (
                <div key={stat.name} className={styles.stat}>
                  <dt>{formatName(stat.name)}</dt>
                  <dd>
                    <span className={styles.statValue}>{stat.value}</span>
                    <progress className={styles.bar} max={MAX_STAT} value={stat.value} />
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </article>
      )}
    </>
  )
}
