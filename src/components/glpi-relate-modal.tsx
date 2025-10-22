import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type GlpiRelacaoPayload = {
  titulo: string;
  localizacao: string;
  tecnicoAtribuido: string;
  grupo: string;
  categoria: string;
  requerente: string;
};

export default function GlpiRelateModal({
  open,
  defaultTecnico,
  defaultRequerente,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  defaultTecnico: string;
  defaultRequerente: string;
  onCancel: () => void;
  onConfirm: (data: GlpiRelacaoPayload) => void;
}) {
  const [titulo, setTitulo] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [tecnicoAtribuido, setTecnicoAtribuido] = useState(
    defaultTecnico || ""
  );
  const [grupo, setGrupo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [requerente, setRequerente] = useState(defaultRequerente || "");

  useEffect(() => {
    if (open) {
      setTecnicoAtribuido(defaultTecnico || "");
      setRequerente(defaultRequerente || "");
    }
  }, [open, defaultTecnico, defaultRequerente]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-md p-4 w-full max-w-lg">
        <h3 className="text-lg font-semibold mb-2">
          Relacionar a um chamado existente
        </h3>
        <div className="grid gap-3">
          <div className="grid gap-2">
            <label>Título</label>
            <Input value={titulo} onChange={(e) => setTitulo(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <label>Localização</label>
            <Input
              value={localizacao}
              onChange={(e) => setLocalizacao(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <label>Técnico atribuído</label>
            <Input
              value={tecnicoAtribuido}
              onChange={(e) => setTecnicoAtribuido(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <label>Grupo</label>
            <Input value={grupo} onChange={(e) => setGrupo(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <label>Categoria</label>
            <Input
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <label>Requerente</label>
            <Input
              value={requerente}
              onChange={(e) => setRequerente(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button
            onClick={() =>
              onConfirm({
                titulo,
                localizacao,
                tecnicoAtribuido,
                grupo,
                categoria,
                requerente,
              })
            }
          >
            Confirmar e enviar
          </Button>
        </div>
      </div>
    </div>
  );
}
