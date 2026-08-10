// services/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

// ✅ Your correct Supabase credentials
const supabaseUrl = 'https://hsggqioxzqialxfijysc.supabase.co';
const supabaseAnonKey = 'sb_publishable_Ryn5yLlpjOeJ1SxBAkUQPw_P8hA2sT4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);