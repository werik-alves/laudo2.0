"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SignatureCanvas from "react-signature-canvas";

// Tipos explícitos para evitar "any"
type EstadoEquipamento = "funcionando" | "nao_funcionando" | "";
type Necessidade = "substituido" | "enviar_conserto" | "descartado" | "";

export default function InfoFormularioPage() {
  const router = useRouter();

  const [numeroChamado, setNumeroChamado] = useState("");
  const [nomeTecnico, setNomeTecnico] = useState("");
  const [equipamento, setEquipamento] = useState("");
  const [loja, setLoja] = useState("");
  const [tombo, setTombo] = useState("");
  const [modelo, setModelo] = useState("");
  const [setor, setSetor] = useState("");
  const [testesRealizados, setTestesRealizados] = useState("");
  const [diagnostico, setDiagnostico] = useState("");
  //   Tipar corretamente os estados (sem any)
  const [estadoEquipamento, setEstadoEquipamento] =
    useState<EstadoEquipamento>("");
  const [necessidade, setNecessidade] = useState<Necessidade>("");

  const handleEstadoEquipamentoChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value as EstadoEquipamento;
    setEstadoEquipamento(value);
  };
  const handleNecessidadeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as Necessidade;
    setNecessidade(value);
  };

  const [dataAtual, setDataAtual] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("");
  const sigPadRef = useRef<any>(null);
  const [assinaturaDataUrl, setAssinaturaDataUrl] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef<boolean>(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const fullName = localStorage.getItem("fullName") || "";
    const tokens = fullName.trim().split(/\s+/);
    const firstTwo = tokens.slice(0, 2).join(" ");
    const storedFullName =
      (typeof window !== "undefined" && localStorage.getItem("fullName")) || "";
    setFullName(storedFullName);
    setNomeTecnico(firstTwo || fullName);
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const formatted = `${pad(d.getDate())}/${pad(
      d.getMonth() + 1
    )}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    setDataAtual(formatted);
  }, [router]);

  function onlyDigits(value: string) {
    return value.replace(/\D/g, "");
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    setImagePreviewUrl((prevUrl) => {
      if (prevUrl) URL.revokeObjectURL(prevUrl);
      return file ? URL.createObjectURL(file) : "";
    });
  };

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    };
  }, [imagePreviewUrl]);

  const saveSignature = () => {
    const pad = sigPadRef.current;
    if (pad && !pad.isEmpty()) {
      const dataUrl = pad.getTrimmedCanvas().toDataURL("image/png");
      setAssinaturaDataUrl(dataUrl);
    }
  };

  const clearSignature = () => {
    const pad = sigPadRef.current;
    if (pad) pad.clear();
  };

  return (
    <Card className="max-w-4xl mx-auto my-6">
      <CardHeader>
        <CardTitle>Informações do Laudo Técnico</CardTitle>
        <CardDescription>Preencha os dados</CardDescription>
      </CardHeader>

      <CardContent className="grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="numeroChamado">Número do Chamado</Label>
            <Input
              id="numeroChamado"
              value={numeroChamado}
              onChange={(e) => setNumeroChamado(onlyDigits(e.target.value))}
              inputMode="numeric"
              pattern="\d*"
              placeholder="Somente números"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="nomeTecnico">Nome do Técnico</Label>
            <Input id="nomeTecnico" value={fullName} readOnly />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="equipamento">Equipamento</Label>
            <Input
              id="equipamento"
              value={equipamento}
              onChange={(e) => setEquipamento(e.target.value)}
              placeholder="Seleção futura a partir do banco"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="loja">Loja</Label>
            <Input
              id="loja"
              value={loja}
              onChange={(e) => setLoja(e.target.value)}
              placeholder="Seleção futura a partir do banco"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="tombo">Tombo</Label>
            <Input
              id="tombo"
              value={tombo}
              onChange={(e) => setTombo(onlyDigits(e.target.value))}
              inputMode="numeric"
              pattern="\d*"
              placeholder="Somente números"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="modelo">Modelo</Label>
            <Input
              id="modelo"
              value={modelo}
              onChange={(e) => setModelo(e.target.value)}
              placeholder="Seleção futura a partir do banco"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="setor">Setor</Label>
            <Input
              id="setor"
              value={setor}
              onChange={(e) => setSetor(e.target.value)}
              placeholder="Seleção futura a partir do banco"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="dataAtual">Data Atual do Sistema</Label>
            <Input id="dataAtual" value={dataAtual} disabled />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="imagemEquipamento">Imagem do Equipamento</Label>
          <input
            id="imagemEquipamento"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="border rounded px-3 py-2"
          />
          {imagePreviewUrl && (
            <img
              src={imagePreviewUrl}
              alt="Prévia da imagem do equipamento"
              className="mt-2 max-h-48 object-contain rounded border"
            />
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="testesRealizados">Testes realizados</Label>
          <textarea
            id="testesRealizados"
            value={testesRealizados}
            onChange={(e) => setTestesRealizados(e.target.value)}
            className="min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm"
            placeholder="Descreva os testes executados"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="diagnostico">
            De acordo com os testes feitos, o diagnóstico do equipamento é
          </Label>
          <textarea
            id="diagnostico"
            value={diagnostico}
            onChange={(e) => setDiagnostico(e.target.value)}
            className="min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm"
            placeholder="Descreva o diagnóstico"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="estadoEquipamento">Estado do equipamento</Label>
            <select
              id="estadoEquipamento"
              value={estadoEquipamento}
              onChange={handleEstadoEquipamentoChange}
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Selecione...</option>
              <option value="funcionando">Funcionando</option>
              <option value="nao_funcionando">Não funcionando</option>
            </select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="necessidade">O equipamento necessita</Label>
            <select
              id="necessidade"
              value={necessidade}
              onChange={handleNecessidadeChange}
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Selecione...</option>
              <option value="substituido">Ser substituído</option>
              <option value="enviar_conserto">Enviado p/ concêrto</option>
              <option value="descartado">Ser descartado</option>
            </select>
          </div>
        </div>

        {/* Campo de assinatura abaixo dos selects */}
        <div className="grid gap-2 mt-4">
          <Label htmlFor="assinatura">Assinatura</Label>
          <div className="rounded-md border bg-white p-2">
            <SignatureCanvas
              ref={(ref) => (sigPadRef.current = ref)}
              penColor="#000000"
              backgroundColor="#ffffff"
              canvasProps={{ className: "w-full h-40 border rounded" }}
            />
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={clearSignature}>
              Limpar Assinatura
            </Button>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between gap-2">
        <Button
          type="button"
          onClick={() => {
            /* futuro: window.print(); */
          }}
        >
          Imprimir
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("fullName");
            router.replace("/");
          }}
        >
          Sair
        </Button>
      </CardFooter>
    </Card>
  );
}
