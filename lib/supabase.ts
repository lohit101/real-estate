import { createBrowserClient } from "@supabase/ssr";

// Cookie-backed browser sessions, using Supabase's supported auth client.
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
