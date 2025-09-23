document.addEventListener('DOMContentLoaded', async () => {
    const soldItemsBody = document.getElementById('sold-items-body');
    const userActivityBody = document.getElementById('user-activity-body');
    const logoutButton = document.getElementById('logout-button');

    const { data: { user } } = await supabaseClient.auth.getUser();

    if (!user) {
        window.location.href = '/auth.html';
        return;
    }

    const { data: profile, error } = await supabaseClient
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (error || profile.role !== 'admin') {
        window.location.href = '/index.html';
        return;
    }

    logoutButton.addEventListener('click', async () => {
        await supabaseClient.auth.signOut();
        window.location.href = '/auth.html';
    });

    // Fetch and display sold items
    const { data: soldItems, error: soldItemsError } = await supabaseClient
        .from('order_items')
        .select(`
            products (name, price),
            quantity
        `);

    if (soldItemsError) {
        console.error('Error fetching sold items:', soldItemsError);
        return;
    }

    const productSales = soldItems.reduce((acc, item) => {
        const productName = item.products.name;
        if (!acc[productName]) {
            acc[productName] = { price: item.products.price, quantity: 0, total: 0 };
        }
        acc[productName].quantity += item.quantity;
        acc[productName].total += item.products.price * item.quantity;
        return acc;
    }, {});

    Object.keys(productSales).forEach(productName => {
        const product = productSales[productName];
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${productName}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>${product.quantity}</td>
            <td>$${product.total.toFixed(2)}</td>
        `;
        soldItemsBody.appendChild(row);
    });

    // Fetch and display user activity
    const { data: users, error: usersError } = await supabaseClient
        .from('profiles')
        .select(`
            username,
            role,
            users(last_sign_in_at)
        `);

    if (usersError) {
        console.error('Error fetching user activity:', usersError);
        return;
    }

    users.forEach(profile => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${profile.username}</td>
            <td>${profile.role}</td>
            <td>${new Date(profile.users.last_sign_in_at).toLocaleString()}</td>
        `;
        userActivityBody.appendChild(row);
    });
});