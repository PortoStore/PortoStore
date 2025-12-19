 "use client";

import { usePathname } from "next/navigation";
import AdminLogoutButton from "@/components/admin-logout-button";
import { AdminNavigationProvider } from "@/components/admin/admin-navigation-provider";
import { AdminLink } from "@/components/admin/admin-link";
import {
    LayoutDashboard,
    Package,
    Tags,
    Receipt,
    Store,
    ExternalLink,
    Percent,
} from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    return (
        <AdminNavigationProvider>
        <div className="flex min-h-screen w-full flex-col bg-muted/40 md:flex-row">
            <aside className="hidden w-64 flex-col border-r bg-background md:flex">
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                    <AdminLink href="/" className="flex items-center gap-2 font-semibold">
                        <Package className="h-6 w-6" />
                        <span className="">PortoStore Admin</span>
                    </AdminLink>
                </div>
                <div className="flex-1 overflow-auto py-2">
                    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                        <AdminLink
                            href="/admin"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                        >
                            <LayoutDashboard className="h-4 w-4" />
                            Panel
                        </AdminLink>
                        <AdminLink
                            href="/admin/products"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                        >
                            <Package className="h-4 w-4" />
                            Productos
                        </AdminLink>
                        <AdminLink
                            href="/admin/categories"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                        >
                            <Tags className="h-4 w-4" />
                            Categorías
                        </AdminLink>
                        <AdminLink
                            href="/admin/discounts"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                        >
                            <Percent className="h-4 w-4" />
                            Descuentos
                        </AdminLink>
                        <AdminLink
                            href="/admin/orders"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                        >
                            <Receipt className="h-4 w-4" />
                            Pedidos
                        </AdminLink>
                        <AdminLink
                            href="/admin/store"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                        >
                            <Store className="h-4 w-4" />
                            Mi tienda
                        </AdminLink>
                        <AdminLink
                            href="/"
                            target="_blank"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                        >
                            <ExternalLink className="h-4 w-4" />
                            Ver Tienda Online
                        </AdminLink>
                    </nav>
                </div>
                <div className="mt-auto p-4">
                    <AdminLogoutButton />
                </div>
            </aside>
            <div className="flex flex-col flex-1 sm:gap-4 sm:py-4">
                <header className="sticky top-0 z-30 flex h-14 items-center border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                    <div className="w-full max-w-7xl mx-auto">
                        <h1 className="text-lg font-semibold md:text-xl">Panel de Administración</h1>
                    </div>
                </header>
                <main className="grid flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 w-full max-w-7xl mx-auto">
                    {children}
                </main>
            </div>
        </div>
        </AdminNavigationProvider>
    );
}
