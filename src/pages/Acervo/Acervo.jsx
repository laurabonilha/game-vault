import { useState } from 'react'
import Header from '../../components/Header/Header'
import usePageTitle from '../../hooks/usePageTitle'
import useJogos from '../../hooks/useJogos'
import GameCard from '../../components/GameCard/GameCard'
import FilterChip from '../../components/FilterChip/FilterChip'
import EmptyState from '../../components/EmptyState/EmptyState'
import generosData from '../../data/generos.json'
import styles from './Acervo.module.css'

const ORDENACOES = [
  { value: 'recente', label: 'Mais recente' },
  { value: 'az',      label: 'Nome A → Z' },
  { value: 'za',      label: 'Nome Z → A' },
  { value: 'nota',    label: 'Maior nota' },
  { value: 'horas',   label: 'Mais jogado' },
]

const SORT_FNS = {
  recente: (a, b) => b.id - a.id,
  az:      (a, b) => a.nome.localeCompare(b.nome),
  za:      (a, b) => b.nome.localeCompare(a.nome),
  nota:    (a, b) => b.nota - a.nota,
  horas:   (a, b) => b.horasJogadas - a.horasJogadas,
}

const STATUS_FILTROS = [
  { label: 'Todos',        value: 'todos',     color: null },
  { label: 'Jogando',      value: 'jogando',   color: 'var(--color-status-jogando)' },
  { label: 'Zerado',       value: 'zerado',    color: 'var(--color-status-zerado)' },
  { label: 'Abandonado',   value: 'abandonado',color: 'var(--color-status-abandonado)' },
  { label: 'Quero Jogar',  value: 'querjogar', color: 'var(--color-status-querjogar)' },
]

