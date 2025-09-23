let menu = document.querySelector('#menu-bar');
let navbar = document.querySelector('.navbar');

menu.onclick = () => {
  menu.classList.toggle('fa-times');
  navbar.classList.toggle('active');
}

window.onscroll = () => {
  menu.classList.remove('fa-times');
  navbar.classList.remove('active');
}

let slides = [];
let index = 0;

function next(){
    if (slides.length === 0) return;
    slides[index].classList.remove('active');
    index = (index + 1) % slides.length;
    slides[index].classList.add('active');
}

function prev(){
    if (slides.length === 0) return;
    slides[index].classList.remove('active');
    index = (index - 1 + slides.length) % slides.length;
    slides[index].classList.add('active');
}

// --- APPLICATION LOGIC ---

document.addEventListener('DOMContentLoaded', () => {
    if (window.supabaseClient) {
        loadProducts();
        loadFeaturedProducts();
        loadRandomFeaturedProducts();
    } else {
        console.error('Supabase client not found. Make sure supabase.js is loaded before this script.');
    }
    updateHeaderCounts();
    handleCookieBanner();
});

// Add a single, delegated event listener for the featured products section
document.addEventListener('click', function(e) {
    if (e.target.matches('.featured .small-image img')) {
        const row = e.target.closest('.row');
        if (row) {
            const bigImage = row.querySelector('.big-image img');
            if (bigImage) {
                bigImage.src = e.target.src;
            }
        }
    }
});

/**
 * Fetches 5 random sneakers from Supabase and populates the hero slider.
 */
async function loadFeaturedProducts() {
    if (!window.supabaseClient) {
        console.error('Supabase client is not available for featured products.');
        return;
    }

    const { data: sneakers, error } = await window.supabaseClient.from('sneakers').select('id, name, retailPrice, imageUrl');

    if (error) {
        console.error('Error fetching featured products:', error.message);
        return;
    }

    const featuredSneakers = sneakers.sort(() => 0.5 - Math.random()).slice(0, 5);
    const container = document.querySelector('.home');
    if (!container) {
        console.error('Home container not found for featured products.');
        return;
    }

    const existingSlides = container.querySelectorAll('.slide-container');
    existingSlides.forEach(slide => slide.remove());

    featuredSneakers.forEach((sneaker, i) => {
        const slideEl = document.createElement('div');
        slideEl.classList.add('slide-container');
        if (i === 0) slideEl.classList.add('active');

        slideEl.innerHTML = `
            <div class="slide">
                <div class="content">
                    <span>new arrival</span>
                    <h3>${sneaker.name}</h3>
                    <p>The latest and greatest from Soles, featuring the iconic ${sneaker.name}.</p>
                    <a href="#" class="btn">add to cart</a>
                </div>
                <div class="image">
                    <img src="${sneaker.imageUrl}" class="shoe" alt="${sneaker.name}">
                </div>
            </div>
        `;
        
        const nextButton = container.querySelector('#next');
        if (nextButton) container.insertBefore(slideEl, nextButton);
        else container.appendChild(slideEl);
    });
    
    slides = document.querySelectorAll('.home .slide-container');
    index = 0;
}

/**
 * Fetches 3 random sneakers and populates the featured products section.
 */
async function loadRandomFeaturedProducts() {
    if (!window.supabaseClient) {
        console.error('Supabase client is not available.');
        return;
    }

    const { data: sneakers, error } = await window.supabaseClient.from('sneakers').select('id, name, retailPrice, imageUrl, sizes');
    if (error) {
        console.error('Error fetching random featured products:', error.message);
        return;
    }

    const randomFeatured = sneakers.sort(() => 0.5 - Math.random()).slice(0, 3);
    const container = document.querySelector('#featured');
    if (!container) {
        console.error('Featured products container not found.');
        return;
    }

    const existingRows = container.querySelectorAll('.row');
    existingRows.forEach(row => row.remove());

    randomFeatured.forEach((sneaker, index) => {
        const rowEl = document.createElement('div');
        rowEl.classList.add('row');

        const imageContainerHTML = `
            <div class="image-container">
                <div class="big-image">
                    <img src="${sneaker.imageUrl}" alt="${sneaker.name}">
                </div>
            </div>`;

        const contentHTML = `
            <div class="content">
                <h3>${sneaker.name}</h3>
                <div class="stars">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="far fa-star"></i>
                </div>
                <p>A top-quality shoe, the ${sneaker.name} is a must-have for any collection.</p>
                <div class="price">$${sneaker.retailPrice} <span>$${(sneaker.retailPrice * 1.25).toFixed(2)}</span></div>
                <a href="#" class="btn">add to cart</a>
            </div>`;

        rowEl.innerHTML = (index % 2 === 0) ? imageContainerHTML + contentHTML : contentHTML + imageContainerHTML;
        container.appendChild(rowEl);
    });
}

