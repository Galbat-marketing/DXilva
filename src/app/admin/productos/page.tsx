import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";
import { Plus, Search, Edit, ExternalLink } from "lucide-react";
import DeleteProductBtn from "./DeleteProductBtn";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from("products")
    .select("*, categories(name)")
    .order("created_at", { ascending: false });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Gestión de Productos</h1>
          <p>Administra tu catálogo e inventario físico</p>
        </div>
        <Link href="/admin/productos/nuevo" className={styles.addBtn}>
          <Plus size={20} />
          Nuevo Producto
        </Link>
      </header>

      <div className={styles.controls}>
        <div className={styles.searchWrapper}>
          <Search size={18} className={styles.searchIcon} />
          <input type="text" placeholder="Buscar por nombre o SKU..." className={styles.searchInput} />
        </div>
        <div className={styles.filters}>
          <select className={styles.select}>
            <option value="">Todas las categorías</option>
            <option value="tecnologia">Tecnología</option>
          </select>
          <select className={styles.select}>
            <option value="">Estado: Todos</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products && products.length > 0 ? (
              products.map((product) => (
                <tr key={product.id}>
                  <td className={styles.productCell}>
                    <div className={styles.thumbnail}>
                      <Image
                        src={product.thumbnail_url || "/placeholder.png"}
                        alt={product.name}
                        width={48}
                        height={48}
                      />
                    </div>
                    <div className={styles.productInfo}>
                      <span className={styles.productName}>{product.name}</span>
                      <span className={styles.productSku}>{product.sku || "Sin SKU"}</span>
                    </div>
                  </td>
                  <td>{product.categories?.name || "Sin categoría"}</td>
                  <td className={styles.price}>${Number(product.price).toFixed(2)}</td>
                  <td>
                    <span className={product.stock_quantity < 5 ? styles.lowStock : ""}>
                      {product.stock_quantity} unidades
                    </span>
                  </td>
                  <td>
                    <span className={`${styles.statusDot} ${product.is_active ? styles.active : styles.inactive}`}></span>
                    {product.is_active ? "Activo" : "Oculto"}
                  </td>
                  <td className={styles.actions}>
                    <Link href={`/tienda/${product.slug}`} target="_blank" className={styles.iconBtn} title="Ver en tienda">
                      <ExternalLink size={18} />
                    </Link>
                    <Link href={`/admin/productos/editar/${product.id}`} className={styles.iconBtn} title="Editar">
                      <Edit size={18} />
                    </Link>
                    <DeleteProductBtn productId={product.id} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className={styles.empty}>No se encontraron productos en la base de datos.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
