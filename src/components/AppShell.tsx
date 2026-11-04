"use client";

import Link from "next/link";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="sticky" elevation={1}>
        <Toolbar>
          <AssignmentOutlinedIcon sx={{ mr: 1.5 }} />
          <Typography
            variant="h6"
            component={Link}
            href="/"
            sx={{
              color: "inherit",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            Gerenciador de Tarefas
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ py: { xs: 3, sm: 4 }, pb: 8 }}>
        {children}
      </Container>
    </Box>
  );
}
