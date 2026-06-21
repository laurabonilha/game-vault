import styles from './StatusBadge.module.css'

const STATUS_CONFIG = {
  jogando:    { label: 'Jogando',     icon: '▶', tooltip: 'Atualmente em andamento' },
  zerado:     { label: 'Zerado',      icon: '✓', tooltip: 'Jogo concluído' },
  abandonado: { label: 'Abandonado',  icon: '✕', tooltip: 'Jogo pausado indefinidamente' },
  querjogar:  { label: 'Quero Jogar', icon: '◆', tooltip: 'Na lista de desejos' },
}

function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG['querjogar']

  return (
    <span
      className={`${styles.badge} ${styles[status]}`}
      title={config.tooltip}
    >
      <span className={styles.icon}>{config.icon}</span>
      {config.label}
    </span>
  )
}

export default StatusBadge
