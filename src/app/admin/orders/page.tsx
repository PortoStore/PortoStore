import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronLeft } from "lucide-react";

export const dynamic = "force-dynamic";

type OrderRow = {
  sale_id: number;
  total_amount: number;
  status: string | null;
  sale_date: string | null;
  payment_types?: { name: string } | { name: string }[] | null;
  payment_records?: { record_status: string } | { record_status: string }[] | null;
};

async function getOrders(): Promise<OrderRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sales")
    .select("sale_id,total_amount,status,sale_date,payment_types(name),payment_records(record_status)")
    .order("sale_date", { ascending: false })
    .limit(50);
  if (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
  return (data as OrderRow[]) || [];
}

export default async function AdminOrdersPage() {
  const orders = await getOrders();
  const STATUS_LABELS: Record<string, string> = {
    pending: "Pendiente",
    pending_approval: "Pendiente de aprobación",
    paid: "Pagada",
    dispatched: "Despachada",
    in_branch: "En sucursal",
    picked_up: "Retirada",
  };
  const RECORD_LABELS: Record<string, string> = {
    recorded: "Registrado",
    verified: "Verificado",
    rejected: "Rechazado",
  };
  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-4">
        <Link href="/admin">
          <Button variant="outline" size="icon" className="h-9 w-9">
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Volver</span>
          </Button>
        </Link>
        <h1 className="text-lg font-semibold md:text-2xl">Pedidos</h1>
      </div>

      {/* Desktop View */}
      <Card className="hidden md:block">
        <CardHeader>
          <CardTitle>Últimos pedidos</CardTitle>
          <CardDescription>Controlá pagos y estados.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Pago</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((o) => {
                const paymentName = Array.isArray(o.payment_types)
                  ? o.payment_types.map((p) => p.name).join(", ")
                  : (o.payment_types as { name: string } | null)?.name || "-";
                const dateStr = o.sale_date ? new Date(o.sale_date).toLocaleString() : "-";
                const payStatusRaw = Array.isArray(o.payment_records)
                  ? o.payment_records.map((p) => p.record_status).join(", ")
                  : (o.payment_records as { record_status: string } | null)?.record_status || "-";
                const payStatus = payStatusRaw === "-"
                  ? "-"
                  : payStatusRaw.split(",").map((s) => RECORD_LABELS[s.trim()] || s.trim()).join(", ");
                const statusLabel = o.status ? (STATUS_LABELS[o.status] || o.status) : "-";
                return (
                  <TableRow key={o.sale_id}>
                    <TableCell className="font-mono text-xs">{o.sale_id}</TableCell>
                    <TableCell>{dateStr}</TableCell>
                    <TableCell>${Number(o.total_amount || 0).toFixed(2)}</TableCell>
                    <TableCell>{paymentName}</TableCell>
                    <TableCell>{statusLabel} {payStatus !== "-" && (<span className="ml-2 text-xs px-2 py-1 rounded bg-secondary">{payStatus}</span>)}</TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/orders/${o.sale_id}`}>
                        <Button variant="ghost" size="sm">Ver</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
              {orders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">No hay pedidos cargados.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Mobile View */}
      <div className="grid gap-4 md:hidden">
        {orders.length === 0 ? (
          <div className="text-center text-muted-foreground p-8 bg-muted/40 rounded-lg">
            No hay pedidos cargados.
          </div>
        ) : (
          orders.map((o) => {
            const paymentName = Array.isArray(o.payment_types)
              ? o.payment_types.map((p) => p.name).join(", ")
              : (o.payment_types as { name: string } | null)?.name || "-";
            const dateStr = o.sale_date ? new Date(o.sale_date).toLocaleString() : "-";
            const payStatusRaw = Array.isArray(o.payment_records)
              ? o.payment_records.map((p) => p.record_status).join(", ")
              : (o.payment_records as { record_status: string } | null)?.record_status || "-";
            const payStatus = payStatusRaw === "-"
              ? "-"
              : payStatusRaw.split(",").map((s) => RECORD_LABELS[s.trim()] || s.trim()).join(", ");
            const statusLabel = o.status ? (STATUS_LABELS[o.status] || o.status) : "-";

            return (
              <Card key={o.sale_id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base font-bold">Pedido #{o.sale_id}</CardTitle>
                    <span className="text-xs text-muted-foreground max-w-[50%] text-right">{dateStr}</span>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monto:</span>
                    <span className="font-medium">${Number(o.total_amount || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estado:</span>
                    <span>
                      {statusLabel}
                      {payStatus !== "-" && (<span className="ml-2 text-xs px-2 py-0.5 rounded bg-secondary">{payStatus}</span>)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pago:</span>
                    <span>{paymentName}</span>
                  </div>
                  <div className="pt-2">
                    <Link href={`/admin/orders/${o.sale_id}`}>
                      <Button variant="outline" className="w-full">Ver Detalles</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
