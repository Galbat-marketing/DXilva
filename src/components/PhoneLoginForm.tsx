"use client";

import { useState } from "react";
import { requestOTP, verifyOTP } from "@/app/(shop)/login/phone-actions";
import { useRouter } from "next/navigation";
import { Phone, Hash, RefreshCw } from "lucide-react";
import styles from "@/app/(shop)/login/page.module.css";

export default function PhoneLoginForm() {
  const [phone, setPhone] = useState("");
  const [token, setToken] = useState("");
  const [step, setStep] = useState(1); // 1: Request, 2: Verify
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    // Ensure phone starts with +
    const formattedPhone = phone.startsWith("+") ? phone : `+${phone}`;
    
    const result = await requestOTP(formattedPhone);
    if (result.success) {
      setStep(2);
    } else {
      setError(result.error || "Error al enviar el código.");
    }
    setLoading(false);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const formattedPhone = phone.startsWith("+") ? phone : `+${phone}`;
    const result = await verifyOTP(formattedPhone, token);
    
    if (result.success) {
      router.push("/perfil");
      router.refresh();
    } else {
      setError(result.error || "Código inválido.");
    }
    setLoading(false);
  };

  return (
    <div className={styles.methodContainer}>
      {error && <div className={styles.alertError}>{error}</div>}

      {step === 1 ? (
        <form onSubmit={handleRequest} className={styles.formContainer}>
          <div className={styles.formGroup}>
            <label htmlFor="phone">Número de Teléfono</label>
            <div className={styles.inputWrapper}>
              <Phone size={18} className={styles.inputIcon} />
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+53 55555555"
                required
                className={styles.input}
              />
            </div>
            <p className={styles.helpText}>Incluye el código de país (ej. +53 para Cuba)</p>
          </div>
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? <RefreshCw className={styles.spin} /> : "Enviar Código SMS"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerify} className={styles.formContainer}>
          <div className={styles.formGroup}>
            <label htmlFor="token">Código de Verificación</label>
            <div className={styles.inputWrapper}>
              <Hash size={18} className={styles.inputIcon} />
              <input
                type="text"
                id="token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="000000"
                required
                className={styles.input}
              />
            </div>
            <p className={styles.helpText}>Ingresa el código de 6 dígitos enviado a {phone}</p>
          </div>
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? <RefreshCw className={styles.spin} /> : "Verificar e Ingresar"}
          </button>
          <button 
            type="button" 
            className={styles.linkBtn} 
            onClick={() => setStep(1)}
            disabled={loading}
          >
            Cambiar número
          </button>
        </form>
      )}
    </div>
  );
}
