import { Link, NavLink } from 'react-router-dom'
import styles from './NavBar.module.css'

function linkClass({ isActive }: { isActive: boolean }) {
  return isActive ? `${styles.link} ${styles.active}` : styles.link
}


export default function NavBar() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link to="/" className={styles.brand}>
          <svg className={styles.ball} viewBox="0 0 24 24" aria-hidden="true">
            <circle className={styles.ballBottom} cx="12" cy="12" r="10.5" />
            <path className={styles.ballTop} d="M1.5 12a10.5 10.5 0 0 1 21 0z" />
            <circle className={styles.ballBottom} cx="12" cy="12" r="3.5" />
          </svg>
          Pokédex
        </Link>
        <NavLink to="/" end className={linkClass}>
          List
        </NavLink>
        <NavLink to="/gallery" className={linkClass}>
          Gallery
        </NavLink>
      </nav>
    </header>
  )
}
