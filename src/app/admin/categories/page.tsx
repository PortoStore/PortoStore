import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import DeleteConfirmButton from "@/components/admin/delete-confirm-button";

export const dynamic = 'force-dynamic';

async function getCategories() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

    if (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
    return data;
}

export default async function AdminCategoriesPage() {
    const categories = await getCategories();
    async function deleteCategoryAction(formData: FormData) {
        "use server";
        const id = Number(formData.get("category_id"));
        if (!id) return;
        const supabase = await createClient();
        await supabase.from("products").update({ category_id: null }).eq("category_id", id);
        await supabase.from("categories").delete().eq("category_id", id);
        revalidatePath("/admin/categories");
    }

    return (
        <div className="grid gap-6 pb-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/admin">
                    <Button variant="outline" size="icon" className="h-9 w-9">
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                </Link>

                <h1 className="text-xl font-semibold md:text-2xl">Categorías</h1>

                <div className="ml-auto">
                    <Link href="/admin/categories/new">
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            <span className="hidden md:inline">Agregar Categoría</span>
                            <span className="md:hidden">Agregar</span>
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Desktop Table */}
            <Card className="hidden md:block">
                <CardHeader>
                    <CardTitle>Todas las Categorías</CardTitle>
                    <CardDescription>Gestioná las categorías de productos.</CardDescription>
                </CardHeader>

                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Nombre</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {categories.map((category) => (
                                <TableRow key={category.category_id}>
                                    <TableCell>{category.category_id}</TableCell>
                                    <TableCell className="font-medium">{category.name}</TableCell>
                                    <TableCell className="text-right">
                                        <Link href={`/admin/categories/${category.category_id}/edit`}>
                                            <Button variant="ghost" size="sm">Editar</Button>
                                        </Link>
                                        <DeleteConfirmButton 
                                            id={category.category_id} 
                                            action={deleteCategoryAction} 
                                            inputName="category_id" 
                                            className="ml-2"
                                            title="¿Eliminar categoría?"
                                            description={`¿Estás seguro de que querés eliminar "${category.name}"? Los productos en esta categoría se quedarán sin categoría.`}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}

                            {categories.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                                        No hay categorías. Creá una para empezar.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Mobile Cards */}
            <div className="grid gap-4 md:hidden">
                {categories.length === 0 ? (
                    <div className="text-center text-muted-foreground p-8 bg-muted/40 rounded-lg">
                        No hay categorías. Creá una para empezar.
                    </div>
                ) : (
                    categories.map((category) => (
                        <Card
                            key={category.category_id}
                            className="shadow-sm border rounded-xl"
                        >
                            <CardHeader className="pb-3 px-4">
                                <CardTitle className="text-lg font-semibold">{category.name}</CardTitle>
                                <CardDescription className="font-mono text-xs">
                                    ID: {category.category_id}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="px-4 pb-4">
                                <Link href={`/admin/categories/${category.category_id}/edit`}>
                                    <Button variant="outline" className="w-full">Editar</Button>
                                </Link>
                                <DeleteConfirmButton 
                                    id={category.category_id} 
                                    action={deleteCategoryAction} 
                                    inputName="category_id" 
                                    className="w-full mt-2"
                                    title="¿Eliminar categoría?"
                                    description={`¿Estás seguro de que querés eliminar "${category.name}"?`}
                                />
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
