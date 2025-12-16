import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronLeft } from "lucide-react";

export const dynamic = "force-dynamic";

type Discount = {
  discount_id: number;
  code: string;
  type: "fixed" | "percentage";
  value: number;
  is_active: boolean;
  valid_from: string | null;
  valid_until: string | null;
  max_uses?: number | null;
  uses_count?: number | null;
};

type UsageRow = {
  usage_id: number;
  sale_id: number;
  discount_id: number;
  code: string;
  amount_applied: number;
  used_at: string | null;
};

async function getData(id: number): Promise<{ discount: Discount | null; usages: UsageRow[] }> {
  const supabase = await createClient();
  const { data: d } = await supabase
    .from("discounts")
    .select("discount_id,code,type,value,is_active,valid_from,valid_until,max_uses,uses_count")
    .eq("discount_id", id)
    .maybeSingle();
  const { data: u } = await supabase
    .from("discount_usages")
    .select("usage_id,sale_id,discount_id,code,amount_applied,used_at")
    .eq("discount_id", id)
    .order("used_at", { ascending: false });
  return { discount: (d as Discount) || null, usages: (u as UsageRow[]) || [] };
}

export default async function DiscountHistoryPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const { discount, usages } = await getData(id);
  return (
    <div className="grid gap-6 pb-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/discounts">
          <Button variant="outline" size="icon" className="h-9 w-9">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold md:text-2xl">Historial de Descuento</h1>
      </div>
      {discount && (
        <Card>
          <CardHeader>
            <CardTitle>{discount.code}</CardTitle>
            <CardDescription>Detalles y usos registrados.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm">
            <div className="flex justify-between">
              <span>Tipo</span>
              <span>{discount.type === "fixed" ? "Fijo" : "Porcentaje"}</span>
            </div>
            <div className="flex justify-between">
              <span>Valor</span>
              <span>{discount.type === "fixed" ? `$${Number(discount.value || 0).toFixed(2)}` : `${Number(discount.value || 0)}%`}</span>
            </div>
            <div className="flex justify-between">
              <span>Usos</span>
              <span>{Number(discount.uses_count || 0)}{discount.max_uses ? ` / ${discount.max_uses}` : ""}</span>
            </div>
            <div className="flex justify-between">
              <span>Vigencia</span>
              <span>
                {(discount.valid_from ? new Date(discount.valid_from).toLocaleDateString() : "-") +
                  " → " +
                  (discount.valid_until ? new Date(discount.valid_until).toLocaleDateString() : "-")}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Activo</span>
              <span>{discount.is_active ? "Sí" : "No"}</span>
            </div>
          </CardContent>
        </Card>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Usos</CardTitle>
          <CardDescription>Aplicaciones del descuento en pedidos.</CardDescription>
        </CardHeader>
        <CardContent>
          {usages.length === 0 ? (
            <div className="text-center text-muted-foreground p-8 bg-muted/40 rounded-lg">Sin usos registrados.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Uso #</TableHead>
                  <TableHead>Pedido</TableHead>
                  <TableHead>Monto aplicado</TableHead>
                  <TableHead>Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usages.map((u) => (
                  <TableRow key={u.usage_id}>
                    <TableCell className="font-mono text-xs">{u.usage_id}</TableCell>
                    <TableCell className="font-mono">
                      <Link href={`/admin/orders/${u.sale_id}`} className="underline">#{u.sale_id}</Link>
                    </TableCell>
                    <TableCell>${Number(u.amount_applied || 0).toFixed(2)}</TableCell>
                    <TableCell>{u.used_at ? new Date(u.used_at).toLocaleString() : "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
