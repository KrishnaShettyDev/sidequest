import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

// Create a singleton for the browser client to maintain session state
let browserClient: ReturnType<typeof createBrowserClient<Database>> | undefined

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables')
    throw new Error('Supabase configuration missing')
  }

  if (typeof window === 'undefined') {
    // Server-side: always create new client
    return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
  }

  // Client-side: use singleton
  if (!browserClient) {
    browserClient = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
  }

  return browserClient
}
