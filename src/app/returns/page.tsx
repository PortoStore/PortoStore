import React from "react";

export default function ReturnsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Políticas de Devolución</h1>
      
      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
        
        <section>
          <p className="text-lg font-medium mb-4">
            Podes realizar la devolución de tu producto comprado en Porto Store:
          </p>
          <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
            <li>
              En nuestro local en <strong>Entre Ríos 1420, Posadas, Misiones</strong>.
            </li>
            <li>
              Desde tu domicilio, escribiendo a la línea de atención al cliente <strong>376 436-651</strong> ¡Nosotros te atenderemos en breve!
            </li>
          </ol>
        </section>

        <section>
          <p className="text-lg font-medium mb-4">
            Los requisitos para realizar la devolución del producto que compraste en nuestra tienda son los siguientes:
          </p>
          <ol className="list-decimal pl-6 space-y-3 text-muted-foreground">
            <li>
              El producto debe estar <strong>sin uso y apto para la venta</strong>.
            </li>
            <li>
              Las devoluciones solo pueden ser realizadas si el producto fue recibido hace <strong>menos de 10 días</strong>, pasado ese tiempo <strong>NO</strong> se aceptará la devolución sin excepción.
            </li>
            <li>
              ¡El envío debe ser realizado vía <strong>Correo Argentino</strong>, <strong>NO</strong> se aceptan otros medios de envíos!
            </li>
            <li>
              Si el cambio es por un producto de menor valor, la diferencia quedará a favor del cliente en forma de cupón de descuento, válido para futuras compras.
            </li>
          </ol>
        </section>

        <section className="bg-muted/30 p-6 rounded-lg border">
          <p className="font-semibold text-center text-muted-foreground">
            Porto Store <strong>NO</strong> se hace cargo de los costos de los envíos ni de ida, ni de vuelta.
          </p>
        </section>

        <section className="text-center pt-4">
          <p className="italic text-muted-foreground">
            Por favor respete los requisitos y no comprometa al personal de trabajo. ¡Muchas gracias!
          </p>
        </section>

      </div>
    </div>
  );
}
