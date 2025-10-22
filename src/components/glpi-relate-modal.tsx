import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type GlpiRelacaoPayload = {
  titulo: string;
  localizacao: string;
  tecnicoAtribuido: string;
  grupo: string;
  categoria: string;
  categoriaId?: number | null;
  requerente: string;
};

export default function GlpiRelateModal({
  open,
  apiBaseUrl,
  defaultTecnico,
  defaultRequerente,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  apiBaseUrl: string;
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
  const [categoriaId, setCategoriaId] = useState<number | null>(null);
  const [requerente, setRequerente] = useState(defaultRequerente || "");

  type GlpiCategory = { id: number; completename: string };
  const [categoriasLista, setCategoriasLista] = useState<GlpiCategory[]>([]);

  useEffect(() => {
    if (open) {
      setTecnicoAtribuido(defaultTecnico || "");
      setRequerente(defaultRequerente || "");
    }
  }, [open, defaultTecnico, defaultRequerente]);

  useEffect(() => {
    if (!open) return;
    // Busca categorias via backend (consulta direta ao DB do GLPI)
    fetch(`${apiBaseUrl}/glpi/lookup/categories-db`, {
      method: "GET",
      credentials: "include",
    })
      .then(async (resp) => {
        if (!resp.ok) {
          const txt = await resp.text().catch(() => "");
          throw new Error(`Falha ao listar categorias: ${resp.status} ${txt}`);
        }
        const data = await resp.json();
        setCategoriasLista(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Erro ao obter categorias GLPI via DB:", err);
      });
  }, [open, apiBaseUrl]);

  if (!open) return null;

  const handleCategoriaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = Number(e.target.value);
    setCategoriaId(isNaN(id) ? null : id);
    const item = categoriasLista.find((c) => c.id === id);
    setCategoria(item?.completename || "");
  };

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
            <select
              className="border rounded px-2 py-1"
              value={categoriaId ?? ""}
              onChange={handleCategoriaChange}
            >
              <option value="">Selecione uma categoria</option>
              {categoriasLista.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.completename}
                </option>
              ))}
            </select>
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
                categoriaId: categoriaId ?? null,
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
