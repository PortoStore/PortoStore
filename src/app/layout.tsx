import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import WhatsAppButton from "@/components/whatsapp-button";
import { Toaster } from "@/components/ui/sonner";

const manrope = Manrope({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Porto Store",
    default: "Porto Store - Moda y Accesorios",
  },
  description: "Descubre la última colección de moda y accesorios en Porto Store.",
  openGraph: {
    title: "Porto Store",
    description: "Moda y accesorios de calidad.",
    siteName: "Porto Store",
    locale: "es_AR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${manrope.variable} antialiased`}>
        <div className="min-h-dvh flex flex-col relative">
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <WhatsAppButton />
          <Toaster />
        </div>
      </body>
    </html>
  );
}