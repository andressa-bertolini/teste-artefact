import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { findTarefaById, store, type Tarefa } from "@/server/db";
import { createTRPCRouter, publicProcedure } from "@/server/trpc";

const tarefaInputSchema = z.object({
  titulo: z
    .string()
    .trim()
    .min(1, "O título é obrigatório"),
  descricao: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v === "" ? undefined : v)),
});

export const tarefaRouter = createTRPCRouter({
  listar: publicProcedure
    .input(
      z.object({
        cursor: z.number().int().min(0).nullish(),
        limit: z.number().int().min(1).max(50).default(8),
      }),
    )
    .query(({ input }) => {
      const ordenadas = [...store.tarefas].sort(
        (a, b) => b.dataCriacao.getTime() - a.dataCriacao.getTime(),
      );

      const start = input.cursor ?? 0;
      const items = ordenadas.slice(start, start + input.limit);
      const nextCursor =
        start + input.limit < ordenadas.length
          ? start + input.limit
          : undefined;

      return {
        items,
        nextCursor,
        total: ordenadas.length,
      };
    }),

  obter: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(({ input }) => {
      const tarefa = findTarefaById(input.id);
      if (!tarefa) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Tarefa com id "${input.id}" não encontrada.`,
        });
      }
      return tarefa;
    }),

  criar: publicProcedure
    .input(tarefaInputSchema)
    .mutation(({ input }): Tarefa => {
      const nova: Tarefa = {
        id: crypto.randomUUID(),
        titulo: input.titulo,
        descricao: input.descricao,
        dataCriacao: new Date(),
      };
      store.tarefas.unshift(nova);
      return nova;
    }),

  atualizar: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        ...tarefaInputSchema.shape,
      }),
    )
    .mutation(({ input }): Tarefa => {
      const index = store.tarefas.findIndex((t) => t.id === input.id);
      if (index === -1) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Não é possível atualizar: tarefa "${input.id}" não existe.`,
        });
      }

      const atualizada: Tarefa = {
        ...store.tarefas[index],
        titulo: input.titulo,
        descricao: input.descricao,
      };
      store.tarefas[index] = atualizada;
      return atualizada;
    }),

  deletar: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(({ input }) => {
      const index = store.tarefas.findIndex((t) => t.id === input.id);
      if (index === -1) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Não é possível deletar: tarefa "${input.id}" não existe.`,
        });
      }

      const [removida] = store.tarefas.splice(index, 1);
      return { success: true as const, tarefa: removida };
    }),
});
