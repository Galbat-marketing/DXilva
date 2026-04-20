"use client";

import { useState } from "react";
import { updateOrderStatus } from "./actions";
import styles from "./page.module.css";
import { RefreshCw } from "lucide-react";

interface Props {
  orderId: string;
  initialStatus: string;
}

export default function OrderStatusBadge({ orderId, initialStatus }: Props) {
  const [status, setStatus] = useState(initialStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const statuses = [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled"
  ];

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === status) return;
    
    setIsUpdating(true);
    const result = await updateOrderStatus(orderId, newStatus);
    
    if (result.success) {
      setStatus(newStatus);
    } else {
      alert("Error actualizando el estado: " + result.error);
    }
    setIsUpdating(false);
  };

  return (
    <div className={styles.statusControl}>
      <select 
        value={status} 
        onChange={(e) => handleStatusChange(e.target.value)}
        disabled={isUpdating}
        className={`${styles.badge} ${styles[status]} ${styles.selectBadge}`}
      >
        {statuses.map(s => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      {isUpdating && <RefreshCw size={14} className={styles.spin} />}
    </div>
  );
}
