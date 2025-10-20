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
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
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
      if (tombo.trim()) url.searchParams.set("tombo", tombo.trim());

      // intervalo de datas: YYYY-MM-DD
      if (dataInicio.trim())
        url.searchParams.set("dataInicio", dataInicio.trim());
      if (dataFim.trim()) url.searchParams.set("dataFim", dataFim.trim());

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

  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    setSelectedIds(new Set(laudos.map((l) => l.id)));
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  const excluirSelecionados = async () => {
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const ids = Array.from(selectedIds);
      if (ids.length === 0) return;

      await Promise.all(
        ids.map(async (id) => {
          const res = await fetch(`${API_BASE_URL}/info-laudos/${id}`, {
            method: "DELETE",
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            credentials: "include",
          });
          if (!res.ok && res.status !== 204) {
            console.error(`Falha ao excluir laudo ${id}:`, res.status);
          }
        })
      );

      setLaudos((prev) => prev.filter((l) => !selectedIds.has(l.id)));
      setSelectedIds(new Set());
    } catch (err) {
      console.error("Erro ao excluir selecionados:", err);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Laudos Gerados</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {/* Linha de ações: Pesquisar + seleção/exclusão em lote */}
        <div className="flex flex-wrap gap-2">
          <Button onClick={load}>Pesquisar</Button>
          <Button
            variant="outline"
            onClick={selectAll}
            className="cursor-pointer"
          >
            Marcar todos
          </Button>
          <Button
            variant="outline"
            onClick={clearSelection}
            className="cursor-pointer"
          >
            Desmarcar
          </Button>
          <Button
            variant="outline"
            onClick={excluirSelecionados}
            disabled={selectedIds.size === 0}
            className="cursor-pointer"
          >
            Excluir selecionados
          </Button>
        </div>

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

          {/* Coluna direita: Data Inicial, Data Final e Tombo */}
          <div className="grid gap-2">
            <Label>Data Inicial</Label>
            <Input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
            />
            <Label>Data Final</Label>
            <Input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
            />
            <Label>Tombo</Label>
            <Input
              value={tombo}
              onChange={(e) => setTombo(e.target.value)}
              placeholder="Digite o tombo (número)"
            />
          </div>
        </div>

        {/* Lista de laudos */}
        <div className="grid gap-3">
          {laudos.map((l) => (
            <div key={l.id} className="rounded-md border p-4 space-y-2">
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
              <div className="flex items-center gap-2 justify-end">
                <Button disabled title="Em breve">
                  Imprimir
                </Button>
                <Button variant="ghost" onClick={() => excluirLaudo(l.id)}>
                  Excluir
                </Button>
                {/* Checkbox para seleção */}
                <input
                  type="checkbox"
                  checked={selectedIds.has(l.id)}
                  onChange={() => toggleSelect(l.id)}
                />
              </div>
            </div>
          ))}
          {laudos.length === 0 && <span>Nenhum laudo encontrado.</span>}
        </div>
      </CardContent>
    </Card>
  );
}
