"use client";

import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

type PageHeaderProps = {
  title: string;
  showNew?: boolean;
  showBack?: boolean;
};

export function PageHeader({
  title,
  showNew,
  showBack,
}: PageHeaderProps) {
  return (
    <Box sx={{ mb: 3 }}>
      {showBack && (
        <Button
          component={Link}
          href="/"
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 1, ml: -1 }}
        >
          Voltar à listagem
        </Button>
      )}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{
          alignItems: { xs: "stretch", sm: "center" },
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
        </Box>
        {showNew && (
          <Button
            component={Link}
            href="/tarefas/nova"
            variant="contained"
            startIcon={<AddIcon />}
          >
            Nova tarefa
          </Button>
        )}
      </Stack>
    </Box>
  );
}
