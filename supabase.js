const supabaseUrl = 'api_url';
const supabaseKey = 'api_key';

// The global 'supabase' object is available from the Supabase CDN script.
// We are using it to create a client, and then exposing that client globally as 'supabaseClient'.
window.supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);
