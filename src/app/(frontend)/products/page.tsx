import { getPayload } from 'payload'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import config from '@/payload.config'
import type { Product, Media, Category } from '@/payload-types'
import { CategoryFilter } from '@/components/CategoryFilter'

interface ProductsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams
  const selectedCategory = typeof params.category === 'string' ? params.category : null

  let products: Product[] = []
  let categories: Category[] = []
  let payloadConfig: any = null

  try {
    payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    // Fetch all categories for the filter dropdown
    const categoriesResult = await payload.find({
      collection: 'categories',
      limit: 100,
      sort: 'title',
    })
    categories = categoriesResult.docs

    // Build where clause for products based on category filter
    const whereClause: any = {
      status: { equals: 'active' },
    }

    // Add category filter if specified
    if (selectedCategory) {
      whereClause.category = {
        equals: selectedCategory,
      }
    }

    // Fetch active products with images and populate relationships
    const productsResult = await payload.find({
      collection: 'products',
      where: whereClause,
      depth: 2, // Include related media and other relationships
      limit: 100,
      sort: '-createdAt',
    })

    products = productsResult.docs as Product[]
  } catch (error) {
    console.error('Error fetching data:', error)
    // Return empty arrays - error will be handled in UI
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-green-600">
                Our Store
              </Link>
            </div>
            <div className="hidden md:flex space-x-8">
              <Link
                href="/"
                className="text-gray-700 hover:text-green-600 transition-colors font-medium"
              >
                Home
              </Link>
              <Link
                href="/products"
                className="text-gray-700 hover:text-green-600 transition-colors font-medium"
              >
                Products
              </Link>
              <a
                href="https://payloadcms.com/docs"
                className="text-gray-700 hover:text-green-600 transition-colors font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                Docs
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <header className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {selectedCategory
                  ? `Products - ${categories.find((c) => c.id === selectedCategory)?.title || 'Category'}`
                  : 'Our Products'}
              </h1>
              <p className="text-gray-600 mt-2">
                {selectedCategory
                  ? `Browse our ${categories.find((c) => c.id === selectedCategory)?.title?.toLowerCase()} collection`
                  : 'Discover our amazing collection'}
              </p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors duration-200"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Category Filter */}
      <CategoryFilter categories={categories} selectedCategory={selectedCategory} />

      {/* Products Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">No products available at the moment.</div>
            <div className="text-gray-400 text-sm mb-6">Check back later for new products.</div>
          </div>
        ) : (
          <>
            {/* Products Count */}
            <div className="mb-8">
              <p className="text-gray-600">
                Showing {products.length} product{products.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-400">
            <p>© 2024 Your Store. Built with Payload CMS.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}


function ProductCard({ product }: { product: Product }) {
  // Get the first image - it could be a string ID or a Media object
  const mainImage = product.images?.[0]
  const imageData = typeof mainImage === 'object' ? (mainImage as Media) : null

  const isOnSale = product.salePrice && product.salePrice < product.price

  return (
    <Link href={`/products/${product.slug}`} className="block group">
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {imageData?.url ? (
            <Image
              src={imageData.url}
              alt={imageData.alt || product.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <div className="text-gray-400 text-center">
                <svg
                  className="w-8 h-8 mx-auto mb-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-xs">No Image</p>
              </div>
            </div>
          )}

          {/* Sale Badge */}
          {isOnSale && (
            <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
              SALE
            </div>
          )}

          {/* Stock Status */}
          {(product.stock === 0 || product.stock === null) && (
            <div className="absolute top-3 right-3 bg-gray-500 text-white px-2 py-1 rounded text-xs font-medium">
              Out of Stock
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
            {product.title}
          </h3>

          {/* Price */}
          <div className="flex items-center gap-2 mb-2">
            {isOnSale ? (
              <>
                <span className="text-lg font-bold text-green-600">${product.salePrice}</span>
                <span className="text-sm text-gray-500 line-through">${product.price}</span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-900">${product.price}</span>
            )}
          </div>

          {/* Stock Status */}
          <div className="text-xs text-gray-500">
            {product.stock && product.stock > 0 ? (
              <span className="text-green-600">In Stock</span>
            ) : (
              <span className="text-red-600">Out of Stock</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
