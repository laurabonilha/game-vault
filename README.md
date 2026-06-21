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

- **Home** com painel de estatísticas dinâmicas (total de jogos, zerados, em andamento, horas jogadas)
- **Acervo** com busca por nome e filtros combinados por status e gênero
- **Detalhe do jogo** com review pessoal, avaliação em estrelas e jogos relacionados por gênero
- **Adicionar jogo** com formulário, preview de status em tempo real, modal de confirmação e toast de sucesso
- **Página 404** temática com fogueira animada em CSS puro
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
| `*` | 404 — Game Over |

---

## Estrutura de pastas

```
src/
├── components/
│   ├── Header/         # Navegação com link ativo via useLocation
│   ├── GameCard/       # Card clicável com capa, status e nota
│   ├── StatusBadge/    # Badge colorido com tooltip e animação
│   ├── FilterChip/     # Chip de filtro com estado ativo
│   ├── StarRating/     # Avaliação em estrelas (leitura e interativo)
│   └── EmptyState/     # Estado vazio com ícone e mensagem
├── pages/
│   ├── Home/           # Banner, estatísticas, jogos em destaque
│   ├── Acervo/         # Grid filtrável de todos os jogos
│   ├── DetalheJogo/    # Página completa do jogo (useParams)
│   ├── AdicionarJogo/  # Formulário com modal e toast (useNavigate)
│   └── NotFound/       # 404 temática com fogueira CSS
├── data/
│   ├── jogos.json      # 14 jogos com status, nota, review e capa
│   └── generos.json    # Lista de gêneros para filtros
└── styles/
    ├── variables.css   # Design tokens (cores, fontes, espaçamentos)
    ├── global.css      # Reset e estilos base
    └── components.css  # Classes utilitárias reutilizáveis
```

---

## Hooks de navegação

| Hook | Onde é usado | Por quê |
|---|---|---|
| `useLocation` | `Header` | Detecta a rota atual para marcar o link ativo |
| `useParams` | `DetalheJogo` | Lê o `:id` da URL para buscar o jogo correto |
| `useNavigate` | `DetalheJogo`, `AdicionarJogo`, `NotFound` | Redireciona após ações do usuário |

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
