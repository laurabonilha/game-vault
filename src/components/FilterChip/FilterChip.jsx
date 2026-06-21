import styles from './FilterChip.module.css'

function FilterChip({ label, active, onClick, color }) {
  return (
    <button
      className={`${styles.chip} ${active ? styles.active : ''}`}
      style={active && color ? { borderColor: color, color } : undefined}
      onClick={onClick}
    >
      {label}
    </button>
  )
}

export default FilterChip
