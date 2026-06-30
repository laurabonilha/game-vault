import { useState } from 'react'
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom'
import Header from '../../components/Header/Header'
import usePageTitle from '../../hooks/usePageTitle'
import useJogos from '../../hooks/useJogos'
import StatusBadge from '../../components/StatusBadge/StatusBadge'
import StarRating from '../../components/StarRating/StarRating'
import GameCard from '../../components/GameCard/GameCard'
import { deleteJogo } from '../../utils/storage'
import styles from './DetalheJogo.module.css'

function DetalheJogo() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { jogos, loading } = useJogos()
  const [modalExcluir, setModalExcluir] = useState(false)

  const jogo = jogos.find((j) => j.id === Number(id)) ?? null
  usePageTitle(loading ? 'Carregando...' : jogo ? jogo.nome : 'Não encontrado')

  const jogosRelacionados = jogo
    ? jogos.filter((j) => j.genero === jogo.genero && j.id !== jogo.id)
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
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb} aria-label="Navegação">
          <Link to="/" className={styles.breadcrumbLink}>Home</Link>
          <span className={styles.breadcrumbSep}>◆</span>
          <Link to="/acervo" className={styles.breadcrumbLink}>Acervo</Link>
          <span className={styles.breadcrumbSep}>◆</span>
          <span className={styles.breadcrumbAtual} title={location.pathname}>
            {jogo.nome}
          </span>
        </nav>

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

            <div className={styles.acoes}>
              <button className="btn btn-ghost" onClick={() => navigate('/acervo')}>
                ← Voltar
              </button>
              <button className="btn" onClick={() => navigate(`/editar/${id}`)}>
                ✎ Editar
              </button>
              <button className={styles.btnExcluir} onClick={() => setModalExcluir(true)}>
                ✕ Excluir
              </button>
            </div>
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

      {modalExcluir && (
        <div className={styles.modalOverlay} onClick={() => setModalExcluir(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <span className={styles.modalIcon}>⚠️</span>
            <h2 className={styles.modalTitulo}>Excluir jogo</h2>
            <p className={styles.modalTexto}>
              Tem certeza que deseja remover <strong>"{jogo.nome}"</strong> do vault? Essa ação não pode ser desfeita.
            </p>
            <div className={styles.modalAcoes}>
              <button className="btn btn-ghost" onClick={() => setModalExcluir(false)}>
                Cancelar
              </button>
              <button
                className={styles.btnExcluirConfirm}
                onClick={() => { deleteJogo(Number(id)); navigate('/acervo') }}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DetalheJogo
