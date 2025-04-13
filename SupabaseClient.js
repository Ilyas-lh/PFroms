// supabaseClient.js - Simple client for our form

// Replace with your Supabase URL and anon key (keep your existing keys)
const supabaseUrl = 'https://wccszfsbabbyrzltbavd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjY3N6ZnNiYWJieXJ6bHRiYXZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0NzI5MzAsImV4cCI6MjA2MDA0ODkzMH0.WZximkNPAOOw2MUZYlIebCed7w0sAkamO6ceVSQ9Iz8';

// Initialize Supabase client
let supabaseClient;

try {
    // When using the CDN, the createClient function is directly available on the supabase object
    supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);
    console.log('Supabase client initialized successfully');
    
    // Test the connection
    supabaseClient.from('simple_form').select('count').limit(1)
        .then(({ data, error }) => {
            if (error) {
                console.error('Supabase connection test failed:', error);
            } else {
                console.log('Supabase connection verified successfully');
            }
        })
        .catch(err => {
            console.error('Supabase connection test exception:', err);
        });
    
} catch (error) {
    console.error('Error initializing Supabase client:', error);
    
    // Create a dummy client so the app doesn't crash
    supabaseClient = {
        from: () => ({
            select: () => Promise.resolve({ data: null, error: { message: 'Supabase initialization failed' } }),
            insert: () => Promise.resolve({ data: null, error: { message: 'Supabase initialization failed' } })
        })
    };
}

// Make our client instance available globally WITHOUT overwriting the main supabase library
window.supabaseClient = supabaseClient;