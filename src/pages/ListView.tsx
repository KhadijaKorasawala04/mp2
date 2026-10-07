import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getPokemonList } from '../api'
import Pagination from '../components/Pagination'
import Status from '../components/Status'
import { useAsync } from '../useAsync'
import { formatName } from '../utils'
import styles from './ListView.module.css'

type SortKey = 'id' | 'name'

const PAGE_SIZE = 24


export default function ListView() {
  const { data, error } = useAsync(getPokemonList)
  const [query, setQuery] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('id')
  const [ascending, setAscending] = useState(true)
  const [page, setPage] = useState(1)

  // wait for the list before filtering
  if (!data) return <Status error={error} />

  const search = query.trim().toLowerCase().replace(/\s+/g, '-')
  const results = data
    .filter((pokemon) => pokemon.name.includes(search))
    .sort((a, b) => {
      const order = sortKey === 'id' ? a.id - b.id : a.name.localeCompare(b.name)
      return ascending ? order : -order
    })


  const pageCount = Math.max(1, Math.ceil(results.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const visible = results.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  return (
    <>
      <h1>Pokémon List</h1>
      <div className={styles.controls}>
        <input
          type="search"
          className={styles.search}
          placeholder="Search by name…"
          aria-label="Search by name"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setPage(1) // back to page 1 on new search
          }}
        />
        <label className={styles.field}>
          Sort by
          <select
            value={sortKey}
            onChange={(event) => {
              setSortKey(event.target.value as SortKey)
              setPage(1)
            }}
          >
            <option value="id">Number</option>
            <option value="name">Name</option>
          </select>
        </label>
        <label className={styles.field}>
          Order
          <select
            value={ascending ? 'asc' : 'desc'}
            onChange={(event) => {
              setAscending(event.target.value === 'asc')
              setPage(1)
            }}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>
      </div>

      <p className={styles.count}>{results.length} Pokémon</p>

      {visible.length === 0 ? (
        <p className={styles.count}>No Pokémon match your search.</p>
      ) : (
        <ul className={styles.list}>
          {visible.map((pokemon) => (
            <li key={pokemon.id}>
              <Link to={`/pokemon/${pokemon.id}`} className={styles.row}>
                <span className={styles.number}>#{pokemon.id}</span>
                <span className={styles.name}>{formatName(pokemon.name)}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Pagination page={currentPage} pageCount={pageCount} onChange={setPage} />
    </>
  )
}
