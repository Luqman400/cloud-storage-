import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Fails loudly instead of silently breaking every Supabase call later.
  console.error(
    "Missing Supabase environment variables. Create a .env.local file " +
      "with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (see .env.example)."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Name of the Storage bucket this app reads/writes files to.
// Must match the bucket you create in the Supabase dashboard.
export const BUCKET_NAME = "files";
