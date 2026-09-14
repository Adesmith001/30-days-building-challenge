export const config = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL?.trim() ?? '',
  supabaseKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim() ?? '',
  appUrl: (import.meta.env.VITE_APP_URL?.trim() || window.location.origin).replace(/\/$/u, ''),
}

export const isSupabaseConfigured = import.meta.env.VITE_FORCE_DEMO !== 'true' && Boolean(config.supabaseUrl && config.supabaseKey)
