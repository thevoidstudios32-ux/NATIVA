# NATIVA — Nature Observation Platform

> Observe. Registre. Descubra.

Plataforma colaborativa de observação, registro e documentação da biodiversidade.

## Stack

| Camada | Tecnologia |
| --- | --- |
| Front-end | React 19 · TypeScript · Vite · Tailwind CSS v4 · componentes no padrão shadcn/ui · Lucide |
| Backend | Supabase (Auth · PostgreSQL · Storage · RLS) — plano gratuito |
| Mapas | Leaflet · React Leaflet · OpenStreetMap · Geolocation API |
| Hospedagem | Render Static Site (deploy automático a partir da `main`) |

## Estrutura

```
src/
  components/
    brand/      Logo e marca
    layout/     Cabeçalho público, rodapé, layout da área logada, layout de autenticação
    landing/    Componentes da landing page
    ui/         Componentes base (button, input, card, photo, notice, spinner)
  content/      Navegação, categorias, fotografias editoriais
  lib/          Cliente Supabase, utilitários, validação
  pages/        Landing, autenticação, páginas da aplicação
supabase/
  migrations/   Migrations SQL versionadas (a partir da Etapa 2)
render.yaml     Blueprint do Render (Static Site + SPA rewrite)
```

## Desenvolvimento

```bash
cp .env.example .env.local   # preencha com a URL e a chave pública do Supabase
npm install
npm run dev
```

Variáveis de ambiente (somente credenciais públicas — **nunca** a `service_role`):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Deploy no Render

1. Em <https://dashboard.render.com> → **New → Blueprint** (ou **Static Site**) → conecte o repositório GitHub `nativa`.
2. Configuração (já descrita em `render.yaml`):
   - Branch: `main` · Auto-Deploy: **On**
   - Build command: `npm ci && npm run build`
   - Publish directory: `dist`
   - Rewrite: `/*` → `/index.html` (status 200) — necessário para o roteamento SPA
3. Em **Environment**, defina `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.
4. No Supabase → **Authentication → URL Configuration**, adicione a URL do Render em *Site URL* e
   `https://SEU-SITE.onrender.com/**` em *Redirect URLs* (confirmação de e-mail e recuperação de senha).

## Etapas

- [x] **1** — Projeto, identidade visual, landing page, navegação
- [x] **2** — Supabase: tabelas, autenticação, perfis, RLS, Storage
- [ ] **3** — Catálogo, fichas de espécies, registro de campo, Storage
- [ ] **4** — Diário, mapa pessoal, geolocalização, filtros
- [ ] **5** — Comunidade, registros públicos/privados, mapa da comunidade, coleções
- [ ] **6** — Testes, revisão de segurança, deploy

Fotografias editoriais da landing: Unsplash. Mapas: © colaboradores do OpenStreetMap.

## Banco de dados (Supabase)

Migrations em `supabase/migrations/` (aplicadas no projeto `nativa`, região São Paulo):

- **Tabelas:** `profiles`, `species`, `observations`, `observation_locations`, `observation_media`,
  `collections`, `collection_observations`, `identification_suggestions`, `reports`.
- **Privacidade geográfica:** a coordenada exata fica em `observation_locations`, legível **somente pelo autor**.
  `observations.public_latitude/longitude` é calculada pelo banco (≈1,1 km; ≈11 km para espécies sensíveis),
  ignorando qualquer valor enviado pelo navegador.
- **RLS** em todas as tabelas: registros privados e rascunhos nunca são visíveis a outras pessoas.
- **Storage:** `observations` (privado, URLs assinadas, 10 MB, JPG/PNG/WebP/HEIC), `avatars` (público, 2 MB),
  `species` (público, escrita só pela administração).
- O perfil é criado automaticamente no cadastro (gatilho `handle_new_user`), privado por padrão.
