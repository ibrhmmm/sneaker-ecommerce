const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://tmhjtcdyiwiubodzecby.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtaGp0Y2R5aXdpdWJvZHplY2J5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODA5OTUzOSwiZXhwIjoyMDczNjc1NTM5fQ.L-lP1n9aL2c6s2erf_5f4f__pG6gHw4e1c14G_sT29s'; // Use service_role key for admin actions

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createAdmin() {
    const email = 'admin@soles.com';
    const password = 'adminpassword';

    // Check if the user already exists
    const { data: { users }, error: getUserError } = await supabase.auth.admin.listUsers();

    if (getUserError) {
        console.error('Error fetching users:', getUserError);
        return;
    }

    const adminExists = users.find(user => user.email === email);

    if (adminExists) {
        // If the user exists, check if the role is correct. If not, update it.
        if (adminExists.app_metadata.role !== 'admin') {
            console.log('Admin user exists but has incorrect role. Updating role...');
            const { data, error } = await supabase.auth.admin.updateUserById(
                adminExists.id,
                { app_metadata: { role: 'admin' } }
            );

            if (error) {
                console.error('Error updating admin user role:', error);
            } else {
                console.log('Admin user role updated successfully.');
            }
        } else {
            console.log('Admin user already exists with the correct role.');
        }
        return;
    }

    // Create the user
    const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Auto-confirm the email
        app_metadata: { role: 'admin' },
    });

    if (error) {
        console.error('Error creating admin user:', error);
    } else {
        console.log('Admin user created successfully:', data.user.email);
    }
}

createAdmin();
