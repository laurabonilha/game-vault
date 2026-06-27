import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header/Header'
import usePageTitle from '../../hooks/usePageTitle'
import StatusBadge from '../../components/StatusBadge/StatusBadge'
import StarRating from '../../components/StarRating/StarRating'
import generosData from '../../data/generos.json'
import { addJogo } from '../../utils/storage'
import styles from './AdicionarJogo.module.css'

const STATUS_OPCOES = [
  { value: 'jogando',    label: 'Jogando' },
  { value: 'zerado',     label: 'Zerado' },
  { value: 'abandonado', label: 'Abandonado' },
  { value: 'querjogar',  label: 'Quero Jogar' },
]

const PLATAFORMAS = ['PC', 'PlayStation 5', 'PlayStation 4', 'Xbox Series', 'Nintendo Switch', 'Mobile']

const FORM_INICIAL = {
  nome: '',
  plataforma: 'PC',
  genero: generosData[0],
  status: 'querjogar',
  nota: 0,
  horasJogadas: '',
  review: '',
}

function AdicionarJogo() {
  usePageTitle('Adicionar Jogo')
  const navigate = useNavigate()
  const [form, setForm] = useState(FORM_INICIAL)
  const [erros, setErros] = useState({})
  const [modalAberto, setModalAberto] = useState(false)
  const [toastVisivel, setToastVisivel] = useState(false)

  const atualizar = (campo, valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }))
    if (erros[campo]) setErros((prev) => ({ ...prev, [campo]: '' }))
  }

  const validar = () => {
    const novosErros = {}
    if (!form.nome.trim()) novosErros.nome = 'O nome do jogo é obrigatório'
    return novosErros
  }

  const abrirModal = () => {
    const novosErros = validar()
    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros)
      return
    }
    setModalAberto(true)
  }

  const confirmarSalvar = () => {
    addJogo({
      nome: form.nome.trim(),
      plataforma: form.plataforma,
      genero: form.genero,
      status: form.status,
      nota: Number(form.nota),
      horasJogadas: Number(form.horasJogadas) || 0,
      review: form.review.trim(),
      capa: '',
      anoLancamento: new Date().getFullYear(),
    })
    setModalAberto(false)
    setToastVisivel(true)
    setTimeout(() => {
      navigate('/acervo')
    }, 1800)
  }

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <h1 className={styles.titulo}>Adicionar Jogo</h1>
        <p className={styles.subtitulo}>Registre uma nova aventura no vault</p>

        <div className={styles.formWrapper}>

          {/* Nome */}
          <div className={styles.campo}>
            <label className="label">Nome do jogo</label>
            <input
              className={`input ${erros.nome ? styles.inputErro : ''}`}
              type="text"
              placeholder="Ex: Elden Ring"
              value={form.nome}
              onChange={(e) => atualizar('nome', e.target.value)}
            />
            {erros.nome && <span className={styles.erroMsg}>{erros.nome}</span>}
          </div>

          {/* Plataforma e Gênero */}
          <div className={styles.linha}>
            <div className={styles.campo}>
              <label className="label">Plataforma</label>
              <select
                className="input"
                value={form.plataforma}
                onChange={(e) => atualizar('plataforma', e.target.value)}
              >
                {PLATAFORMAS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className={styles.campo}>
              <label className="label">Gênero</label>
              <select
                className="input"
                value={form.genero}
                onChange={(e) => atualizar('genero', e.target.value)}
              >
                {generosData.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Status */}
          <div className={styles.campo}>
            <label className="label">Status</label>
            <div className={styles.statusOpcoes}>
              {STATUS_OPCOES.map((opcao) => (
                <div
                  key={opcao.value}
                  className={`${styles.statusOpcao} ${form.status === opcao.value ? styles.statusOpcaoAtivo : ''}`}
                  onClick={() => atualizar('status', opcao.value)}
                >
                  <StatusBadge status={opcao.value} />
                </div>
              ))}
            </div>
          </div>

          {/* Nota */}
          <div className={styles.campo}>
            <label className="label">Nota</label>
            <div className={styles.notaWrapper}>
              <StarRating value={form.nota} onChange={(v) => atualizar('nota', v)} />
              {form.nota > 0 && (
                <span className={styles.notaTexto}>{form.nota}/5</span>
              )}
              {form.nota > 0 && (
                <button
                  className={`btn btn-ghost btn-sm ${styles.limparNota}`}
                  onClick={() => atualizar('nota', 0)}
                >
                  Limpar
                </button>
              )}
            </div>
          </div>

          {/* Horas jogadas */}
          <div className={styles.campo}>
            <label className="label">Horas jogadas</label>
            <input
              className="input"
              type="number"
              placeholder="0"
              min="0"
              value={form.horasJogadas}
              onChange={(e) => atualizar('horasJogadas', e.target.value)}
              style={{ maxWidth: '160px' }}
            />
          </div>

          {/* Review */}
          <div className={styles.campo}>
            <label className="label">Anotação pessoal</label>
            <textarea
              className={`input ${styles.textarea}`}
              placeholder="Suas impressões sobre o jogo..."
              value={form.review}
              onChange={(e) => atualizar('review', e.target.value)}
              rows={4}
            />
          </div>

          {/* Ações */}
          <div className={styles.acoes}>
            <button className="btn btn-ghost" onClick={() => navigate('/acervo')}>
              Cancelar
            </button>
            <button className="btn" onClick={abrirModal}>
              Adicionar ao Vault
            </button>
          </div>
        </div>
      </main>

      {/* Modal de confirmação */}
      {modalAberto && (
        <div className={styles.modalOverlay} onClick={() => setModalAberto(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <span className={styles.modalIcon}>⚔️</span>
            <h2 className={styles.modalTitulo}>Confirmar adição</h2>
            <p className={styles.modalTexto}>
              Tem certeza que deseja adicionar{' '}
              <strong>"{form.nome}"</strong> ao vault?
            </p>
            <div className={styles.modalAcoes}>
              <button className="btn btn-ghost" onClick={() => setModalAberto(false)}>
                Cancelar
              </button>
              <button className="btn" onClick={confirmarSalvar}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast de sucesso */}
      {toastVisivel && (
        <div className={styles.toast}>
          <span>✓</span>
          <span>"{form.nome}" adicionado ao vault com sucesso!</span>
        </div>
      )}
    </div>
  )
}

export default AdicionarJogo
