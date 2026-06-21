import { useEffect } from 'react'

function usePageTitle(titulo) {
  useEffect(() => {
    document.title = titulo ? `${titulo} | Game Vault` : 'Game Vault'
    return () => { document.title = 'Game Vault' }
  }, [titulo])
}

export default usePageTitle
