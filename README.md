# ⚔️ Game Vault

> Seu grimório pessoal de aventuras digitais.

MVP acadêmico desenvolvido para a pós-graduação em **Desenvolvimento Front-end Avançado** da PUC Rio. Game Vault é um inventário pessoal de jogos com estética de RPG medieval dos anos 80 — inspirado em Dungeons & Dragons, Dark Souls e nos clássicos do gênero.

---

## Tecnologias

- [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- [React Router DOM](https://reactrouter.com/) — navegação client-side
- CSS Modules — estilos isolados por componente
- Google Fonts — Cinzel, VT323, Rajdhani
- Sem backend — dados lidos de JSONs locais

---

## Funcionalidades

- **Home** com painel de estatísticas dinâmicas (total de jogos, zerados, em andamento, horas jogadas) e carrossel de destaques gerado automaticamente pelo acervo
- **Acervo** com busca por nome (com debounce), filtros combinados por status, gênero e plataforma, contadores facetados e ordenação
- **Detalhe do jogo** com review pessoal, avaliação em estrelas e jogos relacionados por gênero
- **Adicionar / Editar jogo** com layout em duas colunas, preview ao vivo do card enquanto o formulário é preenchido, modal de confirmação e toast de sucesso
- **Estatísticas** com visão geral do vault: distribuição por status, gêneros e plataformas mais jogadas, ranking por horas e por nota
- **Página 404** temática com fogueira animada em CSS puro
- Toggle de tema claro/escuro persistido no `localStorage`
- Tooltips acessíveis em badges, botões e controles via React Portal
- Loader animado ao carregar dados
- Layout totalmente responsivo (desktop, tablet e mobile)

---

## Instalação

```bash
# Clone o repositório
git clone https://github.com/laurabonilha/game-vault.git

# Entre na pasta
cd game-vault

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse `http://localhost:5173` no navegador.

---

## Rotas

| Rota | Página |
|---|---|
| `/` | Home |
| `/acervo` | Acervo |
| `/jogo/:id` | Detalhe do Jogo |
| `/adicionar` | Adicionar Jogo |
| `/editar/:id` | Editar Jogo |
| `/estatisticas` | Estatísticas |
| `*` | 404 — Game Over |

---

## Estrutura de pastas

```
src/
├── components/
│   ├── Header/         # Navegação com link ativo via useLocation e toggle de tema
│   ├── GameCard/       # Card clicável com capa, status e nota
│   ├── StatusBadge/    # Badge colorido com Tooltip e animação
│   ├── FilterChip/     # Chip de filtro com estado ativo e contador
│   ├── StarRating/     # Avaliação em estrelas (leitura e interativo)
│   ├── EmptyState/     # Estado vazio com ícone e mensagem
│   └── Tooltip/        # Tooltip acessível via React Portal (escapa overflow:hidden)
├── pages/
│   ├── Home/           # Banner, estatísticas, carrossel de destaques automático
│   ├── Acervo/         # Grid filtrável com busca, status, gênero e plataforma
│   ├── DetalheJogo/    # Página completa do jogo (useParams)
│   ├── AdicionarJogo/  # Formulário + preview ao vivo, edição via /editar/:id
│   ├── Estatisticas/   # Dashboard com distribuição, rankings e totais do vault
│   └── NotFound/       # 404 temática com fogueira animada em CSS puro
├── hooks/
│   ├── useJogos.js     # Leitura e persistência dos jogos no localStorage
│   ├── useDebounce.js  # Atrasa atualização de valor para otimizar buscas
│   ├── usePageTitle.js # Atualiza o <title> do documento por rota
│   └── useTheme.js     # Gerencia e persiste o tema claro/escuro
├── utils/
│   └── storage.js      # Helpers de leitura e escrita no localStorage
├── data/
│   ├── jogos.json      # Jogos iniciais com status, nota, review e capa
│   └── generos.json    # Lista de gêneros disponíveis para filtros
└── styles/
    ├── variables.css   # Design tokens (cores, fontes, espaçamentos)
    ├── global.css      # Reset e estilos base
    └── components.css  # Classes utilitárias reutilizáveis
```

---

## Hooks de navegação (React Router)

| Hook | Onde é usado | Por quê |
|---|---|---|
| `useLocation` | `Header` | Detecta a rota atual para marcar o link ativo |
| `useParams` | `DetalheJogo`, `AdicionarJogo` | Lê o `:id` da URL para buscar ou editar o jogo correto |
| `useNavigate` | `DetalheJogo`, `AdicionarJogo`, `NotFound` | Redireciona após ações do usuário |

## Hooks customizados

| Hook | Responsabilidade |
|---|---|
| `useJogos` | Lê jogos do `localStorage`, expõe `jogos`, `loading`, `salvar` e `remover` |
| `useDebounce` | Atrasa 300ms a propagação de um valor — evita re-renders a cada tecla na busca |
| `usePageTitle` | Recebe um sufixo e atualiza `document.title` a cada mudança de rota |
| `useTheme` | Alterna entre `dark`/`light`, persiste no `localStorage` e aplica a classe no `<html>` |

---

## Design System

Conceito visual **"Tavern & Scrolls"** — tema escuro com acentos dourados envelhecidos.

| Token | Valor |
|---|---|
| Cor de fundo | `#0D0A0B` |
| Dourado principal | `#C9A84C` |
| Fonte de títulos | Cinzel |
| Fonte de corpo | Rajdhani |
| Fonte terminal | VT323 |

---

## Autora

Desenvolvido por **Laura Bonilha** — 2026.
