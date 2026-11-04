import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeRegistry } from "@/components/ThemeRegistry";
import { AppShell } from "@/components/AppShell";
import { TRPCProvider } from "@/trpc/Provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "teste-artefact | Gerenciador de Tarefas",
  description: "Sistema simples de tarefas com Next.js 15 e tRPC",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeRegistry>
          <TRPCProvider>
            <AppShell>{children}</AppShell>
          </TRPCProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
