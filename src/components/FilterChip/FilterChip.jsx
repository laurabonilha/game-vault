import styles from './FilterChip.module.css'

function FilterChip({ label, active, onClick, color, count }) {
  return (
    <button
      className={`${styles.chip} ${active ? styles.active : ''}`}
      style={active && color ? { borderColor: color, color } : undefined}
      onClick={onClick}
    >
      {label}
      {count !== undefined && (
        <span className={styles.count}>{count}</span>
      )}
    </button>
  )
}

export default FilterChip
