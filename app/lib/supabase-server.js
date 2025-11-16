// app/lib/supabase-server.ts
import { createServerComponentClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const supabaseServer = createServerComponentClient({ cookies });
