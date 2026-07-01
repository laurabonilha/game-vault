import { useState, useEffect } from 'react'

function useDebounce(valor, delay) {
  const [valorAtrasado, setValorAtrasado] = useState(valor)

  useEffect(() => {
    const timer = setTimeout(() => {
      setValorAtrasado(valor)
    }, delay)

    // Cancela o timer se o valor mudar antes do delay terminar
    return () => clearTimeout(timer)
  }, [valor, delay])

  return valorAtrasado
}

export default useDebounce
