const supabaseUrl = 'https://tmhjtcdyiwiubodzecby.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtaGp0Y2R5aXdpdWJvZHplY2J5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwOTk1MzksImV4cCI6MjA3MzY3NTUzOX0.MsKki6FXCGpcFF1sFFv9AvlXaOCC43Qi9vuChBn3dPY';

// The global 'supabase' object is available from the Supabase CDN script.
// We are using it to create a client, and then exposing that client globally as 'supabaseClient'.
window.supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);
