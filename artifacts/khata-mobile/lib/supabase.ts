import { createClient } from '@supabase/supabase-js';

// 🔴 TODO: paste in the SAME Supabase URL and anon key your delivery-app
// project uses (look inside the delivery-app's own supabase.ts /
// supabaseClient.ts file for these two values — they must be the SAME
// project so both apps read/write the same tables, like `deliveries`).
const supabaseUrl = 'https://hsggqioxzqialxfijysc.supabase.co';
const supabaseAnonKey = 'sb_publishable_Ryn5yLlpjOeJ1SxBAkUQPw_P8hA2sT4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);