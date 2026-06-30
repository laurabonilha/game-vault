import { useState, useEffect } from 'react'
import { getJogos } from '../utils/storage'

function useJogos() {
  const [jogos, setJogos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setJogos(getJogos())
      setLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  return { jogos, loading }
}

export default useJogos
