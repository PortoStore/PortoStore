"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { addCartItem } from "@/lib/utils";

type Size = { size_id: number; name: string };

export default function ProductSizeSelector({ sizes, stockBySizeId, productId, price }: { sizes: Size[]; stockBySizeId: Record<number, number>; productId: number; price: number }) {
  const [selectedSizeId, setSelectedSizeId] = useState<number | null>(null);
  const currentStock = selectedSizeId ? (stockBySizeId[selectedSizeId] || 0) : 0;
  const canAdd = selectedSizeId !== null && currentStock > 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-4 gap-3">
        {sizes.map((s) => {
          const stock = stockBySizeId[s.size_id] || 0;
          const disabled = stock <= 0;
          const active = selectedSizeId === s.size_id;
          return (
            <button
              key={s.size_id}
              type="button"
              disabled={disabled}
              onClick={() => {
                setSelectedSizeId(s.size_id);
              }}
              className={`p-3 rounded-lg border text-sm transition ${active ? 'border-primary' : ''} ${disabled ? 'border-destructive text-destructive' : 'hover:border-primary'}`}
            >
              <span className="inline-flex items-center gap-1">
                {s.name}
                {disabled && <X className="size-3" />}
              </span>
            </button>
          );
        })}
      </div>
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <Button
          className="flex-grow"
          disabled={!canAdd}
          onClick={() => {
            if (!canAdd || selectedSizeId === null) return;
            addCartItem({ product_id: productId, size_id: selectedSizeId, qty: 1, price_snapshot: price });
          }}
        >
          Agregar al Carrito
        </Button>
      </div>
      {selectedSizeId !== null && currentStock === 0 && (
        <p className="text-sm text-destructive">Sin stock para el talle seleccionado.</p>
      )}
    </div>
  );
}
