import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { DiscountCode } from "@/types";
import { discountValidationSchema } from "@/lib/validations";

interface ValidateRequest {
  code: string;
  cartTotal: number;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate request body
    const validationResult = discountValidationSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { code, cartTotal } = validationResult.data;

    const supabase = await createClient();

    // Buscar el código de descuento
    const searchCode = code.toUpperCase();
    console.log("Buscando código de descuento:", searchCode);

    const { data: discount } = await supabase
      .from("discount_codes")
      .select("*")
      .ilike("code", searchCode)
      .eq("is_active", true)
      .maybeSingle();

    console.log("Resultado:", discount ? "Encontrado" : "No encontrado");

    if (!discount) {
      return NextResponse.json(
        { error: "Código de descuento no encontrado o inactivo" },
        { status: 404 }
      );
    }

    // Verificar si el código ha expirado
    if (discount.expires_at && new Date(discount.expires_at) < new Date()) {
      return NextResponse.json(
        { error: "El código de descuento ha expirado" },
        { status: 400 }
      );
    }

    // Verificar límite de uso
    if (discount.usage_limit && discount.usage_count >= discount.usage_limit) {
      return NextResponse.json(
        { error: "El código de descuento ha alcanzado su límite de uso" },
        { status: 400 }
      );
    }

    // Verificar monto mínimo
    if (discount.minimum_amount && cartTotal < discount.minimum_amount) {
      return NextResponse.json(
        {
          error: `El monto mínimo para este descuento es $${discount.minimum_amount.toFixed(2)}`
        },
        { status: 400 }
      );
    }

    // Calcular el descuento
    let discountAmount = 0;
    if (discount.discount_type === "percentage") {
      discountAmount = (cartTotal * discount.discount_value) / 100;
    } else if (discount.discount_type === "fixed") {
      discountAmount = Math.min(discount.discount_value, cartTotal);
    }

    return NextResponse.json({
      discount: discount as DiscountCode,
      discountAmount,
    });
  } catch (error: unknown) {
    console.error("Error validating discount code:", error);
    const message = error instanceof Error ? error.message : "Error interno del servidor";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}