import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home/Home'
import Acervo from './pages/Acervo/Acervo'
import DetalheJogo from './pages/DetalheJogo/DetalheJogo'
import AdicionarJogo from './pages/AdicionarJogo/AdicionarJogo'
import Estatisticas from './pages/Estatisticas/Estatisticas'
import NotFound from './pages/NotFound/NotFound'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/acervo" element={<Acervo />} />
        <Route path="/jogo/:id" element={<DetalheJogo />} />
        <Route path="/adicionar" element={<AdicionarJogo />} />
        <Route path="/editar/:id" element={<AdicionarJogo />} />
        <Route path="/estatisticas" element={<Estatisticas />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
