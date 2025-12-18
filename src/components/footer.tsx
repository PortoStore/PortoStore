"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
// AQUÍ ESTABA EL ERROR: Agregué la } antes del from
import { Instagram, MapPin, Mail, Clock, ExternalLink, Lock, HelpCircle, FileText, Scale, LifeBuoy, MessageCircleQuestion } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default function Footer() {
  const pathname = usePathname();
  const [address, setAddress] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("store_settings")
        .select("address,email")
        .eq("id", 1)
        .maybeSingle();
      
      if (!cancelled) {
        if (data) {
          const d = data as { address?: string | null; email?: string | null };
          if (d.address) setAddress(d.address);
          if (d.email) setEmail(d.email);
        }
        setIsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (pathname?.startsWith("/admin")) return null;

  const [line1, line2] = (() => {
    if (!address) return ["", ""];
    const parts = address.split(",").map(s => s.trim());
    if (parts.length >= 2) return [parts[0], parts.slice(1).join(", ")];
    return [address, ""];
  })();

  return (
    <footer className="border-t bg-background pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* GRID: 3 Columnas limpias */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-8 items-start">
          
          {/* COLUMNA 1: MARCA (Texto en vez de Logo) */}
          <div className="flex flex-col items-start gap-4">
            <div>
                {/* SOLUCIÓN AL LOGO: Usar tipografía "Black" (muy gruesa) */}
                <h2 className="text-2xl font-black tracking-tighter uppercase text-foreground">
                    PORTO STORE
                </h2>
                
            </div>
            
            <Link 
              href="https://www.instagram.com/portostoreok/" 
              target="_blank" 
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-all text-sm font-medium group mt-2"
            >
              <Instagram className="size-4 group-hover:scale-110 transition-transform" />
              <span>Seguinos en Instagram</span>
            </Link>
          </div>

        {/* COLUMNA 2: INFO (Con Iconos en todos) */}
          <div className="md:pl-8 lg:pl-12">
            <h3 className="font-semibold text-foreground mb-6 text-base">Información</h3>
            <ul className="space-y-4 text-sm text-muted-foreground">
              
              {/* Política de Devolución */}
              <li>
                <Link className="hover:text-primary transition-colors flex items-center gap-2 group" href="/returns">
                    <FileText className="size-4 opacity-70 group-hover:opacity-100 transition-opacity" /> 
                    <span>Política de Devolución</span>
                </Link>
              </li>
              
              {/* Términos y Condiciones */}
              <li>
                <Link className="hover:text-primary transition-colors flex items-center gap-2 group" href="/returns#terminos">
                    <Scale className="size-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                    <span>Términos y Condiciones</span>
                </Link>
              </li>

               {/* Centro de Ayuda */}
              <li>
                <Link className="hover:text-primary transition-colors flex items-center gap-2 group" href="/help">
                    <LifeBuoy className="size-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                    <span>Centro de Ayuda</span>
                </Link>
              </li>

              {/* Preguntas Frecuentes */}
              <li>
                <Link className="hover:text-primary transition-colors flex items-center gap-2 group" href="/help#faq">
                    <MessageCircleQuestion className="size-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                    <span>Preguntas Frecuentes</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMNA 3: CONTACTO (Sin tarjeta, estilo limpio) */}
          <div className="space-y-6">
            <h3 className="font-semibold text-foreground text-base mb-6">Visítanos</h3>
            
            <div className="flex gap-3 items-start">
              <MapPin className="size-5 text-primary shrink-0 mt-0.5" /> 
              <div className="text-sm text-muted-foreground w-full">
                <p className="font-medium text-foreground mb-1">Sucursal Posadas</p>
                {isLoading ? (
                  <div className="space-y-2 mt-1">
                    <div className="h-4 w-3/4 bg-muted animate-pulse rounded"></div>
                    <div className="h-4 w-1/2 bg-muted animate-pulse rounded"></div>
                  </div>
                ) : (
                  <>
                    <p>{line1}</p>
                    {line2 && <p>{line2}</p>}
                  </>
                )}
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <Clock className="size-5 text-primary shrink-0 mt-0.5" /> 
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">Horarios de Atención</p>
                <p>Lunes a Sábado</p>
                <p>10:00 a 21:00 hs (De corrido)</p>
              </div>
            </div>

            <div className="flex gap-3 items-center pt-2">
               <Mail className="size-5 text-primary shrink-0" />
               {isLoading ? (
                  <div className="h-4 w-48 bg-muted animate-pulse rounded"></div>
               ) : (
                 <a href={`mailto:${email}`} className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">
                   {email || "ventas@tiendaportostore.com"}
                 </a>
               )}
            </div>
          </div>
        
        </div>

        {/* CREDITOS */}
        <div className="mt-16 pt-8 border-t flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground gap-4">
          <p>© {new Date().getFullYear()} Porto Store Todos los derechos reservados.</p>
          
          <div className="flex items-center gap-6">
            <Link 
                href="/admin" 
                className="opacity-30 hover:opacity-100 transition-opacity p-2"
                title="Acceso Administrativo"
            >
                <Lock className="size-3" />
            </Link>
            
            <div className="flex items-center gap-1">
                <span>Desarrollado por</span>
                <Link 
                href="https://soft3ch.com" 
                className="font-bold text-foreground hover:text-primary transition-colors flex items-center gap-1"
                target="_blank"
                rel="noopener noreferrer"
                >
                Soft3ch <ExternalLink className="size-3" />
                </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}