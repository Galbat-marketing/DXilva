"use server";

import { createClient } from "@/utils/supabase/server";

export async function requestOTP(phone: string) {
  const supabase = await createClient();
  
  const { error } = await supabase.auth.signInWithOtp({
    phone: phone,
  });

  if (error) {
    console.error("Error requesting OTP:", error);
    return { error: error.message };
  }

  return { success: true };
}

export async function verifyOTP(phone: string, token: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: 'sms',
  });

  if (error) {
    console.error("Error verifying OTP:", error);
    return { error: error.message };
  }

  return { success: true };
}
