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
  localizacaoId?: number | null;
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
  const [localizacaoId, setLocalizacaoId] = useState<number | null>(null);
  type GlpiLocation = { id: number; completename: string };
  const [localizacoesLista, setLocalizacoesLista] = useState<GlpiLocation[]>(
    []
  );
  const [localizacaoQuery, setLocalizacaoQuery] = useState("");
  const [isLocalizacaoOpen, setIsLocalizacaoOpen] = useState(false);
  const [tecnicoAtribuido, setTecnicoAtribuido] = useState(
    defaultTecnico || ""
  );
  const [grupo, setGrupo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [categoriaId, setCategoriaId] = useState<number | null>(null);
  type GlpiCategory = { id: number; completename: string };
  const [categoriasLista, setCategoriasLista] = useState<GlpiCategory[]>([]);
  const [categoriaQuery, setCategoriaQuery] = useState("");
  const [isCategoriaOpen, setIsCategoriaOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setTecnicoAtribuido(defaultTecnico || "");
      setRequerente(defaultRequerente || "");
    }
  }, [open, defaultTecnico, defaultRequerente]);

  useEffect(() => {
    if (!open) return;
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

  const filteredCategorias = categoriasLista.filter((c) =>
    c.completename.toLowerCase().includes(categoriaQuery.toLowerCase())
  );

  const handleSelectCategoria = (item: GlpiCategory) => {
    setCategoriaId(item.id);
    setCategoria(item.completename);
    setCategoriaQuery(item.completename);
    setIsCategoriaOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    fetch(`${apiBaseUrl}/glpi/lookup/locations-db`, {
      method: "GET",
      credentials: "include",
    })
      .then(async (resp) => {
        if (!resp.ok) {
          const txt = await resp.text().catch(() => "");
          throw new Error(
            `Falha ao listar localizações: ${resp.status} ${txt}`
          );
        }
        const data = await resp.json();
        setLocalizacoesLista(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Erro ao obter localizações GLPI via DB:", err);
      });
  }, [open, apiBaseUrl]);

  const filteredLocalizacoes = localizacoesLista.filter((l) =>
    l.completename.toLowerCase().includes(localizacaoQuery.toLowerCase())
  );

  const handleSelectLocalizacao = (item: GlpiLocation) => {
    setLocalizacaoId(item.id);
    setLocalizacao(item.completename);
    setLocalizacaoQuery(item.completename);
    setIsLocalizacaoOpen(false);
  };

  const [requerente, setRequerente] = useState(defaultRequerente || "");

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
          {/* Removemos o input simples de Localização para colocar o combobox abaixo */}
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
            <div className="relative">
              <Input
                value={categoriaQuery}
                placeholder="Digite para filtrar e selecione"
                onFocus={() => setIsCategoriaOpen(true)}
                onChange={(e) => {
                  setCategoriaQuery(e.target.value);
                  setIsCategoriaOpen(true);
                }}
                onBlur={() => {
                  setTimeout(() => setIsCategoriaOpen(false), 150);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const first = filteredCategorias[0];
                    if (first) handleSelectCategoria(first);
                  }
                }}
              />
              {isCategoriaOpen && (
                <div
                  className="absolute z-50 w-full max-h-56 overflow-y-auto rounded border bg-white shadow mt-1"
                  style={{ top: "calc(100% + 4px)" }}
                >
                  {filteredCategorias.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground">
                      Nenhuma categoria encontrada
                    </div>
                  ) : (
                    filteredCategorias.map((item) => (
                      <button
                        type="button"
                        key={item.id}
                        className="w-full text-left px-2 py-1 hover:bg-accent"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleSelectCategoria(item)}
                      >
                        {item.completename}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="grid gap-2">
            <label>Requerente</label>
            <Input
              value={requerente}
              onChange={(e) => setRequerente(e.target.value)}
            />
          </div>
          {/* Localização com combobox, aparece no final do modal */}
          <div className="grid gap-2">
            <label>Localização</label>
            <div className="relative">
              <Input
                value={localizacaoQuery}
                placeholder="Digite para filtrar e selecione"
                onFocus={() => setIsLocalizacaoOpen(true)}
                onChange={(e) => {
                  setLocalizacaoQuery(e.target.value);
                  setIsLocalizacaoOpen(true);
                }}
                onBlur={() => {
                  setTimeout(() => setIsLocalizacaoOpen(false), 150);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const first = filteredLocalizacoes[0];
                    if (first) handleSelectLocalizacao(first);
                  }
                }}
              />
              {isLocalizacaoOpen && (
                <div
                  className="absolute z-50 w-full max-h-56 overflow-y-auto rounded border bg-white shadow mt-1"
                  style={{ top: "calc(100% + 4px)" }}
                >
                  {filteredLocalizacoes.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground">
                      Nenhuma localização encontrada
                    </div>
                  ) : (
                    filteredLocalizacoes.map((item) => (
                      <button
                        type="button"
                        key={item.id}
                        className="w-full text-left px-2 py-1 hover:bg-accent"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleSelectLocalizacao(item)}
                      >
                        {item.completename}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
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
                localizacaoId: localizacaoId ?? null,
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
