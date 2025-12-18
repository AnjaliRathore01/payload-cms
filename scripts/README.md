# Utility Scripts

This directory contains utility scripts for managing your Payload CMS data.

## Available Scripts

### `add-categories.ts`
Adds sample categories to your database with images.

**Usage:**
```bash
pnpm run add-categories
# or
npm run add-categories
```

**Features:**
- Creates 8 sample categories (Electronics, Clothing, Home & Garden, etc.)
- Uploads placeholder images for each category
- Skips categories that already exist
- Safe to run multiple times

### `add-categories-simple.ts`
Adds sample categories to your database without images.

**Usage:**
```bash
pnpm run add-categories-simple
# or
npm run add-categories-simple
```

**Features:**
- Creates 6 sample categories without images
- Faster execution (no file uploads)
- Skips categories that already exist
- Safe to run multiple times

### `add-products.ts`
Adds sample products to your database with images.

**Usage:**
```bash
pnpm run add-products
# or
npm run add-products
```

**Features:**
- Creates 10 sample products across different categories
- Includes image uploads for each product
- Products have pricing, descriptions, stock levels, and status
- Skips products that already exist
- Safe to run multiple times

### `add-products-simple.ts`
Adds sample products to your database without images.

**Usage:**
```bash
pnpm run add-products-simple
# or
npm run add-products-simple
```

**Features:**
- Creates 10 sample products without images
- Faster execution (no file uploads)
- Products have pricing, descriptions, stock levels, and status
- Skips products that already exist
- Safe to run multiple times

## Prerequisites

1. **Environment Variables**: Ensure your `.env` file contains the required variables:
   - `PAYLOAD_SECRET`: Your Payload CMS secret key
   - `DATABASE_URI`: Your database connection string

2. **Database**: Make sure your database is accessible and running.

The scripts use Payload's Local API to interact with your database and do not require the development server to be running.

## Sample Data

### Categories

The scripts create the following categories:

1. **Electronics** - Latest gadgets and devices
2. **Clothing** - Fashionable apparel and accessories
3. **Home & Garden** - Home improvement and gardening supplies
4. **Sports & Outdoors** - Active lifestyle gear
5. **Books & Media** - Entertainment and educational content
6. **Health & Beauty** - Wellness and personal care products
7. **Automotive** - Car parts and accessories *(full script only)*
8. **Toys & Games** - Entertainment for all ages *(full script only)*

### Products

The product scripts create the following sample products:

**Electronics:**
- Wireless Bluetooth Headphones ($89.99, sale: $79.99)
- Smartphone Stand ($19.99)

**Clothing:**
- Cotton T-Shirt ($24.99, sale: $19.99)
- Denim Jeans ($79.99)

**Home & Garden:**
- Ceramic Plant Pot ($34.99)
- Garden Hose 50ft ($29.99)

**Sports & Outdoors:**
- Yoga Mat ($39.99, sale: $34.99)
- Water Bottle 32oz ($16.99)

**Books & Media:**
- Programming Guide ($49.99)

**Health & Beauty:**
- Natural Face Cream ($24.99)

Each product includes:
- Title and unique slug
- Pricing (some with sale prices)
- Rich text descriptions
- Stock levels
- Active status (ready for display)

## Customization

You can modify the sample data in the script files to add your own categories or change the existing ones.

## Troubleshooting

- **Script fails to run**: Make sure `tsx` is installed as a dev dependency
- **Database connection issues**: Ensure your Payload server is running
- **Permission errors**: Check your database connection and user permissions
- **Image upload fails**: Verify the media directory exists and contains valid image files
