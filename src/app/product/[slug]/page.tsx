import { notFound } from "next/navigation";
import { getProductBySlug, getFeaturedProducts } from "@/services/products";
import { supabase } from "@/lib/supabase";
import ProductSizeSelector from "@/components/product-size-selector";
// import { Button } from "@/components/ui/button";
import ProductCard from "@/components/product-card";
import ProductGallery from "@/components/product-gallery";

type Params = { slug: string };

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) return notFound();

  // Fetch related products (just featured for now)
  const relatedProducts = await getFeaturedProducts();

  // Fetch stock per size for this product
  const { data: sizeRows } = await supabase
    .from('product_sizes')
    .select('size_id,stock')
    .eq('product_id', product.product_id);
  const stockBySizeId: Record<number, number> = {};
  (sizeRows || []).forEach((r: { size_id: number; stock: number }) => { stockBySizeId[r.size_id] = Number(r.stock) || 0; });
  const sizes = [
    { size_id: 2, name: 'XS' },
    { size_id: 3, name: 'S' },
    { size_id: 4, name: 'M' },
    { size_id: 5, name: 'L' },
    { size_id: 6, name: 'XL' },
    { size_id: 7, name: 'XXL' },
  ];
  const hasAnySizeStock = (sizeRows || []).some((r: { size_id: number; stock: number }) => r.size_id !== 8);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <div className="flex flex-wrap gap-2 mb-8 text-sm text-muted-foreground">
        <span>Inicio</span>
        <span>/</span>
        <span>Producto</span>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Gallery */}
        <ProductGallery images={product.images} productName={product.name} />

        {/* Info */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tight">{product.name}</h1>
            <p className="text-sm text-muted-foreground mt-2">Ref. {product.slug}</p>
          </div>
          <div className="flex items-baseline gap-4">
            <p className="text-4xl font-bold text-primary">${product.price.toFixed(2)}</p>
            {/* <p className="text-xl line-through text-muted-foreground">$75.00</p> */}
          </div>
          <p className="text-muted-foreground">
            Selecciona opciones y agrega al carrito.
          </p>
          {hasAnySizeStock && (
            <ProductSizeSelector sizes={sizes} stockBySizeId={stockBySizeId} productId={product.product_id} price={product.price} />
          )}
        </div>
      </div>

      {/* Related */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">También te podría interesar</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {relatedProducts.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
