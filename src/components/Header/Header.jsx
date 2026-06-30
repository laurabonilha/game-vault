import { Link, useLocation } from 'react-router-dom'
import styles from './Header.module.css'

function Header() {
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <header className={styles.header}>
      <div className={styles.container}>

        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}>⚔</span>
          <span className={styles.logoDivider} />
          <span className={styles.logoText}>Game Vault</span>
        </Link>

        <nav className={styles.nav}>
          <Link
            to="/"
            className={`${styles.navLink} ${isActive('/') ? styles.active : ''}`}
          >
            Home
          </Link>

          <span className={styles.navSep}>◆</span>

          <Link
            to="/acervo"
            className={`${styles.navLink} ${isActive('/acervo') ? styles.active : ''}`}
          >
            Acervo
          </Link>

          <span className={styles.navSep}>◆</span>

          <Link
            to="/estatisticas"
            className={`${styles.navLink} ${isActive('/estatisticas') ? styles.active : ''}`}
          >
            Stats
          </Link>

          <span className={styles.navSep}>◆</span>

          <Link
            to="/adicionar"
            className={`${styles.navLink} ${styles.navLinkAdicionar} ${isActive('/adicionar') ? styles.active : ''}`}
          >
            + Adicionar
          </Link>
        </nav>

      </div>
    </header>
  )
}

export default Header
