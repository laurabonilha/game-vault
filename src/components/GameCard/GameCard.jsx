import { useNavigate } from 'react-router-dom'
import StatusBadge from '../StatusBadge/StatusBadge'
import StarRating from '../StarRating/StarRating'
import styles from './GameCard.module.css'

function GameCard({ id, nome, plataforma, genero, status, nota, capa }) {
  const navigate = useNavigate()

  return (
    <div className={styles.card} onClick={() => navigate(`/jogo/${id}`)}>
      <div className={styles.capa}>
        {capa ? (
          <img src={capa} alt={nome} className={styles.capaImg} />
        ) : (
          <div className={styles.capaPlaceholder}>
            <span className={styles.capaIcon}>🎮</span>
          </div>
        )}
      </div>

      <div className={styles.info}>
        <h3 className={styles.nome}>{nome}</h3>

        <div className={styles.meta}>
          <span className={styles.metaItem}>{plataforma}</span>
          <span className={styles.metaSep}>·</span>
          <span className={styles.metaItem}>{genero}</span>
        </div>

        <div className={styles.footer}>
          <StatusBadge status={status} />
          {nota > 0 && <StarRating value={nota} />}
        </div>
      </div>
    </div>
  )
}

export default GameCard
