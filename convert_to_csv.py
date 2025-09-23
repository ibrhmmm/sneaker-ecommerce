
import json
import csv
import random

# Open the JSON file and load the data
with open('sneakers.json', 'r') as json_file:
    data = json.load(json_file)

# The list of sneakers is under the 'product' key
sneaker_list = data.get('product', [])

# Open a new CSV file to write to
with open('sneakers.csv', 'w', newline='', encoding='utf-8') as csv_file:
    # Create a CSV writer
    csv_writer = csv.writer(csv_file)

    # Write the header row
    header = ['id', 'name', 'brand', 'releaseDate', 'retailPriceCents', 'imageUrl', 'quantity', 'sizes']
    csv_writer.writerow(header)

    # Loop through each sneaker in the data
    for i, sneaker in enumerate(sneaker_list):
        # --- Image URL Logic ---
        # Check for 'original_picture_url' first, then for 'image.original'
        image_url = sneaker.get('original_picture_url', '')
        if not image_url:
            image_data = sneaker.get('image')
            if image_data and isinstance(image_data, dict):
                image_url = image_data.get('original', '')

        # --- Generate Sizes and Quantity ---
        sizes = {str(size): random.randint(0, 20) for size in range(36, 46)}
        quantity = sum(sizes.values())

        # --- Price Logic ---
        retail_price_cents = sneaker.get('retailPriceCents')
        # If retailPriceCents is not present, try to get it from 'retail_price_cents'
        if retail_price_cents is None:
             retail_price_cents = sneaker.get('retail_price_cents', 0)
        if retail_price_cents is None:
            retail_price_cents = 0


        # --- Create and Write Row ---
        row = [
            i + 1,
            sneaker.get('name', ''),
            sneaker.get('brand_name', sneaker.get('brand', '')),
            sneaker.get('release_date', sneaker.get('releaseDate', '')),
            retail_price_cents,
            image_url,
            quantity,
            json.dumps(sizes)
        ]
        csv_writer.writerow(row)

print(f"Successfully converted {len(sneaker_list)} sneakers to sneakers.csv with corrected image URLs.")

