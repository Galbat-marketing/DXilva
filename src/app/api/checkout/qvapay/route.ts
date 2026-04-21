import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createInvoice } from "@/lib/qvapay";

interface CheckoutItem {
  name: string;
  price: number;
  quantity: number;
  product_id: string;
}

interface CheckoutBody {
  items: CheckoutItem[];
  total: number;
  customerInfo: {
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    province: string;
  };
}

export async function POST(request: Request) {
  try {
    const body: CheckoutBody = await request.json();
    const { items, total, customerInfo } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "El carrito está vacío" },
        { status: 400 }
      );
    }

    if (total <= 0) {
      return NextResponse.json(
        { error: "El total debe ser mayor a 0" },
        { status: 400 }
      );
    }

    // 1. Create the order in Supabase
    const supabase = await createClient();

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: `DX-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
        customer_name: `${customerInfo.firstName} ${customerInfo.lastName}`,
        customer_email: customerInfo.email,
        customer_phone: customerInfo.phone,
        shipping_address: JSON.stringify({
          address: customerInfo.address,
          city: customerInfo.city,
          province: customerInfo.province,
        }),
        subtotal: total,
        total: total,
        status: "pending",
        payment_method: "qvapay",
        payment_status: "pending",
      })
      .select()
      .single();

    if (orderError) {
      console.error("Supabase order creation error:", orderError);
      return NextResponse.json(
        { error: "Error al crear la orden: " + orderError.message },
        { status: 500 }
      );
    }

    // 2. Insert order items
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.name,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.price * item.quantity,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Supabase order items error:", itemsError);
      // Clean up the order if items fail
      await supabase.from("orders").delete().eq("id", order.id);
      return NextResponse.json(
        { error: "Error al guardar los productos: " + itemsError.message },
        { status: 500 }
      );
    }

    // 3. Create invoice in QvaPay
    const itemsSummary = items
      .map((i) => `${i.quantity}x ${i.name}`)
      .join(", ");

    const invoice = await createInvoice({
      amount: total,
      description: `D'XILVA #${order.order_number}: ${itemsSummary}`.slice(
        0,
        300
      ),
      remote_id: order.order_number,
    });

    // 4. Update the order with QvaPay transaction info
    const transactionUuid = invoice.transaction_uuid;
    const paymentUrl = invoice.url;

    await supabase
      .from("orders")
      .update({
        qvapay_invoice_id: transactionUuid,
        qvapay_payment_uuid: transactionUuid,
        payment_intent_id: transactionUuid,
      })
      .eq("id", order.id);

    // 5. Return the payment URL to the frontend
    return NextResponse.json({
      paymentUrl,
      orderNumber: order.order_number,
      transactionUuid,
    });
  } catch (error: unknown) {
    console.error("Checkout QvaPay error:", error);
    const message =
      error instanceof Error ? error.message : "Error interno del servidor";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
