import { PageHeader } from "@/components/PageHeader";
import { TaskForm } from "@/components/TaskForm";

export default function NovaTarefaPage() {
  return (
    <>
      <PageHeader
        title="Nova tarefa"
        showBack
      />
      <TaskForm />
    </>
  );
}
