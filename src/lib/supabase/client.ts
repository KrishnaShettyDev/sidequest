import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

// Create a singleton for the browser client to maintain session state
let browserClient: ReturnType<typeof createBrowserClient<Database>> | undefined

export function createClient() {
  if (typeof window === 'undefined') {
    // Server-side: always create new client
    return createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }

  // Client-side: use singleton
  if (!browserClient) {
    browserClient = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }

  return browserClient
}
