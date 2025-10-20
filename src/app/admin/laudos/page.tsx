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
  const [tecnico, setTecnico] = useState("");
  const [numeroChamado, setNumeroChamado] = useState("");
  const [data, setData] = useState(""); // ISO (YYYY-MM-DD) vindo do input date
  const [tombo, setTombo] = useState("");

  async function excluirLaudo(id: number) {
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const res = await fetch(`${API_BASE_URL}/info-laudos/${id}`, {
        method: "DELETE",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
      });
      if (res.status === 204 || res.status === 200) {
        setLaudos((prev) => prev.filter((x) => x.id !== id));
      } else {
        const msg = await res.text();
        console.error(`Falha ao excluir: ${res.status} ${msg}`);
        alert("Falha ao excluir o laudo.");
      }
    } catch (err) {
      console.error("Erro ao excluir laudo:", err);
      alert("Erro ao excluir o laudo.");
    }
  }

  // Converte 'YYYY-MM-DD' para 'DD/MM/YYYY' para bater com o que está salvo no banco
  function toBrDate(isoDate: string) {
    const [y, m, d] = isoDate.split("-");
    if (!y || !m || !d) return isoDate;
    return `${d}/${m}/${y}`;
  }

  const load = async () => {
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const url = new URL(`${API_BASE_URL}/info-laudos`);
      if (tecnico.trim()) url.searchParams.set("tecnico", tecnico.trim());
      if (numeroChamado.trim())
        url.searchParams.set("numeroChamado", numeroChamado.trim());
      if (data.trim()) url.searchParams.set("data", toBrDate(data.trim()));
      if (tombo.trim()) url.searchParams.set("tombo", tombo.trim());

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
      const dataJson = (await res.json()) as InfoLaudo[];
      setLaudos(dataJson);
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
        {/* Duas colunas lado a lado */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Coluna esquerda: Técnico e Número do Chamado */}
          <div className="grid gap-2">
            <Label>Técnico</Label>
            <Input
              value={tecnico}
              onChange={(e) => setTecnico(e.target.value)}
              placeholder="Digite o nome do técnico"
            />

            <Label>Número do Chamado</Label>
            <Input
              value={numeroChamado}
              onChange={(e) => setNumeroChamado(e.target.value)}
              placeholder="Digite o número do chamado"
            />
          </div>

          {/* Coluna direita: Data (type=date) e Tombo */}
          <div className="grid gap-2">
            <Label>Data</Label>
            <Input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
            />

            <Label>Tombo</Label>
            <Input
              value={tombo}
              onChange={(e) => setTombo(e.target.value)}
              placeholder="Digite o tombo (número)"
            />
          </div>
        </div>

        <div>
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
                <Button variant="ghost" onClick={() => excluirLaudo(l.id)}>
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
