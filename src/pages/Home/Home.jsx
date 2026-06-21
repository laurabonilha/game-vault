import { useState, useEffect } from 'react'
import Header from '../../components/Header/Header'
import usePageTitle from '../../hooks/usePageTitle'
import GameCard from '../../components/GameCard/GameCard'
import jogosData from '../../data/jogos.json'
import styles from './Home.module.css'

function Home() {
  usePageTitle(null)
  const [jogos, setJogos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setJogos(jogosData)
      setLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  const jogando = jogos.filter((j) => j.status === 'jogando')
  const zerados = jogos.filter((j) => j.status === 'zerado')
  const totalHoras = jogos.reduce((acc, j) => acc + j.horasJogadas, 0)

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        {/* Banner */}
        <section className={styles.banner}>
          <div className={styles.bannerHalo} />

          <div className={`${styles.bannerOrnament} ${styles.ornamentTop}`}>
            <span className={styles.ornamentLine} />
            <span className={styles.ornamentStar}>✦</span>
            <span className={styles.ornamentLine} />
          </div>

          <h1 className={styles.bannerTitle}>Game Vault</h1>

          <div className={`${styles.bannerOrnament} ${styles.ornamentBottom}`}>
            <span className={styles.ornamentLine} />
            <span className={styles.ornamentStar}>✦</span>
            <span className={styles.ornamentLine} />
          </div>

          <p className={styles.bannerSub}>
            <span className={styles.subDeco}>── · ──</span>
            Seu grimório pessoal de aventuras digitais
            <span className={styles.subDeco}>── · ──</span>
          </p>
        </section>

        {/* Painel de estatísticas */}
        {loading ? (
          <div className="loader">
            <div className="loader-dot" />
            <div className="loader-dot" />
            <div className="loader-dot" />
          </div>
        ) : (
          <section className={`${styles.statsPanel} fade-in`}>
            <div className={styles.statCard}>
              <span className={styles.statIcon}>🎮</span>
              <span className={styles.statValue}>{jogos.length}</span>
              <span className={styles.statLabel}>Total de Jogos</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statIcon}>🏆</span>
              <span className={styles.statValue}>{zerados.length}</span>
              <span className={styles.statLabel}>Zerados</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statIcon}>🔥</span>
              <span className={styles.statValue}>{jogando.length}</span>
              <span className={styles.statLabel}>Jogando</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statIcon}>⏳</span>
              <span className={styles.statValue}>{totalHoras}h</span>
              <span className={styles.statLabel}>Horas Jogadas</span>
            </div>
          </section>
        )}

        {!loading && (
          <>
            {/* Jogando Agora */}
            <section className={`${styles.section} fade-in`}>
              <div className="divider">
                <div className="divider-line" />
                <span className="divider-icon">▶</span>
                <div className="divider-line" />
              </div>
              <h2 className={styles.sectionTitle}>Jogando Agora</h2>
              <div className={styles.grid}>
                {jogando.map((jogo) => (
                  <GameCard key={jogo.id} {...jogo} />
                ))}
              </div>
            </section>

            {/* Zerados Recentemente */}
            <section className={`${styles.section} fade-in`}>
              <div className="divider">
                <div className="divider-line" />
                <span className="divider-icon">✓</span>
                <div className="divider-line" />
              </div>
              <h2 className={styles.sectionTitle}>Zerados Recentemente</h2>
              <div className={styles.grid}>
                {zerados.map((jogo) => (
                  <GameCard key={jogo.id} {...jogo} />
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  )
}

export default Home
