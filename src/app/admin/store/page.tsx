"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ChevronLeft, Upload, X } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";

type StoreSettings = {
  id: number;
  store_name?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  bank?: string | null;
  cbu?: string | null;
  alias?: string | null;
  account?: string | null;
  cuit?: string | null;
  whatsapp?: string | null;
  hero_image_url?: string | null;
};

export default function AdminStorePage() {
  const supabase = createClient();
  const [settings, setSettings] = useState<StoreSettings>({ id: 1 });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("store_settings")
        .select("*")
        .eq("id", 1)
        .maybeSingle();
      if (!cancelled && data) {
        setSettings(data as StoreSettings);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  async function onSave() {
    setLoading(true);
    setError(null);
    setSaved(false);
    try {
      const row = { ...settings, id: 1 };
      const { error: upErr } = await supabase
        .from("store_settings")
        .upsert([row], { onConflict: "id" });
      if (upErr) throw upErr;
      setSaved(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo guardar");
    } finally {
      setLoading(false);
      setTimeout(() => setSaved(false), 1500);
    }
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-4">
        <Link href="/admin">
          <Button variant="outline" size="icon" className="h-9 w-9">
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Volver</span>
          </Button>
        </Link>
        <h1 className="text-lg font-semibold md:text-2xl">Mi tienda</h1>
        <div className="ml-auto">
          <Button onClick={onSave} disabled={loading}>
            {loading ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Datos generales</CardTitle>
          <CardDescription>Personalizá la información de tu tienda.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Nombre de la tienda</label>
            <Input value={settings.store_name || ""} onChange={(e) => setSettings(s => ({ ...s, store_name: e.target.value }))} placeholder="Porto Store" />
          </div>
          <div className="grid gap-2 md:col-span-2">
            <label className="text-sm font-medium">Dirección</label>
            <Input value={settings.address || ""} onChange={(e) => setSettings(s => ({ ...s, address: e.target.value }))} placeholder="Entre Ríos 1420, Posadas" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Teléfono</label>
            <Input value={settings.phone || ""} onChange={(e) => setSettings(s => ({ ...s, phone: e.target.value }))} placeholder="+54 376 436-651" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Email</label>
            <Input value={settings.email || ""} onChange={(e) => setSettings(s => ({ ...s, email: e.target.value }))} placeholder="contacto@portostore.com" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">WhatsApp</label>
            <Input value={settings.whatsapp || ""} onChange={(e) => setSettings(s => ({ ...s, whatsapp: e.target.value }))} placeholder="+54 376 433-3760" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Imagen de Portada (Hero)</CardTitle>
          <CardDescription>Esta imagen aparecerá en la página principal.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex flex-col gap-4">
            {settings.hero_image_url && (
              <div className="relative w-full max-w-sm aspect-[4/3] rounded-lg overflow-hidden border">
                <Image src={settings.hero_image_url} alt="Hero" fill className="object-cover" />
                <button
                  onClick={() => setSettings(s => ({ ...s, hero_image_url: null }))}
                  className="absolute top-2 right-2 bg-black/50 p-1 rounded-full text-white hover:bg-black/70"
                >
                  <X size={16} />
                </button>
              </div>
            )}
            <CldUploadWidget
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "porto_store"}
              onSuccess={(result: any) => {
                if (result.info?.secure_url) {
                  setSettings(s => ({ ...s, hero_image_url: result.info.secure_url }));
                }
              }}
            >
              {({ open }) => (
                <Button type="button" variant="outline" onClick={() => open()}>
                  <Upload className="mr-2 h-4 w-4" />
                  {settings.hero_image_url ? "Cambiar Imagen" : "Subir Imagen"}
                </Button>
              )}
            </CldUploadWidget>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Datos Bancarios</CardTitle>
          <CardDescription>Usados para transferencias.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Banco</label>
            <Input value={settings.bank || ""} onChange={(e) => setSettings(s => ({ ...s, bank: e.target.value }))} placeholder="Banco Nación" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Titular / Cuenta</label>
            <Input value={settings.account || ""} onChange={(e) => setSettings(s => ({ ...s, account: e.target.value }))} placeholder="Porto Store S.A." />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">CBU</label>
            <Input value={settings.cbu || ""} onChange={(e) => setSettings(s => ({ ...s, cbu: e.target.value }))} placeholder="2850..." />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Alias</label>
            <Input value={settings.alias || ""} onChange={(e) => setSettings(s => ({ ...s, alias: e.target.value }))} placeholder="portostore.cobros" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">CUIT</label>
            <Input value={settings.cuit || ""} onChange={(e) => setSettings(s => ({ ...s, cuit: e.target.value }))} placeholder="30-12345678-9" />
          </div>
        </CardContent>
      </Card>

      {error && <div className="text-sm text-red-500">{error}</div>}
      {saved && <div className="text-sm text-green-600">Cambios guardados.</div>}
    </div>
  );
}
