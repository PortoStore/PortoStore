import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

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
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
