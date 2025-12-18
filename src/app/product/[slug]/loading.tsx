export default function ProductLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs Skeleton */}
      <div className="flex gap-2 mb-8">
        <div className="h-4 w-12 bg-muted animate-pulse rounded" />
        <div className="h-4 w-4 bg-muted animate-pulse rounded" />
        <div className="h-4 w-16 bg-muted animate-pulse rounded" />
        <div className="h-4 w-4 bg-muted animate-pulse rounded" />
        <div className="h-4 w-32 bg-muted animate-pulse rounded" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Gallery Skeleton */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square w-full bg-muted animate-pulse rounded-lg" />
          {/* Thumbnails */}
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 w-24 bg-muted animate-pulse rounded-md shrink-0" />
            ))}
          </div>
        </div>

        {/* Info Skeleton */}
        <div className="flex flex-col gap-6">
          <div>
            <div className="h-10 w-3/4 bg-muted animate-pulse rounded mb-2" />
            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
          </div>
          
          <div className="h-10 w-32 bg-muted animate-pulse rounded" />
          
          <div className="space-y-2">
            <div className="h-4 w-full bg-muted animate-pulse rounded" />
            <div className="h-4 w-2/3 bg-muted animate-pulse rounded" />
          </div>

          {/* Size Selector Skeleton */}
          <div className="space-y-3 pt-4">
            <div className="h-5 w-24 bg-muted animate-pulse rounded" />
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-10 w-12 bg-muted animate-pulse rounded border" />
              ))}
            </div>
          </div>

          {/* Add to Cart Button Skeleton */}
          <div className="pt-4">
            <div className="h-12 w-full bg-muted animate-pulse rounded-lg" />
          </div>
        </div>
      </div>

      {/* Related Products Skeleton */}
      <div className="mt-16">
        <div className="h-8 w-64 bg-muted animate-pulse rounded mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-[3/4] w-full bg-muted animate-pulse rounded-lg" />
              <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
              <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
