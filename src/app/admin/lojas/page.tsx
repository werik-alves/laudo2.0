"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LojaType } from "@/types/domain";

export default function AdminLojasPage() {
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
  const [lojas, setLojas] = useState<LojaType[]>([]);
  const [novoNome, setNovoNome] = useState("");

  const load = async () => {
    const res = await fetch(`${API_BASE_URL}/lojas`);
    const data = await res.json();
    setLojas(data);
  };

  useEffect(() => {
    load();
  }, []);

  const criar = async () => {
    const nome = novoNome.trim();
    if (!nome) return;
    const res = await fetch(`${API_BASE_URL}/lojas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome }),
    });
    if (res.ok) {
      setNovoNome("");
      await load();
    } else {
      alert("Falha ao criar loja");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lojas</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2 max-w-sm">
          <Label>Nova loja</Label>
          <Input
            value={novoNome}
            onChange={(e) => setNovoNome(e.target.value)}
            placeholder="Nome da loja"
          />
          <Button onClick={criar}>Criar</Button>
        </div>

        <div className="grid gap-2">
          {lojas.map((l) => (
            <div key={l.id} className="flex items-center gap-2">
              <span className="min-w-[200px]">{l.nome}</span>
            </div>
          ))}
          {lojas.length === 0 && <span>Nenhuma loja cadastrada.</span>}
        </div>
      </CardContent>
    </Card>
  );
}
