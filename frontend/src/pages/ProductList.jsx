import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FiArrowRight as ArrowRight,
  FiTruck as TruckIcon,
  FiCheckCircle as CheckIcon,
  FiInfo as InfoIcon } from 'react-icons/fi'
import toast from 'react-hot-toast'

function ProductList() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({
    grade: '',
    search: '',
    priceRange: '',
    category: ''
  })
  const [lastViewedProducts, setLastViewedProducts] = useState([])
  const [currentBanner, setCurrentBanner] = useState(0)
  const location = useLocation();

  // Banner data
  const banners = [
    {
      id: 1,
      title: "Premium Roses Collection",
      subtitle: "Hand-selected luxury roses grown in our eco-friendly gardens, each bloom nurtured to perfection for unforgettable moments.",
      discount: "30% OFF",
      image: "https://images.pexels.com/photos/104844/rose-pink-floral-arrangement-bouquet-104844.jpeg",
      color: "from-rose-800 to-black-100"
    },
    {
      id: 2,
      title: "Wedding Flower Packages",
      subtitle: "Breathtaking floral arrangements designed to transform your wedding vision into reality - from classic roses to seasonal blooms, each crafted with precision and care.",
      discount: "25% OFF",
      image: "https://images.pexels.com/photos/1445697/pexels-photo-1445697.jpeg",
      color: "from-amber-500/80 to-black-100"
    },
    {
      id: 3,
      title: "Seasonal Blooms",
      subtitle: "Celebrate nature's fleeting beauty with our exclusive seasonal collection - hand-picked at peak perfection and available only while supplies last.",
      discount: "40% OFF",
      image: "https://images.pexels.com/photos/16009468/pexels-photo-16009468.jpeg",
      color: "from-emerald-800 to-black-100"
    }
  ]

  // Advertisement data
  const advertisements = [
    {
      id: 1,
      title: "Free Delivery",
      subtitle: "On orders over $50",
      icon: <TruckIcon className="w-6 h-6" />,
      color: "from-black to-gray-800"
    },
    {
      id: 2,
      title: "Fresh Guarantee",
      subtitle: "7-day freshness promise",
      icon: <CheckIcon className="w-6 h-6" />,
      color: "from-black to-gray-800"
    },
    {
      id: 3,
      title: "Expert Care Tips",
      subtitle: "Free with every purchase",
      icon: <InfoIcon className="w-6 h-6" />,
      color: "from-black to-gray-800"
    }
  ]


  // Construct full image URL
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `http://localhost:8001${imageUrl}`;
  };

  // Banner rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Load last viewed products from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('lastViewedProducts');
    if (stored) {
      setLastViewedProducts(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    fetchProducts()
  }, [filters])

  useEffect(() => {
    if (location.state?.productAdded) {
      toast.success('Product added successfully!');
      // Clear the state so it doesn't show again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

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

  const clearFilters = () => {
    setFilters({
      grade: '',
      search: '',
      priceRange: '',
      category: ''
    })
  }

  const handleProductClick = (productId) => {
    // In a real app, this would use React Router
    console.log(`Navigate to product ${productId}`)
  }

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
      {/* Hero Banner Carousel - Modified with Left Gradient */}
      <div className="relative h-[500px] mb-8 overflow-hidden">
        {banners.map((banner, index) => (
          <div 
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentBanner ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <div className="relative h-full w-full overflow-hidden">
              {/* Background image */}
              <img 
                src={banner.image} 
                alt={banner.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              {/* Left-side gradient overlay */}
              <div className={`absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r ${banner.color} opacity-80`} />
              
              {/* Semi-transparent overlay */}
              <div className="absolute inset-0 bg-black/20" />
              
              {/* Content */}
              <div className="relative h-full flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="max-w-xl">
                    <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white font-semibold mb-4">
                      {banner.discount}
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">{banner.title}</h2>
                    <p className="text-lg md:text-sm text-white/90 mb-6">{banner.subtitle}</p>
                    <button className="bg-white text-gray-900 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-200 shadow-lg flex items-center">
                      Shop Now
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Banner Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBanner(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentBanner ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Rest of your existing code remains exactly the same */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent mb-4">
            Premium Flowers
          </h1>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover the finest quality flowers, each graded by our advanced AI system for guaranteed excellence
          </p>
        </div>

        {/* Advertisement Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {advertisements.map((ad) => (
            <div 
              key={ad.id} 
              className={`bg-gradient-to-r ${ad.color} p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-1`}
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-black/30 rounded-full flex items-center justify-center mr-4 group-hover:bg-white/10 transition-colors duration-300">
                  {ad.icon}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{ad.title}</h3>
                  <p className="text-white/80">{ad.subtitle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Filters */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-8 mb-12 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Filter & Search</h3>
            <button 
              onClick={clearFilters}
              className="text-sm text-gray-600 hover:text-gray-900 font-medium"
            >
              Clear All
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  placeholder="Search by name..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-white/50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-gray-900/10 focus:bg-white transition-all duration-200 shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900">Quality Grade</label>
              <select
                value={filters.grade}
                onChange={(e) => setFilters({ ...filters, grade: e.target.value })}
                className="w-full border border-gray-200 bg-white/50 backdrop-blur-sm rounded-2xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-900/10 focus:bg-white transition-all duration-200 shadow-sm"
              >
                <option value="">All Quality Grades</option>
                <option value="A">Premium Grade A</option>
                <option value="B">Select Grade B</option>
                <option value="C">Standard Grade C</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900">Price Range</label>
              <select
                value={filters.priceRange}
                onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                className="w-full border border-gray-200 bg-white/50 backdrop-blur-sm rounded-2xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-900/10 focus:bg-white transition-all duration-200 shadow-sm"
              >
                <option value="">All Prices</option>
                <option value="0-25">Under $25</option>
                <option value="25-50">$25 - $50</option>
                <option value="50-100">$50 - $100</option>
                <option value="100+">$100+</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full border border-gray-200 bg-white/50 backdrop-blur-sm rounded-2xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-900/10 focus:bg-white transition-all duration-200 shadow-sm"
              >
                <option value="">All Categories</option>
                <option value="roses">Roses</option>
                <option value="tulips">Tulips</option>
                <option value="lilies">Lilies</option>
                <option value="orchids">Orchids</option>
                <option value="sunflowers">Sunflowers</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <h4 className="text-lg font-semibold text-gray-900">
              {filteredProducts.length} Products Found
            </h4>
            {(filters.search || filters.grade || filters.priceRange || filters.category) && (
              <div className="flex flex-wrap gap-2">
                {filters.search && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    Search: "{filters.search}"
                  </span>
                )}
                {filters.grade && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Grade: {filters.grade}
                  </span>
                )}
                {filters.priceRange && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                    Price: ${filters.priceRange}
                  </span>
                )}
                {filters.category && (
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                    Category: {filters.category}
                  </span>
                )}
              </div>
            )}
          </div>
          
        </div>

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
              <p className="text-gray-600 leading-relaxed mb-6">
                Try adjusting your search terms or quality grade filters to discover more beautiful blooms.
              </p>
              <button 
                onClick={clearFilters}
                className="bg-gray-900 text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors duration-200"
              >
                Clear Filters
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((item) => (
              <Link
                key={item.product.id}
                to={`/products/${item.product.id}`}
                className="group bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-xl shadow-gray-900/5 hover:shadow-2xl hover:shadow-gray-900/10 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 cursor-pointer"
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

        {/* Last Viewed Products */}
        {lastViewedProducts.length > 0 && (
          <div className="mb-12 mt-20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Recently Viewed</h3>
              <button className="text-sm text-gray-600 hover:text-gray-900 font-medium">
                View All
              </button>
            </div>
            <div className="flex space-x-4 overflow-x-auto pb-4">
              {lastViewedProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="flex-shrink-0 w-48 bg-white/70 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={getImageUrl(product.image)}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x400?text=Image+Not+Available';
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 text-sm mb-1 truncate">{product.name}</h4>
                    <p className="text-lg font-bold text-gray-700">${product.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

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
      </div>
    </div>
  )
}

export default ProductList