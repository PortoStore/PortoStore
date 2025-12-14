import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function HelpPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold tracking-tight mb-2">Centro de Ayuda</h1>
      <p className="text-muted-foreground mb-10">
        Estamos acá para ayudarte. Contactanos o buscá tu respuesta abajo.
      </p>

      <div className="grid gap-16">
        
        {/* --- SECCIÓN 1: CONTACTO --- */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Canales de Atención</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            
            {/* Teléfono */}
            <div className="flex flex-col items-center text-center p-6 rounded-xl bg-card border shadow-sm">
              <div className="p-3 rounded-full bg-primary/10 mb-4">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium mb-1">Teléfono</h3>
              <p className="text-sm text-muted-foreground">+54 9 376 436-6511</p>
            </div>
            
            {/* WhatsApp (Link directo) */}
            <a 
              href="https://wa.me/5493764366511?text=Hola!%20Necesito%20ayuda" 
              target="_blank" 
              className="flex flex-col items-center text-center p-6 rounded-xl bg-card border shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="p-3 rounded-full bg-green-100 mb-4">
                <MessageCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-medium mb-1">WhatsApp</h3>
              <p className="text-sm text-muted-foreground">Enviar mensaje</p>
            </a>

            {/* Email (Link directo) */}
            <a 
              href="mailto:tiendaportostore@gmail.com" 
              className="flex flex-col items-center text-center p-6 rounded-xl bg-card border shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="p-3 rounded-full bg-primary/10 mb-4">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium mb-1">Email</h3>
              <p className="text-sm text-muted-foreground break-all">tiendaportostore@gmail.com</p>
            </a>

            {/* Ubicación */}
            <div className="flex flex-col items-center text-center p-6 rounded-xl bg-card border shadow-sm">
              <div className="p-3 rounded-full bg-primary/10 mb-4">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium mb-1">Sucursal</h3>
              <p className="text-sm text-muted-foreground">Entre Rios 1420<br/>Posadas, Misiones</p>
            </div>
          </div>
        </section>

        {/* --- SECCIÓN 2: PREGUNTAS FRECUENTES (FAQ) --- */}
        {/* Mantenemos el id="faq" para que el footer funcione */}
        <section id="faq" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold mb-6">Preguntas Frecuentes</h2>
          <Accordion type="single" collapsible className="w-full">
            
            <AccordionItem value="item-1">
              <AccordionTrigger>¿Cuáles son los tiempos de envío?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Realizamos envíos a todo el país. Los tiempos de entrega varían según la ubicación, pero generalmente demoran entre 3 y 7 días hábiles desde que se confirma el pago.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger>¿Qué métodos de pago aceptan?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Aceptamos transferencias bancarias y pagos en efectivo al retirar en nuestro local.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger>¿Cómo puedo realizar un cambio?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Si necesitas realizar un cambio, debes hacerlo dentro de los 10 días de realizada la compra. 
                <br className="mb-2"/>
                Para ver los requisitos detallados, visitá nuestra sección de <Link href="/returns" className="text-primary hover:underline font-medium">Políticas de Devolución</Link>.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger>¿Tienen local físico?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Sí, nuestro local está ubicado en Entre Rios 1420, Posadas, Misiones.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>¿Dónde veo los Términos y Condiciones?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Podés leer nuestros términos y condiciones completos haciendo <Link href="/returns#terminos" className="text-primary hover:underline font-medium">clic aquí</Link>.
              </AccordionContent>
            </AccordionItem>

          </Accordion>
        </section>

      </div>
    </div>
  );
}