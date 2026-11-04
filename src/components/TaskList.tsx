"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { trpc } from "@/trpc/client";
import { Feedback } from "@/components/Feedback";
import type { Tarefa } from "@/server/db";

type Page = {
  items: Tarefa[];
  nextCursor: number | undefined;
  total: number;
};

type TaskListProps = {
  initialData: Page;
};

const PAGE_LIMIT = 8;

export function TaskList({ initialData }: TaskListProps) {
  const [feedback, setFeedback] = useState<{
    tipo: "sucesso" | "erro";
    mensagem: string;
  } | null>(null);
  const [tarefaParaExcluir, setTarefaParaExcluir] = useState<Tarefa | null>(
    null,
  );

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const utils = trpc.useUtils();

  const infinite = trpc.tarefa.listar.useInfiniteQuery(
    { limit: PAGE_LIMIT },
    {
      getNextPageParam: (last) => last.nextCursor,
      initialData: {
        pages: [initialData],
        pageParams: [0],
      },
    },
  );

  const deletar = trpc.tarefa.deletar.useMutation({
    onSuccess: async () => {
      setFeedback({ tipo: "sucesso", mensagem: "Tarefa excluída com sucesso." });
      setTarefaParaExcluir(null);
      await utils.tarefa.listar.invalidate();
    },
    onError: (err) => {
      setFeedback({ tipo: "erro", mensagem: err.message });
    },
  });

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (
          entry?.isIntersecting &&
          infinite.hasNextPage &&
          !infinite.isFetchingNextPage
        ) {
          void infinite.fetchNextPage();
        }
      },
      { rootMargin: "120px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [infinite]);

  const tarefas = infinite.data?.pages.flatMap((p) => p.items) ?? [];
  const total = infinite.data?.pages[0]?.total ?? 0;

  function formatDate(date: Date) {
    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(date));
  }

  return (
    <Box component="section">
      {feedback && (
        <Feedback
          tipo={feedback.tipo}
          mensagem={feedback.mensagem}
          onClose={() => setFeedback(null)}
        />
      )}

      {infinite.isError && (
        <Feedback tipo="erro" mensagem={infinite.error.message} />
      )}

      <Typography color="text.secondary" sx={{ mb: 2 }}>
        {total} tarefa{total === 1 ? "" : "s"}
      </Typography>

      {tarefas.length === 0 ? (
        <Card>
          <CardContent>
            <Typography color="text.secondary" align="center">
              Nenhuma tarefa cadastrada. Crie a primeira!
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Stack spacing={1.5} component="ul" sx={{ listStyle: "none", m: 0, p: 0 }}>
          {tarefas.map((tarefa) => (
            <Box component="li" key={tarefa.id}>
              <Card>
                <CardContent sx={{ pb: 1 }}>
                  <Typography variant="h6" component="h2">
                    {tarefa.titulo}
                  </Typography>
                  {tarefa.descricao && (
                    <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                      {tarefa.descricao}
                    </Typography>
                  )}
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    component="time"
                    dateTime={new Date(tarefa.dataCriacao).toISOString()}
                    suppressHydrationWarning
                    sx={{ display: "block", mt: 1 }}
                  >
                    Criada em {formatDate(tarefa.dataCriacao)}
                  </Typography>
                </CardContent>
                <CardActions sx={{ px: 2, pb: 1.5 }}>
                  <Button
                    component={Link}
                    href={`/tarefas/${tarefa.id}/editar`}
                    size="small"
                    startIcon={<EditOutlinedIcon />}
                  >
                    Editar
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteOutlinedIcon />}
                    onClick={() => setTarefaParaExcluir(tarefa)}
                    disabled={deletar.isPending}
                  >
                    Excluir
                  </Button>
                </CardActions>
              </Card>
            </Box>
          ))}
        </Stack>
      )}

      <Box ref={sentinelRef} sx={{ height: 1 }} aria-hidden />

      {infinite.isFetchingNextPage && (
        <Stack sx={{ mt: 3, alignItems: "center" }}>
          <CircularProgress size={28} />
          <Typography color="text.secondary" variant="body2" sx={{ mt: 1 }}>
            Carregando mais tarefas...
          </Typography>
        </Stack>
      )}
      
      <Dialog
        open={Boolean(tarefaParaExcluir)}
        onClose={() => !deletar.isPending && setTarefaParaExcluir(null)}
      >
        <DialogTitle>Excluir tarefa?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Excluir a tarefa &quot;{tarefaParaExcluir?.titulo}&quot;? Esta ação
            não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setTarefaParaExcluir(null)}
            disabled={deletar.isPending}
          >
            Cancelar
          </Button>
          <Button
            color="error"
            variant="contained"
            disabled={deletar.isPending || !tarefaParaExcluir}
            onClick={() => {
              if (!tarefaParaExcluir) return;
              deletar.mutate({ id: tarefaParaExcluir.id });
            }}
            startIcon={
              deletar.isPending ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <DeleteOutlinedIcon />
              )
            }
          >
            {deletar.isPending ? "Excluindo..." : "Excluir"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
