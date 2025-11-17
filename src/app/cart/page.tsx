import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const items = [
  {
    name: "Camisa de Lino",
    price: 45,
    meta: "Color: Blanco, Talla: M",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBvocv1fQgVksxvQOUqiVrehVXWDZt8rysivqlfTpM9bAXWN7y18XaCOw0eC4VORBk32UdRG0W7ShuN2pgZl0y8sduicDhSNKOSriKJKGjd-R-QLBsee0JMEDlEsCSBuunjoCkGuSIVjAFz-9j-j-FOMZAOUlxjvzg-ietbdfyrmgkUAbdKYy3YaljW-Vd7ZkokbNPiF5Jgh3BT7qlRoHtGDbIWiUuB_HR0xuyvfLZsgEIBExlGUt2bPYb1w7nE28S2XH5-Inuu1ezr",
  },
  {
    name: "Pantalón Chino",
    price: 60,
    meta: "Color: Azul Marino, Talla: 32",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDQ1zViT7U9p4qrT7Qr1tf2TobK7eLiCjsQ0UMcXk19SJKSgOTPPOEefrjTBFoMt_iuqoO9m6js6P44586qCDFXxBMO6qEdOzasF2Ode6l9591mME9f6KxTitiNv0AjQ5p_0rA1ADwXtjN2U1pB9jeRObmBI0s-V0-oplA-WcYW20xd_-xzy0Y5uzRxf_plw-1p-V-NrH5LWEv42gKyUTGnLyPbuAkNUMlgz7OM3yIMc8Bo9n5NVmg9BoAZbER1k9SPAe2PDZd4-NXG",
  },
];

export default function CartPage() {
  const subtotal = items.reduce((acc, i) => acc + i.price, 0);
  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Lista de productos */}
        <div className="w-full lg:w-2/3">
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">Mi Carrito</h1>
            <p className="text-muted-foreground mt-2">Revisa los productos en tu carrito.</p>
          </div>
          <div className="flex flex-col gap-4">
            {items.map((item, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg border">
                <div className="flex w-full sm:w-auto items-start gap-4">
                  <div className="relative size-[80px] rounded-lg overflow-hidden">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col justify-center">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">{item.meta}</p>
                  </div>
                </div>
                <div className="flex flex-1 items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <button className="h-8 w-8 rounded-full border">-</button>
                    <input className="w-8 text-center bg-transparent" defaultValue={1} />
                    <button className="h-8 w-8 rounded-full border">+</button>
                  </div>
                  <p className="font-semibold">${item.price.toFixed(2)}</p>
                  <button className="text-muted-foreground hover:text-red-500">Eliminar</button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link className="text-sm font-medium text-primary" href="/">Ver más productos</Link>
            <button className="text-sm font-medium text-muted-foreground hover:text-red-500">Vaciar Carrito</button>
          </div>
        </div>

        {/* Resumen */}
        <div className="w-full lg:w-1/3">
          <div className="p-6 rounded-lg border sticky top-24">
            <h2 className="text-xl font-bold pb-4 border-b">Resumen del Pedido</h2>
            <div className="py-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Envío</span>
                <span className="text-muted-foreground">A calcular</span>
              </div>
            </div>
            <div className="py-4 flex justify-between border-t">
              <span className="text-base font-bold">Total</span>
              <span className="text-xl font-bold">${subtotal.toFixed(2)}</span>
            </div>
            <Link href="/checkout">
              <Button className="w-full mt-2">Iniciar Compra</Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}