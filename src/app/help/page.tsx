import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";

export default function HelpPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Centro de Ayuda</h1>

      <div className="grid gap-12">
        {/* Contact Info */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Contáctanos</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/50">
              <div className="p-3 rounded-full bg-primary/10 mb-3">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium mb-1">Teléfono</h3>
              <p className="text-sm text-muted-foreground">+54 9 376 436-6511</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/50">
              <div className="p-3 rounded-full bg-primary/10 mb-3">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium mb-1">WhatsApp</h3>
              <p className="text-sm text-muted-foreground">376 436-6511</p>
            </div>

            <div className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/50">
              <div className="p-3 rounded-full bg-primary/10 mb-3">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium mb-1">Email</h3>
              <p className="text-sm text-muted-foreground">tiendaportostore@gmail.com</p>
            </div>

            <div className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/50">
              <div className="p-3 rounded-full bg-primary/10 mb-3">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium mb-1">Ubicación</h3>
              <p className="text-sm text-muted-foreground">Entre Rios 1420, Posadas, Misiones</p>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Preguntas Frecuentes</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>¿Cuáles son los tiempos de envío?</AccordionTrigger>
              <AccordionContent>
                Realizamos envíos a todo el país. Los tiempos de entrega varían según la ubicación, pero generalmente demoran entre 3 y 7 días hábiles desde que se confirma el pago.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>¿Qué métodos de pago aceptan?</AccordionTrigger>
              <AccordionContent>
                Transferencias bancarias y pagos en efectivo en el local.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>¿Cómo puedo realizar un cambio?</AccordionTrigger>
              <AccordionContent>
                Si necesitas realizar un cambio, contáctanos dentro de los 10 días de realizada la compra. El producto debe estar en perfectas condiciones y con su etiqueta original. Los costos de envío por cambio corren por cuenta del cliente, salvo por fallas de fábrica.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>¿Tienen local físico?</AccordionTrigger>
              <AccordionContent>
                Tenemos un local ubicado en Entre Rios 1420, Posadas, Misiones.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>¿Tienen redes sociales?</AccordionTrigger>
              <AccordionContent>
                Sí, encontranos en instagram como <a href="https://www.instagram.com/portostoreok/" target="_blank" rel="noopener noreferrer">@portostoreok</a>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </div>
    </div>
  );
}
