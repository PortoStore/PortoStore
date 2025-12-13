"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const fallbackImage = "https://images.unsplash.com/photo-1557821552-17105176677c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHNob3BwaW5nfGVufDB8fDB8fHww";
  const displayImages = images.length > 0 ? images : [fallbackImage];
  
  const [selectedImage, setSelectedImage] = useState(displayImages[0]);

  return (
    <div className="flex flex-col md:flex-row-reverse gap-4">
      <div className="flex-grow">
        <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-muted">
          <Image
            src={selectedImage}
            alt={productName}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
      <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
        {displayImages.map((src, i) => (
          <button
            key={i}
            type="button"
            className={cn(
              "relative size-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0",
              selectedImage === src ? "border-primary" : "border-transparent hover:border-muted"
            )}
            onClick={() => setSelectedImage(src)}
          >
            <Image
              src={src}
              alt={`${productName} ${i + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
