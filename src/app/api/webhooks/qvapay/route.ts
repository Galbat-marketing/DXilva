import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getInvoice } from "@/lib/qvapay";

/**
 * QvaPay Webhook Handler
 *
 * QvaPay sends a GET request to the webhook URL when a payment status changes.
 * The request includes:
 *  - id: the transaction UUID
 *  - remote_id: our order_number
 *  - status: "paid" | "pending" | "cancelled"
 *
 * For security, we verify the transaction by calling QvaPay's get_invoice endpoint.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const transactionId = searchParams.get("id");
    const remoteId = searchParams.get("remote_id");

    console.log("[QvaPay Webhook] Received:", {
      id: transactionId,
      remote_id: remoteId,
    });

    if (!transactionId && !remoteId) {
      console.error("[QvaPay Webhook] Missing id and remote_id");
      return NextResponse.json(
        { error: "Missing identification fields" },
        { status: 400 }
      );
    }

    // ─── Verify the transaction with QvaPay ─────────────────
    // This prevents forged webhook calls by confirming the status
    // directly with QvaPay's servers.
    let verifiedStatus: string = "unknown";

    if (transactionId) {
      try {
        const invoice = await getInvoice(transactionId);
        verifiedStatus = invoice.status;
        console.log(
          `[QvaPay Webhook] Verified transaction ${transactionId}: status=${verifiedStatus}`
        );
      } catch (verifyError) {
        console.error(
          "[QvaPay Webhook] Could not verify transaction:",
          verifyError
        );
        // If we can't verify, still process but log the warning
      }
    }

    // ─── Find the order in Supabase ─────────────────────────
    const supabase = await createClient();

    let query = supabase.from("orders").select("*");

    if (remoteId) {
      query = query.eq("order_number", remoteId);
    } else if (transactionId) {
      query = query.eq("qvapay_invoice_id", transactionId);
    }

    const { data: order, error: findError } = await query.maybeSingle();

    if (findError || !order) {
      console.error("[QvaPay Webhook] Order not found:", {
        remote_id: remoteId,
        transaction_id: transactionId,
        error: findError,
      });
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // ─── Update order based on verified status ──────────────
    const isPaid = verifiedStatus === "paid";

    if (isPaid) {
      const { error: updateError } = await supabase
        .from("orders")
        .update({
          payment_status: "paid",
          status: "confirmed",
          paid_at: new Date().toISOString(),
          qvapay_invoice_id:
            transactionId || order.qvapay_invoice_id,
          qvapay_payment_uuid:
            transactionId || order.qvapay_payment_uuid,
        })
        .eq("id", order.id);

      if (updateError) {
        console.error(
          "[QvaPay Webhook] Failed to update order:",
          updateError
        );
        return NextResponse.json(
          { error: "Failed to update order" },
          { status: 500 }
        );
      }

      console.log(
        `[QvaPay Webhook] ✅ Order ${order.order_number} marked as PAID`
      );
    } else if (verifiedStatus === "cancelled") {
      await supabase
        .from("orders")
        .update({
          payment_status: "failed",
          status: "cancelled",
        })
        .eq("id", order.id);

      console.log(
        `[QvaPay Webhook] ❌ Order ${order.order_number} CANCELLED`
      );
    } else {
      console.log(
        `[QvaPay Webhook] ⏳ Order ${order.order_number} status: ${verifiedStatus}`
      );
    }

    // Always return 200 to acknowledge receipt
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("[QvaPay Webhook] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * QvaPay may also POST to webhooks in some configurations.
 * Handle both methods for maximum compatibility.
 */
export async function POST(request: Request) {
  try {
    const payload = await request.json();

    console.log(
      "[QvaPay Webhook POST] Received:",
      JSON.stringify(payload, null, 2)
    );

    const transactionId =
      payload.id || payload.uuid || payload.transaction_uuid;
    const remoteId = payload.remote_id;

    if (!transactionId && !remoteId) {
      return NextResponse.json(
        { error: "Missing identification fields" },
        { status: 400 }
      );
    }

    // Verify the transaction with QvaPay
    let verifiedStatus: string = "unknown";

    if (transactionId) {
      try {
        const invoice = await getInvoice(transactionId);
        verifiedStatus = invoice.status;
      } catch {
        console.warn(
          "[QvaPay Webhook POST] Could not verify transaction"
        );
      }
    }

    const supabase = await createClient();

    let query = supabase.from("orders").select("*");
    if (remoteId) {
      query = query.eq("order_number", remoteId);
    } else {
      query = query.eq("qvapay_invoice_id", transactionId);
    }

    const { data: order, error: findError } = await query.maybeSingle();

    if (findError || !order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    if (verifiedStatus === "paid") {
      await supabase
        .from("orders")
        .update({
          payment_status: "paid",
          status: "confirmed",
          paid_at: new Date().toISOString(),
          qvapay_invoice_id:
            transactionId || order.qvapay_invoice_id,
        })
        .eq("id", order.id);

      console.log(
        `[QvaPay Webhook POST] ✅ Order ${order.order_number} PAID`
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("[QvaPay Webhook POST] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
