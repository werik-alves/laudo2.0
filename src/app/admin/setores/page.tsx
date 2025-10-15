"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SetorType } from "@/types/domain";

export default function AdminSetoresPage() {
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
  const [setores, setSetores] = useState<SetorType[]>([]);
  const [novoNome, setNovoNome] = useState("");

  const load = async () => {
    const res = await fetch(`${API_BASE_URL}/setores`);
    const data = await res.json();
    setSetores(data);
  };

  useEffect(() => {
    load();
  }, []);

  const criar = async () => {
    const nome = novoNome.trim();
    if (!nome) return;
    const res = await fetch(`${API_BASE_URL}/setores`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome }),
    });
    if (res.ok) {
      setNovoNome("");
      await load();
    } else {
      alert("Falha ao criar setor");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Setores</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2 max-w-sm">
          <Label>Novo setor</Label>
          <Input
            value={novoNome}
            onChange={(e) => setNovoNome(e.target.value)}
            placeholder="Nome do setor"
          />
          <Button onClick={criar}>Criar</Button>
        </div>

        <div className="grid gap-2">
          {setores.map((s) => (
            <div key={s.id} className="flex items-center gap-2">
              <span className="min-w-[200px]">{s.nome}</span>
            </div>
          ))}
          {setores.length === 0 && <span>Nenhum setor cadastrado.</span>}
        </div>
      </CardContent>
    </Card>
  );
}
