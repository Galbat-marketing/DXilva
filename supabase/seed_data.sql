-- SCRIPT DE SEMILLA (SEED) PARA D'XILVA
-- Ejecuta esto en el SQL Editor de tu Dashboard de Supabase

-- 1. Insertar una categoría de ejemplo
INSERT INTO categories (name, slug, description)
VALUES ('Tecnología', 'tecnologia', 'Gadgets y dispositivos de última generación')
ON CONFLICT (slug) DO NOTHING;

-- 2. Insertar productos de prueba vinculados a esa categoría
-- Nota: Asegúrate de tener la extensión uuid-ossp activa (está en tu schema.sql)

INSERT INTO products (
  name, 
  slug, 
  description, 
  short_description, 
  price, 
  currency, 
  thumbnail_url, 
  is_active,
  category_id
) 
VALUES 
(
  'Auriculares D''XILVA Gold', 
  'auriculares-dxilva-gold', 
  'Auriculares premium con acabado en oro de 24k y cancelación de ruido activa superior.', 
  'Sonido de alta fidelidad con diseño exclusivo.', 
  299.99, 
  'USD', 
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80', 
  true,
  (SELECT id FROM categories WHERE slug = 'tecnologia' LIMIT 1)
),
(
  'Smartwatch Serie Platinum', 
  'smartwatch-platinum', 
  'El equilibrio perfecto entre elegancia analógica y potencia digital avanzada.', 
  'Reloj inteligente con monitor de salud.', 
  199.50, 
  'USD', 
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80', 
  true,
  (SELECT id FROM categories WHERE slug = 'tecnologia' LIMIT 1)
);
