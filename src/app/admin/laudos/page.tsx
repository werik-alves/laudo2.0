"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { InfoLaudo } from "@/types/domain";

export default function AdminLaudosGeradosPage() {
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

  const [laudos, setLaudos] = useState<InfoLaudo[]>([]);
  const [numeroChamado, setNumeroChamado] = useState("");

  const load = async () => {
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const url = new URL(`${API_BASE_URL}/info-laudos`);
      if (numeroChamado.trim()) {
        url.searchParams.set("numeroChamado", numeroChamado.trim());
      }
      const res = await fetch(url.toString(), {
        method: "GET",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
      });
      if (!res.ok) {
        console.error("Falha ao carregar laudos:", res.status);
        setLaudos([]);
        return;
      }
      const data = (await res.json()) as InfoLaudo[];
      setLaudos(data);
    } catch (err) {
      console.error("Erro ao buscar laudos:", err);
      setLaudos([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Laudos Gerados</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2 max-w-sm">
          <Label>Número do Chamado</Label>
          <Input
            value={numeroChamado}
            onChange={(e) => setNumeroChamado(e.target.value)}
            placeholder="Digite o número do chamado"
          />
          <Button onClick={load}>Pesquisar</Button>
        </div>

        <div className="grid gap-3">
          {laudos.map((l) => (
            <div
              key={l.id}
              className="flex items-start justify-between gap-2 border rounded p-3"
            >
              <div className="grid">
                <span className="font-semibold">
                  Chamado: {l.numeroChamado}
                </span>
                <span>Técnico: {l.tecnico}</span>
                <span>
                  Equipamento: {l.equipamento} {l.modelo ? `- ${l.modelo}` : ""}
                </span>
                <span>
                  Loja: {l.loja} | Setor: {l.setor}
                </span>
                <span>Tombo: {l.tombo}</span>
                <span>Data: {l.data}</span>
              </div>
              <div className="flex gap-2">
                <Button disabled title="Em breve">
                  Imprimir
                </Button>
                <Button variant="ghost" disabled title="Em breve">
                  Excluir
                </Button>
              </div>
            </div>
          ))}
          {laudos.length === 0 && <span>Nenhum laudo encontrado.</span>}
        </div>
      </CardContent>
    </Card>
  );
}
