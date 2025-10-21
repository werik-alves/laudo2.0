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

  // Habilita impressão do laudo (PDF) usando pdfmake, igual ao InfoFormulário
  async function imprimirLaudo(l: InfoLaudo) {
    // Identificação de quem está reimprimindo (painel admin)
    const adminName =
      typeof window !== "undefined"
        ? localStorage.getItem("fullName") ||
          localStorage.getItem("username") ||
          "Administrador"
        : "Administrador";

    const nowBr = () => {
      const d = new Date();
      const dd = String(d.getDate()).padStart(2, "0");
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const yyyy = d.getFullYear();
      const HH = String(d.getHours()).padStart(2, "0");
      const MM = String(d.getMinutes()).padStart(2, "0");
      return `${dd}/${mm}/${yyyy} ${HH}:${MM}`;
    };

    // Importa pdfmake
    // @ts-ignore
    const pdfMakeMod = await import("pdfmake/build/pdfmake");
    // @ts-ignore
    const pdfFontsMod = await import("pdfmake/build/vfs_fonts");
    const pdfMake = pdfMakeMod.default || pdfMakeMod;
    const pdfFonts = pdfFontsMod.default || pdfFontsMod;
    pdfMake.vfs = pdfFonts.pdfMake?.vfs || pdfFonts.vfs;

    const estadoLabel =
      l.estadoEquipamento === "FUNCIONANDO"
        ? "Funcionando"
        : l.estadoEquipamento === "NAO_FUNCIONANDO"
        ? "Não funcionando"
        : "-";

    const necessidadeLabel =
      l.necessidade === "SUBSTITUIDO"
        ? "Ser substituído"
        : l.necessidade === "ENVIAR_CONSERTO"
        ? "Enviado p/ conserto"
        : l.necessidade === "DESCARTADO"
        ? "Ser descartado"
        : "-";

    const equipamentoModelo =
      l.modelo && l.modelo.trim()
        ? `${l.equipamento} - ${l.modelo}`
        : l.equipamento;

    const reprintBanner = {
      table: {
        widths: ["*"],
        body: [
          [
            {
              text: "REIMPRESSÃO — Painel Administrativo",
              bold: true,
              color: "#b91c1c",
              alignment: "center",
              margin: [4, 6, 4, 2],
            },
          ],
          [
            {
              text: `Emitido por: ${adminName} em ${nowBr()}`,
              alignment: "center",
              margin: [4, 0, 4, 6],
            },
          ],
        ],
      },
      layout: {
        hLineWidth: () => 0.5,
        vLineWidth: () => 0.5,
        hLineColor: () => "#e5e7eb",
        vLineColor: () => "#e5e7eb",
      },
      margin: [0, 0, 0, 10],
    };

    const content: unknown[] = [
      {
        text: "LAUDO TÉCNICO",
        style: "header",
        alignment: "center",
        margin: [0, 0, 0, 15],
      },
      reprintBanner,
      {
        table: {
          widths: ["100%"],
          body: [
            [
              {
                text: `Número do Chamado: ${l.numeroChamado || "-"}`,
                bold: true,
                fillColor: "#f2f2f2",
                margin: [4, 4, 4, 4],
              },
            ],
            [
              {
                text: `Técnico: ${l.tecnico || l.createdByUsername || "-"}`,
                margin: [4, 2, 4, 2],
              },
            ],
            [{ text: `Data: ${l.data || "-"}`, margin: [4, 2, 4, 2] }],
            [{ text: `Loja: ${l.loja || "-"}`, margin: [4, 2, 4, 2] }],
            [{ text: `Setor: ${l.setor || "-"}`, margin: [4, 2, 4, 2] }],
            [
              {
                text: `Equipamento: ${equipamentoModelo || "-"}`,
                margin: [4, 2, 4, 2],
              },
            ],
            [{ text: `Tombo: ${l.tombo || "-"}`, margin: [4, 2, 4, 2] }],
            [
              {
                text: `Estado do Equipamento: ${estadoLabel}`,
                margin: [4, 2, 4, 2],
              },
            ],
            [
              {
                text: `Necessidade: ${necessidadeLabel}`,
                margin: [4, 2, 4, 2],
              },
            ],
          ],
        },
        layout: {
          hLineWidth: () => 0.5,
          vLineWidth: () => 0.5,
          hLineColor: () => "#cccccc",
          vLineColor: () => "#cccccc",
          paddingLeft: () => 5,
          paddingRight: () => 5,
          paddingTop: () => 3,
          paddingBottom: () => 3,
        },
        margin: [0, 0, 0, 15],
      },
      { text: "TESTES REALIZADOS", style: "subheader", margin: [0, 10, 0, 4] },
      { text: l.testesRealizados || "-", margin: [4, 0, 0, 8] },
      { text: "DIAGNÓSTICO", style: "subheader", margin: [0, 10, 0, 4] },
      { text: l.diagnostico || "-", margin: [4, 0, 0, 8] },
    ];

    const docDefinition: unknown = {
      info: {
        title: `Laudo Técnico - Reimpressão - ${
          l.numeroChamado || "sem_chamado"
        }`,
        author: adminName,
      },
      pageMargins: [40, 40, 40, 60],
      defaultStyle: { fontSize: 10, lineHeight: 1.3 },
      styles: {
        header: { fontSize: 18, bold: true, color: "#2c3e50" },
        subheader: { fontSize: 12, bold: true, color: "#000000" },
      },
      background: () => ({
        text: "REIMPRESSÃO",
        color: "#b91c1c",
        opacity: 0.08,
        bold: true,
        fontSize: 60,
        alignment: "center",
        margin: [0, 300, 0, 0],
      }),
      content,
    };

    pdfMake.createPdf(docDefinition).open();
  }

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
                <Button onClick={() => imprimirLaudo(l)}>Imprimir</Button>
                <Button variant="ghost" onClick={() => excluirLaudo(l.id)}>
                  Excluir
                </Button>
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
