"use client";

import { useState } from "react";
import { createBrowserClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Wallet, RefreshCw, AlertCircle } from "lucide-react";
import styles from "@/app/(shop)/login/page.module.css";
import { createPublicClient, http, createWalletClient, custom } from "viem";
import { mainnet } from "viem/chains";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function Web3LoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createBrowserClient();

  const handleWeb3Login = async () => {
    if (!supabase) {
      setError("Error de configuración: No se pudo inicializar el cliente de base de datos.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (typeof window.ethereum === 'undefined') {
        throw new Error("No se detectó ninguna billetera (MetaMask, etc.)");
      }

      // 1. Connect to Wallet
      const walletClient = createWalletClient({
        chain: mainnet,
        transport: custom(window.ethereum!)
      });

      const [address] = await walletClient.requestAddresses();

      // 2. Start Supabase Web3 Auth Flow (Sign-In with Ethereum)
      const { data, error: authError } = await supabase.auth.signInWithWeb3({
        chain: 'ethereum',
        options: {
          // You can specify redirection or other options here
        }
      });

      if (authError) throw authError;

      // 3. Sign the message returned by Supabase
      if (data.message) {
        const signature = await walletClient.signMessage({
          account: address as `0x${string}`,
          message: data.message
        });

        // 4. Verify the signature with Supabase
        const { error: verifyError } = await supabase.auth.signInWithWeb3({
          chain: 'ethereum',
          message: data.message,
          signature: signature as `0x${string}`,
        });

        if (verifyError) throw verifyError;

        router.push("/perfil");
        router.refresh();
      }
    } catch (err: any) {
      console.error("Web3 Login Error:", err);
      setError(err.message || "Error al conectar con la billetera.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.methodContainer}>
      <div className={styles.web3Info}>
        <div className={styles.walletIconLarge}>
          <Wallet size={48} />
        </div>
        <p>Conéctate usando tu billetera Web3 de forma segura.</p>
        <p className={styles.helpTextSmall}>Soportamos MetaMask, Rainbow y otras billeteras compatibles con Ethereum.</p>
      </div>

      {error && (
        <div className={styles.alertError}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <button 
        onClick={handleWeb3Login} 
        className={styles.web3Btn} 
        disabled={loading}
      >
        {loading ? <RefreshCw className={styles.spin} /> : (
          <>
            <Wallet size={20} />
            Conectar Billetera
          </>
        )}
      </button>
    </div>
  );
}
