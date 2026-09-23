import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

/**
 * Cliente con la clave secreta: ignora RLS, así que solo puede usarse en el
 * servidor. Se crea de forma perezosa para que el build no falle cuando las
 * variables aún no están configuradas.
 */
export function supabaseAdmin(): SupabaseClient {
  if (cached) return cached;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;

  if (!url || !key) {
    throw new Error(
      "Faltan SUPABASE_URL o SUPABASE_SECRET_KEY. Revisa .env.local (o las variables en Vercel).",
    );
  }

  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}

export function supabaseConfigurado() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SECRET_KEY);
}
