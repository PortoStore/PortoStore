import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/product-card";
import { getCategoriesWithProducts, getFeaturedProducts } from "@/services/products";

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();
  const categoriesWithProducts = await getCategoriesWithProducts();
  const visibleCategories = categoriesWithProducts.filter((c) => c.products.length > 0);

  return (
    <div>
      {/* Hero */}
      <div
        className="relative w-full h-[60vh] md:h-[80vh] flex items-center justify-center text-center"
      >
        <Image
  src="/imagenhero.jpg"  // La ruta comienza con / que representa la carpeta public
  alt="Modelos vistiendo ropa de la nueva colección"
  fill
  className="object-cover"
  priority
/>
        <div className="absolute inset-0 bg-black/30" />
        
      </div>

      {/* Productos Destacados */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-10">Productos Destacados</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featuredProducts.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* Banner promocional */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="relative overflow-hidden rounded-xl min-h-[300px]">
          <Image
  src="/imagenhero.jpg"  // La ruta comienza con / que representa la carpeta public
  alt="Modelos vistiendo ropa de la nueva colección"
  fill
  className="object-cover"
  priority
/>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="relative z-10 p-8 text-white">
            <h3 className="text-4xl font-bold leading-tight mb-2">Rebajas de Fin de Temporada</h3>
            <p className="text-lg">Hasta 50% de descuento en artículos seleccionados.</p>
          </div>
        </div>
      </section>

      {/* Categorías con Productos */}
      {visibleCategories.map((category) => (
        <section key={category.title} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 border-t">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold">{category.title}</h2>
            <Button variant="outline" asChild>
              <Link href={`/category/${category.title}`}>Ver más</Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {category.products.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
