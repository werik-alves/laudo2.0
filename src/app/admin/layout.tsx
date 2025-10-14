"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex gap-2 mb-4">
        <Link href="/admin/equipamentos">
          <Button>Equipamentos</Button>
        </Link>
        <Link href="/admin/modelos">
          <Button>Modelos</Button>
        </Link>
      </div>
      {children}
    </div>
  );
}
