"use client";
import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import { getCartItems, clearCart } from "@/lib/utils";
import { sendOrderEmails } from "@/actions/send-emails";

export default function CheckoutPage() {
  const [shipping, setShipping] = useState<"home" | "store">("home");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "transfer">("transfer");
  const [copied, setCopied] = useState<boolean>(false);
  const [items, setItems] = useState(() => getCartItems());
  const [products, setProducts] = useState<Record<number, { name: string; sku_base?: string; image?: string; prices: { payment_type_id: number; price: number }[] }>>({});
  const [sizeNames, setSizeNames] = useState<Record<number, string>>({});
  const [success, setSuccess] = useState<boolean>(false);
  const [saleId, setSaleId] = useState<number | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [transferRef, setTransferRef] = useState<string>("");
  const [copiedId, setCopiedId] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [bank, setBank] = useState({
    cbu: "",
    alias: "",
    bank: "",
    account: "",
    cuit: "",
  });
  const [whatsappNumber, setWhatsappNumber] = useState<string>("");
  const [discountCode, setDiscountCode] = useState<string>("");
  const [discountErr, setDiscountErr] = useState<string | null>(null);
  const [appliedDiscount, setAppliedDiscount] = useState<{ id: number; code: string; type: "fixed" | "percentage"; value: number } | null>(null);

  const unitPriceById = useMemo(() => {
    const dict: Record<number, number> = {};
    items.forEach((i) => {
      const p = products[i.product_id];
      // Use payment_type_id 1 (Efectivo / Transferencia)
      const priceRow = p?.prices?.find((r) => Number(r.payment_type_id) === 1) || p?.prices?.[0];
      dict[i.product_id] = Number(priceRow?.price) || 0;
    });
    return dict;
  }, [items, products]);
  const subtotalDb = useMemo(() => items.reduce((acc, i) => acc + (unitPriceById[i.product_id] || 0) * (Number(i.qty) || 1), 0), [items, unitPriceById]);
  const total = subtotalDb;

  useEffect(() => {
    const onUpdate = () => setItems(getCartItems());
    window.addEventListener("storage", onUpdate);
    window.addEventListener("cart_updated", onUpdate as EventListener);
    return () => {
      window.removeEventListener("storage", onUpdate);
      window.removeEventListener("cart_updated", onUpdate as EventListener);
    };
  }, []);

  useEffect(() => {
    const ids = Array.from(new Set(items.map((i) => i.product_id)));
    let cancelled = false;
    const run = async () => {
      if (ids.length === 0) {
        await Promise.resolve();
        if (!cancelled) setProducts({});
        return;
      }
      const { data } = await supabase
        .from("products")
        .select("product_id,name,sku_base,images(url),product_prices(payment_type_id,price)")
        .in("product_id", ids);
      const dict: Record<number, { name: string; sku_base?: string; image?: string; prices: { payment_type_id: number; price: number }[] }> = {};
      type Row = { product_id: number; name: string; sku_base?: string; images?: { url: string }[]; product_prices?: { payment_type_id: number; price: number }[] };
      (data as Row[] | null)?.forEach((p) => {
        dict[p.product_id] = { name: p.name, sku_base: p.sku_base || undefined, image: p.images?.[0]?.url, prices: p.product_prices || [] };
      });
      if (!cancelled) setProducts(dict);
    };
    run();
    return () => { cancelled = true; };
  }, [items]);

  useEffect(() => {
    const sizeIds = Array.from(new Set(items.map((i) => i.size_id)));
    if (sizeIds.length === 0) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("sizes")
        .select("size_id,name")
        .in("size_id", sizeIds);
      if (!cancelled && data) {
        const dict: Record<number, string> = {};
        (data as { size_id: number; name: string }[]).forEach(s => { dict[s.size_id] = s.name; });
        setSizeNames(dict);
      }
    })();
    return () => { cancelled = true; };
  }, [items]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("store_settings")
        .select("bank,cbu,alias,account,cuit,whatsapp")
        .eq("id", 1)
        .maybeSingle();
      if (!cancelled && data) {
        const d = data as { bank?: string | null; cbu?: string | null; alias?: string | null; account?: string | null; cuit?: string | null; whatsapp?: string | null };
        setBank({
          bank: d.bank || "Banco Nación",
          cbu: d.cbu || "2850590940090412345678",
          alias: d.alias || "portostore.cobros",
          account: d.account || "Porto Store S.A.",
          cuit: d.cuit || "30-12345678-9",
        });
        if (d.whatsapp) {
           const digits = d.whatsapp.replace(/[^0-9]/g, "");
           if (digits) setWhatsappNumber(digits);
        }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  function validateShipping(): boolean {
    const next: Record<string, string> = {};
    
    // Validaciones comunes para todos los métodos
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Email inválido";
    if (!firstName.trim()) next.firstName = "Nombre requerido";
    if (!lastName.trim()) next.lastName = "Apellido requerido";

    if (shipping === "home") {
      if (!address.trim()) next.address = "Dirección requerida";
      if (!city.trim()) next.city = "Ciudad requerida";
      const cp = postalCode.trim();
      if (!/^[0-9]{4,8}$/.test(cp)) next.postalCode = "Código postal inválido";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function createOrderInDb(): Promise<number> {
    const paymentId = paymentMethod === "cash" ? 1 : 3;
    const initialStatus = "pending_approval";
    // Si es WhatsApp (home), removemos el envío del total en la DB para coincidir con el mensaje
    const finalTotal = shipping === "home" ? Math.max(0, subtotalDb - discountAmount) : totalWithDiscount;
    
    const { data: saleRow, error: saleErr } = await supabase
      .from("sales")
      .insert([{ payment_type_id: paymentId, total_amount: finalTotal, status: initialStatus }])
      .select()
      .single();
    if (saleErr) throw saleErr;
    const sid = Number((saleRow as { sale_id: number }).sale_id);
    
    const details = items.map((i) => ({
      sale_id: sid,
      product_id: i.product_id,
      size_id: i.size_id,
      quantity: Number(i.qty) || 1,
      price_at_sale: unitPriceById[i.product_id] || 0,
    }));
    const { error: detErr } = await supabase.from("sale_details").insert(details);
    if (detErr) throw detErr;

    // Restar stock
    await Promise.all(items.map(async (item) => {
      const { data: currentSize } = await supabase
        .from("product_sizes")
        .select("stock")
        .eq("product_id", item.product_id)
        .eq("size_id", item.size_id)
        .single();
      
      if (currentSize) {
        const newStock = Math.max(0, Number(currentSize.stock || 0) - Number(item.qty || 1));
        await supabase
          .from("product_sizes")
          .update({ stock: newStock })
          .eq("product_id", item.product_id)
          .eq("size_id", item.size_id);
      }
    }));
    
    if (paymentMethod === "transfer") {
      const { error: recErr } = await supabase
        .from("payment_records")
        .insert([{ sale_id: sid, payment_type_id: 3, amount: finalTotal, reference_number: transferRef || null, record_status: "recorded" }]);
      if (recErr) throw recErr;
    }
    
    if (appliedDiscount) {
      const { error: usageErr } = await supabase
        .from("discount_usages")
        .insert([{ sale_id: sid, discount_id: appliedDiscount.id, code: appliedDiscount.code, amount_applied: discountAmount }]);
      if (usageErr) throw usageErr;
      const { data: discRow } = await supabase
        .from("discounts")
        .select("uses_count")
        .eq("discount_id", appliedDiscount.id)
        .single();
      const currentCount = Number(((discRow as { uses_count?: number } | null)?.uses_count) || 0);
      await supabase
        .from("discounts")
        .update({ uses_count: currentCount + 1 })
        .eq("discount_id", appliedDiscount.id);
    }
    return sid;
  }

  async function handleWhatsAppCheckout() {
    setSubmitError(null);
    if (!whatsappNumber) { setSubmitError("Error: No hay número de WhatsApp configurado en la tienda."); return; }
    if (!validateShipping()) return;
    if (items.length === 0) { setSubmitError("No hay productos en el carrito"); return; }
    
    try {
      setSaving(true);
      const sid = await createOrderInDb();

      const itemsList = items.map(i => {
        const p = products[i.product_id];
        const name = p?.name || `Producto #${i.product_id}`;
        const sku = p?.sku_base ? `SKU: ${p.sku_base}` : "";
        const sizeName = sizeNames[i.size_id] || "Talle único";
        const qty = Number(i.qty) || 1;
        const unit = unitPriceById[i.product_id] || 0;
        return `- ${sku ? sku + " | " : ""}${name} (Talle: ${sizeName}) x${qty} ($${unit})`;
      }).join('\n');

      // Total para WhatsApp sin envío
      const totalMsg = Math.max(0, subtotalDb - discountAmount);

      const msg = `Hola, quiero realizar un pedido con envío a domicilio.
Código de pedido: #${sid}

*Datos de Envío:*
Nombre: ${firstName} ${lastName}
Email: ${email}
Dirección: ${address}
Ciudad: ${city}
CP: ${postalCode}

*Pedido:*
${itemsList}

*Resumen:*
Subtotal: $${subtotalDb.toFixed(2)}
${appliedDiscount ? `Descuento: -$${discountAmount.toFixed(2)}\n` : ""}Total: $${totalMsg.toFixed(2)}

*Método de Pago:* ${paymentMethod === 'transfer' ? 'Transferencia' : 'Efectivo'}
${paymentMethod === 'transfer' ? `(Referencia: ${transferRef})` : ''}`;

      clearCart();
      setItems([]);
      setSaleId(sid);
      setSuccess(true); // Mostramos modal de éxito también
      
      const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`;
      // Usamos location.href en lugar de window.open para evitar bloqueo de popups en iOS
      window.location.href = url;
    } catch (e) {
      const msg = e instanceof Error ? e.message : "No se pudo generar el pedido para WhatsApp";
      setSubmitError(msg);
    } finally {
      setSaving(false);
    }
  }

  async function finalizePurchase() {
    setSuccess(false);
    setSubmitError(null);
    if (!validateShipping()) return;
    if (items.length === 0) { setSubmitError("No hay productos en el carrito"); return; }
    try {
      setSaving(true);
      const sid = await createOrderInDb();
      setSaleId(sid);
      
      clearCart();
      setItems([]);

      // Enviar emails de confirmación
      try {
        const emailItems = items.map(i => ({
          name: products[i.product_id]?.name || `Producto #${i.product_id}`,
          quantity: Number(i.qty) || 1,
          price: unitPriceById[i.product_id] || 0
        }));

        await sendOrderEmails({
          orderId: sid,
          customerName: `${firstName} ${lastName}`,
          customerEmail: email,
          items: emailItems,
          total: totalWithDiscount,
          shippingMethod: shipping,
          paymentMethod: paymentMethod
        });
      } catch (err) {
        console.error("Failed to send emails:", err);
      }

      setSuccess(true);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "No se pudo finalizar la compra";
      setSubmitError(msg);
    } finally {
      setSaving(false);
    }
  }

  async function applyDiscount() {
    setDiscountErr(null);
    const code = discountCode.trim().toUpperCase();
    if (!code) { setDiscountErr("Ingresá un código"); return; }
    const { data } = await supabase
      .from("discounts")
      .select("discount_id,code,type,value,is_active,valid_from,valid_until,max_uses,uses_count")
      .ilike("code", code)
      .maybeSingle();
    type DiscountRow = {
      discount_id: number;
      code: string;
      type: "fixed" | "percentage";
      value: number;
      is_active: boolean;
      valid_from: string | null;
      valid_until: string | null;
      max_uses: number | null;
      uses_count: number | null;
    };
    const row = (data as DiscountRow | null);
    if (!row || !row.is_active) { setDiscountErr("Código inválido"); return; }
    const now = new Date();
    const vf = row.valid_from ? new Date(row.valid_from) : null;
    const vu = row.valid_until ? new Date(row.valid_until) : null;
    if ((vf && now < vf) || (vu && now > vu)) { setDiscountErr("Código vencido"); return; }
    const maxUses = row.max_uses;
    const usesCount = Number(row.uses_count || 0);
    if (maxUses !== null && !Number.isNaN(maxUses) && usesCount >= maxUses) { setDiscountErr("Límite de usos alcanzado"); return; }
    const t = row.type || "percentage";
    const v = Number(row.value || 0);
    if (v <= 0) { setDiscountErr("Valor inválido"); return; }
    setAppliedDiscount({ id: Number(row.discount_id), code, type: t, value: v });
  }
  const discountBase = subtotalDb;
  const discountAmount = appliedDiscount
    ? appliedDiscount.type === "fixed"
      ? Math.min(appliedDiscount.value, discountBase)
      : Math.min((discountBase * appliedDiscount.value) / 100, discountBase)
    : 0;
  const totalWithDiscount = Math.max(0, subtotalDb - discountAmount);
  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="flex flex-wrap gap-2 mb-8 text-sm">
        <span className="text-primary">Carrito</span>
        <span className="text-muted-foreground">/</span>
        <span>Envío</span>
        <span className="text-muted-foreground">/</span>
        <span className="text-muted-foreground">Pago</span>
      </div>
      <p className="text-4xl font-black tracking-tight mb-6">Finalizar Compra</p>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 flex flex-col gap-6">
          <details className="rounded-xl border p-4 group" open>
            <summary className="flex cursor-pointer items-center justify-between gap-6 list-none">
              <p className="text-lg font-bold">1. Información de Envío</p>
              <span className="rotate-0 group-open:rotate-180 transition-transform">⌄</span>
            </summary>
            <div className="mt-6 grid gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium mb-1" htmlFor="email">Email</label>
                    <Input id="email" placeholder="tu@email.com" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setErrors((prev) => ({ ...prev, email: "" })); }} />
                    {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1" htmlFor="firstName">Nombre</label>
                    <Input id="firstName" placeholder="Juan" value={firstName} onChange={(e) => { setFirstName(e.target.value); setErrors((prev) => ({ ...prev, firstName: "" })); }} />
                    {errors.firstName && <div className="text-red-500 text-xs mt-1">{errors.firstName}</div>}
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1" htmlFor="lastName">Apellido</label>
                    <Input id="lastName" placeholder="Pérez" value={lastName} onChange={(e) => { setLastName(e.target.value); setErrors((prev) => ({ ...prev, lastName: "" })); }} />
                    {errors.lastName && <div className="text-red-500 text-xs mt-1">{errors.lastName}</div>}
                  </div>
              </div>

              <fieldset className="grid gap-3">
                <legend className="text-sm font-medium">Método de envío</legend>
                <label className="flex items-center gap-2 text-sm">
                  <input type="radio" name="shipping_method" value="home" checked={shipping === "home"} onChange={() => { setShipping("home"); setPaymentMethod("transfer"); }} className="size-4" />
                  Envío a domicilio
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="radio" name="shipping_method" value="store" checked={shipping === "store"} onChange={() => { setShipping("store"); setPaymentMethod("cash"); }} className="size-4" />
                  Retiro en la tienda
                </label>
              </fieldset>
              {shipping === "home" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium mb-1" htmlFor="address">Dirección</label>
                    <Input id="address" placeholder="Av. Siempre Viva 742" value={address} onChange={(e) => { setAddress(e.target.value); setErrors((prev) => ({ ...prev, address: "" })); }} />
                    {errors.address && <div className="text-red-500 text-xs mt-1">{errors.address}</div>}
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1" htmlFor="city">Ciudad</label>
                    <Input id="city" placeholder="Posadas" value={city} onChange={(e) => { setCity(e.target.value); setErrors((prev) => ({ ...prev, city: "" })); }} />
                    {errors.city && <div className="text-red-500 text-xs mt-1">{errors.city}</div>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium mb-1" htmlFor="postalCode">Código Postal</label>
                    <Input id="postalCode" placeholder="B1636" value={postalCode} onChange={(e) => { setPostalCode(e.target.value); setErrors((prev) => ({ ...prev, postalCode: "" })); }} />
                    {errors.postalCode && <div className="text-red-500 text-xs mt-1">{errors.postalCode}</div>}
                  </div>
                </div>
              )}
              {shipping === "store" && (
                <div className="grid gap-2 text-sm">
                  <div>Retiro en tienda principal.</div>
                  <div className="text-muted-foreground">Dirección: Entre Rios 1420, Posadas, Misiones. Presentá tu número de pedido.</div>
                </div>
              )}
            </div>
          </details>
          
          <details className="rounded-xl border p-4 group" open>
            <summary className="flex cursor-pointer items-center justify-between gap-6 list-none">
              <p className="text-lg font-bold">2. Método de Pago</p>
              <span className="rotate-0 group-open:rotate-180 transition-transform">⌄</span>
            </summary>
            <div className="mt-6 grid grid-cols-1 gap-4">
              <fieldset className="grid gap-3">
                <legend className="text-sm font-medium">Seleccioná un método</legend>
                <label className={`flex items-center gap-2 text-sm ${shipping !== "store" ? "opacity-50 cursor-not-allowed" : ""}`}>
                  <input type="radio" name="payment_method" value="cash" className="size-4" disabled={shipping !== "store"} checked={paymentMethod === "cash"} onChange={() => setPaymentMethod("cash")} />
                  Efectivo
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="radio" name="payment_method" value="transfer" className="size-4" checked={paymentMethod === "transfer"} onChange={() => setPaymentMethod("transfer")} />
                  Transferencia
                </label>
                {shipping !== "store" && (
                  <div className="text-xs text-muted-foreground">Para envío, sólo transferencia.</div>
                )}
              </fieldset>
              {paymentMethod === "transfer" && (
                <div className="grid gap-3 rounded-md border p-4">
                  <div className="bg-yellow-50 text-yellow-800 p-3 rounded-md text-sm border border-yellow-200">
                    ⚠ Tenés 10 minutos para realizar la transferencia y enviar el comprobante.
                  </div>
                  <div className="text-sm font-medium">Datos para transferencia</div>
                  <div className="grid sm:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">CBU:</span>
                      <span>{bank.cbu}</span>
                      <Button type="button" variant="secondary" size="sm" onClick={async () => { await navigator.clipboard.writeText(bank.cbu); setCopied(true); setTimeout(() => setCopied(false), 1500); }}>
                        {copied ? "Copiado" : "Copiar"}
                      </Button>
                    </div>
                    <div>
                      <span className="font-medium">Alias:</span> <span>{bank.alias}</span>
                    </div>
                    <div>
                      <span className="font-medium">Banco:</span> <span>{bank.bank}</span>
                    </div>
                    <div>
                      <span className="font-medium">Titular:</span> <span>{bank.account}</span>
                    </div>
                    <div>
                      <span className="font-medium">CUIT:</span> <span>{bank.cuit}</span>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Referencia de pago</label>
                    <Input placeholder="Opcional: número de comprobante o alias" value={transferRef} onChange={(e) => setTransferRef(e.target.value)} />
                  </div>
                </div>
              )}
            </div>
          </details>
          <Button className="w-full" type="button" onClick={shipping === "home" ? handleWhatsAppCheckout : finalizePurchase} disabled={saving || items.length === 0}>
            {shipping === "home" ? "Finalizar por WhatsApp" : "Finalizar Compra"}
          </Button>
          {submitError && (<div className="mt-3 text-sm text-red-500">{submitError}</div>)}
          <Dialog open={success} onOpenChange={setSuccess}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>¡Compra confirmada!</DialogTitle>
                <DialogDescription>Tu pedido se generó correctamente.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-2 text-sm">
                {saleId !== null && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">N° de pedido</span>
                    <span className="font-mono font-bold">#{saleId}</span>
                  </div>
                )}
                {transferRef && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Comprobante</span>
                    <span className="font-mono">{transferRef}</span>
                  </div>
                )}
                <div className="text-muted-foreground">Guardá este número para cualquier consulta.</div>
              </div>
              <DialogFooter>
                {saleId !== null && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={async () => {
                      await navigator.clipboard.writeText(String(saleId));
                      setCopiedId(true);
                      setTimeout(() => setCopiedId(false), 1500);
                    }}
                  >
                    {copiedId ? "Copiado" : "Copiar N° pedido"}
                  </Button>
                )}
                <Button type="button" onClick={() => setSuccess(false)}>Aceptar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="lg:col-span-5">
          <div className="sticky top-28 rounded-xl border p-6">
            <h2 className="text-xl font-bold mb-6">Resumen del Pedido</h2>
            <ul className="space-y-4 text-sm">
              {items.map((ci, idx) => {
                const p = products[ci.product_id];
                const name = p?.name || `Producto #${ci.product_id}`;
                const unit = unitPriceById[ci.product_id] || 0;
                const qty = Number(ci.qty) || 1;
                return (
                  <li key={`${ci.product_id}-${ci.size_id}-${idx}`} className="flex justify-between">
                    <span>{name} × {qty}</span>
                    <span>${(unit * qty).toFixed(2)}</span>
                  </li>
                );
              })}
              {items.length === 0 && (
                <li className="text-muted-foreground">No hay productos en el pedido.</li>
              )}
            </ul>
            <div className="mt-8 pt-6 border-t space-y-2 text-sm">
              <div className="flex items-center gap-2 mb-2">
                <Input placeholder="Código de descuento" value={discountCode} onChange={(e) => setDiscountCode(e.target.value)} />
                <Button variant="secondary" onClick={applyDiscount}>Aplicar</Button>
              </div>
              {discountErr && (<div className="text-red-500 text-xs">{discountErr}</div>)}
              <div className="flex justify-between"><span>Subtotal</span><span>${subtotalDb.toFixed(2)}</span></div>
              {appliedDiscount && (
                <div className="flex justify-between text-primary"><span>Descuento</span><span>-${discountAmount.toFixed(2)}</span></div>
              )}
              <div className="flex justify-between text-base font-bold border-t pt-4 mt-4"><span>Total</span><span>${totalWithDiscount.toFixed(2)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
