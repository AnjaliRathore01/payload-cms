import { headers as getHeaders } from 'next/headers.js'
import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import type { Category, Media, Product, Notification } from '@/payload-types'
import './styles.css'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  // Fetch categories with images
  let categories: Category[] = []
  try {
    const categoriesResult = await payload.find({
      collection: 'categories',
      depth: 2, // Include related media
      limit: 20,
      sort: 'title',
    })
    categories = categoriesResult.docs
  } catch (error) {
    console.error('Error fetching categories:', error)
  }

  // Fetch featured products
  let featuredProducts: Product[] = []
  try {
    const productsResult = await payload.find({
      collection: 'products',
      where: {
        status: { equals: 'active' },
      },
      depth: 2,
      limit: 6,
      sort: '-createdAt',
    })
    featuredProducts = productsResult.docs
  } catch (error) {
    console.error('Error fetching featured products:', error)
  }

  // Fetch active notifications for carousel
  let notifications: Notification[] = []
  try {
    const notificationsResult = await payload.find({
      collection: 'notifications',
      where: {
        active: { equals: true },
        ...(new Date().toISOString() && {
          or: [
            { expiresAt: { greater_than: new Date().toISOString() } },
            { expiresAt: { exists: false } },
          ],
        }),
      },
      sort: '-priority,-createdAt', // High priority first, then newest
      limit: 10,
    })
    notifications = notificationsResult.docs
  } catch (error) {
    console.error('Error fetching notifications:', error)
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

      {/* Hero Section */}
      <header className="bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Welcome to Our Store
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Discover amazing products across our carefully curated categories. From fresh arrivals
              to timeless classics.
            </p>
            {!user && (
              <p className="text-lg text-gray-500 mb-8">
                Sign in to access exclusive features and manage your account
              </p>
            )}
            {user && <p className="text-lg text-gray-500 mb-8">Welcome back, {user.email}!</p>}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/products"
                className="px-8 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-lg"
              >
                Shop All Products
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Notifications Carousel */}
      {notifications.length > 0 && <NotificationsCarousel notifications={notifications} />}

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Explore our wide range of product categories and find exactly what you&apos;re looking for
            </p>
          </div>

          {categories.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-4">No categories available yet.</div>
              <div className="text-gray-400 text-sm">Check back later for new categories.</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Featured Products
              </h2>
              <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
                Check out our latest and most popular products
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredProducts.slice(0, 3).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="text-center">
              <Link
                href="/products"
                className="inline-block px-8 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-lg"
              >
                View All Products
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* News/Updates Section */}
      <section className="py-16 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Latest Updates</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Stay informed about new products and store updates
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">New Products Added</h3>
              <p className="text-gray-600 text-sm mb-4">
                We&apos;re constantly adding new products to our collection. Check back regularly for
                fresh arrivals.
              </p>
              <Link
                href="/products"
                className="text-green-600 hover:text-green-700 font-medium text-sm"
              >
                Browse Products →
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Fast Shipping</h3>
              <p className="text-gray-600 text-sm mb-4">
                Enjoy fast and reliable shipping on all orders. Quality products delivered to your
                doorstep.
              </p>
              <span className="text-gray-500 font-medium text-sm">Coming Soon</span>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality Guarantee</h3>
              <p className="text-gray-600 text-sm mb-4">
                All our products come with quality guarantee. Shop with confidence and satisfaction.
              </p>
              <span className="text-gray-500 font-medium text-sm">Learn More</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/products"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    All Products
                  </Link>
                </li>
                <li>
                  <a
                    href="https://payloadcms.com/docs"
                    className="text-gray-300 hover:text-white transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Documentation
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Categories</h3>
              <ul className="space-y-2">
                {categories.slice(0, 5).map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`/products?category=${category.slug}`}
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {category.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">About</h3>
              <p className="text-gray-300">
                Built with Payload CMS - a powerful headless CMS for modern web applications.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
            <p>© 2024 Your Store. Built with Payload CMS.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function NotificationsCarousel({ notifications }: { notifications: Notification[] }) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden">
          <div className="flex animate-marquee">
            {/* Duplicate notifications for seamless loop */}
            {[...notifications, ...notifications].map((notification, index) => (
              <div
                key={`${notification.id}-${index}`}
                className="flex items-center space-x-4 mx-8 flex-shrink-0"
              >
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    notification.type === 'success'
                      ? 'bg-green-500'
                      : notification.type === 'warning'
                        ? 'bg-yellow-500'
                        : notification.type === 'error'
                          ? 'bg-red-500'
                          : notification.type === 'promotion'
                            ? 'bg-pink-500'
                            : notification.type === 'news'
                              ? 'bg-indigo-500'
                              : 'bg-blue-500'
                  }`}
                >
                  {notification.icon ? (
                    <span className="text-white text-sm">{notification.icon}</span>
                  ) : (
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  )}
                </div>
                <div className="text-white">
                  <p className="font-semibold text-sm">{notification.title}</p>
                  <p className="text-blue-100 text-xs">{notification.message}</p>
                </div>
                {notification.link && (
                  <a
                    href={notification.link}
                    className="text-blue-200 hover:text-white text-sm underline ml-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Learn More →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function CategoryCard({ category }: { category: Category }) {
  // Get the category image
  const categoryImage = typeof category.image === 'object' ? (category.image as Media) : null

  return (
    <Link href={`/products?category=${category.slug}`} className="group block">
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200">
        {/* Category Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {categoryImage?.url ? (
            <Image
              src={categoryImage.url}
              alt={categoryImage.alt || category.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <div className="text-gray-400 text-center">
                <svg
                  className="w-12 h-12 mx-auto mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <p className="text-xs font-medium">{category.title}</p>
              </div>
            </div>
          )}
        </div>

        {/* Category Info */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
            {category.title}
          </h3>
          {category.description && (
            <p className="text-gray-600 text-sm line-clamp-2 mb-4">{category.description}</p>
          )}
          <div className="flex items-center text-green-600 group-hover:text-green-700 transition-colors">
            <span className="text-sm font-medium">Explore Category</span>
            <svg
              className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  )
}

function ProductCard({ product }: { product: Product }) {
  // Get the first image
  const mainImage = product.images?.[0]
  const imageData = typeof mainImage === 'object' ? (mainImage as Media) : null

  const isOnSale = product.salePrice && product.salePrice < product.price

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {imageData?.url ? (
            <Image
              src={imageData.url}
              alt={imageData.alt || product.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
