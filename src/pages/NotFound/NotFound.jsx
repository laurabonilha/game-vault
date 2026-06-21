import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header/Header'
import usePageTitle from '../../hooks/usePageTitle'
import styles from './NotFound.module.css'

function NotFound() {
  usePageTitle('404 — Game Over')
  const navigate = useNavigate()

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <p className={styles.codigo}>404</p>

        {/* Fogueira CSS */}
        <div className={styles.cena}>
          <div className={styles.guerreiro}>🧎</div>
          <div className={styles.fogueiraWrapper}>
            <div className={styles.chamas}>
              <div className={`${styles.chama} ${styles.chama1}`} />
              <div className={`${styles.chama} ${styles.chama2}`} />
              <div className={`${styles.chama} ${styles.chama3}`} />
              <div className={styles.brasa} />
            </div>
            <div className={styles.tronco} />
            <div className={styles.glow} />
          </div>
        </div>

        <div className={styles.morreu}>GAME OVER</div>

        <h1 className={styles.titulo}>Esta página não existe, guerreiro</h1>
        <p className={styles.mensagem}>
          Descanse na fogueira. A sala que você busca foi perdida nas masmorras —
          talvez nunca tenha existido, ou foi consumida pela escuridão.
        </p>

        <button className="btn" onClick={() => navigate('/')}>
          ⚔ Retornar à Fogueira Principal
        </button>
      </main>
    </div>
  )
}

export default NotFound