/**
 * Fetches sneakers from Supabase and populates the product section.
 */
async function loadProducts() {
    if (!window.supabaseClient) {
        console.error('Supabase client is not available.');
        return;
    }

    const { data: sneakers, error } = await window.supabaseClient.from('sneakers').select('id, name, retailPrice, imageUrl, sizes');
    if (error) {
        console.error('Error fetching products:', error.message);
        return;
    }

    const container = document.querySelector('.products .box-container');
    if (!container) {
        console.error('Products container not found.');
        return;
    }

    container.innerHTML = '';

    sneakers.forEach(sneaker => {
        const productEl = document.createElement('div');
        productEl.classList.add('box');
        const availableSizes = sneaker.sizes || {};
        const sizeOptions = Object.keys(availableSizes).filter(size => availableSizes[size] > 0).map(size => `<option value="${size}">${size}</option>`).join('');

        productEl.innerHTML = `
            <div class="icons">
                <a href="#" class="fas fa-heart add-to-wishlist"></a>
                <a href="#" class="fas fa-share"></a>
            </div>
            <img src="${sneaker.imageUrl}" alt="${sneaker.name}">
            <div class="content">
                <h3>${sneaker.name}</h3>
                <div class="price">$${sneaker.retailPrice}</div>
                ${sizeOptions.length > 0 ? `<select class="size-selector"><option value="">Select Size</option>${sizeOptions}</select>` : '<p>Out of Stock</p>'}
                <a href="#" class="btn add-to-cart ${sizeOptions.length === 0 ? 'disabled' : ''}">add to cart</a>
            </div>
        `;

        container.appendChild(productEl);

        const product = { id: sneaker.id, name: sneaker.name, price: sneaker.retailPrice, image_url: sneaker.imageUrl, sizes: sneaker.sizes };

        productEl.querySelector('.add-to-cart').addEventListener('click', (e) => {
            e.preventDefault();
            const sizeSelector = productEl.querySelector('.size-selector');
            const selectedSize = sizeSelector ? sizeSelector.value : null;
            if (sizeOptions.length > 0 && !selectedSize) {
                alert('Please select a size.');
                return;
            }
            addToCart(product, selectedSize);
        });

        productEl.querySelector('.add-to-wishlist').addEventListener('click', (e) => {
            e.preventDefault();
            addToWishlist(product);
        });
    });
}

/**
 * Adds a product to the local storage cart.
 */
function addToCart(product, size) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProduct = cart.find(item => item.id === product.id && item.size === size);
    if (existingProduct) existingProduct.quantity++;
    else cart.push({ ...product, quantity: 1, size: size });
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${product.name} (Size: ${size}) has been added to your cart.`);
    updateHeaderCounts();
}

/**
 * Adds a product to the local storage wishlist.
 */
function addToWishlist(product) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const existingProduct = wishlist.find(item => item.id === product.id);
    if (!existingProduct) {
        wishlist.push(product);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        alert(`${product.name} has been added to your wishlist.`);
    } else {
        alert(`${product.name} is already in your wishlist.`);
    }
    updateHeaderCounts();
}

/**
 * Updates the cart and wishlist item counts in the header.
 */
function updateHeaderCounts() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const cartCountEl = document.getElementById('cart-item-count');
    const wishlistCountEl = document.getElementById('wishlist-item-count');
    const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCountEl) cartCountEl.textContent = totalCartItems > 0 ? totalCartItems : '';
    if (wishlistCountEl) wishlistCountEl.textContent = wishlist.length > 0 ? wishlist.length : '';
}

// --- COOKIE BANNER LOGIC ---

function handleCookieBanner() {
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');
    if (cookieBanner && cookieAccept) {
        if (!getCookie('cookies_accepted')) cookieBanner.style.display = 'block';
        cookieAccept.addEventListener('click', () => {
            setCookie('cookies_accepted', 'true', 365);
            cookieBanner.style.display = 'none';
        });
    }
}

function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i=0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
