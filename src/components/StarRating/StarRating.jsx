import styles from './StarRating.module.css'

function StarRating({ value, onChange }) {
  const interactive = typeof onChange === 'function'

  return (
    <div className={`${styles.stars} ${interactive ? styles.interactive : ''}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`${styles.star} ${star <= value ? styles.filled : styles.empty}`}
          onClick={() => interactive && onChange(star)}
          title={interactive ? `${star} estrela${star > 1 ? 's' : ''}` : undefined}
        >
          ★
        </span>
      ))}
    </div>
  )
}

export default StarRating
