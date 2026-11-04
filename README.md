# teste-artefact

Aplicação Next.js 15 que simula um gerenciador simples de tarefas, com API tipada via **tRPC** e armazenamento **em memória** (sem banco de dados).

## Stack

- **Next.js 15** (App Router) + React 19
- **tRPC v11** + **Zod** (validação) + **superjson** (serialização de `Date`)
- **TanStack React Query** (cache, mutations e infinite query)

## Como funciona

### Backend (`src/server`)

- `db.ts` — store em memória (preservado em HMR via `globalThis`)
- `routers/tarefa.ts` — CRUD tipado:
  - `criar` / `listar` / `obter` / `atualizar` / `deletar`
- Validação: título obrigatório; erros `NOT_FOUND` ao editar/deletar id inexistente
- `listar` é paginado (cursor) para habilitar infinite scroll

### Frontend (`src/app` + `src/components`)

| Rota | Comportamento |
|------|----------------|
| `/` | Listagem com **SSR** da 1ª página + infinite scroll no cliente |
| `/tarefas/nova` | Formulário de criação |
| `/tarefas/[id]/editar` | Formulário de edição (dados pré-carregados no servidor) |

Feedback visual de sucesso/erro/carregamento nas mutations e validação de título no formulário.

## Como executar

```bash
cd teste-artefact
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

Outros scripts:

```bash
npm run build   # build de produção
npm run start   # serve o build
npm run lint    # ESLint
```

## Decisões técnicas

1. **Caller server-side** (`src/trpc/server.ts`) para SSR sem HTTP interno.
2. **Infinite scroll** com `useInfiniteQuery` + `IntersectionObserver` no sentinel.
3. **Seed de 25 tarefas** no store para facilitar o teste do scroll.
4. Estado em memória: reiniciar o servidor limpa/reseta os dados (seed é recriado).

## Estrutura

```
src/
  app/
    api/trpc/[trpc]/route.ts   # handler HTTP do tRPC
    page.tsx                   # listagem (SSR)
    tarefas/nova/page.tsx
    tarefas/[id]/editar/page.tsx
  components/
    TaskList.tsx               # listagem + infinite scroll + delete
    TaskForm.tsx               # create/update
    Feedback.tsx
  server/
    db.ts
    trpc.ts
    routers/
  trpc/
    client.ts
    server.ts
    Provider.tsx
```
