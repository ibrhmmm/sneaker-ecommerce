
# SneakerHub Marketplace

Welcome to SneakerHub, a dynamic e-commerce website for buying and selling the latest and greatest sneakers. This project is a complete front-to-back solution, featuring a customer-facing storefront, an admin dashboard for product management, and a robust data pipeline for populating the product catalog.

## ✨ Features

-   **Dynamic Product Catalog:** Browse a wide variety of sneakers, with details, images, and pricing.
-   **User Authentication:** Secure user sign-up and login functionality.
-   **Shopping Cart & Checkout:** A complete payment flow for purchasing sneakers.
-   **Wishlist:** Users can save their favorite sneakers to a personal wishlist.
-   **Admin Dashboard:** A dedicated interface for administrators to manage inventory, view products, and add new admins.
-   **Automated Data Pipeline:** Scripts to fetch sneaker data from external APIs, process it, and upload it directly to the Supabase database.

## 🛠️ Tech Stack

-   **Frontend:** HTML5, CSS3, JavaScript
-   **Backend & Database:** [Supabase](https://supabase.io/)
-   **Data Processing:** Python, Node.js
-   **Development Environment:** Nix (via `.idx/dev.nix`)

## 📂 Project Structure

Here is a brief overview of the key files and directories:

```
├── .idx/
│   ├── dev.nix           # Nix environment configuration for reproducible builds.
│   └── airules.md        # AI assistant configuration.
├── images/               # Site images and assets.
├── payment/              # HTML, CSS, and JS for cart, checkout, and confirmation.
├── append_sneakers.js    # Node.js script to fetch sneaker data from an API.
├── convert_to_csv.py     # Python script to convert the fetched JSON data to CSV.
├── upload_to_supabase.js # Node.js script to upload the CSV data to Supabase.
├── fetch_from_supabase.js # Node.js script to fetch and display data from Supabase.
├── supabase.js           # Supabase client initialization for the frontend.
├── index.html            # The main landing page for the marketplace.
├── admin.html            # Admin dashboard for product management.
├── auth.html             # User authentication page (Login/Signup).
├── style.css             # Main stylesheet for the application.
└── README.md             # You are here!
```

## 🚀 Getting Started

### 1. Environment Setup

This project uses Nix for a reproducible development environment. The `.idx/dev.nix` file installs all the necessary packages like `nodejs` and `python`. When you open this project in a Nix-compatible IDE (like Firebase Studio), the environment will be configured automatically.

### 2. Configure Supabase

The frontend and backend scripts connect to a Supabase project for data storage and authentication.

1.  In `supabase.js`, `upload_to_supabase.js`, and `fetch_from_supabase.js`, ensure the `SUPABASE_URL` and `SUPABASE_ANON_KEY` variables are set to your Supabase project's credentials.

### 3. Data Pipeline: Populating the Sneaker Catalog

The product data is populated through a multi-step pipeline.

**Step 1: Fetch Sneaker Data from API**
Run the `append_sneakers.js` script to fetch data from an external API and save it as `sneakers.json`.

```bash
node append_sneakers.js
```

**Step 2: Convert JSON to CSV**
The `sneakers.json` file contains raw data. The Python script `convert_to_csv.py` processes this file, cleans the data, generates random stock levels, and creates a clean `sneakers.csv` file.

```bash
python3 convert_to_csv.py
```

**Step 3: Upload CSV to Supabase**
Finally, use the `upload_to_supabase.js` script to read `sneakers.csv` and upload its contents to your `sneaker` table in Supabase.

> **Note:** Ensure your Supabase table (`sneaker`) has columns that match the headers in `sneakers.csv`: `id`, `name`, `brand`, `releaseDate`, `retailPriceCents`, `imageUrl`, `quantity`, and `sizes`.

```bash
node upload_to_supabase.js
```

## 🌐 Usage

-   **Main Site:** Open `index.html` to browse the sneaker catalog.
-   **Admin Panel:** Open `admin.html` to access the administrative dashboard.
-   **Authentication:** Use the forms in `auth.html` to sign up or log in.

