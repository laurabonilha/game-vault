import { useState, useEffect } from 'react'
import Header from '../../components/Header/Header'
import usePageTitle from '../../hooks/usePageTitle'
import { getJogos } from '../../utils/storage'
import styles from './Estatisticas.module.css'

const STATUS_CONFIG = {
  jogando:    { label: 'Jogando',     color: 'var(--color-status-jogando)' },
  zerado:     { label: 'Zerado',      color: 'var(--color-status-zerado)' },
  abandonado: { label: 'Abandonado',  color: 'var(--color-status-abandonado)' },
  querjogar:  { label: 'Quero Jogar', color: 'var(--color-status-querjogar)' },
}

function agrupar(jogos, campo) {
  return jogos.reduce((acc, j) => {
    const chave = j[campo]
    acc[chave] = (acc[chave] || 0) + 1
    return acc
  }, {})
}

function agruparHoras(jogos, campo) {
  return jogos.reduce((acc, j) => {
    const chave = j[campo]
    acc[chave] = (acc[chave] || 0) + j.horasJogadas
    return acc
  }, {})
}

function ordenarDesc(obj) {
  return Object.entries(obj).sort((a, b) => b[1] - a[1])
}

function Estatisticas() {
  usePageTitle('Estatísticas')
  const [jogos, setJogos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setJogos(getJogos())
      setLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  const total = jogos.length
  const jogosComNota = jogos.filter((j) => j.nota > 0)
  const mediaNota =
    jogosComNota.length > 0
      ? (jogosComNota.reduce((acc, j) => acc + j.nota, 0) / jogosComNota.length).toFixed(1)
      : '—'
  const totalHoras = jogos.reduce((acc, j) => acc + j.horasJogadas, 0)
  const jogosComReview = jogos.filter((j) => j.review && j.review.trim()).length

  const statusMap = { jogando: 0, zerado: 0, abandonado: 0, querjogar: 0 }
  jogos.forEach((j) => { if (j.status in statusMap) statusMap[j.status]++ })

  const generosCount  = ordenarDesc(agrupar(jogos, 'genero'))
  const generoHoras   = ordenarDesc(agruparHoras(jogos, 'genero')).filter(([, h]) => h > 0)
  const plataformas   = ordenarDesc(agrupar(jogos, 'plataforma'))

  const maxGenero    = generosCount[0]?.[1] || 1
  const maxHoras     = generoHoras[0]?.[1]  || 1
  const maxPlataforma = plataformas[0]?.[1] || 1

  const topJogos = [...jogos]
    .filter((j) => j.nota > 0)
    .sort((a, b) => b.nota - a.nota || b.horasJogadas - a.horasJogadas)
    .slice(0, 5)

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <h1 className={styles.titulo}>Estatísticas</h1>
        <p className={styles.subtitulo}>Um mapa da sua jornada pelo vault</p>

        {loading ? (
          <div className="loader" style={{ paddingTop: '80px' }}>
            <div className="loader-dot" />
            <div className="loader-dot" />
            <div className="loader-dot" />
          </div>
        ) : total === 0 ? (
          <div className={styles.vazio}>
            <span className={styles.vaziIcone}>📜</span>
            <p>Nenhum jogo no vault ainda. Adicione aventuras para ver as estatísticas.</p>
          </div>
        ) : (
          <div className={`${styles.conteudo} fade-in`}>

            {/* Cards de resumo */}
            <section className={styles.resumo}>
              <div className={styles.resumoCard}>
                <span className={styles.resumoIcone}>🎮</span>
                <span className={styles.resumoValor}>{total}</span>
                <span className={styles.resumoLabel}>Total de Jogos</span>
              </div>
              <div className={styles.resumoCard}>
                <span className={styles.resumoIcone}>⭐</span>
                <span className={styles.resumoValor}>{mediaNota}</span>
                <span className={styles.resumoLabel}>Média de Nota</span>
              </div>
              <div className={styles.resumoCard}>
                <span className={styles.resumoIcone}>⏳</span>
                <span className={styles.resumoValor}>{totalHoras}h</span>
                <span className={styles.resumoLabel}>Horas Jogadas</span>
              </div>
              <div className={styles.resumoCard}>
                <span className={styles.resumoIcone}>📜</span>
                <span className={styles.resumoValor}>{jogosComReview}</span>
                <span className={styles.resumoLabel}>Com Anotação</span>
              </div>
            </section>

            {/* Seções em grid */}
            <div className={styles.secaoGrid}>

              {/* Status */}
              <section className={styles.secao}>
                <h2 className={styles.secaoTitulo}>Por Status</h2>
                <div className={styles.barras}>
                  {Object.entries(statusMap).map(([status, count]) => (
                    <div key={status} className={styles.barraItem}>
                      <div className={styles.barraHeader}>
                        <span className={styles.barraLabel}>{STATUS_CONFIG[status].label}</span>
                        <span className={styles.barraValor}>
                          {count} · {total > 0 ? Math.round((count / total) * 100) : 0}%
                        </span>
                      </div>
                      <div className={styles.barraTrack}>
                        <div
                          className={styles.barraFill}
                          style={{
                            width: total > 0 ? `${(count / total) * 100}%` : '0%',
                            background: STATUS_CONFIG[status].color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Gêneros */}
              <section className={styles.secao}>
                <h2 className={styles.secaoTitulo}>Por Gênero</h2>
                <div className={styles.barras}>
                  {generosCount.map(([genero, count]) => (
                    <div key={genero} className={styles.barraItem}>
                      <div className={styles.barraHeader}>
                        <span className={styles.barraLabel}>{genero}</span>
                        <span className={styles.barraValor}>{count} jogo{count !== 1 ? 's' : ''}</span>
                      </div>
                      <div className={styles.barraTrack}>
                        <div
                          className={styles.barraFill}
                          style={{ width: `${(count / maxGenero) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Horas por gênero */}
              <section className={styles.secao}>
                <h2 className={styles.secaoTitulo}>Horas por Gênero</h2>
                <div className={styles.barras}>
                  {generoHoras.map(([genero, horas]) => (
                    <div key={genero} className={styles.barraItem}>
                      <div className={styles.barraHeader}>
                        <span className={styles.barraLabel}>{genero}</span>
                        <span className={styles.barraValor}>{horas}h</span>
                      </div>
                      <div className={styles.barraTrack}>
                        <div
                          className={styles.barraFill}
                          style={{
                            width: `${(horas / maxHoras) * 100}%`,
                            background: 'var(--color-gold)',
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Plataformas */}
              <section className={styles.secao}>
                <h2 className={styles.secaoTitulo}>Por Plataforma</h2>
                <div className={styles.barras}>
                  {plataformas.map(([plataforma, count]) => (
                    <div key={plataforma} className={styles.barraItem}>
                      <div className={styles.barraHeader}>
                        <span className={styles.barraLabel}>{plataforma}</span>
                        <span className={styles.barraValor}>{count} jogo{count !== 1 ? 's' : ''}</span>
                      </div>
                      <div className={styles.barraTrack}>
                        <div
                          className={styles.barraFill}
                          style={{
                            width: `${(count / maxPlataforma) * 100}%`,
                            background: 'rgba(201, 168, 76, 0.6)',
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Top avaliados */}
            {topJogos.length > 0 && (
              <section className={styles.topSecao}>
                <div className="divider">
                  <div className="divider-line" />
                  <span className="divider-icon">⭐</span>
                  <div className="divider-line" />
                </div>
                <h2 className={styles.secaoTitulo}>Top Avaliados</h2>
                <div className={styles.topLista}>
                  {topJogos.map((j, i) => (
                    <div key={j.id} className={styles.topItem}>
                      <span className={styles.topPos}>#{i + 1}</span>
                      <div className={styles.topInfo}>
                        <span className={styles.topNome}>{j.nome}</span>
                        <span className={styles.topMeta}>{j.plataforma} · {j.genero} · {j.horasJogadas}h</span>
                      </div>
                      <span className={styles.topNota}>
                        {'★'.repeat(j.nota)}{'☆'.repeat(5 - j.nota)}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

          </div>
        )}
      </main>
    </div>
  )
}

export default Estatisticas
