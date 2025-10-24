"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [displayName, setDisplayName] = React.useState("Usuário");

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const fullName = localStorage.getItem("fullName");
      const username = localStorage.getItem("username");
      setDisplayName(fullName || username || "Usuário");
    }
  }, []);

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-gray-50 border-r flex flex-col">
        <div className="p-4 border-b">
          <p className="text-sm font-medium">Bem-vindo, {displayName}</p>
          <p className="text-xs text-muted-foreground">
            Ao painel administrador
          </p>
        </div>

        <nav className="p-2 space-y-1">
          <Link href="/admin">
            <Button
              variant="ghost"
              className="justify-start w-full cursor-pointer"
            >
              Início
            </Button>
          </Link>
          <Link href="/admin/equipamentos">
            <Button
              variant="ghost"
              className="justify-start w-full cursor-pointer"
            >
              Equipamentos
            </Button>
          </Link>
          <Link href="/admin/modelos">
            <Button
              variant="ghost"
              className="justify-start w-full cursor-pointer"
            >
              Modelos
            </Button>
          </Link>
          <Link href="/admin/lojas">
            <Button
              variant="ghost"
              className="justify-start w-full cursor-pointer"
            >
              Lojas
            </Button>
          </Link>
          <Link href="/admin/setores">
            <Button
              variant="ghost"
              className="justify-start w-full cursor-pointer"
            >
              Setores
            </Button>
          </Link>
          <Link href="/admin/laudos">
            <Button
              variant="ghost"
              className="justify-start w-full cursor-pointer"
            >
              Laudos Gerados
            </Button>
          </Link>
          <Link href="/admin/auditoria">
            <Button
              variant="ghost"
              className="justify-start w-full cursor-pointer"
            >
              Auditoria
            </Button>
          </Link>
          <Link href="/infoFormulario">
            <Button
              variant="ghost"
              className="justify-start w-full cursor-pointer"
            >
              Laudo Técnico
            </Button>
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
