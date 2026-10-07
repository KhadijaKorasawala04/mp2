import { Route, Routes } from 'react-router-dom'
import styles from './App.module.css'
import NavBar from './components/NavBar'
import DetailView from './pages/DetailView'
import GalleryView from './pages/GalleryView'
import ListView from './pages/ListView'


function App() {
  return (
    <>
      <NavBar />
      <main className={styles.main}>
        <Routes>
          <Route path="/" element={<ListView />} />
          <Route path="/gallery" element={<GalleryView />} />
          <Route path="/pokemon/:id" element={<DetailView />} />
          {/* fallback for unknown urls */}
          <Route path="*" element={<p>Page not found.</p>} />
        </Routes>
      </main>
      <footer className={styles.footer}>
        Built by Khadija · Data from{' '}
        <a
          href="https://pokeapi.co/"
          className={styles.footerLink}
          target="_blank"
          rel="noreferrer"
        >
          PokéAPI
        </a>
      </footer>
    </>
  )
}

export default App
