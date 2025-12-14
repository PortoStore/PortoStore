import Link from "next/link";
import { getCategories } from "@/services/products";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react"; // Asegúrate de tener lucide-react instalado

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="mb-10 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Categorías</h1>
        <p className="text-muted-foreground text-lg">
          Explora todo nuestro catálogo organizado alfabéticamente.
        </p>
      </div>

      {/* Grid adaptable: 2 columnas en móvil, 3 en tablet, 4 en PC */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((category) => (
          <Link 
            key={category.title} 
            href={`/category/${encodeURIComponent(category.title)}`}
            className="group block h-full"
          >
            <Card className="h-full hover:border-black/50 hover:shadow-sm transition-all duration-200 cursor-pointer bg-card">
              <CardContent className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Círculo con la inicial (Generado por código, sin imagen) */}
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center shrink-0 group-hover:bg-black group-hover:text-white transition-colors duration-300">
                    <span className="text-lg font-bold">
                      {category.title.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  
                  {/* Nombre de la categoría */}
                  <span className="font-semibold text-lg leading-tight group-hover:text-black/80">
                    {category.title}
                  </span>
                </div>

                {/* Flechita indicadora */}
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-black group-hover:translate-x-1 transition-all" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      
      {categories.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          No hay categorías disponibles en este momento.
        </div>
      )}
    </div>
  );
}