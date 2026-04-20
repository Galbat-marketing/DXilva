import { Product } from "@/types";

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Auriculares Premium Gold",
    slug: "auriculares-premium-gold",
    description: "Experimenta la máxima calidad de sonido con estos auriculares over-ear de diseño exclusivo en acabado dorado y negro. Cancelación activa de ruido y 40 horas de batería.",
    short_description: "Auriculares over-ear con cancelación de ruido",
    price: 249.99,
    compare_price: 299.99,
    currency: "USD",
    thumbnail_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    is_active: true,
  },
  {
    id: "2",
    name: "Reloj Inteligente Serie X",
    slug: "reloj-inteligente-serie-x",
    description: "Elegancia y tecnología en tu muñeca. Monitor de salud avanzado, pantalla OLED y acabado en acero inoxidable mate.",
    short_description: "Smartwatch con monitor de salud avanzado",
    price: 199.50,
    currency: "USD",
    thumbnail_url: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80",
    is_active: true,
  },
  {
    id: "3",
    name: "Mochila Ejecutiva D'XILVA",
    slug: "mochila-ejecutiva-dx",
    description: "Mochila ergonómica, resistente al agua y diseñada para proteger tus dispositivos manteniendo un estilo minimalista e impecable.",
    short_description: "Mochila ergonómica y resistente al agua",
    price: 89.99,
    compare_price: 120.00,
    currency: "USD",
    thumbnail_url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
    is_active: true,
  },
  {
    id: "4",
    name: "Teclado Mecánico Minimalista",
    slug: "teclado-mecanico-minimalista",
    description: "Teclado mecánico premium con switches silenciosos y retroiluminación LED dorada personalizable.",
    short_description: "Teclado mecánico con retroiluminación dorada",
    price: 159.00,
    currency: "USD",
    thumbnail_url: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80",
    is_active: true,
  }
];

export async function getProducts(): Promise<Product[]> {
  // Simula un llamado asíncrono temporal a Base de Datos
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_PRODUCTS);
    }, 500);
  });
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const product = MOCK_PRODUCTS.find(p => p.slug === slug);
      resolve(product || null);
    }, 400);
  });
}
