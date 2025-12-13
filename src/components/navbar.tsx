"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, ChevronDown, User, Loader2 } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetHeader } from "@/components/ui/sheet";
import ThemeToggle from "./theme-toggle";
import { getCartCount, cn } from "@/lib/utils";
import { getCategories } from "@/services/products";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [cartCount, setCartCount] = useState(() => getCartCount());
  const [isScrolled, setIsScrolled] = useState(true);
  const [isProductsOpen, setIsProductsOpen] = useState(false);

  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const onUpdate = () => setCartCount(getCartCount());
    window.addEventListener("storage", onUpdate);
    window.addEventListener("cart_updated", onUpdate as EventListener);
    return () => {
      window.removeEventListener("storage", onUpdate);
      window.removeEventListener("cart_updated", onUpdate as EventListener);
    };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const cs = await getCategories();
        setCategories(cs.map((c) => c.title));
      } catch (error) {
        console.error("Error cargando categorías", error);
      }
    })();
  }, []);

  useEffect(() => {
    if (!isHome) return;

    // Try to find the hero element
    const hero = document.getElementById("home-hero");
    if (!hero) { return; }

    const observer = new IntersectionObserver(
      ([entry]) => {
        // If not intersecting (scrolled past), show navbar
        setIsScrolled(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, [isHome, pathname]);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 border-b bg-background transition-all duration-500",
        isHome ? "md:fixed md:w-full md:border-b-0" : "",
        isHome && !isScrolled ? "md:-translate-y-full md:opacity-0" : "md:translate-y-0 md:opacity-100",
        isHome && isScrolled ? "md:bg-background/80 md:backdrop-blur-md md:border-b md:shadow-sm" : ""
      )}
    >
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between relative">
        
        {/* Izquierda: Logo */}
        <div className="flex items-center z-20"> 
          <Link href="/" className="flex items-center gap-2 font-bold">
            <div className="relative h-12 w-auto min-w-[120px]"> 
                <Image 
                    src="/PORTO - 2.PNG" 
                    alt="PortoStore" 
                    fill
                    className="object-contain object-left"
                    priority 
                />
            </div>
          </Link>
        </div>

        {/* Centro: Navegación */}
        {/* Nota: Como "Políticas de Devolución" es largo, vigilamos el espaciado */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium absolute left-1/2 -translate-x-1/2 whitespace-nowrap z-10">
          <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
          
          <Link href="/categories" className="hover:text-primary transition-colors">
            Categorías
          </Link>

          {/* CAMBIO 2: Texto cambiado */}
          <Link href="/returns" className="hover:text-primary transition-colors">
            Políticas de Devolución
          </Link>

          <Link href="/help" className="hover:text-primary transition-colors">
            Ayuda
          </Link>
        </nav>

        {/* Derecha: Acciones */}
        <div className="flex items-center gap-2 z-20">
         
          
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingBag className="size-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 size-5 rounded-full bg-primary text-primary-foreground text-[11px] flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>

          <ThemeToggle />

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <SheetHeader>
                 <div className="relative h-8 w-32">
                    <Image src="/PORTO - 2.PNG" alt="PortoStore" fill className="object-contain object-left" />
                 </div>

              </SheetHeader>
              <nav className="mt-8 flex flex-col gap-4 px-4">
                  <Link href="/" onClick={() => setOpen(false)} className="font-medium">Inicio</Link>
                  
                  <Link href="/categories" onClick={() => setOpen(false)} className="font-medium">Categorías</Link>

                  <Link href="/returns" onClick={() => setOpen(false)} className="font-medium">Políticas de Devolución</Link>

                  <Link href="/help" onClick={() => setOpen(false)} className="font-medium">Ayuda</Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
