import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Header from '../../components/Header/Header'
import usePageTitle from '../../hooks/usePageTitle'
import useJogos from '../../hooks/useJogos'
import GameCard from '../../components/GameCard/GameCard'
import StatusBadge from '../../components/StatusBadge/StatusBadge'
import styles from './Home.module.css'

// ─── Helpers ────────────────────────────────────────────────

function agrupar(jogos, campo, valor = (j) => j.horasJogadas) {
  return jogos.reduce((acc, j) => {
    acc[j[campo]] = (acc[j[campo]] || 0) + valor(j)
    return acc
  }, {})
}

function melhorEm(jogos, campo, valor) {
  return [...jogos]
    .filter((j) => j[campo] === valor)
    .sort((a, b) => b.nota - a.nota || b.horasJogadas - a.horasJogadas)[0] ?? null
}

function buildSlides(jogos) {
  if (!jogos.length) return []

  const slides = []
  const usados = new Set()

  // Retorna o primeiro jogo da lista que ainda não foi usado como capa
  const firstUnused = (sorted) => sorted.find((j) => !usados.has(j.id)) ?? null
  // Marca o jogo como usado e o retorna
  const useGame = (j) => { if (j) usados.add(j.id); return j }

  const metaJogo = (j) =>
    [j.plataforma, j.genero, j.horasJogadas > 0 ? `${j.horasJogadas}h` : null]
      .filter(Boolean).join(' · ')

  const defaults = { icone: '🎮', estrelas: 0, status: null, ctaLabel: 'Ver detalhes →' }

  // 1. Último adicionado
  const recente = useGame(firstUnused([...jogos].sort((a, b) => b.id - a.id)))
  if (recente) slides.push({
    ...defaults, tag: '⚔ Último adicionado', watermark: '⚔',
    titulo: recente.nome, capa: recente.capa, estrelas: recente.nota,
    descricao: 'O grimório foi atualizado — uma nova saga aguarda ser inscrita.',
    meta: metaJogo(recente), status: recente.status, destino: `/jogo/${recente.id}`,
  })

  // 2. Mais avaliado
  const avaliado = useGame(firstUnused([...jogos].filter((j) => j.nota > 0).sort((a, b) => b.nota - a.nota || b.id - a.id)))
  if (avaliado) slides.push({
    ...defaults, tag: '★ Mais avaliado', watermark: '★',
    titulo: avaliado.nome, capa: avaliado.capa, estrelas: avaliado.nota,
    descricao: 'Sua aventura mais apreciada, gravada em ouro nos arquivos do vault.',
    meta: metaJogo(avaliado), status: avaliado.status, destino: `/jogo/${avaliado.id}`,
  })

  // 3. Gênero favorito — mais horas acumuladas; capa = melhor jogo não usado do gênero
  const horasPorGenero = agrupar(jogos, 'genero')
  const countPorGenero = agrupar(jogos, 'genero', () => 1)
  const generoFav = Object.keys(horasPorGenero).sort(
    (a, b) => horasPorGenero[b] - horasPorGenero[a] || countPorGenero[b] - countPorGenero[a]
  )[0]
  if (generoFav) {
    const count = countPorGenero[generoFav]
    const horas = horasPorGenero[generoFav]
    const melhor = useGame(firstUnused(
      [...jogos].filter((j) => j.genero === generoFav).sort((a, b) => b.nota - a.nota || b.horasJogadas - a.horasJogadas)
    ))
    slides.push({
      ...defaults, tag: '◈ Gênero favorito', watermark: '◈', icone: '🃏',
      titulo: generoFav, capa: melhor?.capa || '',
      descricao: 'As terras onde seu espírito de aventureiro mais encontrou lar.',
      meta: `${count} jogo${count !== 1 ? 's' : ''} · ${horas}h no total`,
      destino: melhor ? `/jogo/${melhor.id}` : '/acervo', ctaLabel: 'Explorar →',
    })
  }

  // 4. Plataforma principal — mais jogos; capa = melhor jogo não usado da plataforma
  const countPorPlat = agrupar(jogos, 'plataforma', () => 1)
  const platPrinc = Object.keys(countPorPlat).sort((a, b) => countPorPlat[b] - countPorPlat[a])[0]
  if (platPrinc) {
    const total = countPorPlat[platPrinc]
    const melhor = useGame(firstUnused(
      [...jogos].filter((j) => j.plataforma === platPrinc).sort((a, b) => b.nota - a.nota || b.horasJogadas - a.horasJogadas)
    ))
    slides.push({
      ...defaults, tag: '⊕ Plataforma principal', watermark: '⊕', icone: '🖥',
      titulo: platPrinc, capa: melhor?.capa || '',
      descricao: 'O reino onde mais batalhas foram travadas e vitórias conquistadas.',
      meta: `${total} jogo${total !== 1 ? 's' : ''} cadastrado${total !== 1 ? 's' : ''}`,
      destino: melhor ? `/jogo/${melhor.id}` : '/acervo', ctaLabel: 'Explorar →',
    })
  }

  // 5. Jogo mais jogado — procura o próximo não usado
  const maisJogado = useGame(firstUnused(
    [...jogos].filter((j) => j.horasJogadas > 0).sort((a, b) => b.horasJogadas - a.horasJogadas)
  ))
  if (maisJogado) slides.push({
    ...defaults, tag: '⧗ Jogo mais jogado', watermark: '⧗',
    titulo: maisJogado.nome, capa: maisJogado.capa, estrelas: maisJogado.nota,
    descricao: 'Incontáveis horas neste mundo. Ele se tornou sua segunda morada.',
    meta: `${maisJogado.horasJogadas}h de jogatina`,
    status: maisJogado.status, destino: `/jogo/${maisJogado.id}`,
  })

  // 6. Próxima aventura — querjogar mais antigo não usado
  const proxima = useGame(firstUnused(
    [...jogos].filter((j) => j.status === 'querjogar').sort((a, b) => a.id - b.id)
  ))
  if (proxima) slides.push({
    ...defaults, tag: '✦ Próxima aventura', watermark: '✦',
    titulo: proxima.nome, capa: proxima.capa,
    descricao: 'O pergaminho aguarda. Uma nova história prestes a ser escrita.',
    meta: 'Aguardando na sua lista', status: proxima.status,
    destino: `/jogo/${proxima.id}`, ctaLabel: 'Começar →',
  })

  // 7. Conquista recente — zerado mais recente não usado
  const conquista = useGame(firstUnused(
    [...jogos].filter((j) => j.status === 'zerado').sort((a, b) => b.id - a.id)
  ))
  if (conquista) slides.push({
    ...defaults, tag: '⚜ Conquista recente', watermark: '⚜',
    titulo: conquista.nome, capa: conquista.capa, estrelas: conquista.nota,
    descricao: 'O dragão foi derrotado. Mais uma vitória inscrita em seus pergaminhos.',
    meta: conquista.horasJogadas > 0 ? `Zerado em ${conquista.horasJogadas}h` : 'Vitória selada!',
    status: conquista.status, destino: `/jogo/${conquista.id}`,
  })

  // 8. Aventura inacabada — abandonado mais recente não usado
  const abandonado = useGame(firstUnused(
    [...jogos].filter((j) => j.status === 'abandonado').sort((a, b) => b.id - a.id)
  ))
  if (abandonado) slides.push({
    ...defaults, tag: 'Ω Aventura inacabada', watermark: 'Ω',
    titulo: abandonado.nome, capa: abandonado.capa,
    descricao: 'Você deixou essa aventura para trás... Será que é hora de retomar?',
    meta: 'Jornada interrompida', status: abandonado.status,
    destino: `/editar/${abandonado.id}`, ctaLabel: 'Retomar →',
  })

  return slides
}

