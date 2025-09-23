// vendor.js
const supabaseUrl = 'https://tmhjtcdyiwiubodzecby.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtaGp0Y2R5aXdpdWJvZHplY2J5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwOTk1MzksImV4cCI6MjA3MzY3NTUzOX0.MsKki6FXCGpcFF1sFFv9AvlXaOCC43Qi9vuChBn3dPY';

const supabase = supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', async () => {
    const user = await supabase.auth.getUser();
    if (!user.data.user || sessionStorage.getItem('user_role') !== 'vendor') {
        window.location.href = 'auth.html';
        return;
    }

    const addProductForm = document.getElementById('add-product-form');
    const myProductsBody = document.getElementById('my-products-body');

    addProductForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('product-name').value;
        const imageUrl = document.getElementById('product-image').value;
        const retailPrice = document.getElementById('product-price').value;
        const quantity = document.getElementById('product-quantity').value;

        const { data, error } = await supabase
            .from('sneakers')
            .insert([{ 
                name, 
                imageUrl, 
                retailPrice, 
                quantity, 
                vendor_id: user.data.user.id 
            }]);

        if (error) {
            alert('Error adding product: ' + error.message);
        } else {
            alert('Product added successfully!');
            addProductForm.reset();
            loadVendorProducts();
        }
    });

    async function loadVendorProducts() {
        myProductsBody.innerHTML = '';
        const { data, error } = await supabase
            .from('sneakers')
            .select('*')
            .eq('vendor_id', user.data.user.id);

        if (error) {
            console.error('Error fetching products:', error);
        } else {
            data.forEach(product => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${product.name}</td>
                    <td>$${product.retailPrice}</td>
                    <td>${product.quantity}</td>
                    <td>
                        <button class="btn-edit">Edit</button>
                        <button class="btn-delete">Delete</button>
                    </td>
                `;
                myProductsBody.appendChild(row);
            });
        }
    }

    document.getElementById('logout-button').addEventListener('click', async () => {
        await supabase.auth.signOut();
        sessionStorage.removeItem('user_role');
        window.location.href = 'index.html';
    });

    loadVendorProducts();
});