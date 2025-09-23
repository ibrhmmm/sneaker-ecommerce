document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const role = document.getElementById('role').value;

            // Hardcoded accounts
            const users = {
                admin: { username: 'admin', role: 'admin' },
                seller: { username: 'seller', role: 'seller' },
                buyer: { username: 'buyer', role: 'buyer' },
            };

            if (users[role] && users[role].username === username) {
                localStorage.setItem('loggedInUser', JSON.stringify(users[role]));
                window.location.href = `/${role}.html`;
            } else {
                alert('Invalid username or role.');
            }
        });
    }
});
