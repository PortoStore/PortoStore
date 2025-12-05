import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const manrope = Manrope({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Porto Store",
  description: "Moda y accesorios",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${manrope.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="min-h-dvh flex flex-col">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