// ─── Componente ─────────────────────────────────────────────

function Home() {
  usePageTitle(null)
  const { jogos, loading } = useJogos()
  const [slideIndex, setSlideIndex] = useState(0)

  const jogando = jogos.filter((j) => j.status === 'jogando')
  const zerados = jogos.filter((j) => j.status === 'zerado')
  const totalHoras = jogos.reduce((acc, j) => acc + j.horasJogadas, 0)

  const slides = useMemo(() => buildSlides(jogos), [jogos])
  const slide = slides[slideIndex % Math.max(slides.length, 1)] ?? null

  const irParaSlide = (delta) =>
    setSlideIndex((prev) => (prev + delta + slides.length) % slides.length)

  useEffect(() => {
    if (slides.length <= 1) return
    const interval = setInterval(() => irParaSlide(1), 5000)
    return () => clearInterval(interval)
  }, [slides.length])

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
            {/* Destaques */}
            {slide && (
              <section className={`${styles.section} fade-in`}>
                <div className="divider">
                  <div className="divider-line" />
                  <span className="divider-icon">♥</span>
                  <div className="divider-line" />
                </div>
                <h2 className={styles.sectionTitle}>Destaques</h2>

                <div className={styles.destaque}>
                  {slide.capa && (
                    <div
                      className={styles.destaqueBg}
                      style={{ backgroundImage: `url(${slide.capa})` }}
                    />
                  )}

                  {slides.length > 1 && (
                    <>
                      <button
                        className={`${styles.destaqueArrow} ${styles.destaqueArrowLeft}`}
                        onClick={() => irParaSlide(-1)}
                        aria-label="Slide anterior"
                      >‹</button>
                      <button
                        className={`${styles.destaqueArrow} ${styles.destaqueArrowRight}`}
                        onClick={() => irParaSlide(1)}
                        aria-label="Próximo slide"
                      >›</button>
                    </>
                  )}

                  <div className={styles.destaqueEsquerda}>
                    {slide.capa ? (
                      <img
                        key={slide.destino}
                        src={slide.capa}
                        alt={slide.titulo}
                        className={styles.destaqueCapaImg}
                      />
                    ) : (
                      <div key={slide.destino} className={styles.destaqueCapaSem}>
                        {slide.icone}
                      </div>
                    )}
                  </div>

                  <div key={slide.destino + '_info'} className={styles.destaqueDireita}>
                    <span className={styles.destaqueWatermark} aria-hidden="true">
                      {slide.watermark}
                    </span>

                    <span className={styles.destaqueTag}>{slide.tag}</span>

                    <h2 className={styles.destaqueNome}>{slide.titulo}</h2>

                    {slide.descricao && (
                      <p className={styles.destaqueDescricao}>{slide.descricao}</p>
                    )}

                    {slide.estrelas > 0 && (
                      <span className={styles.destaqueEstrelas}>
                        {'★'.repeat(slide.estrelas)}{'☆'.repeat(5 - slide.estrelas)}
                        <span className={styles.destaqueNota}> {slide.estrelas}/5</span>
                      </span>
                    )}

                    <div className={styles.destaqueMeta}>{slide.meta}</div>

                    {slide.status && (
                      <div><StatusBadge status={slide.status} /></div>
                    )}

                    <Link to={slide.destino} className={`btn ${styles.destaqueBtn}`}>
                      {slide.ctaLabel}
                    </Link>
                  </div>
                </div>

                {slides.length > 1 && (
                  <div className={styles.indicadores}>
                    {slides.map((_, i) => (
                      <button
                        key={i}
                        className={`${styles.indicador} ${i === slideIndex ? styles.indicadorAtivo : ''}`}
                        onClick={() => setSlideIndex(i)}
                        aria-label={`Destaque ${i + 1}`}
                      >✦</button>
                    ))}
                  </div>
                )}
              </section>
            )}

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