function Acervo() {
  usePageTitle('Acervo')
  const { jogos, loading } = useJogos()
  const [busca, setBusca] = useState('')
  const [statusAtivo, setStatusAtivo] = useState('todos')
  const [generoAtivo, setGeneroAtivo] = useState('todos')
  const [plataformaAtiva, setPlataformaAtiva] = useState('todas')
  const [ordenacao, setOrdenacao] = useState('recente')

  const plataformas = [...new Set(jogos.map((j) => j.plataforma))].sort()

  const jogosFiltrados = jogos
    .filter((jogo) => {
      const matchBusca = jogo.nome.toLowerCase().includes(busca.toLowerCase())
      const matchStatus = statusAtivo === 'todos' || jogo.status === statusAtivo
      const matchGenero = generoAtivo === 'todos' || jogo.genero === generoAtivo
      const matchPlataforma = plataformaAtiva === 'todas' || jogo.plataforma === plataformaAtiva
      return matchBusca && matchStatus && matchGenero && matchPlataforma
    })
    .sort(SORT_FNS[ordenacao])

  // Contadores facetados: cada dimensão ignora o próprio filtro mas respeita os outros
  const contarStatus = (status) => jogos.filter((j) => {
    const matchBusca = j.nome.toLowerCase().includes(busca.toLowerCase())
    const matchGenero = generoAtivo === 'todos' || j.genero === generoAtivo
    const matchPlataforma = plataformaAtiva === 'todas' || j.plataforma === plataformaAtiva
    return matchBusca && matchGenero && matchPlataforma && (status === 'todos' || j.status === status)
  }).length

  const contarGenero = (genero) => jogos.filter((j) => {
    const matchBusca = j.nome.toLowerCase().includes(busca.toLowerCase())
    const matchStatus = statusAtivo === 'todos' || j.status === statusAtivo
    const matchPlataforma = plataformaAtiva === 'todas' || j.plataforma === plataformaAtiva
    return matchBusca && matchStatus && matchPlataforma && (genero === 'todos' || j.genero === genero)
  }).length

  const contarPlataforma = (plataforma) => jogos.filter((j) => {
    const matchBusca = j.nome.toLowerCase().includes(busca.toLowerCase())
    const matchStatus = statusAtivo === 'todos' || j.status === statusAtivo
    const matchGenero = generoAtivo === 'todos' || j.genero === generoAtivo
    return matchBusca && matchStatus && matchGenero && (plataforma === 'todas' || j.plataforma === plataforma)
  }).length

  const filtrosAtivos = busca !== '' || statusAtivo !== 'todos' || generoAtivo !== 'todos' || plataformaAtiva !== 'todas'

  const limparFiltros = () => {
    setBusca('')
    setStatusAtivo('todos')
    setGeneroAtivo('todos')
    setPlataformaAtiva('todas')
  }

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <h1 className={styles.titulo}>Acervo</h1>
          <p className={styles.subtitulo}>O grimório completo das suas aventuras</p>
        </div>

        {/* Busca + Ordenação */}
        <div className={styles.controles}>
          <div className={styles.buscaWrapper}>
            <span className={styles.buscaIcon}>🔍</span>
            <input
              className={`input ${styles.busca}`}
              type="text"
              placeholder="Buscar jogo pelo nome..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>

          <div className={styles.sortWrapper}>
            <span className={styles.filtrosLabel}>Ordenar</span>
            <select
              className={`input ${styles.sortSelect}`}
              value={ordenacao}
              onChange={(e) => setOrdenacao(e.target.value)}
            >
              {ORDENACOES.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Filtros de status */}
        <div className={styles.filtrosGrupo}>
          <div className={styles.filtrosHeaderRow}>
            <span className={styles.filtrosLabel}>Status</span>
            {filtrosAtivos && (
              <button className={styles.limparBtn} onClick={limparFiltros}>
                ✕ Limpar filtros
              </button>
            )}
          </div>
          <div className={styles.chips}>
            {STATUS_FILTROS.map((f) => (
              <FilterChip
                key={f.value}
                label={f.label}
                active={statusAtivo === f.value}
                color={f.color}
                count={contarStatus(f.value)}
                onClick={() => setStatusAtivo(f.value)}
              />
            ))}
          </div>
        </div>

        {/* Filtros de gênero */}
        <div className={styles.filtrosGrupo}>
          <span className={styles.filtrosLabel}>Gênero</span>
          <div className={styles.chips}>
            <FilterChip
              label="Todos"
              active={generoAtivo === 'todos'}
              count={contarGenero('todos')}
              onClick={() => setGeneroAtivo('todos')}
            />
            {generosData.map((genero) => (
              <FilterChip
                key={genero}
                label={genero}
                active={generoAtivo === genero}
                count={contarGenero(genero)}
                onClick={() => setGeneroAtivo(genero)}
              />
            ))}
          </div>
        </div>

        {/* Filtros de plataforma */}
        {plataformas.length > 0 && (
          <div className={styles.filtrosGrupo}>
            <span className={styles.filtrosLabel}>Plataforma</span>
            <div className={styles.chips}>
              <FilterChip
                label="Todas"
                active={plataformaAtiva === 'todas'}
                count={contarPlataforma('todas')}
                onClick={() => setPlataformaAtiva('todas')}
              />
              {plataformas.map((plataforma) => (
                <FilterChip
                  key={plataforma}
                  label={plataforma}
                  active={plataformaAtiva === plataforma}
                  count={contarPlataforma(plataforma)}
                  onClick={() => setPlataformaAtiva(plataforma)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Conteúdo */}
        {loading ? (
          <div className="loader">
            <div className="loader-dot" />
            <div className="loader-dot" />
            <div className="loader-dot" />
          </div>
        ) : jogosFiltrados.length === 0 ? (
          <EmptyState
            icon="📜"
            title="Nenhum jogo encontrado"
            message="Nenhum jogo encontrado nos grimórios. Tente ajustar os filtros ou adicionar novos títulos ao vault."
          />
        ) : (
          <div className={styles.grid}>
            {jogosFiltrados.map((jogo, i) => (
              <GameCard key={jogo.id} {...jogo} index={i} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default Acervo
