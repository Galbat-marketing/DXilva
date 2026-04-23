"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteDiscount } from "./actions";

interface Props {
  discountId: string;
}

export default function DeleteDiscountBtn({ discountId }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de que quieres eliminar este código de descuento?")) {
      return;
    }

    startTransition(async () => {
      try {
        await deleteDiscount(discountId);
        router.refresh();
      } catch (error) {
        alert("Error al eliminar el código de descuento");
        console.error(error);
      }
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="iconBtn"
      title="Eliminar"
    >
      <Trash2 size={18} />
    </button>
  );
}