import { useState, useEffect } from 'react'
import Header from '../../components/Header/Header'
import usePageTitle from '../../hooks/usePageTitle'
import GameCard from '../../components/GameCard/GameCard'
import FilterChip from '../../components/FilterChip/FilterChip'
import EmptyState from '../../components/EmptyState/EmptyState'
import { getJogos } from '../../utils/storage'
import generosData from '../../data/generos.json'
import styles from './Acervo.module.css'

const STATUS_FILTROS = [
  { label: 'Todos',        value: 'todos',     color: null },
  { label: 'Jogando',      value: 'jogando',   color: 'var(--color-status-jogando)' },
  { label: 'Zerado',       value: 'zerado',    color: 'var(--color-status-zerado)' },
  { label: 'Abandonado',   value: 'abandonado',color: 'var(--color-status-abandonado)' },
  { label: 'Quero Jogar',  value: 'querjogar', color: 'var(--color-status-querjogar)' },
]

function Acervo() {
  usePageTitle('Acervo')
  const [jogos, setJogos] = useState([])
  const [loading, setLoading] = useState(true)
  const [busca, setBusca] = useState('')
  const [statusAtivo, setStatusAtivo] = useState('todos')
  const [generoAtivo, setGeneroAtivo] = useState('todos')

  useEffect(() => {
    const timer = setTimeout(() => {
      setJogos(getJogos())
      setLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  const jogosFiltrados = jogos.filter((jogo) => {
    const matchBusca = jogo.nome.toLowerCase().includes(busca.toLowerCase())
    const matchStatus = statusAtivo === 'todos' || jogo.status === statusAtivo
    const matchGenero = generoAtivo === 'todos' || jogo.genero === generoAtivo
    return matchBusca && matchStatus && matchGenero
  })

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <h1 className={styles.titulo}>Acervo</h1>

        {/* Busca */}
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

        {/* Filtros de status */}
        <div className={styles.filtrosGrupo}>
          <span className={styles.filtrosLabel}>Status</span>
          <div className={styles.chips}>
            {STATUS_FILTROS.map((f) => (
              <FilterChip
                key={f.value}
                label={f.label}
                active={statusAtivo === f.value}
                color={f.color}
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
              onClick={() => setGeneroAtivo('todos')}
            />
            {generosData.map((genero) => (
              <FilterChip
                key={genero}
                label={genero}
                active={generoAtivo === genero}
                onClick={() => setGeneroAtivo(genero)}
              />
            ))}
          </div>
        </div>

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
          <div className={`${styles.grid} fade-in`}>
            {jogosFiltrados.map((jogo) => (
              <GameCard key={jogo.id} {...jogo} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default Acervo
