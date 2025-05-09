// supabaseClient.js - Improved version
console.log('Loading supabaseClient.js');

// This function initializes Supabase and makes the client available globally
function initSupabase() {
    // Supabase project URL and anonymous key
    const supabaseUrl = 'https://wccszfsbabbyrzltbavd.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjY3N6ZnNiYWJieXJ6bHRiYXZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0NzI5MzAsImV4cCI6MjA2MDA0ODkzMH0.WZximkNPAOOw2MUZYlIebCed7w0sAkamO6ceVSQ9Iz8';

    // Use consistent table name
    const tableName = 'simple_form';

    // Check if Supabase library is available
    if (typeof supabase === 'undefined') {
        console.error('Supabase library not found! Make sure the CDN script is loaded correctly.');
        return null;
    }

    try {
        // Create Supabase client
        const client = supabase.createClient(supabaseUrl, supabaseKey);
        console.log('Supabase client created successfully');
        
        // Test the connection with better error handling
        client.from(tableName).select('count').limit(1)
            .then(response => {
                if (response.error) {
                    if (response.error.code === 'PGRST116') {
                        // Table doesn't exist error - this is normal for first run
                        console.warn(`Table '${tableName}' does not exist yet. Will be created on first submission.`);
                    } else {
                        console.error('Supabase connection test failed:', response.error);
                    }
                } else {
                    console.log('Supabase connection test succeeded');
                }
            })
            .catch(error => {
                console.error('Supabase connection test error:', error);
            });
        
        return client;
    } catch (error) {
        console.error('Error creating Supabase client:', error);
        return null;
    }
}

// Initialize and make available globally
window.supabaseClient = initSupabase();
console.log('Supabase client initialized:', window.supabaseClient ? 'Success' : 'Failed');

// Add a helper function to check if the client is connected
window.isSupabaseConnected = function() {
    return window.supabaseClient !== null && window.supabaseClient !== undefined;
};