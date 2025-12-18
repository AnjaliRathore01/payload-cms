#!/usr/bin/env tsx

import { config as dotenvConfig } from 'dotenv'
import { getPayload, buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { fileURLToPath } from 'url'
import path from 'path'
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

const sampleCategories = [
  {
    title: 'Electronics',
    slug: 'electronics',
    description: 'Latest gadgets, devices, and electronic accessories for modern living.',
  },
  {
    title: 'Clothing',
    slug: 'clothing',
    description: 'Fashionable apparel and accessories for every style and occasion.',
  },
  {
    title: 'Home & Garden',
    slug: 'home-garden',
    description: 'Everything you need to make your home beautiful and your garden flourish.',
  },
  {
    title: 'Sports & Outdoors',
    slug: 'sports-outdoors',
    description: 'Gear and equipment for your active lifestyle and outdoor adventures.',
  },
  {
    title: 'Books & Media',
    slug: 'books-media',
    description: 'Books, movies, music, and digital media for entertainment and learning.',
  },
  {
    title: 'Health & Beauty',
    slug: 'health-beauty',
    description: 'Products for your wellness, skincare, and personal care needs.',
  },
]

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

        const category = await payload.create({
          collection: 'categories',
          data: {
            title: categoryData.title,
            slug: categoryData.slug,
            description: categoryData.description,
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

// Run the script if called directly
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
