document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const cartCountElement = document.getElementById('cart-count');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    function displayCheckoutSummary() {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        let itemCount = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
            cartCountElement.textContent = '0';
            cartTotalElement.textContent = '$0.00';
            return;
        }

        cart.forEach(item => {
            const itemElement = document.createElement('p');
            const itemLink = document.createElement('a');
            itemLink.href = '#';
            itemLink.textContent = item.name;
            const itemPrice = document.createElement('span');
            itemPrice.className = 'price';
            itemPrice.textContent = `$${(item.price * item.quantity).toFixed(2)}`;

            itemElement.appendChild(itemLink);
            itemElement.appendChild(document.createTextNode(` x ${item.quantity}`));
            itemElement.appendChild(itemPrice);
            cartItemsContainer.appendChild(itemElement);

            total += item.price * item.quantity;
            itemCount += item.quantity;
        });

        cartCountElement.textContent = itemCount;
        cartTotalElement.textContent = `$${total.toFixed(2)}`;
    }

    displayCheckoutSummary();
});
