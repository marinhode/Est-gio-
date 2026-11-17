/**
 * Endereço e chave publicável do Supabase. Os dois são públicos por natureza
 * (vão no próprio site); a segurança está nas regras do banco (RLS).
 * Os valores padrão permitem publicar sem configurar variáveis; para outro
 * projeto, defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.
 * Nunca coloque aqui a secret key.
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://hmmrthhwchefxwshpphl.supabase.co'
export const SUPABASE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? 'sb_publishable_iVRZnpXkEhbmBx6zDXd_8w__TeNgSkW'
