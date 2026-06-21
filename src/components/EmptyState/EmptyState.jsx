import styles from './EmptyState.module.css'

function EmptyState({ title, message, icon }) {
  return (
    <div className={styles.container}>
      <span className={styles.icon}>{icon || '📜'}</span>
      <h3 className={styles.title}>{title}</h3>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  )
}

export default EmptyState
