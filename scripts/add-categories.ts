#!/usr/bin/env tsx

import { config as dotenvConfig } from 'dotenv'
import { getPayload, buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

// Import collections
import { Users } from '../src/collections/Users'
import { Media } from '../src/collections/Media'
import { Products } from '../src/collections/Product'
import { Orders } from '../src/collections/Order'
import { Categories } from '../src/collections/Categories'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')
const envPath = path.join(projectRoot, '.env')

// Load environment variables from absolute path
dotenvConfig({ path: envPath })

// Create payload config inline
const payloadConfig = buildConfig({
  admin: {
    user: Users.slug,
  },
  collections: [Users, Media, Products, Categories, Orders],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(projectRoot, 'src', 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
})

// Check for required environment variables
const requiredEnvVars = ['PAYLOAD_SECRET', 'DATABASE_URI']
const missingEnvVars = requiredEnvVars.filter((varName) => !process.env[varName])

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:')
  missingEnvVars.forEach((varName) => {
    console.error(`   - ${varName}`)
  })
  console.error('\nPlease check your .env file and ensure all required variables are set.')
  process.exit(1)
}

interface CategoryData {
  title: string
  slug: string
  description?: string
  imagePath?: string
}

const sampleCategories: CategoryData[] = [
  {
    title: 'Electronics',
    slug: 'electronics',
    description: 'Latest gadgets, devices, and electronic accessories for modern living.',
    imagePath: '../media/cat.jpg', // Using existing image as placeholder
  },
  {
    title: 'Clothing',
    slug: 'clothing',
    description: 'Fashionable apparel and accessories for every style and occasion.',
    imagePath: '../media/cat.jpg',
  },
  {
    title: 'Home & Garden',
    slug: 'home-garden',
    description: 'Everything you need to make your home beautiful and your garden flourish.',
    imagePath: '../media/cat.jpg',
  },
  {
    title: 'Sports & Outdoors',
    slug: 'sports-outdoors',
    description: 'Gear and equipment for your active lifestyle and outdoor adventures.',
    imagePath: '../media/cat.jpg',
  },
  {
    title: 'Books & Media',
    slug: 'books-media',
    description: 'Books, movies, music, and digital media for entertainment and learning.',
    imagePath: '../media/cat.jpg',
  },
  {
    title: 'Health & Beauty',
    slug: 'health-beauty',
    description: 'Products for your wellness, skincare, and personal care needs.',
    imagePath: '../media/cat.jpg',
  },
  {
    title: 'Automotive',
    slug: 'automotive',
    description: 'Car parts, accessories, and maintenance products for your vehicle.',
    imagePath: '../media/cat.jpg',
  },
  {
    title: 'Toys & Games',
    slug: 'toys-games',
    description: 'Fun toys, games, and entertainment for all ages.',
    imagePath: '../media/cat.jpg',
  },
]

async function uploadImage(payload: any, imagePath: string): Promise<string | null> {
  try {
    // Check if image file exists
    const fullPath = path.resolve(__dirname, imagePath)
    if (!fs.existsSync(fullPath)) {
      console.log(`Image not found: ${fullPath}, skipping image upload`)
      return null
    }

    // Check if image already exists in media collection
    const existingImage = await payload.find({
      collection: 'media',
      where: {
        filename: { equals: path.basename(imagePath) },
      },
      limit: 1,
    })

    if (existingImage.docs.length > 0) {
      console.log(`Using existing image: ${path.basename(imagePath)}`)
      return existingImage.docs[0].id
    }

    // Upload new image
    const imageBuffer = fs.readFileSync(fullPath)
    const imageFile = new File([imageBuffer], path.basename(imagePath), {
      type: 'image/jpeg', // Assuming JPEG, you might want to detect the actual type
    })

    const uploadedImage = await payload.create({
      collection: 'media',
      data: {
        alt: path.basename(imagePath, path.extname(imagePath)),
      },
      file: imageFile,
    })

    console.log(`Uploaded image: ${uploadedImage.filename}`)
    return uploadedImage.id
  } catch (error) {
    console.error(`Error uploading image ${imagePath}:`, error)
    return null
  }
}

async function addCategories() {
  try {
    console.log('🚀 Starting category seeding script...')

    // Initialize Payload
    const payload = await getPayload({ config: payloadConfig })
    console.log('✅ Payload initialized')

    // Check existing categories
    const existingCategories = await payload.find({
      collection: 'categories',
      limit: 100,
    })

    console.log(`📊 Found ${existingCategories.totalDocs} existing categories`)

    // Filter out categories that already exist
    const categoriesToCreate = sampleCategories.filter((sampleCategory) => {
      return !existingCategories.docs.some(
        (existingCategory) => existingCategory.slug === sampleCategory.slug,
      )
    })

    if (categoriesToCreate.length === 0) {
      console.log('🎉 All categories already exist! No new categories to add.')
      return
    }

    console.log(`📝 Creating ${categoriesToCreate.length} new categories...`)

    // Create categories
    for (const categoryData of categoriesToCreate) {
      try {
        console.log(`📦 Creating category: ${categoryData.title}`)

        // Upload image if specified
        let imageId = null
        if (categoryData.imagePath) {
          imageId = await uploadImage(payload, categoryData.imagePath)
        }

        // Create category
        const category = await payload.create({
          collection: 'categories',
          data: {
            title: categoryData.title,
            slug: categoryData.slug,
            description: categoryData.description,
            ...(imageId && { image: imageId }),
          },
        })

        console.log(`✅ Created category: ${category.title} (ID: ${category.id})`)
      } catch (error) {
        console.error(`❌ Error creating category "${categoryData.title}":`, error)
      }
    }

    // Verify final count
    const finalCategories = await payload.find({
      collection: 'categories',
      limit: 100,
    })

    console.log(`\n🎊 Category seeding completed!`)
    console.log(`📈 Total categories in database: ${finalCategories.totalDocs}`)
    console.log(`✨ Added ${categoriesToCreate.length} new categories`)
  } catch (error) {
    console.error('💥 Script failed:', error)
    process.exit(1)
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  addCategories()
    .then(() => {
      console.log('\n🏁 Script finished successfully!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('\n💥 Script failed:', error)
      process.exit(1)
    })
}

export { addCategories }
