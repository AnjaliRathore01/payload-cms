import { getPayload } from 'payload'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import config from '@/payload.config'
import type { Product, Media } from '@/payload-types'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params

  let product: Product | null = null

  try {
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    const productResult = await payload.find({
      collection: 'products',
      where: {
        slug: { equals: slug },
        status: { equals: 'active' }
      },
      depth: 3, // Deep population for all related data
      limit: 1
    })

    product = productResult.docs[0] || null
  } catch (error) {
    console.error('Error fetching product:', error)
  }

  if (!product) {
    notFound()
  }

  return <ProductDetailPage product={product} />
}

function ProductDetailPage({ product }: { product: Product }) {
  // Helper function to extract plain text from rich text
  const getPlainTextFromRichText = (richText: any): string => {
    if (!richText?.root?.children) return ''
    return richText.root.children
      .map((child: any) => {
        if (child.type === 'text') return child.text || ''
        if (child.children) return child.children.map((c: any) => c.text || '').join('')
        return ''
      })
      .join(' ')
      .trim()
  }

  const descriptionText = product.description ? getPlainTextFromRichText(product.description) : ''

  // Get all images
  const images = product.images?.filter(img => typeof img === 'object') as Media[] || []

  const isOnSale = product.salePrice && product.salePrice < product.price
  const discountPercentage = isOnSale
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/products"
                className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
              >
                ← Back to Products
              </Link>
              <h1 className="text-2xl font-bold mt-2">{product.title}</h1>
            </div>
            <Link
              href="/"
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Product Details */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {images.length > 0 ? (
              <>
                {/* Main Image */}
                <div className="aspect-square relative rounded-xl overflow-hidden bg-gray-800">
                  <Image
                    src={images[0].url!}
                    alt={images[0].alt || product.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>

                {/* Thumbnail Images */}
                {images.length > 1 && (
                  <div className="grid grid-cols-4 gap-4">
                    {images.slice(1).map((image, index) => (
                      <div key={image.id} className="aspect-square relative rounded-lg overflow-hidden bg-gray-800">
                        <Image
                          src={image.url!}
                          alt={image.alt || `${product.title} ${index + 2}`}
                          fill
                          className="object-cover hover:scale-105 transition-transform cursor-pointer"
                          sizes="25vw"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="aspect-square bg-gray-800 rounded-xl flex items-center justify-center">
                <div className="text-gray-400 text-center">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-lg">No Images Available</p>
                </div>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title and Status */}
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  product.status === 'active'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-gray-500/20 text-gray-400'
                }`}>
                  {product.status === 'active' ? 'Active' : 'Draft'}
                </span>
                {product.stock !== undefined && product.stock !== null && (
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    product.stock > 0
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="border-t border-gray-800 pt-6">
              <div className="flex items-center gap-4 mb-4">
                {isOnSale ? (
                  <>
                    <span className="text-3xl font-bold text-green-400">
                      ${product.salePrice}
                    </span>
                    <span className="text-xl text-gray-500 line-through">
                      ${product.price}
                    </span>
                    <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                      -{discountPercentage}%
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-white">
                    ${product.price}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            {descriptionText && (
              <div className="border-t border-gray-800 pt-6">
                <h2 className="text-xl font-semibold mb-3">Description</h2>
                <p className="text-gray-300 leading-relaxed">
                  {descriptionText}
                </p>
              </div>
            )}

            {/* Product Details */}
            <div className="border-t border-gray-800 pt-6">
              <h2 className="text-xl font-semibold mb-3">Product Details</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Price:</span>
                  <span className="ml-2 text-white">${product.price}</span>
                </div>
                {product.salePrice && (
                  <div>
                    <span className="text-gray-400">Sale Price:</span>
                    <span className="ml-2 text-green-400">${product.salePrice}</span>
                  </div>
                )}
                <div>
                  <span className="text-gray-400">Stock:</span>
                  <span className="ml-2 text-white">{product.stock ?? 0}</span>
                </div>
                <div>
                  <span className="text-gray-400">SKU:</span>
                  <span className="ml-2 text-white">{product.slug}</span>
                </div>
                <div>
                  <span className="text-gray-400">Added:</span>
                  <span className="ml-2 text-white">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Updated:</span>
                  <span className="ml-2 text-white">
                    {new Date(product.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t border-gray-800 pt-6 space-y-4">
              <button
                disabled={!product.stock || product.stock === 0}
                className="w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200
                  disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed
                  bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg"
              >
                {!product.stock || product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>

              <div className="flex gap-4">
                <button className="flex-1 py-3 px-4 rounded-lg font-medium bg-gray-800 hover:bg-gray-700 transition-colors duration-200">
                  Add to Wishlist
                </button>
                <button className="flex-1 py-3 px-4 rounded-lg font-medium bg-gray-800 hover:bg-gray-700 transition-colors duration-200">
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-400">
            <p>© 2024 Your Store. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
