"use client";

import { useEffect, useMemo, useState } from "react";
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
  const [observacaoEnvio, setObservacaoEnvio] = useState("");
  const [testesRealizados, setTestesRealizados] = useState("");
  const [diagnostico, setDiagnostico] = useState("");
  // Tipar corretamente os estados (sem any)
  const [estadoEquipamento, setEstadoEquipamento] =
    useState<EstadoEquipamento>("");
  const [necessidade, setNecessidade] = useState<Necessidade>("");

  // Handlers tipados para os selects
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

  useEffect(() => {
    const fullName = localStorage.getItem("fullName") || "";
    const tokens = fullName.trim().split(/\s+/);
    const firstTwo = tokens.slice(0, 2).join(" ");
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

  return (
    <Card className="max-w-4xl mx-auto my-6">
      <CardHeader>
        <CardTitle>Informações do Formulário</CardTitle>
        <CardDescription>Preencha os dados do atendimento</CardDescription>
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
            <Input
              id="nomeTecnico"
              value={nomeTecnico}
              onChange={(e) => setNomeTecnico(e.target.value)}
              placeholder="Primeiro e segundo nome"
            />
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
          <Label htmlFor="observacaoEnvio">
            Observação sobre o envio do equipamento
          </Label>
          <textarea
            id="observacaoEnvio"
            value={observacaoEnvio}
            onChange={(e) => setObservacaoEnvio(e.target.value)}
            className="min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm"
            placeholder="Descreva observações relevantes"
          />
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
              <option value="">Selecione</option>
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
              <option value="">Selecione</option>
              <option value="substituido">Ser substituído</option>
              <option value="enviar_conserto">Enviado p/ conserto</option>
              <option value="descartado">Ser descartado</option>
            </select>
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
