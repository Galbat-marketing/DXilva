import styles from "./page.module.css";
import { login, signup } from "./actions";
import Link from "next/link";
import LoginCartCleaner from "@/components/LoginCartCleaner";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams;
  const error = params?.error as string;
  const message = params?.message as string;
  const isRegister = params?.type === "register";

  return (
    <div className={styles.container}>
      <LoginCartCleaner />
      <div className={styles.authCard}>
        <h1 className={styles.title}>
          Bienvenido a <span className={styles.goldText}>D'XILVA</span>
        </h1>
        <p className={styles.subtitle}>
          {isRegister ? "Crea tu cuenta comercial." : "Ingresa para gestionar tu cuenta."}
        </p>

        {error && (
          <div className={styles.alertError}>
            {error}
          </div>
        )}

        {message && (
          <div className={styles.alertSuccess}>
            {message}
          </div>
        )}

        <form className={styles.formContainer} action={isRegister ? signup : login}>
          {isRegister && (
            <div className={styles.formGroup}>
              <label htmlFor="full_name">Nombre Completo</label>
              <input type="text" id="full_name" name="full_name" required placeholder="Tu nombre" className={styles.input} />
            </div>
          )}
          <div className={styles.formGroup}>
            <label htmlFor="email">Correo Electrónico</label>
            <input type="email" id="email" name="email" required placeholder="tu@email.com" className={styles.input} />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Contraseña</label>
            <input type="password" id="password" name="password" required placeholder="••••••••" className={styles.input} />
          </div>
          <button type="submit" className={styles.submitBtn}>
            {isRegister ? "Crear Cuenta" : "Entrar"}
          </button>
        </form>

        <div className={styles.toggleText}>
          {isRegister ? (
            <p>
              ¿Ya tienes cuenta? <Link href="/login">Inicia Sesión</Link>
            </p>
          ) : (
            <p>
              ¿No tienes cuenta? <Link href="/login?type=register">Regístrate</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
