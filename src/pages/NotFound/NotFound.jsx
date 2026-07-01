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

        <div className={styles.morreu}>GAME OVER</div>

        {/* Cena da fogueira */}
        <div className={styles.cena}>

          <div className={styles.fogueiraWrapper}>
            {/* Brasas flutuando */}
            <div className={styles.embersContainer}>
              <div className={`${styles.ember} ${styles.ember1}`} />
              <div className={`${styles.ember} ${styles.ember2}`} />
              <div className={`${styles.ember} ${styles.ember3}`} />
              <div className={`${styles.ember} ${styles.ember4}`} />
              <div className={`${styles.ember} ${styles.ember5}`} />
              <div className={`${styles.ember} ${styles.ember6}`} />
            </div>

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

        {/* Linha de chão */}
        <div className={styles.chao} />

        <h1 className={styles.titulo}>Esta página não existe, guerreiro</h1>
        <p className={styles.mensagem}>
          Descanse na fogueira. A sala que você busca foi perdida nas masmorras —
          talvez nunca tenha existido, ou foi consumida pela escuridão.
        </p>

        <button className={`btn ${styles.btnVoltar}`} onClick={() => navigate('/')}>
          ⚔ Retornar à Fogueira Principal
        </button>
      </main>
    </div>
  )
}

export default NotFound
