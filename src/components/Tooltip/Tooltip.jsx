import { useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import styles from './Tooltip.module.css'

function Tooltip({ text, children, position = 'top' }) {
  const [visible, setVisible] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0 })
  const wrapperRef = useRef(null)

  const show = () => {
    if (!wrapperRef.current) return
    const rect = wrapperRef.current.getBoundingClientRect()
    setCoords({
      top:  position === 'top' ? rect.top : rect.bottom,
      left: rect.left + rect.width / 2,
    })
    setVisible(true)
  }

  const hide = () => setVisible(false)

  return (
    <>
      <span
        ref={wrapperRef}
        className={styles.wrapper}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
      >
        {children}
      </span>

      {visible && createPortal(
        <span
          className={`${styles.tip} ${styles[position]}`}
          style={{ top: coords.top, left: coords.left }}
        >
          {text}
        </span>,
        document.body
      )}
    </>
  )
}

export default Tooltip
