import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Package, Tags, Plus, LayoutDashboard, Receipt, Store } from "lucide-react";
import AdminLogoutButton from "@/components/admin-logout-button";
import { BarChartComponent } from "@/components/admin/charts/bar-chart";
import { DonutChartComponent } from "@/components/admin/charts/donut-chart";

export default async function AdminDashboard() {
    const supabase = await createClient();

    const { count: productsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

    const { count: categoriesCount } = await supabase
        .from('categories')
        .select('*', { count: 'exact', head: true });

    const since = new Date();
    since.setDate(since.getDate() - 30);
    const sinceIso = since.toISOString();

    const { count: ordersLast30 } = await supabase
        .from('sales')
        .select('*', { count: 'exact', head: true })
        .gte('sale_date', sinceIso);

    const { data: salesRows } = await supabase
        .from('sales')
        .select('total_amount,sale_date,status,payment_type_id')
        .gte('sale_date', sinceIso);
    const revenueLast30 = ((salesRows || []) as { total_amount: number; sale_date: string | null; status: string | null; payment_type_id: number | null }[])
        .reduce((acc, r) => acc + Number(r.total_amount || 0), 0);

    const { count: lowStockCount } = await supabase
        .from('product_sizes')
        .select('*', { count: 'exact', head: true })
        .lte('stock', 3);

    const days = Array.from({ length: 14 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (13 - i));
        return d;
    });
    const dayKeys = days.map(d => d.toISOString().slice(0, 10));
    const rows14 = ((salesRows || []) as { total_amount: number; sale_date: string | null; status: string | null; payment_type_id: number | null }[])
        .filter(r => (r.sale_date || '').slice(0, 10) >= dayKeys[0]);
    const revByDay: Record<string, number> = {};
    const ordersByDay: Record<string, number> = {};
    dayKeys.forEach(k => { revByDay[k] = 0; ordersByDay[k] = 0; });
    rows14.forEach(r => {
        const k = (r.sale_date || '').slice(0, 10);
        if (k in revByDay) {
            revByDay[k] += Number(r.total_amount || 0);
            ordersByDay[k] += 1;
        }
    });

    const revenueData = dayKeys.map(k => ({
        date: k,
        total_amount: revByDay[k]
    }));

    const ordersData = dayKeys.map(k => ({
        date: k,
        orders_count: ordersByDay[k]
    }));

    const cashCount = rows14.filter(r => r.payment_type_id === 1).length;
    const transferCount = rows14.filter(r => r.payment_type_id === 3).length;

    const paymentData = [
        { name: "Efectivo", count: cashCount, fill: "#10b981" },
        { name: "Transferencia", count: transferCount, fill: "#3b82f6" },
    ];


    return (
        <div className="space-y-4">
            {/* Mobile Navigation Menu */}
            <div className="grid gap-4 md:hidden">
                <Link href="/" target="_blank">
                    <Button variant="outline" className="w-full justify-start gap-3 h-14 text-lg">
                        <Store className="h-5 w-5" />
                        Ir a la tienda
                    </Button>
                </Link>
                <Link href="/admin/products">
                    <Button variant="outline" className="w-full justify-start gap-3 h-14 text-lg">
                        <Package className="h-5 w-5" />
                        Productos
                    </Button>
                </Link>
                <Link href="/admin/categories">
                    <Button variant="outline" className="w-full justify-start gap-3 h-14 text-lg">
                        <Tags className="h-5 w-5" />
                        Categorías
                    </Button>
                </Link>
                <Link href="/admin/orders">
                    <Button variant="outline" className="w-full justify-start gap-3 h-14 text-lg">
                        <Receipt className="h-5 w-5" />
                        Pedidos
                    </Button>
                </Link>
                <Link href="/admin/store">
                    <Button variant="outline" className="w-full justify-start gap-3 h-14 text-lg">
                        <Store className="h-5 w-5" />
                        Mi tienda
                    </Button>
                </Link>
                <AdminLogoutButton />
            </div>

            {/* Desktop Dashboard Stats & Quick Actions */}
            <div className="hidden md:grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Productos</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{productsCount ?? 0}</div>
                        <p className="text-xs text-muted-foreground">
                            Productos registrados
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Categorías</CardTitle>
                        <Tags className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{categoriesCount ?? 0}</div>
                        <p className="text-xs text-muted-foreground">
                            Categorías activas
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ventas últimos 30 días</CardTitle>
                        <Receipt className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${Number(revenueLast30 || 0).toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">{ordersLast30 ?? 0} pedidos</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Stock bajo</CardTitle>
                        <Tags className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{lowStockCount ?? 0}</div>
                        <p className="text-xs text-muted-foreground">Variaciones con ≤ 3 unidades</p>
                    </CardContent>
                </Card>
                <div className="col-span-full grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Acciones Rápidas</CardTitle>
                            <CardDescription>Gestioná el contenido de tu tienda</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <Link href="/admin/products/new">
                                    <Button variant="outline" className=" text-black hover:bg-black hover:text-white w-full justify-start gap-2">
                                    <Plus className="h-4 w-4" />
                                    Agregar Producto
                                </Button>
                            </Link>
                            <Link href="/admin/categories/new">
                                    <Button variant="outline" className=" text-black hover:bg-black hover:text-white w-full justify-start gap-2">
                                    <Plus className="h-4 w-4" />
                                    Agregar Categoría
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <BarChartComponent
                    data={revenueData}
                    title="KPI: Ingresos por día"
                    subtitle="Últimos 14 días"
                    dataKey="total_amount"
                    colorVar="hsl(var(--chart-1))"
                />
                <BarChartComponent
                    data={ordersData}
                    title="KPI: Pedidos por día"
                    subtitle="Últimos 14 días"
                    dataKey="orders_count"
                    colorVar="hsl(var(--chart-2))"
                />
                <DonutChartComponent
                    data={paymentData}
                    title="KPI: Métodos de pago"
                    subtitle="Distribución últimos 14 días"
                />
            </div>
        </div>
    );
}
