import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { productsAPI } from '../lib/api';
import ProductCard from '../components/ProductCard';
import { useAuthStore } from '../lib/store';

const Products = () => {
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    grade: '',
    seller: ''
  });
  const [sortBy, setSortBy] = useState('name');
  const [showUnapproved, setShowUnapproved] = useState(false);
  const { user } = useAuthStore();

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products', filters, sortBy, showUnapproved],
    queryFn: () => productsAPI.getProducts({ 
      ...filters, 
      sort_by: sortBy,
      approved_only: !showUnapproved 
    })
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      grade: '',
      seller: ''
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-black border-t-transparent absolute top-0 left-0"></div>
            </div>
            <div className="text-center">
              <p className="text-xl font-medium text-gray-900">Loading products</p>
              <p className="text-gray-600 mt-1">Discovering beautiful flowers for you...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md w-full text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
              <p className="text-red-600">{error.message}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-gray-900 to-gray-700 rounded-3xl mb-6 shadow-xl">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent mb-4">
            Flower Products
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover beautiful, AI-graded flowers from trusted sellers around the world
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-8 mb-12 shadow-xl shadow-gray-900/5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900">
                Category
              </label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full border-0 bg-white/50 backdrop-blur-sm rounded-2xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-900/10 focus:bg-white transition-all duration-200 shadow-sm"
              >
                <option value="">All Categories</option>
                <option value="roses">Roses</option>
                <option value="tulips">Tulips</option>
                <option value="lilies">Lilies</option>
                <option value="orchids">Orchids</option>
                <option value="sunflowers">Sunflowers</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900">
                Min Price
              </label>
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                placeholder="0"
                className="w-full border-0 bg-white/50 backdrop-blur-sm rounded-2xl px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-gray-900/10 focus:bg-white transition-all duration-200 shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900">
                Max Price
              </label>
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="1000"
                className="w-full border-0 bg-white/50 backdrop-blur-sm rounded-2xl px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-gray-900/10 focus:bg-white transition-all duration-200 shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900">
                Grade
              </label>
              <select
                name="grade"
                value={filters.grade}
                onChange={handleFilterChange}
                className="w-full border-0 bg-white/50 backdrop-blur-sm rounded-2xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-900/10 focus:bg-white transition-all duration-200 shadow-sm"
              >
                <option value="">All Grades</option>
                <option value="A">Grade A</option>
                <option value="B">Grade B</option>
                <option value="C">Grade C</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full border-0 bg-white/50 backdrop-blur-sm rounded-2xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-900/10 focus:bg-white transition-all duration-200 shadow-sm"
              >
                <option value="name">Name</option>
                <option value="price">Price</option>
                <option value="grade">Grade</option>
                <option value="created_at">Newest</option>
              </select>
            </div>

            <div className="flex flex-col justify-end space-y-3">
              <button
                onClick={clearFilters}
                className="group relative overflow-hidden bg-gray-900 text-white px-6 py-3 rounded-2xl font-medium transition-all duration-300 hover:bg-gray-800 hover:scale-105 hover:shadow-xl active:scale-95"
              >
                <span className="relative z-10">Clear Filters</span>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              {(user?.role === 'seller' || user?.role === 'admin') && (
                <button
                  onClick={() => setShowUnapproved(!showUnapproved)}
                  className={`group relative overflow-hidden px-6 py-3 rounded-2xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 ${
                    showUnapproved 
                      ? 'bg-gray-700 text-white hover:bg-gray-600' 
                      : 'bg-white text-gray-900 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="relative z-10">
                    {showUnapproved ? 'Hide Pending' : 'Show Pending'}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <div key={product.id} className="transform hover:scale-105 transition-transform duration-300">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-12 max-w-md w-full text-center shadow-xl">
              <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No products found</h3>
              <p className="text-gray-600 leading-relaxed">
                Try adjusting your filters or check back later for new beautiful flowers from our sellers.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;