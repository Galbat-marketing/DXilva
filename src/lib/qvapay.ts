/**
 * QvaPay API Client
 * Docs: https://qvapay.com/docs/1.0/overview
 * Base URL: https://qvapay.com/api/v1
 * Auth: app_id + app_secret as query parameters
 */

const QVAPAY_BASE = "https://api.qvapay.com/v2";

// ─── Interfaces ─────────────────────────────────────────────

export interface QvaPayProduct {
  name: string;
  price: number;
  quantity: number;
}

export interface CreateInvoiceParams {
  amount: number;
  description: string;
  remote_id: string;
}

export interface QvaPayInvoiceResponse {
  app_id: string;
  amount: string;
  description: string;
  remote_id: string;
  transaction_uuid: string;
  url: string;
}

// ─── Helpers ────────────────────────────────────────────────

function getCredentials() {
  const appId = process.env.QVAPAY_APP_ID;
  const appSecret = process.env.QVAPAY_APP_SECRET;

  if (!appId || !appSecret) {
    throw new Error(
      "QvaPay credentials not configured. Set QVAPAY_APP_ID and QVAPAY_APP_SECRET in .env"
    );
  }

  return { appId, appSecret };
}

// ─── API Methods ────────────────────────────────────────────

export async function createInvoice(
  params: CreateInvoiceParams
): Promise<QvaPayInvoiceResponse> {
  const { appId, appSecret } = getCredentials();

  const res = await fetch(`${QVAPAY_BASE}/create_invoice`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "app-id": appId,
      "app-secret": appSecret,
    },
    body: JSON.stringify({
      amount: params.amount,
      description: params.description.slice(0, 300),
      remote_id: params.remote_id,
    }),
  });

  let dataText = "";
  try {
    dataText = await res.text();
    if (!res.ok) {
      throw new Error(`QvaPay API Error (${res.status}): ${dataText}`);
    }
    
    if (dataText.trim().startsWith("<")) {
      throw new Error("QvaPay devolvió código HTML. Verifica tus credenciales.");
    }
    
    return JSON.parse(dataText);
  } catch (error: any) {
    throw new Error(error.message || `Error en la respuesta: ${dataText.slice(0, 100)}`);
  }
}

export async function getInvoice(
  transactionUuid: string
): Promise<any> {
  // En v2 de QvaPay usualmente se requiere Auth via headers.
  // Nota: Si este endpoint (v2/transaction) no existe, no debemos bloquear el webhook, 
  // sino retornar algo simulado o simplemente marcar pending.
  const { appId, appSecret } = getCredentials();
  const res = await fetch(`${QVAPAY_BASE}/transactions/${transactionUuid}`, {
    method: "GET",
    headers: {
      "app-id": appId,
      "app-secret": appSecret,
    },
  });

  if (!res.ok) {
    throw new Error(`Error validando transación: ${res.status}`);
  }

  return res.json();
}
