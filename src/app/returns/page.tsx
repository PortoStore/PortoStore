import React from "react";
import { createClient } from "@/lib/supabase/server";
import { FileText, ShieldAlert } from "lucide-react"; // Agregué iconos para darle cariño visual

export default async function ReturnsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("store_settings")
    .select("address,phone")
    .eq("id", 1)
    .maybeSingle();
  const settings = (data as { address?: string | null; phone?: string | null } | null) || null;

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl scroll-smooth">
      
      {/* SECCIÓN 1: POLÍTICA DE DEVOLUCIÓN (Es lo primero que se ve) */}
      <h1 className="text-3xl font-bold mb-8 text-center">Políticas de Devolución</h1>
      
      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-12">
        
        <section>
          <div className="bg-muted/30 p-6 rounded-xl border mb-8">
            <p className="text-lg font-medium mb-4 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-primary" />
              ¿Cómo realizar una devolución?
            </p>
            <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
              <li>
                En nuestro local en <strong>{settings?.address || "Entre Ríos 1420, Posadas, Misiones"}</strong>.
              </li>
              <li>
                Desde tu domicilio, escribiendo a la línea de atención al cliente <strong>{settings?.phone || "376 436-6511"}</strong> ¡Nosotros te atenderemos en breve!
              </li>
            </ol>
          </div>

          <p className="text-lg font-medium mb-4">
            Requisitos obligatorios para la devolución:
          </p>
          <ol className="list-decimal pl-6 space-y-3 text-muted-foreground">
            <li>
              El producto debe estar <strong>sin uso y apto para la venta</strong>, con sus etiquetas originales.
            </li>
            <li>
              Las devoluciones solo se aceptan dentro de los <strong>10 días corridos</strong> de haber recibido el producto. Pasado ese tiempo, <strong>NO</strong> se aceptará la devolución sin excepción.
            </li>
            <li>
              Para envíos desde otras provincias: ¡El envío debe ser realizado vía <strong>Correo Argentino</strong> exclusivamente!
            </li>
            <li>
              Si el cambio es por un producto de menor valor, la diferencia quedará a favor del cliente mediante un cupón de crédito válido para futuras compras (sin fecha de vencimiento).
            </li>
          </ol>
        </section>

        <section className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg border border-orange-100 dark:border-orange-900/50">
          <p className="font-semibold text-center text-orange-800 dark:text-orange-200 text-sm">
            ⚠️ Importante: Porto Store <strong>NO</strong> se hace cargo de los costos de envío (ida o vuelta) .
          </p>
        </section>

        <hr className="my-12 border-gray-200" />

        {/* SECCIÓN 2: TÉRMINOS Y CONDICIONES 
            IMPORTANTE: El id="terminos" es lo que conecta con el Footer 
        */}
        <section id="terminos" className="scroll-mt-24">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
             <FileText className="w-6 h-6 text-primary" /> Términos y Condiciones
          </h2>
          
          <div className="space-y-6 text-muted-foreground text-sm leading-relaxed">
            <p>
              Bienvenido a Porto Store. Al realizar una compra en nuestro sitio web o local físico, usted acepta los siguientes términos y condiciones:
            </p>
            
            <div>
              <strong className="text-foreground block mb-1">1. Precios y Pagos</strong>
              Los precios publicados en la web son exclusivos para venta online. Los precios pueden sufrir modificaciones sin previo aviso. El precio se congela únicamente al momento de concretar el pago.
            </div>

            <div>
              <strong className="text-foreground block mb-1">2. Stock</strong>
              Todos los pedidos están sujetos a disponibilidad de stock. En el caso improbable de falta de stock tras la compra, nos comunicaremos para ofrecer un producto similar, esperar la reposición o realizar la devolución total del dinero.
            </div>

          

            <div>
               <strong className="text-foreground block mb-1">3. Envíos</strong>
               Los tiempos de envío son estimativos y dependen del correo. Porto Store no se responsabiliza por demoras ocasionadas por la empresa de logística, aunque asistiremos al cliente en el reclamo.
            </div>
          </div>
        </section>

      

      </div>
    </div>
  );
}