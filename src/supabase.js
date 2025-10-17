import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ushzdidzrkuzzczekagp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzaHpkaWR6cmt1enpjemVrYWdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2Mjc3NjgsImV4cCI6MjA3NjIwMzc2OH0.KBxu9hScOzGdZT2SFskwAD0-HR9h-nN1MMMZTMeVleQ";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
