const axios = require('axios');
const fs = require('fs').promises;

// --- CONFIGURATION ---
const rapidApiKey = process.env.RAPIDAPI_KEY || '428d85fe47msh721d8b0fc6607cdp14de85jsna4b2ba373034'; // Replace with your key
const SNEAKERS_FILE = 'sneakers.json';

/**
 * Fetches a specific page of sneaker data from the API.
 * @param {number} pageNumber - The page number to fetch.
 * @returns {Promise<Array>} - A promise that resolves to an array of sneaker objects.
 */
const fetchSneakerPage = async (pageNumber) => {
    const options = {
        method: 'GET',
        url: 'https://the-sneaker-database.p.rapidapi.com/sneakers',
        params: { limit: '100', page: pageNumber.toString() },
        headers: {
            'X-RapidAPI-Key': rapidApiKey,
            'X-RapidAPI-Host': 'the-sneaker-database.p.rapidapi.com'
        }
    };
    try {
        console.log(`Fetching page ${pageNumber} of sneakers from API...`);
        const response = await axios.request(options);
        // The API response has a 'results' key containing the list of sneakers
        return response.data.results || [];
    } catch (error) {
        console.error(`Error fetching page ${pageNumber}:`, error.response ? error.response.data : error.message);
        return [];
    }
};

/**
 * Main function to read, append, and write sneaker data.
 */
const appendData = async () => {
    let fileData = { product: [] };
    let existingProducts = [];

    // 1. Read existing data from sneakers.json
    try {
        const content = await fs.readFile(SNEAKERS_FILE, 'utf-8');
        fileData = JSON.parse(content);
        // Ensure the 'product' key exists and is an array
        if (Array.isArray(fileData.product)) {
            existingProducts = fileData.product;
        }
        console.log(`Found ${existingProducts.length} sneakers in sneakers.json.`);
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.log('sneakers.json not found. A new file will be created.');
        } else {
            console.error('Error reading or parsing sneakers.json. Please check the file for errors.', error);
            return; // Stop execution if file is corrupt
        }
    }

    // 2. Determine the next page number to fetch
    const nextPage = Math.floor(existingProducts.length / 100) + 1;

    // 3. Fetch the new batch of sneaker data
    const newProducts = await fetchSneakerPage(nextPage);
    if (newProducts.length === 0) {
        console.log('No new sneakers were fetched from the API. The file remains unchanged.');
        return;
    }

    // 4. Combine the old and new sneaker lists
    fileData.product = existingProducts.concat(newProducts);

    // 5. Write the combined data back to the file
    try {
        await fs.writeFile(SNEAKERS_FILE, JSON.stringify(fileData, null, 2));
        console.log(`Successfully added ${newProducts.length} new sneakers. Total sneakers: ${fileData.product.length}.`);
        console.log(`The file 'sneakers.json' has been updated.`);
    } catch (error) {
        console.error('Error writing to sneakers.json:', error);
    }
};

appendData();
