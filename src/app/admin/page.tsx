import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Package, Tags, Plus, LayoutDashboard, Receipt, Store } from "lucide-react";

export default async function AdminDashboard() {
    const supabase = await createClient();

    const { count: productsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

    const { count: categoriesCount } = await supabase
        .from('categories')
        .select('*', { count: 'exact', head: true });

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
                        <CardTitle className="text-sm font-medium">Ultimas Compras</CardTitle>
                        <Receipt className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">--</div>
                        <p className="text-xs text-muted-foreground">....</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Horarios</CardTitle>
                        <Tags className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">--</div>
                        <p className="text-xs text-muted-foreground">....</p>
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
        </div>
    );
}
