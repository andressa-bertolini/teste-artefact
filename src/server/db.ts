export type Tarefa = {
  id: string;
  titulo: string;
  descricao?: string;
  dataCriacao: Date;
};

type Store = {
  tarefas: Tarefa[];
};

const globalForStore = globalThis as unknown as { __tarefasStore?: Store };

function createSeed(): Tarefa[] {
  const agora = Date.now();

  return Array.from({ length: 25 }, (_, i) => ({
    id: crypto.randomUUID(),
    titulo: `Tarefa ${i + 1}`,
    descricao:
      i % 3 === 0
        ? `Descrição da tarefa ${i + 1}`
        : undefined,
    dataCriacao: new Date(agora - i * 60_000),
  }));
}

export const store: Store =
  globalForStore.__tarefasStore ??
  (globalForStore.__tarefasStore = { tarefas: createSeed() });

export function findTarefaById(id: string): Tarefa | undefined {
  return store.tarefas.find((t) => t.id === id);
}
