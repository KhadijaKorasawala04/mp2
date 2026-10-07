import styles from './Status.module.css'


export default function Status({ error }: { error: boolean }) {
  return (
    <p className={styles.status}>
      {error ? 'Could not load data from PokéAPI. Please refresh the page.' : 'Loading…'}
    </p>
  )
}
