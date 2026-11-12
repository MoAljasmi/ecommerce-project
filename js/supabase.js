// Supabase configuration (public publishable key - safe for browser use with RLS enabled)
const SUPABASE_URL = "https://dhphuullfsfdhxzmtsse.supabase.co";
const SUPABASE_KEY = "sb_publishable_cWw_4ZrfpxJ8sbEQCMZJxg_ErOHhzWi";
const ORDER_TABLE = "order";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
