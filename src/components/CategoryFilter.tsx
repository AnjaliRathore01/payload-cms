'use client'

import Link from 'next/link'
import type { Category } from '@/payload-types'

interface CategoryFilterProps {
  categories: Category[]
  selectedCategory: string | null
}

export function CategoryFilter({ categories, selectedCategory }: CategoryFilterProps) {
  return (
    <section className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <label htmlFor="category-select" className="text-sm font-medium text-gray-700">
              Filter by Category:
            </label>
            <select
              id="category-select"
              defaultValue={selectedCategory || ''}
              onChange={(e) => {
                const value = e.target.value
                if (value) {
                  window.location.href = `/products?category=${value}`
                } else {
                  window.location.href = '/products'
                }
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.title}
                </option>
              ))}
            </select>
          </div>

          {selectedCategory && (
            <Link
              href="/products"
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear Filter
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
