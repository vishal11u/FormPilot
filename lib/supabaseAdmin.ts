import { createClient } from "@supabase/supabase-js";

// IMPORTANT: Use environment variables; DO NOT hardcode keys here.
// The key must be the service_role key (not the anon/public key).
const supabaseUrl = "https://bgfxjhgyfbcxdivspjtl.supabase.co";
const supabaseServiceRoleKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnZnhqaGd5ZmJjeGRpdnNwanRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3MTA1NTYsImV4cCI6MjA3MjI4NjU1Nn0.t3lYIRnMGjEF_ih0kbliPzICFE6tTf86jrsvb057IU8";

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error(
    "Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY on the server."
  );
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);
