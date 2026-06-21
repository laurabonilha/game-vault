import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../../components/Header/Header'
import usePageTitle from '../../hooks/usePageTitle'
import StatusBadge from '../../components/StatusBadge/StatusBadge'
import StarRating from '../../components/StarRating/StarRating'
import GameCard from '../../components/GameCard/GameCard'
import jogosData from '../../data/jogos.json'
import styles from './DetalheJogo.module.css'

function DetalheJogo() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [jogo, setJogo] = useState(null)
  const [loading, setLoading] = useState(true)
  usePageTitle(jogo ? jogo.nome : 'Carregando...')

  useEffect(() => {
    const timer = setTimeout(() => {
      const encontrado = jogosData.find((j) => j.id === Number(id))
      setJogo(encontrado || null)
      setLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [id])

  const jogosRelacionados = jogo
    ? jogosData.filter((j) => j.genero === jogo.genero && j.id !== jogo.id)
    : []

  if (loading) {
    return (
      <div className={styles.page}>
        <Header />
        <div className="loader" style={{ paddingTop: '120px' }}>
          <div className="loader-dot" />
          <div className="loader-dot" />
          <div className="loader-dot" />
        </div>
      </div>
    )
  }

  if (!jogo) {
    return (
      <div className={styles.page}>
        <Header />
        <div className={styles.notFound}>
          <span className={styles.notFoundIcon}>⚔️</span>
          <h2>Jogo não encontrado nos grimórios</h2>
          <button className="btn" onClick={() => navigate('/acervo')}>
            Voltar ao Acervo
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <Header />

      {jogo.capa && (
        <div className={styles.heroBg}>
          <div
            className={styles.heroBgImg}
            style={{ backgroundImage: `url(${jogo.capa})` }}
          />
          <div className={styles.heroBgOverlay} />
        </div>
      )}

      <main className={`${styles.main} fade-in`}>
        {/* Hero */}
        <div className={styles.hero}>
          <div className={styles.capaWrapper}>
            {jogo.capa ? (
              <img src={jogo.capa} alt={jogo.nome} className={styles.capa} />
            ) : (
              <div className={styles.capaPlaceholder}>
                <span>🎮</span>
              </div>
            )}
          </div>

          <div className={styles.heroInfo}>
            <div className={styles.headerRow}>
              <StatusBadge status={jogo.status} />
              <span className={styles.ano}>{jogo.anoLancamento}</span>
            </div>

            <h1 className={styles.nome}>{jogo.nome}</h1>

            {jogo.nota > 0 && (
              <div className={styles.notaRow}>
                <StarRating value={jogo.nota} />
                <span className={styles.notaTexto}>{jogo.nota}/5</span>
              </div>
            )}

            <div className={styles.metaGrid}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Plataforma</span>
                <span className={styles.metaValor}>{jogo.plataforma}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Gênero</span>
                <span className={styles.metaValor}>{jogo.genero}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Horas jogadas</span>
                <span className={styles.metaValor}>
                  {jogo.horasJogadas > 0 ? `${jogo.horasJogadas}h` : '—'}
                </span>
              </div>
            </div>

            {jogo.review && (
              <div className={styles.reviewBox}>
                <span className={styles.reviewLabel}>{'>'} Anotação do aventureiro</span>
                <p className={styles.reviewTexto}>{jogo.review}</p>
              </div>
            )}

            <button
              className="btn"
              onClick={() => navigate('/acervo')}
              style={{ marginTop: 'auto' }}
            >
              ← Voltar ao Acervo
            </button>
          </div>
        </div>

        {/* Jogos relacionados */}
        {jogosRelacionados.length > 0 && (
          <section className={styles.relacionados}>
            <div className="divider">
              <div className="divider-line" />
              <span className="divider-icon">◆</span>
              <div className="divider-line" />
            </div>
            <h2 className={styles.relacionadosTitulo}>Você também tem</h2>
            <div className={styles.relacionadosGrid}>
              {jogosRelacionados.map((j) => (
                <GameCard key={j.id} {...j} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export default DetalheJogo
