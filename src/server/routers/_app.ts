import { createTRPCRouter } from "@/server/trpc";
import { tarefaRouter } from "@/server/routers/tarefa";

export const appRouter = createTRPCRouter({
  tarefa: tarefaRouter,
});

export type AppRouter = typeof appRouter;
