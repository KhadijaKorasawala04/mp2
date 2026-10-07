import styles from './Pagination.module.css'

interface PaginationProps {
  page: number
  pageCount: number
  onChange: (page: number) => void
}


export default function Pagination({ page, pageCount, onChange }: PaginationProps) {
  return (
    <div className={styles.pagination}>
      <button type="button" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        ← Prev
      </button>
      <span>
        Page {page} of {pageCount}
      </span>
      <button type="button" disabled={page >= pageCount} onClick={() => onChange(page + 1)}>
        Next →
      </button>
    </div>
  )
}
