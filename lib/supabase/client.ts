import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Fail loudly at build/runtime instead of silently returning empty data —
  // makes misconfigured .env.local obvious immediately.
  throw new Error(
    'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. ' +
      'Check your .env.local file (see .env.local.example).'
  );
}

// A single shared client is safe here because:
//  - we only ever use the public anon key (never a secret/service key)
//  - Row Level Security enforces what this key can actually do (read
//    categories/products, insert-only on orders)
//  - this app has no login/session state to isolate between users
// This client works in both Server Components and Client Components.
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
