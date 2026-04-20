"use client";

import { useState } from "react";
import { deleteProduct } from "./delete-action";
import { Trash2, RefreshCw } from "lucide-react";
import styles from "./page.module.css";

interface Props {
  productId: string;
}

export default function DeleteProductBtn({ productId }: Props) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.")) {
      return;
    }

    setIsDeleting(true);
    const result = await deleteProduct(productId);
    
    if (result.error) {
      alert("Error al eliminar: " + result.error);
      setIsDeleting(false);
    }
    // No need to setIsDeleting(false) on success as the page revalidates
  };

  return (
    <button 
      className={`${styles.iconBtn} ${styles.deleteBtn}`} 
      onClick={handleDelete}
      disabled={isDeleting}
      title="Eliminar"
    >
      {isDeleting ? <RefreshCw size={18} className={styles.spin} /> : <Trash2 size={18} />}
    </button>
  );
}
