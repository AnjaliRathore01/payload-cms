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

## Prerequisites

1. **Environment Variables**: Ensure your `.env` file contains the required variables:
   - `PAYLOAD_SECRET`: Your Payload CMS secret key
   - `DATABASE_URI`: Your database connection string

2. **Database**: Make sure your database is accessible and running.

The scripts use Payload's Local API to interact with your database and do not require the development server to be running.

## Sample Categories

The scripts create the following categories:

1. **Electronics** - Latest gadgets and devices
2. **Clothing** - Fashionable apparel and accessories
3. **Home & Garden** - Home improvement and gardening supplies
4. **Sports & Outdoors** - Active lifestyle gear
5. **Books & Media** - Entertainment and educational content
6. **Health & Beauty** - Wellness and personal care products
7. **Automotive** - Car parts and accessories *(full script only)*
8. **Toys & Games** - Entertainment for all ages *(full script only)*

## Customization

You can modify the sample data in the script files to add your own categories or change the existing ones.

## Troubleshooting

- **Script fails to run**: Make sure `tsx` is installed as a dev dependency
- **Database connection issues**: Ensure your Payload server is running
- **Permission errors**: Check your database connection and user permissions
- **Image upload fails**: Verify the media directory exists and contains valid image files
