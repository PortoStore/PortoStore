import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronLeft } from "lucide-react";

export const dynamic = "force-dynamic";

type DiscountRow = {
  discount_id: number;
  code: string;
  type: "fixed" | "percentage";
  value: number;
  is_active: boolean;
  valid_from: string | null;
  valid_until: string | null;
  created_at: string | null;
  max_uses?: number | null;
  uses_count?: number | null;
};

async function getDiscounts(): Promise<DiscountRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("discounts")
    .select("discount_id,code,type,value,is_active,valid_from,valid_until,created_at,max_uses,uses_count")
    .order("created_at", { ascending: false });
  return (data as DiscountRow[]) || [];
}

export default async function AdminDiscountsPage() {
  const rows = await getDiscounts();

  async function toggleActive(formData: FormData) {
    "use server";
    const id = Number(formData.get("discount_id"));
    const next = String(formData.get("next")) === "true";
    if (!id) return;
    const supabase = await createClient();
    await supabase.from("discounts").update({ is_active: next }).eq("discount_id", id);
    revalidatePath("/admin/discounts");
  }

  async function deleteDiscount(formData: FormData) {
    "use server";
    const id = Number(formData.get("discount_id"));
    if (!id) return;
    const supabase = await createClient();
    await supabase.from("discounts").delete().eq("discount_id", id);
    revalidatePath("/admin/discounts");
  }

  return (
    <div className="grid gap-6 pb-8">
      <div className="flex items-center gap-4">
        <Link href="/admin">
          <Button variant="outline" size="icon" className="h-9 w-9">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold md:text-2xl">Descuentos</h1>
        <div className="ml-auto">
          <Link href="/admin/discounts/new">
            <Button>Nuevo Descuento</Button>
          </Link>
        </div>
      </div>

      <Card className="hidden md:block">
        <CardHeader>
          <CardTitle>Listado</CardTitle>
          <CardDescription>Gestioná códigos y estado.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Vigencia</TableHead>
                <TableHead>Usos</TableHead>
                <TableHead>Activo</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => {
                const from = r.valid_from ? new Date(r.valid_from).toLocaleDateString() : "-";
                const until = r.valid_until ? new Date(r.valid_until).toLocaleDateString() : "-";
                return (
                  <TableRow key={r.discount_id}>
                    <TableCell className="font-mono text-xs">{r.discount_id}</TableCell>
                    <TableCell className="font-mono">{r.code}</TableCell>
                    <TableCell>{r.type === "fixed" ? "Fijo" : "Porcentaje"}</TableCell>
                    <TableCell>{r.type === "fixed" ? `$${Number(r.value || 0).toFixed(2)}` : `${Number(r.value || 0)}%`}</TableCell>
                    <TableCell>{from} → {until}</TableCell>
                    <TableCell>{Number(r.uses_count || 0)}{r.max_uses ? ` / ${r.max_uses}` : ""}</TableCell>
                    <TableCell>{r.is_active ? "Sí" : "No"}</TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/discounts/${r.discount_id}`} className="mr-2 inline-flex">
                        <Button type="button" variant="outline" size="sm">Historial</Button>
                      </Link>
                      <form action={toggleActive} className="inline-flex mr-2">
                        <input type="hidden" name="discount_id" value={r.discount_id} />
                        <input type="hidden" name="next" value={String(!r.is_active)} />
                        <Button type="submit" variant="outline" size="sm">{r.is_active ? "Desactivar" : "Activar"}</Button>
                      </form>
                      <form action={deleteDiscount} className="inline-flex">
                        <input type="hidden" name="discount_id" value={r.discount_id} />
                        <Button type="submit" variant="destructive" size="sm">Eliminar</Button>
                      </form>
                    </TableCell>
                  </TableRow>
                );
              })}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">No hay descuentos.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:hidden">
        {rows.length === 0 ? (
          <div className="text-center text-muted-foreground p-8 bg-muted/40 rounded-lg">No hay descuentos.</div>
        ) : (
          rows.map((r) => {
            const from = r.valid_from ? new Date(r.valid_from).toLocaleDateString() : "-";
            const until = r.valid_until ? new Date(r.valid_until).toLocaleDateString() : "-";
            return (
              <Card key={r.discount_id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-bold">{r.code}</CardTitle>
                  <CardDescription className="text-xs">{from} → {until}</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3">
                  <div className="flex justify-between text-sm">
                    <span>Tipo</span>
                    <span>{r.type === "fixed" ? "Fijo" : "Porcentaje"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Valor</span>
                    <span>{r.type === "fixed" ? `$${Number(r.value || 0).toFixed(2)}` : `${Number(r.value || 0)}%`}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Usos</span>
                    <span>{Number(r.uses_count || 0)}{r.max_uses ? ` / ${r.max_uses}` : ""}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Activo</span>
                    <span>{r.is_active ? "Sí" : "No"}</span>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Link href={`/admin/discounts/${r.discount_id}`} className="flex-1">
                      <Button type="button" variant="outline" className="w-full">Historial</Button>
                    </Link>
                    <form action={toggleActive} className="flex-1">
                      <input type="hidden" name="discount_id" value={r.discount_id} />
                      <input type="hidden" name="next" value={String(!r.is_active)} />
                      <Button type="submit" variant="outline" className="w-full">{r.is_active ? "Desactivar" : "Activar"}</Button>
                    </form>
                    <form action={deleteDiscount} className="flex-1">
                      <input type="hidden" name="discount_id" value={r.discount_id} />
                      <Button type="submit" variant="destructive" className="w-full">Eliminar</Button>
                    </form>
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
