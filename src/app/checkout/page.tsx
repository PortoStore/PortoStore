import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CheckoutPage() {
  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="flex flex-wrap gap-2 mb-8 text-sm">
        <span className="text-primary">Carrito</span>
        <span className="text-muted-foreground">/</span>
        <span>Envío</span>
        <span className="text-muted-foreground">/</span>
        <span className="text-muted-foreground">Facturación</span>
        <span className="text-muted-foreground">/</span>
        <span className="text-muted-foreground">Pago</span>
      </div>
      <p className="text-4xl font-black tracking-tight mb-6">Finalizar Compra</p>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 flex flex-col gap-6">
          <details className="rounded-xl border p-4 group" open>
            <summary className="flex cursor-pointer items-center justify-between gap-6 list-none">
              <p className="text-lg font-bold">1. Información de Envío</p>
              <span className="rotate-0 group-open:rotate-180 transition-transform">⌄</span>
            </summary>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-sm font-medium mb-1" htmlFor="email">Email</label>
                <Input id="email" placeholder="tu@email.com" type="email" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1" htmlFor="firstName">Nombre</label>
                <Input id="firstName" placeholder="Juan" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1" htmlFor="lastName">Apellido</label>
                <Input id="lastName" placeholder="Pérez" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-medium mb-1" htmlFor="address">Dirección</label>
                <Input id="address" placeholder="Av. Siempre Viva 742" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1" htmlFor="city">Ciudad</label>
                <Input id="city" placeholder="Springfield" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1" htmlFor="postalCode">Código Postal</label>
                <Input id="postalCode" placeholder="B1636" />
              </div>
            </div>
          </details>
          <details className="rounded-xl border p-4 group">
            <summary className="flex cursor-pointer items-center justify-between gap-6 list-none">
              <p className="text-lg font-bold">2. Datos de Facturación</p>
              <span className="rotate-0 group-open:rotate-180 transition-transform">⌄</span>
            </summary>
            <div className="mt-6">
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" className="size-4" />
                Mis datos de facturación son los mismos que los de envío.
              </label>
            </div>
          </details>
          <details className="rounded-xl border p-4 group">
            <summary className="flex cursor-pointer items-center justify-between gap-6 list-none">
              <p className="text-lg font-bold">3. Método de Pago</p>
              <span className="rotate-0 group-open:rotate-180 transition-transform">⌄</span>
            </summary>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-3">
                <label className="text-sm font-medium mb-1" htmlFor="card-number">Número de Tarjeta</label>
                <Input id="card-number" placeholder="•••• •••• •••• ••••" />
              </div>
              <div className="sm:col-span-3">
                <label className="text-sm font-medium mb-1" htmlFor="card-name">Nombre en la Tarjeta</label>
                <Input id="card-name" placeholder="Juan Pérez" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-medium mb-1" htmlFor="expiration-date">Fecha de Vencimiento (MM/AA)</label>
                <Input id="expiration-date" placeholder="MM/AA" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1" htmlFor="cvc">CVC</label>
                <Input id="cvc" placeholder="123" />
              </div>
            </div>
          </details>
          <Button className="w-full">Finalizar Compra</Button>
        </div>
        <div className="lg:col-span-5">
          <div className="sticky top-28 rounded-xl border p-6">
            <h2 className="text-xl font-bold mb-6">Resumen del Pedido</h2>
            <ul className="space-y-4 text-sm">
              <li className="flex justify-between"><span>Remera Básica Blanca</span><span>$32.00</span></li>
              <li className="flex justify-between"><span>Jean Azul Clásico</span><span>$90.00</span></li>
            </ul>
            <div className="mt-8 pt-6 border-t space-y-2 text-sm">
              <div className="flex items-center gap-2 mb-2">
                <Input placeholder="Código de descuento" />
                <Button variant="secondary">Aplicar</Button>
              </div>
              <div className="flex justify-between"><span>Subtotal</span><span>$122.00</span></div>
              <div className="flex justify-between"><span>Envío</span><span>$8.00</span></div>
              <div className="flex justify-between text-base font-bold border-t pt-4 mt-4"><span>Total</span><span>$130.00</span></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}