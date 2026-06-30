import { useState, useEffect } from 'react'

function useTheme() {
  const [tema, setTema] = useState(() => {
    const salvo = localStorage.getItem('game-vault-tema') || 'dark'
    document.documentElement.setAttribute('data-theme', salvo)
    return salvo
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', tema)
    localStorage.setItem('game-vault-tema', tema)
  }, [tema])

  const alternarTema = () => setTema((t) => (t === 'dark' ? 'light' : 'dark'))

  return { tema, alternarTema }
}

export default useTheme
