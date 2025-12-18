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

interface ProductData {
  title: string
  slug: string
  price: number
  salePrice?: number
  description?: any
  stock?: number
  status: 'draft' | 'active'
  imagePaths?: string[]
}

const sampleProducts: ProductData[] = [
  // Electronics
  {
    title: 'Wireless Bluetooth Headphones',
    slug: 'wireless-bluetooth-headphones',
    price: 89.99,
    salePrice: 79.99,
    description: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'High-quality wireless Bluetooth headphones with noise cancellation and premium sound quality.'
              }
            ]
          }
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1
      }
    },
    stock: 25,
    status: 'active',
    imagePaths: ['../media/cat.jpg']
  },
  {
    title: 'Smartphone Stand',
    slug: 'smartphone-stand',
    price: 19.99,
    description: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Adjustable smartphone stand perfect for video calls, watching videos, or following recipes.'
              }
            ]
          }
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1
      }
    },
    stock: 50,
    status: 'active',
    imagePaths: ['../media/cat.jpg']
  },

  // Clothing
  {
    title: 'Cotton T-Shirt',
    slug: 'cotton-t-shirt',
    price: 24.99,
    salePrice: 19.99,
    description: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Comfortable 100% cotton t-shirt available in multiple colors and sizes.'
              }
            ]
          }
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1
      }
    },
    stock: 100,
    status: 'active',
    imagePaths: ['../media/cat.jpg']
  },
  {
    title: 'Denim Jeans',
    slug: 'denim-jeans',
    price: 79.99,
    description: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Classic denim jeans with a comfortable fit and durable construction.'
              }
            ]
          }
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1
      }
    },
    stock: 30,
    status: 'active',
    imagePaths: ['../media/cat.jpg']
  },

  // Home & Garden
  {
    title: 'Ceramic Plant Pot',
    slug: 'ceramic-plant-pot',
    price: 34.99,
    description: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Beautiful ceramic plant pot perfect for indoor plants and decoration.'
              }
            ]
          }
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1
      }
    },
    stock: 20,
    status: 'active',
    imagePaths: ['../media/cat.jpg']
  },
  {
    title: 'Garden Hose 50ft',
    slug: 'garden-hose-50ft',
    price: 29.99,
    description: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Durable garden hose perfect for watering plants and garden maintenance.'
              }
            ]
          }
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1
      }
    },
    stock: 15,
    status: 'active',
    imagePaths: ['../media/cat.jpg']
  },

  // Sports & Outdoors
  {
    title: 'Yoga Mat',
    slug: 'yoga-mat',
    price: 39.99,
    salePrice: 34.99,
    description: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Non-slip yoga mat with excellent cushioning for comfortable workouts.'
              }
            ]
          }
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1
      }
    },
    stock: 40,
    status: 'active',
    imagePaths: ['../media/cat.jpg']
  },
  {
    title: 'Water Bottle 32oz',
    slug: 'water-bottle-32oz',
    price: 16.99,
    description: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Insulated water bottle that keeps drinks cold for 24 hours or hot for 12 hours.'
              }
            ]
          }
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1
      }
    },
    stock: 60,
    status: 'active',
    imagePaths: ['../media/cat.jpg']
  },

  // Books & Media
  {
    title: 'Programming Guide',
    slug: 'programming-guide',
    price: 49.99,
    description: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Comprehensive programming guide for beginners and intermediate developers.'
              }
            ]
          }
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1
      }
    },
    stock: 10,
    status: 'active',
    imagePaths: ['../media/cat.jpg']
  },

  // Health & Beauty
  {
    title: 'Natural Face Cream',
    slug: 'natural-face-cream',
    price: 24.99,
    description: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Natural face cream made with organic ingredients for healthy, glowing skin.'
              }
            ]
          }
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1
      }
    },
    stock: 35,
    status: 'active',
    imagePaths: ['../media/cat.jpg']
  }
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

async function addProducts() {
  try {
    console.log('🚀 Starting product seeding script...')

    // Initialize Payload
    const payload = await getPayload({ config: payloadConfig })
    console.log('✅ Payload initialized')

    // Check existing products
    const existingProducts = await payload.find({
      collection: 'products',
      limit: 100,
    })

    console.log(`📊 Found ${existingProducts.totalDocs} existing products`)

    // Filter out products that already exist
    const productsToCreate = sampleProducts.filter((sampleProduct) => {
      return !existingProducts.docs.some(
        (existingProduct) => existingProduct.slug === sampleProduct.slug,
      )
    })

    if (productsToCreate.length === 0) {
      console.log('🎉 All products already exist! No new products to add.')
      return
    }

    console.log(`📝 Creating ${productsToCreate.length} new products...`)

    // Create products
    for (const productData of productsToCreate) {
      try {
        console.log(`📦 Creating product: ${productData.title}`)

        // Upload images if specified
        let imageIds: string[] = []
        if (productData.imagePaths && productData.imagePaths.length > 0) {
          for (const imagePath of productData.imagePaths) {
            const imageId = await uploadImage(payload, imagePath)
            if (imageId) {
              imageIds.push(imageId)
            }
          }
        }

        // Create product
        const product = await payload.create({
          collection: 'products',
          data: {
            title: productData.title,
            slug: productData.slug,
            price: productData.price,
            salePrice: productData.salePrice,
            description: productData.description,
            stock: productData.stock,
            status: productData.status,
            ...(imageIds.length > 0 && { images: imageIds }),
          },
        })

        console.log(`✅ Created product: ${product.title} (ID: ${product.id})`)
      } catch (error) {
        console.error(`❌ Error creating product "${productData.title}":`, error)
      }
    }

    // Verify final count
    const finalProducts = await payload.find({
      collection: 'products',
      limit: 100,
    })

    console.log(`\n🎊 Product seeding completed!`)
    console.log(`📈 Total products in database: ${finalProducts.totalDocs}`)
    console.log(`✨ Added ${productsToCreate.length} new products`)

  } catch (error) {
    console.error('💥 Script failed:', error)
    process.exit(1)
  }
}

// Run the script if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  addProducts()
    .then(() => {
      console.log('\n🏁 Script finished successfully!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('\n💥 Script failed:', error)
      process.exit(1)
    })
}

export { addProducts }
