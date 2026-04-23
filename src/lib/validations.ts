import { z } from "zod";

// Product validation schemas
export const productSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(255, "El nombre es demasiado largo"),
  short_description: z.string().min(1, "La descripción corta es requerida").max(500, "La descripción corta es demasiado larga"),
  description: z.string().min(1, "La descripción es requerida"),
  price: z.number().min(0.01, "El precio debe ser mayor a 0"),
  compare_price: z.number().min(0).optional(),
  thumbnail_url: z.string().url("URL de imagen inválida"),
  images: z.string().optional(),
  category_id: z.string().min(1, "La categoría es requerida"),
  stock_quantity: z.number().int().min(0, "La cantidad en stock debe ser 0 o mayor"),
  is_active: z.boolean(),
  slug: z.string().optional(),
});

export const createProductSchema = productSchema.omit({ slug: true });
export const updateProductSchema = productSchema.partial();

// Discount validation schemas
export const discountSchema = z.object({
  code: z.string()
    .min(1, "El código es requerido")
    .max(50, "El código es demasiado largo")
    .regex(/^[A-Z0-9]+$/, "El código solo puede contener letras mayúsculas y números"),
  description: z.string().min(1, "La descripción es requerida").max(500, "La descripción es demasiado larga"),
  discount_type: z.enum(["percentage", "fixed"], {
    errorMap: () => ({ message: "Tipo de descuento inválido" })
  }),
  discount_value: z.number().min(0.01, "El valor del descuento debe ser mayor a 0"),
  minimum_amount: z.number().min(0).optional(),
  usage_limit: z.number().int().min(1).optional(),
  expires_at: z.string().optional(),
  is_active: z.boolean(),
});

export const createDiscountSchema = discountSchema;
export const updateDiscountSchema = discountSchema.partial();

// Checkout validation schemas
export const checkoutItemSchema = z.object({
  name: z.string().min(1),
  price: z.number().min(0),
  quantity: z.number().int().min(1),
  product_id: z.string().min(1),
});

export const checkoutSchema = z.object({
  items: z.array(checkoutItemSchema).min(1, "El carrito debe tener al menos un producto"),
  total: z.number().min(0.01, "El total debe ser mayor a 0"),
  discount: z.object({
    code: z.string(),
    discount_amount: z.number().min(0),
  }).nullable().optional(),
  customerInfo: z.object({
    email: z.string().email("Email inválido"),
    phone: z.string().min(1, "Teléfono requerido"),
    firstName: z.string().min(1, "Nombre requerido"),
    lastName: z.string().min(1, "Apellido requerido"),
    address: z.string().min(1, "Dirección requerida"),
    city: z.string().min(1, "Ciudad requerida"),
    province: z.string().min(1, "Provincia requerida"),
  }),
});

// Login validation schemas
export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Contraseña requerida"),
});

export const signupSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  full_name: z.string().min(1, "Nombre completo requerido"),
});

// API validation schemas
export const discountValidationSchema = z.object({
  code: z.string().min(1, "Código requerido"),
  cartTotal: z.number().min(0, "Total del carrito inválido"),
});

// Store settings validation
export const storeSettingsSchema = z.object({
  store_name: z.string().min(1, "Nombre de tienda requerido"),
  support_email: z.string().email("Email de soporte inválido"),
  contact_phone: z.string().min(1, "Teléfono de contacto requerido"),
  meta_description: z.string().min(1, "Meta descripción requerida"),
});