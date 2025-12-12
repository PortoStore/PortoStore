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
      <div id="home-hero" className="relative w-full">
        {/* Mobile Hero (Original) */}
        <div
            className="md:hidden relative w-full h-[60vh] flex items-center justify-center text-center"
        >
            <Image
            src="/imagenpage.jpg"
            alt="Modelos vistiendo ropa de la nueva colección"
            fill
            className="object-cover"
            priority
            />
            <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Desktop Hero (Split Screen) */}
        <div className="hidden md:flex h-screen w-full overflow-hidden">
    {/* Left: Content */}
    <div className="w-1/2 flex flex-col justify-center px-16 lg:px-24 bg-background z-10">
        <div className="relative h-40 w-full max-w-lg mb-8">
            <Image
                src="/PORTO - 2.PNG"
                alt="PortoStore"
                fill
                className="object-contain object-center" 
                priority
            />
        </div>
        
        {/* AQUÍ ESTÁ EL CAMBIO: */}
        <div className="flex justify-center w-full max-w-lg">
            <Button size="lg" asChild>
                <Link href="#featured-products">Ver Productos</Link>
            </Button>
        </div>
    </div>

            {/* Right: Image */}
            <div className="w-1/2 relative h-full bg-muted/20 flex items-center justify-center">
                <div className="relative w-[70%] h-[85%] rounded-2xl overflow-hidden shadow-2xl">
                    <Image
                        src="/imagenpage.jpg"
                        alt="Nueva Colección"
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-700"
                        priority
                    />
                </div>
            </div>
        </div>
      </div>

      {/* Productos Destacados */}
      <section id="featured-products" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-10">Productos Destacados</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featuredProducts.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* Banner promocional */}
      

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
