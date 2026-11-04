import Alert from "@mui/material/Alert";
import { TRPCError } from "@trpc/server";
import { createCaller } from "@/trpc/server";
import { PageHeader } from "@/components/PageHeader";
import { TaskForm } from "@/components/TaskForm";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export default async function EditarTarefaPage({ params }: PageProps) {
  const { id } = await params;
  const caller = createCaller();

  try {
    const tarefa = await caller.tarefa.obter({ id });

    return (
      <>
        <PageHeader
          title="Editar tarefa"
          showBack
        />
        <TaskForm tarefa={tarefa} />
      </>
    );
  } catch (error) {
    const mensagem =
      error instanceof TRPCError
        ? error.message
        : "Não foi possível carregar a tarefa.";

    return (
      <>
        <PageHeader title="Editar tarefa" showBack />
        <Alert severity="error" role="alert">
          {mensagem}
        </Alert>
      </>
    );
  }
}
