'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewDiscountPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [type, setType] = useState<"fixed" | "percentage">("percentage");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(event.currentTarget);
    const codeRaw = (formData.get("code") as string) || "";
    const valueRaw = Number(formData.get("value") || 0);
    const validUntilRaw = (formData.get("valid_until") as string) || "";
    const maxUsesRaw = formData.get("max_uses");
    const isActiveRaw = String(formData.get("is_active") || "true") === "true";
    const code = codeRaw.trim().toUpperCase();
    if (!code || valueRaw <= 0) {
      setError("Código y valor son obligatorios");
      setLoading(false);
      return;
    }
    try {
      const payload: { code: string; type: "fixed" | "percentage"; value: number; is_active: boolean; valid_until?: string; max_uses?: number | null } = {
        code,
        type,
        value: valueRaw,
        is_active: isActiveRaw,
      };
      if (validUntilRaw) {
        const d = new Date(validUntilRaw);
        d.setHours(23, 59, 59, 999);
        payload.valid_until = d.toISOString();
      }
      const parsedMax = typeof maxUsesRaw === "string" && maxUsesRaw.trim() !== "" ? Number(maxUsesRaw) : null;
      if (parsedMax !== null && !Number.isNaN(parsedMax) && parsedMax >= 0) {
        payload.max_uses = parsedMax;
      }
      const { error: insErr } = await supabase.from("discounts").insert([payload]);
      if (insErr) throw insErr;
      router.push("/admin/discounts");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo crear el descuento");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Nuevo Descuento</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Detalles del Descuento</CardTitle>
          <CardDescription>Definí código, tipo, valor y vigencia.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="code">Código</Label>
              <Input id="code" name="code" placeholder="PORTO10" required />
            </div>
            <div className="grid gap-2">
              <Label>Tipo</Label>
              <Select value={type} onValueChange={(v) => setType(v as "fixed" | "percentage")}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccioná tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Porcentaje</SelectItem>
                  <SelectItem value="fixed">Fijo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="value">Valor</Label>
              <Input id="value" name="value" type="number" step="0.01" placeholder="ej.: 10 o 1000" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="max_uses">Límite de usos</Label>
              <Input id="max_uses" name="max_uses" type="number" placeholder="Opcional: ej. 100" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="valid_until">Fecha de vencimiento</Label>
              <Input id="valid_until" name="valid_until" type="date" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="is_active">Activo</Label>
              <Select name="is_active" defaultValue="true">
                <SelectTrigger>
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Sí</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {error && <div className="text-sm text-red-500">{error}</div>}
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
              <Button type="submit" disabled={loading}>{loading ? "Creando..." : "Crear Descuento"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
