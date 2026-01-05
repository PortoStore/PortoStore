"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Sale = { sale_id: number; total_amount: number; status: string | null; payment_type_id: number | null; sale_date: string | null };
type SaleDetail = { product_id: number | null; size_id: number | null; quantity: number; price_at_sale: number };

const STATUS_OPTIONS = [
  { value: "pending_approval", label: "Pendiente de aprobación" },
  { value: "paid", label: "Pagada" },
  { value: "cancelled", label: "Cancelada" },
];

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  const id = Number(params?.id);
  const [sale, setSale] = useState<Sale | null>(null);
  const [details, setDetails] = useState<SaleDetail[]>([]);
  const [status, setStatus] = useState<string>("pending");
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data: saleRow } = await supabase
        .from("sales")
        .select("sale_id,total_amount,status,payment_type_id,sale_date")
        .eq("sale_id", id)
        .single();
      const { data: items } = await supabase
        .from("sale_details")
        .select("product_id,size_id,quantity,price_at_sale")
        .eq("sale_id", id);
      if (saleRow) {
        setSale(saleRow as Sale);
        setStatus((saleRow as Sale).status || "pending");
      }
      setDetails((items as SaleDetail[]) || []);
    })();
  }, [id]);

  const totalCalc = useMemo(() => details.reduce((acc, d) => acc + Number(d.price_at_sale || 0) * Number(d.quantity || 0), 0), [details]);

  async function updateStatus(next: string) {
    if (!sale) return;
    setSaving(true);
    setError(null);

    // Stock management
    const current = sale.status;
    if (next === "cancelled" && current !== "cancelled") {
      // Devolver stock
      await Promise.all(details.map(async (d) => {
        if (!d.product_id || !d.size_id) return;
        const { data: curr } = await supabase.from("product_sizes").select("stock").eq("product_id", d.product_id).eq("size_id", d.size_id).single();
        if (curr) {
          await supabase.from("product_sizes").update({ stock: (Number(curr.stock) || 0) + Number(d.quantity) }).eq("product_id", d.product_id).eq("size_id", d.size_id);
        }
      }));
    } else if (next !== "cancelled" && current === "cancelled") {
      // Restar stock nuevamente
      await Promise.all(details.map(async (d) => {
        if (!d.product_id || !d.size_id) return;
        const { data: curr } = await supabase.from("product_sizes").select("stock").eq("product_id", d.product_id).eq("size_id", d.size_id).single();
        if (curr) {
          const newStock = Math.max(0, (Number(curr.stock) || 0) - Number(d.quantity));
          await supabase.from("product_sizes").update({ stock: newStock }).eq("product_id", d.product_id).eq("size_id", d.size_id);
        }
      }));
    }

    const { error } = await supabase.from("sales").update({ status: next }).eq("sale_id", sale.sale_id);
    if (error) {
      setError(error.message || "No se pudo actualizar el estado");
    } else {
      setStatus(next);
      setSale({ ...sale, status: next });
    }
    setSaving(false);
  }

  return (
    <div className="grid gap-4 max-w-4xl w-full mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Pedido #{id}</h1>
        <Button variant="outline" onClick={() => router.back()}>Volver</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Detalles del Pedido</CardTitle>
          <CardDescription>Revisá ítems y estados.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-2 text-sm">
            <div><span className="text-muted-foreground">Fecha: </span>{sale?.sale_date ? new Date(sale.sale_date).toLocaleString() : "-"}</div>
            <div><span className="text-muted-foreground">Estado: </span>
              <select className="h-9 rounded-md border bg-transparent px-3 text-sm" value={status} onChange={(e) => updateStatus(e.target.value)} disabled={saving}>
                {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Talle</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {details.map((d, idx) => (
                <TableRow key={idx}>
                  <TableCell>#{d.product_id ?? "-"}</TableCell>
                  <TableCell>{d.size_id ?? "-"}</TableCell>
                  <TableCell>{d.quantity}</TableCell>
                  <TableCell>${Number(d.price_at_sale || 0).toFixed(2)}</TableCell>
                  <TableCell>${(Number(d.price_at_sale || 0) * Number(d.quantity || 0)).toFixed(2)}</TableCell>
                </TableRow>
              ))}
              {details.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">Sin ítems.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between border-t pt-4">
            <div className="text-muted-foreground">Total calculado</div>
            <div className="text-xl font-bold">${totalCalc.toFixed(2)}</div>
          </div>
          {error && <div className="text-sm text-red-500">{error}</div>}
        </CardContent>
      </Card>
    </div>
  );
}
