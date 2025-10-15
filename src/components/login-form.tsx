"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [goAdmin, setGoAdmin] = useState(false);
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const username = String(formData.get("username") || "");
    const password = String(formData.get("password") || "");

    try {
      const body = new URLSearchParams({ username, password });
      const resp = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
        credentials: "include",
      });

      const data = await resp.json();
      if (!resp.ok) {
        setErrorMsg(data?.error || "Falha no login");
        setLoading(false);
        return;
      }

      if (data?.fullName) localStorage.setItem("fullName", data.fullName);
      if (data?.token) localStorage.setItem("token", data.token);

      if (goAdmin && data?.isAdmin === true) {
        router.push("/admin");
      } else {
        if (goAdmin && data?.isAdmin !== true) {
          setErrorMsg("Seu perfil não tem acesso ao painel administrador.");
        }
        router.push("/infoFormulario");
      }
    } catch (err) {
      setErrorMsg("Erro de rede ou servidor indisponível");
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Entrar</CardTitle>
        <CardDescription>Acesse sua conta para continuar</CardDescription>
      </CardHeader>

      <form className="grid gap-6" onSubmit={handleSubmit}>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="username">Usuário (AD)</Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="seu_usuario"
              required
              autoComplete="username"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="adminPanel"
              type="checkbox"
              checked={goAdmin}
              onChange={(e) => setGoAdmin(e.target.checked)}
            />
            <Label htmlFor="adminPanel">
              Ir direto ao painel administrador
            </Label>
          </div>

          {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </Button>
          <Button
            variant="link"
            className="w-full justify-center hover:via-blue-950"
            type="button"
          >
            Esqueci minha senha
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
