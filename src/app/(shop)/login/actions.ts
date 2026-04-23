"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { loginSchema, signupSchema } from "@/lib/validations";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  // Validate input data
  const validationResult = loginSchema.safeParse(data);
  if (!validationResult.success) {
    redirect(`/login?error=${encodeURIComponent("Datos inválidos")}`);
  }

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  redirect("/perfil");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const validationData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    full_name: formData.get("full_name") as string,
  };

  // Validate input data
  const validationResult = signupSchema.safeParse(validationData);
  if (!validationResult.success) {
    redirect(`/login?error=${encodeURIComponent("Datos inválidos")}&type=register`);
  }

  const data = {
    email: validationData.email,
    password: validationData.password,
    options: {
      data: {
        full_name: validationData.full_name,
      }
    }
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}&type=register`);
  }

  // Si no hay error, le avisamos que revise su correo
  redirect("/login?message=Por+favor,+revisa+tu+correo+para+confirmar+tu+cuenta.");
}

export async function signout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
