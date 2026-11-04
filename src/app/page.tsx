import { createCaller } from "@/trpc/server";
import { PageHeader } from "@/components/PageHeader";
import { TaskList } from "@/components/TaskList";

export const dynamic = "force-dynamic";

const PAGE_LIMIT = 8;

export default async function HomePage() {
  const caller = createCaller();
  const initialData = await caller.tarefa.listar({ limit: PAGE_LIMIT });

  return (
    <>
      <PageHeader
        title="Tarefas"
        showNew
      />
      <TaskList initialData={initialData} />
    </>
  );
}
