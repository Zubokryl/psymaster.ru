import { createServerComponentClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  return createServerComponentClient({
    cookies: cookies()
  })
}
