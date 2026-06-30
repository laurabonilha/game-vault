import jogosData from '../data/jogos.json'

const STORAGE_KEY = 'game-vault-jogos'

export function getJogos() {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) return JSON.parse(stored)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(jogosData))
  return jogosData
}

export function saveJogos(jogos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(jogos))
}

export function addJogo(jogo) {
  const jogos = getJogos()
  const novo = { ...jogo, id: Date.now() }
  saveJogos([...jogos, novo])
  return novo
}

export function updateJogo(id, dados) {
  const jogos = getJogos()
  saveJogos(jogos.map((j) => (j.id === id ? { ...j, ...dados } : j)))
}

export function deleteJogo(id) {
  saveJogos(getJogos().filter((j) => j.id !== id))
}
