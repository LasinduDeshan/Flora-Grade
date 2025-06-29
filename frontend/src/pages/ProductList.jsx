import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function ProductList() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({
    grade: '',
    search: ''
  })

  // Construct full image URL
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `http://localhost:8001${imageUrl}`;
  };

  useEffect(() => {
    fetchProducts()
  }, [filters])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filters.grade) params.append('grade_filter', filters.grade)
      
      const response = await fetch(`http://localhost:8001/products?${params}`)
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      } else {
        setError('Failed to fetch products')
      }
    } catch (error) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  const getGradeColor = (grade) => {
    switch (grade?.toUpperCase()) {
      case 'A': return 'text-emerald-600 bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200'
      case 'B': return 'text-blue-600 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200'
      case 'C': return 'text-amber-600 bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200'
      default: return 'text-gray-600 bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200'
    }
  }

  const filteredProducts = products.filter(product => {
    if (filters.search) {
      return product.product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
             product.product.description.toLowerCase().includes(filters.search.toLowerCase())
    }
    return true
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-gray-200 mx-auto"></div>
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-black border-t-transparent absolute top-0 left-1/2 transform -translate-x-1/2"></div>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-900">Loading premium flowers</h3>
            <p className="text-gray-600">Discovering the finest quality blooms...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-gray-900 to-gray-700 rounded-3xl mb-6 shadow-xl">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent mb-4">
            Premium Flowers
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover the finest quality flowers, each graded by our advanced AI system for guaranteed excellence
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-8 mb-12 shadow-xl shadow-gray-900/5">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900">Search Flowers</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search by name or description..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 border-0 bg-white/50 backdrop-blur-sm rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-gray-900/10 focus:bg-white transition-all duration-200 shadow-sm"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900">Quality Grade</label>
              <select
                value={filters.grade}
                onChange={(e) => setFilters({ ...filters, grade: e.target.value })}
                className="w-full border-0 bg-white/50 backdrop-blur-sm rounded-2xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-900/10 focus:bg-white transition-all duration-200 shadow-sm"
              >
                <option value="">All Quality Grades</option>
                <option value="A">Premium Grade A</option>
                <option value="B">Select Grade B</option>
                <option value="C">Standard Grade C</option>
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading products</h3>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-12 max-w-md w-full text-center shadow-xl">
              <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No flowers found</h3>
              <p className="text-gray-600 leading-relaxed">
                Try adjusting your search terms or quality grade filters to discover more beautiful blooms.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((item) => (
              <Link
                key={item.product.id}
                to={`/products/${item.product.id}`}
                className="group bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-xl shadow-gray-900/5 hover:shadow-2xl hover:shadow-gray-900/10 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2"
              >
                <div className="aspect-square overflow-hidden relative">
                  <img
                    src={getImageUrl(item.product.image_url)}
                    alt={item.product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x400?text=Image+Not+Available';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  {item.flower_grade && (
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1.5 text-xs font-bold rounded-full border backdrop-blur-sm ${getGradeColor(item.flower_grade.grade)}`}>
                        Grade {item.flower_grade.grade}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="mb-3">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors mb-2">
                      {item.product.name}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                      {item.product.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                        ${item.product.price}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-gray-500">Stock</span>
                      <p className="text-lg font-semibold text-gray-900">{item.product.stock_quantity}</p>
                    </div>
                  </div>
                  
                  {item.seller && (
                    <div className="flex items-center pt-4 border-t border-gray-100">
                      <div className="w-8 h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Seller</p>
                        <p className="text-sm font-medium text-gray-900">{item.seller.username}</p>
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductList