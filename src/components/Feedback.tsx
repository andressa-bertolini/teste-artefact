"use client";

import Alert from "@mui/material/Alert";

type FeedbackProps = {
  tipo: "sucesso" | "erro" | "info";
  mensagem: string;
  onClose?: () => void;
};

const severityMap = {
  sucesso: "success",
  erro: "error",
  info: "info",
} as const;

export function Feedback({ tipo, mensagem, onClose }: FeedbackProps) {
  return (
    <Alert
      severity={severityMap[tipo]}
      onClose={onClose}
      sx={{ mb: 2 }}
      role="alert"
    >
      {mensagem}
    </Alert>
  );
}
