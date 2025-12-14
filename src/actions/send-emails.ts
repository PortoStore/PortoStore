"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// CONFIGURACIÓN DE CORREOS
const FROM_EMAIL = 'Porto Store <ventas@tiendaportostore.com>'; // Tu dominio verificado
const MY_GMAIL = 'tiendaportostore@gmail.com'; // Tu Gmail real para recibir avisos y respuestas

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderEmailData {
  orderId: number;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  total: number;
  shippingMethod: string;
  paymentMethod: string;
}

export async function sendOrderEmails(data: OrderEmailData) {
  const { orderId, customerName, customerEmail, items, total, shippingMethod, paymentMethod } = data;

  // --- VALIDACIONES ---
  if (!customerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
    throw new Error("El email del cliente es inválido o está vacío.");
  }

  if (!customerName || !customerName.trim()) {
    throw new Error("El nombre del cliente es requerido.");
  }

  if (!items || items.length === 0) {
    throw new Error("El pedido debe contener al menos un producto.");
  }

  for (const item of items) {
    if (!item.name || item.quantity <= 0 || item.price < 0) {
      throw new Error(`Item inválido detectado: ${item.name || 'Sin nombre'} (Qty: ${item.quantity}, Price: ${item.price})`);
    }
  }

  if (typeof total !== 'number' || total < 0) {
    throw new Error("El total del pedido debe ser un número positivo.");
  }

  const validShippingMethods = ['home', 'branch', 'store'];
  if (!validShippingMethods.includes(shippingMethod)) {
    throw new Error(`Método de envío inválido: ${shippingMethod}`);
  }

  const validPaymentMethods = ['cash', 'transfer'];
  if (!validPaymentMethods.includes(paymentMethod)) {
    throw new Error(`Método de pago inválido: ${paymentMethod}`);
  }
  // --------------------

  console.log("Iniciando envío de emails para orden:", orderId);

  // 1. Enviar email al CLIENTE
  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: customerEmail,
      replyTo: MY_GMAIL, // <--- TRUCO: Si el cliente responde, te llega a tu Gmail
      subject: `Confirmación de pedido #${orderId} - Porto Store`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">¡Gracias por tu compra, ${customerName}!</h1>
          <p>Tu pedido <strong>#${orderId}</strong> ha sido registrado exitosamente.</p>
          
          <div style="background-color: #f4f4f4; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="margin-top: 0;">Detalle del pedido:</h2>
            <ul style="padding-left: 20px;">
              ${items.map(item => `
                <li style="margin-bottom: 10px;">
                  <strong>${item.name}</strong> <br>
                  Cantidad: ${item.quantity} x $${item.price}
                </li>
              `).join('')}
            </ul>
            <p style="font-size: 1.2em; font-weight: bold; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 10px;">
              Total: $${total}
            </p>
          </div>
          
          <div style="margin-bottom: 20px;">
            <p><strong>Método de envío:</strong> ${translateShipping(shippingMethod)}</p>
            <p><strong>Método de pago:</strong> ${translatePayment(paymentMethod)}</p>
          </div>

          ${paymentMethod === 'transfer' ? `
            <div style="background-color: #e6f7ff; padding: 15px; border-radius: 8px; border: 1px solid #91d5ff;">
              <p style="margin: 0;"><strong>Importante:</strong> Si elegiste transferencia , por favor envialo respondiendo a este correo o por WhatsApp indicando tu número de pedido.</p>
            </div>
          ` : ''}
          
          <p style="color: #666; font-size: 0.9em; margin-top: 40px;">
            Si tenés alguna duda, contactanos respondiendo este correo.
          </p>
        </div>
      `
    });

    if (error) {
        console.error("Error Resend (Cliente):", error);
    }
  } catch (error) {
    console.error("Error enviando email al cliente:", error);
  }

  // 2. Enviar email al VENDEDOR (A ti mismo)
  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: MY_GMAIL, // <--- Te llega a tu Gmail
      subject: `💰 Nuevo pedido #${orderId} - ${customerName}`,
      html: `
        <div style="font-family: sans-serif;">
          <h1>Nuevo pedido recibido</h1>
          <p>El cliente <strong>${customerName}</strong> (${customerEmail}) ha realizado el pedido #${orderId}.</p>
          
          <h2>Detalle:</h2>
          <ul>
            ${items.map(item => `<li>${item.name} x${item.quantity} - $${item.price}</li>`).join('')}
          </ul>
          
          <p><strong>Total: $${total}</strong></p>
          
          <p>Envío: ${translateShipping(shippingMethod)}</p>
          <p>Pago: ${translatePayment(paymentMethod)}</p>
        </div>
      `
    });

    if (error) {
        console.error("Error Resend (Vendedor):", error);
    }
  } catch (error) {
    console.error("Error enviando email al vendedor:", error);
  }
  
  return { success: true };
}

// FUNCIONES AUXILIARES

function translateShipping(method: string) {
    const map: Record<string, string> = {
        'home': 'Envío a domicilio',
        'branch': 'Retiro en sucursal',
        'store': 'Retiro en tienda'
    };
    return map[method] || method;
}

function translatePayment(method: string) {
    const map: Record<string, string> = {
        'cash': 'Efectivo',
        'transfer': 'Transferencia'
    };
    return map[method] || method;
}