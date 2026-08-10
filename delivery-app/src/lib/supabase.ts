// // // delivery-app/src/lib/supabase.ts
// // import { createClient } from '@supabase/supabase-js';

// // // Use environment variables or hardcode for now
// // // const supabaseUrl = 'https://your-project-id.supabase.co'; // Replace with your URL
// // const supabaseUrl = 'https://hsggqioxzqialxfijysc.supabase.co';
// // // const supabaseAnonKey = 'your-supabase-anon-key'; // Replace with your key
// // const supabaseAnonKey = 'sb_publishable_Ryn5yLlpjOeJ1SxBAkUQPw_P8hA2sT4';

// // export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// // export interface User {
// //   id: number;
// //   name: string;
// //   phone: string;
// //   email: string | null;
// //   role: 'admin' | 'owner' | 'staff';
// //   created_at?: string;
// // }

// // export default supabase;
// // delivery-app/src/lib/supabase.ts
// import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = 'https://hsggqioxzqialxfijysc.supabase.co';
// const supabaseAnonKey = 'sb_publishable_Ryn5yLlpjOeJ1SxBAkUQPw_P8hA2sT4';

// export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// export interface User {
//   id: number;
//   name: string;
//   phone: string;
//   email: string | null;
//   password_hash?: string; // Added password_hash field
//   role: 'admin' | 'owner' | 'staff';
//   created_at?: string;
// }

// export default supabase;
// delivery-app/src/lib/supabase.ts
// import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = 'https://hsggqioxzqialxfijysc.supabase.co';
// const supabaseAnonKey = 'sb_publishable_Ryn5yLlpjOeJ1SxBAkUQPw_P8hA2sT4';

// export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// export interface User {
//   id: number;
//   name: string;
//   phone: string;
//   email: string | null;
//   password_hash?: string; // Added this field
//   role: 'admin' | 'owner' | 'staff';
//   created_at?: string;
// }

// export default supabase;
// Khata-Pro/delivery-app/src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// 🔴 Use the SAME Supabase URL and anon key as your khata-mobile project
const supabaseUrl = 'https://hsggqioxzqialxfijysc.supabase.co';
const supabaseAnonKey = 'sb_publishable_Ryn5yLlpjOeJ1SxBAkUQPw_P8hA2sT4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface User {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  business_id?: number;
  delivery_address?: string;
}