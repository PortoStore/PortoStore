"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Instagram, MapPin, Mail, Clock, ExternalLink, Lock } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="border-t bg-background pt-12 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* GRID: 3 Columnas distribuidas equitativamente */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          
          {/* COLUMNA 1: LOGO + INSTAGRAM */}
          <div className="flex flex-col items-start gap-6">
            {/* Logo */}
            <div className="relative h-10 w-40">
               <Image 
                  src="/PORTO - 2.PNG" 
                  alt="PortoStore" 
                  fill 
                  className="object-contain object-left" 
               />
            </div>
            
            {/* Botón Instagram (Más visible para compensar falta de texto) */}
            <Link 
              href="https://www.instagram.com/portostoreok/" 
              target="_blank" 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 hover:bg-primary hover:text-primary-foreground transition-all text-sm font-medium group"
            >
              <Instagram className="size-4 group-hover:scale-110 transition-transform" />
              <span>Seguinos en Instagram</span>
            </Link>
          </div>

          {/* COLUMNA 2: AYUDA (Centrada visualmente) */}
          <div className="md:pl-12"> {/* Un poco de padding para empujarlo al centro visual exacto */}
            <h3 className="font-semibold text-foreground mb-4 text-base">Ayuda</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link className="hover:text-primary transition-colors block w-fit" href="/contact">Contacto</Link></li>
              <li><Link className="hover:text-primary transition-colors block w-fit" href="/returns">Politica de Devolución</Link></li>
              <li><Link className="hover:text-primary transition-colors block w-fit" href="/faq">Preguntas Frecuentes</Link></li>
              <li><Link className="hover:text-primary transition-colors block w-fit" href="/terms">Términos y Condiciones</Link></li>
            </ul>
          </div>

          {/* COLUMNA 3: TARJETA DE VISITA (Mantiene el peso visual a la derecha) */}
          <div className="bg-secondary/20 p-6 rounded-xl border border-border/40 space-y-5">
            <div>
              <h3 className="font-semibold flex items-center gap-2 text-base mb-2">
                <MapPin className="size-4 text-primary" /> Visítanos
              </h3>
              <div className="text-sm text-muted-foreground pl-6">
                <p>Entre Ríos 1420</p>
                <p>Posadas, Misiones</p>
              </div>
            </div>

            <div>
               <h3 className="font-semibold flex items-center gap-2 text-base mb-2">
                <Clock className="size-4 text-primary" /> Horarios
              </h3>
              <div className="text-sm text-muted-foreground pl-6">
                <p>Lunes a Sábado</p>
                <p className="font-medium text-primary">10:00 a 21:00 hs (De corrido)</p>
              </div>
            </div>

            <div className="pt-2 border-t border-border/40">
               <a href="mailto:info@portostore.com" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mt-2">
                 <Mail className="size-4" /> tiendaportostore@gmail.com
               </a>
            </div>
          </div>
        
        </div>

        {/* CREDITOS */}
        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground gap-4">
          <p>© {new Date().getFullYear()} PortoStore. Todos los derechos reservados.</p>
          <Link 
              href="/admin" 
              className="opacity-20 hover:opacity-100 transition-opacity p-1"
              title="Acceso Administrativo"
            >
              <Lock className="size-3" />
            </Link>
          <div className="flex items-center gap-1">
            <span>Desarrollado por</span>
            <Link 
              href="https://soft3ch.com" 
              className="font-bold text-primary hover:underline flex items-center gap-1"
              target="_blank"
            >
              Soft3ch <ExternalLink className="size-3" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}