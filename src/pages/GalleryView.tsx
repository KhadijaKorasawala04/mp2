import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPokemonList, getTypeIds, TYPES } from '../api'
import Pagination from '../components/Pagination'
import Status from '../components/Status'
import { useAsync } from '../useAsync'
import { artworkUrl, formatName } from '../utils'
import styles from './GalleryView.module.css'

const PAGE_SIZE = 24


export default function GalleryView() {
  const [selected, setSelected] = useState<string[]>([])
  const [page, setPage] = useState(1)

  const loadTypeIds = useCallback(() => Promise.all(selected.map(getTypeIds)), [selected])
  const list = useAsync(getPokemonList)
  const typeIds = useAsync(loadTypeIds)


  function toggleType(type: string) {
    setSelected((current) =>
      current.includes(type) ? current.filter((t) => t !== type) : [...current, type],
    )
    setPage(1)
  }

  function renderGallery() {
    if (!list.data) return <Status error={list.error} />
    if (!typeIds.data) return <Status error={typeIds.error} />

    const allowed = new Set(typeIds.data.flat())
    const results =
      selected.length === 0 ? list.data : list.data.filter((pokemon) => allowed.has(pokemon.id))


    const pageCount = Math.max(1, Math.ceil(results.length / PAGE_SIZE))
    const currentPage = Math.min(page, pageCount)
    const visible = results.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

    return (
      <>
        <p className={styles.count}>{results.length} Pokémon</p>
        <ul className={styles.grid}>
          {visible.map((pokemon) => (
            <li key={pokemon.id}>
              <Link to={`/pokemon/${pokemon.id}`} className={styles.card}>
                <img
                  className={styles.image}
                  src={artworkUrl(pokemon.id)}
                  alt={formatName(pokemon.name)}
                  loading="lazy"
                />
                {formatName(pokemon.name)}
              </Link>
            </li>
          ))}
        </ul>
        <Pagination page={currentPage} pageCount={pageCount} onChange={setPage} />
      </>
    )
  }


  return (
    <>
      <h1>Pokémon Gallery</h1>
      <div className={styles.filters}>
        {TYPES.map((type) => {
          const active = selected.includes(type)
          return (
            <button
              key={type}
              type="button"
              className={active ? `${styles.filter} ${styles.active}` : styles.filter}
              aria-pressed={active}
              onClick={() => toggleType(type)}
            >
              {type}
            </button>
          )
        })}
      </div>
      {renderGallery()}
    </>
  )
}
