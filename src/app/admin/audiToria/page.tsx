"use client";

import React from "react";
import { useRouter } from "next/router";

export default function AdminAuditoriaPage() {
  // Redireciona automaticamente para a auditoria de tombo
  // ao acessar /admin/audiToria
  const router = useRouter();
  React.useEffect(() => {
    router.replace("/admin/audiToria/tombo");
  }, [router]);
  return null;
}
