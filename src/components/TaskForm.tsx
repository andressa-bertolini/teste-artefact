"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { trpc } from "@/trpc/client";
import { Feedback } from "@/components/Feedback";
import type { Tarefa } from "@/server/db";

type TaskFormProps = {
  tarefa?: Tarefa;
};

export function TaskForm({ tarefa }: TaskFormProps) {
  const router = useRouter();
  const isEdit = Boolean(tarefa);

  const [titulo, setTitulo] = useState(tarefa?.titulo ?? "");
  const [descricao, setDescricao] = useState(tarefa?.descricao ?? "");
  const [erroLocal, setErroLocal] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  const utils = trpc.useUtils();

  const criar = trpc.tarefa.criar.useMutation({
    onSuccess: async () => {
      setSucesso("Tarefa criada com sucesso!");
      await utils.tarefa.listar.invalidate();
      setTimeout(() => router.push("/"), 600);
    },
    onError: (err) => {
      setErroLocal(err.message);
      setSucesso(null);
    },
  });

  const atualizar = trpc.tarefa.atualizar.useMutation({
    onSuccess: async () => {
      setSucesso("Tarefa atualizada com sucesso!");
      await utils.tarefa.listar.invalidate();
      setTimeout(() => router.push("/"), 600);
    },
    onError: (err) => {
      setErroLocal(err.message);
      setSucesso(null);
    },
  });

  const isPending = criar.isPending || atualizar.isPending;
  const tituloInvalido = Boolean(erroLocal && !titulo.trim());

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErroLocal(null);
    setSucesso(null);

    const tituloTrim = titulo.trim();
    if (!tituloTrim) {
      setErroLocal("O título é obrigatório.");
      return;
    }

    const payload = {
      titulo: tituloTrim,
      descricao: descricao.trim() || undefined,
    };

    if (isEdit && tarefa) {
      atualizar.mutate({ id: tarefa.id, ...payload });
    } else {
      criar.mutate(payload);
    }
  }

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      noValidate
      elevation={0}
      sx={{
        p: { xs: 2, sm: 3 },
        border: 1,
        borderColor: "divider",
        display: "grid",
        gap: 2.5,
      }}
    >
      <TextField
        id="titulo"
        name="titulo"
        label="Título"
        required
        fullWidth
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        placeholder="Ex.: Revisar documentação"
        disabled={isPending}
        error={tituloInvalido}
        helperText={tituloInvalido ? "O título é obrigatório." : " "}
      />

      <TextField
        id="descricao"
        name="descricao"
        label="Descrição"
        fullWidth
        multiline
        minRows={4}
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        placeholder="Detalhes opcionais da tarefa"
        disabled={isPending}
      />

      {erroLocal && !tituloInvalido && (
        <Feedback
          tipo="erro"
          mensagem={erroLocal}
          onClose={() => setErroLocal(null)}
        />
      )}
      {sucesso && <Feedback tipo="sucesso" mensagem={sucesso} />}

      <Stack direction="row" spacing={1.5} sx={{ justifyContent: "flex-end" }}>
        <Button
          type="button"
          variant="outlined"
          onClick={() => router.push("/")}
          disabled={isPending}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={isPending}
          startIcon={
            isPending ? <CircularProgress size={16} color="inherit" /> : undefined
          }
        >
          {isPending
            ? "Salvando..."
            : isEdit
              ? "Salvar alterações"
              : "Criar tarefa"}
        </Button>
      </Stack>
    </Paper>
  );
}
