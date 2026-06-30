import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../../components/Header/Header'
import usePageTitle from '../../hooks/usePageTitle'
import StatusBadge from '../../components/StatusBadge/StatusBadge'
import StarRating from '../../components/StarRating/StarRating'
import generosData from '../../data/generos.json'
import { addJogo, updateJogo, getJogos } from '../../utils/storage'
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
  capa: '',
}

function AdicionarJogo() {
  const { id } = useParams()
  const modoEdicao = Boolean(id)
  usePageTitle(modoEdicao ? 'Editar Jogo' : 'Adicionar Jogo')
  const navigate = useNavigate()
  const [form, setForm] = useState(FORM_INICIAL)
  const [erros, setErros] = useState({})
  const [modalAberto, setModalAberto] = useState(false)
  const [toastVisivel, setToastVisivel] = useState(false)
  const [capaErro, setCapaErro] = useState(false)
  const [formTocado, setFormTocado] = useState(false)
  const [modalSairAberto, setModalSairAberto] = useState(false)
  const [destinoSair, setDestinoSair] = useState('')

  useEffect(() => {
    if (!modoEdicao) return
    const jogo = getJogos().find((j) => j.id === Number(id))
    if (jogo) {
      setForm({
        nome: jogo.nome,
        plataforma: jogo.plataforma,
        genero: jogo.genero,
        status: jogo.status,
        nota: jogo.nota,
        horasJogadas: jogo.horasJogadas || '',
        review: jogo.review || '',
        capa: jogo.capa || '',
      })
      setCapaErro(false)
    }
  }, [id, modoEdicao])

  const atualizar = (campo, valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }))
    if (erros[campo]) setErros((prev) => ({ ...prev, [campo]: '' }))
    setFormTocado(true)
  }

  const tentarSair = (destino) => {
    if (formTocado) {
      setDestinoSair(destino)
      setModalSairAberto(true)
    } else {
      navigate(destino)
    }
  }

  const confirmarSair = () => {
    setModalSairAberto(false)
    navigate(destinoSair)
  }

  useEffect(() => {
    const handler = (e) => {
      if (!formTocado) return
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [formTocado])

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
    const dados = {
      nome: form.nome.trim(),
      plataforma: form.plataforma,
      genero: form.genero,
      status: form.status,
      nota: Number(form.nota),
      horasJogadas: Number(form.horasJogadas) || 0,
      review: form.review.trim(),
      capa: form.capa.trim(),
    }
    if (modoEdicao) {
      updateJogo(Number(id), dados)
    } else {
      addJogo({ ...dados, anoLancamento: new Date().getFullYear() })
    }
    setFormTocado(false)
    setModalAberto(false)
    setToastVisivel(true)
    setTimeout(() => {
      navigate(modoEdicao ? `/jogo/${id}` : '/acervo')
    }, 1800)
  }

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>

        <div className={styles.pageHeader}>
          <h1 className={styles.titulo}>{modoEdicao ? 'Editar Jogo' : 'Adicionar Jogo'}</h1>
          <p className={styles.subtitulo}>
            {modoEdicao ? 'Atualize os dados da aventura' : 'Registre uma nova aventura no vault'}
          </p>
        </div>

        <div className={styles.formGrid}>

          {/* ── Coluna esquerda: campos do formulário ── */}
          <div className={styles.formEsquerda}>

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

            {/* Nota e Horas */}
            <div className={styles.linha}>
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

              <div className={styles.campo}>
                <label className="label">Horas jogadas</label>
                <input
                  className="input"
                  type="number"
                  placeholder="0"
                  min="0"
                  value={form.horasJogadas}
                  onChange={(e) => atualizar('horasJogadas', e.target.value)}
                />
              </div>
            </div>

            {/* Review */}
            <div className={styles.campo}>
              <label className="label">Anotação pessoal</label>
              <textarea
                className={`input ${styles.textarea}`}
                placeholder="Suas impressões sobre o jogo..."
                value={form.review}
                onChange={(e) => atualizar('review', e.target.value)}
                rows={5}
              />
            </div>

            {/* Ações */}
            <div className={styles.acoes}>
              <button className="btn btn-ghost" onClick={() => tentarSair(modoEdicao ? `/jogo/${id}` : '/acervo')}>
                Cancelar
              </button>
              <button className="btn" onClick={abrirModal}>
                {modoEdicao ? 'Salvar Alterações' : 'Adicionar ao Vault'}
              </button>
            </div>
          </div>

          {/* ── Coluna direita: preview ao vivo ── */}
          <div className={styles.formDireita}>
            <div className={styles.previewPanel}>
              <span className={styles.previewLabel}>◈ Preview no Vault</span>

              <div className={styles.previewCard}>
                <div className={styles.previewCapa}>
                  {form.capa && !capaErro ? (
                    <img
                      key={form.capa}
                      src={form.capa}
                      alt={form.nome}
                      className={styles.previewCapaImg}
                      onError={() => setCapaErro(true)}
                    />
                  ) : (
                    <div className={styles.previewCapaSem}>
                      <span className={styles.previewCapaIcone}>⚔</span>
                      <span className={styles.previewCapaHint}>
                        {capaErro ? 'URL inválida' : 'Sem capa'}
                      </span>
                    </div>
                  )}
                </div>

                <div className={styles.previewInfo}>
                  <span className={styles.previewNome}>
                    {form.nome || <span className={styles.previewPlaceholder}>Nome do jogo</span>}
                  </span>
                  <span className={styles.previewMeta}>
                    {[form.plataforma, form.genero].filter(Boolean).join(' · ')}
                  </span>
                  {form.nota > 0 && (
                    <span className={styles.previewNota}>
                      {'★'.repeat(form.nota)}{'☆'.repeat(5 - form.nota)}
                    </span>
                  )}
                  <div className={styles.previewStatus}>
                    <StatusBadge status={form.status} />
                  </div>
                </div>
              </div>

              {/* URL da capa */}
              <div className={styles.campo}>
                <label className="label">URL da capa</label>
                <input
                  className="input"
                  type="url"
                  placeholder="https://exemplo.com/capa.jpg"
                  value={form.capa}
                  onChange={(e) => { atualizar('capa', e.target.value); setCapaErro(false) }}
                />
                <span className={styles.capaHint}>
                  Cole a URL de uma imagem para ver o preview acima
                </span>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Modal de confirmação de salvar */}
      {modalAberto && (
        <div className={styles.modalOverlay} onClick={() => setModalAberto(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <span className={styles.modalIcon}>⚔️</span>
            <h2 className={styles.modalTitulo}>{modoEdicao ? 'Confirmar edição' : 'Confirmar adição'}</h2>
            <p className={styles.modalTexto}>
              {modoEdicao
                ? <>Tem certeza que deseja salvar as alterações em <strong>"{form.nome}"</strong>?</>
                : <>Tem certeza que deseja adicionar <strong>"{form.nome}"</strong> ao vault?</>
              }
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

      {/* Modal de confirmação de saída */}
      {modalSairAberto && (
        <div className={styles.modalOverlay} onClick={() => setModalSairAberto(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <span className={styles.modalIcon}>⚠️</span>
            <h2 className={styles.modalTitulo}>Sair sem salvar?</h2>
            <p className={styles.modalTexto}>
              Você tem alterações não salvas. Se sair agora, todo o progresso será perdido.
            </p>
            <div className={styles.modalAcoes}>
              <button className="btn btn-ghost" onClick={confirmarSair}>
                Sair mesmo assim
              </button>
              <button className="btn" onClick={() => setModalSairAberto(false)}>
                Continuar editando
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast de sucesso */}
      {toastVisivel && (
        <div className={styles.toast}>
          <span>✓</span>
          <span>"{form.nome}" {modoEdicao ? 'atualizado' : 'adicionado ao vault'} com sucesso!</span>
        </div>
      )}
    </div>
  )
}

export default AdicionarJogo
