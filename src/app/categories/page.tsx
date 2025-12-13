import Link from "next/link";
import Image from "next/image";
import { getCategories } from "@/services/products";

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Categorías</h1>
        <p className="text-muted-foreground">Explora nuestra colección por categoría.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link 
            key={category.title} 
            href={`/category/${encodeURIComponent(category.title)}`}
            className="group relative overflow-hidden rounded-xl bg-muted aspect-[4/3] block"
          >
            <Image
              src={category.image}
              alt={category.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-colors group-hover:bg-black/50">
              <h2 className="text-2xl font-bold text-white tracking-wide">{category.title}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
