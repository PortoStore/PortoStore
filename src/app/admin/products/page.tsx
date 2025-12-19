import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import DeleteConfirmButton from "@/components/admin/delete-confirm-button";

export const dynamic = 'force-dynamic';

async function getProducts() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('products')
        .select(`
        product_id,
        name,
        sku_base,
        categories (name),
        product_prices (price),
        product_sizes (size_id, stock)
    `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching products:', error);
        return [];
    }
    return data;
}

export default async function AdminProductsPage() {
    type ProductRow = {
        product_id: number;
        name: string;
        sku_base?: string | null;
        categories?: { name: string } | { name: string }[] | null;
        product_prices?: { price: number }[] | null;
        product_sizes?: { size_id: number; stock: number }[] | null;
    };
    const products = (await getProducts()) as ProductRow[];
    const getTotalStock = (p: ProductRow) => {
        const rows = Array.isArray(p.product_sizes) ? p.product_sizes : [];
        return rows.reduce((acc: number, r: { size_id: number; stock: number }) => acc + Number(r.stock || 0), 0);
    };
    const getSizeSummary = (p: ProductRow) => {
        const rows = Array.isArray(p.product_sizes) ? p.product_sizes : [];
        const dict: Record<number, number> = {};
        rows.forEach((r: { size_id: number; stock: number }) => {
            const k = Number(r.size_id);
            dict[k] = (dict[k] || 0) + Number(r.stock || 0);
        });
        const order = [2, 3, 4, 5, 6, 7, 8];
        const names: Record<number, string> = { 2: 'XS', 3: 'S', 4: 'M', 5: 'L', 6: 'XL', 7: 'XXL', 8: 'ST' };
        return order
            .filter((k) => dict[k] !== undefined)
            .map((k) => `${names[k]}:${dict[k]}`)
            .join(' · ');
    };

    async function deleteProductAction(formData: FormData) {
        "use server";
        const id = Number(formData.get("product_id"));
        if (!id) return;
        const supabase = await createClient();
        await supabase.from("product_sizes").delete().eq("product_id", id);
        await supabase.from("product_prices").delete().eq("product_id", id);
        await supabase.from("images").delete().eq("product_id", id);
        await supabase.from("products").delete().eq("product_id", id);
        revalidatePath("/admin/products");
    }
    return (
        <div className="grid gap-4">
            <div className="flex items-center gap-4">
                <Link href="/admin">
                    <Button variant="outline" size="icon" className="h-9 w-9">
                        <ChevronLeft className="h-5 w-5" />
                        <span className="sr-only">Volver</span>
                    </Button>
                </Link>
                <h1 className="text-lg font-semibold md:text-2xl">Productos</h1>
                <div className="ml-auto">
                    <Link href="/admin/products/new">
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            <span className="hidden md:inline">Agregar Producto</span>
                            <span className="md:hidden">Agregar</span>
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Desktop View */}
            <Card className="hidden md:block">
                <CardHeader>
                    <CardTitle>Todos los Productos</CardTitle>
                    <CardDescription>Gestioná el inventario.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>SKU</TableHead>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Categoría</TableHead>
                                <TableHead>Precio</TableHead>
                                <TableHead>Stock</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((product) => (
                                <TableRow key={product.product_id}>
                                    <TableCell className="font-mono text-xs">{product.sku_base || '-'}</TableCell>
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell>
                                        {Array.isArray(product.categories)
                                            ? product.categories.map((c: { name: string }) => c.name).join(', ')
                                            : (product.categories as { name: string } | null)?.name || '-'}
                                    </TableCell>
                                    <TableCell>
                                        {Array.isArray(product.product_prices) && product.product_prices.length > 0
                                            ? `$${Number(product.product_prices[0].price || 0).toFixed(2)}`
                                            : '-'}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{getTotalStock(product)}</span>
                                            <span className="text-xs text-muted-foreground">{getSizeSummary(product) || '-'}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Link href={`/admin/products/${product.product_id}/edit`}>
                                            <Button variant="ghost" size="sm">Editar / Stock</Button>
                                        </Link>
                                        <DeleteConfirmButton 
                                            id={product.product_id} 
                                            action={deleteProductAction} 
                                            inputName="product_id" 
                                            className="ml-2"
                                            title="¿Eliminar producto?"
                                            description={`¿Estás seguro de que querés eliminar "${product.name}"? Esta acción borrará el producto, su stock y sus imágenes.`}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                            {products.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                                        No hay productos. Creá uno para empezar.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Mobile View */}
            <div className="grid gap-4 md:hidden">
                {products.length === 0 ? (
                     <div className="text-center text-muted-foreground p-8 bg-muted/40 rounded-lg">
                        No hay productos. Creá uno para empezar.
                    </div>
                ) : (
                    products.map((product) => (
                        <Card key={product.product_id}>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base font-bold">{product.name}</CardTitle>
                                <CardDescription className="font-mono text-xs">SKU: {product.sku_base || '-'}</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Precio:</span>
                                    <span className="font-medium">
                                        {Array.isArray(product.product_prices) && product.product_prices.length > 0
                                            ? `$${Number(product.product_prices[0].price || 0).toFixed(2)}`
                                            : '-'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Categoría:</span>
                                    <span>
                                        {Array.isArray(product.categories)
                                            ? product.categories.map((c: { name: string }) => c.name).join(', ')
                                            : (product.categories as { name: string } | null)?.name || '-'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Stock total:</span>
                                    <span className="font-medium">{getTotalStock(product)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Por talle:</span>
                                    <span>{getSizeSummary(product) || '-'}</span>
                                </div>
                                <div className="pt-2">
                                    <Link href={`/admin/products/${product.product_id}/edit`}>
                                        <Button variant="outline" className="w-full">Editar / Stock</Button>
                                    </Link>
                                    <DeleteConfirmButton 
                                        id={product.product_id} 
                                        action={deleteProductAction} 
                                        inputName="product_id" 
                                        className="w-full mt-2"
                                        title="¿Eliminar producto?"
                                        description={`¿Estás seguro de que querés eliminar "${product.name}"?`}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
