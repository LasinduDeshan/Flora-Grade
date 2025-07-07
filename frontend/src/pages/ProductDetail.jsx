import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productsAPI } from '../lib/api';
import { useCartStore } from '../lib/store';
import { formatPrice, getGradeColor } from '../lib/utils';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState('');
  const { addItem } = useCartStore();
  const [quantity, setQuantity] = useState(1);

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `http://localhost:8001${imageUrl}`;
  };

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line
  }, [id]);

  // Save last viewed product to localStorage
  useEffect(() => {
    if (!product) return;
    const prodData = {
      id: product.product.id,
      name: product.product.name,
      price: product.product.price,
      image: product.product.image_url
    };
    let viewed = JSON.parse(localStorage.getItem('lastViewedProducts') || '[]');
    viewed = viewed.filter(p => p.id !== prodData.id);
    viewed.unshift(prodData);
    viewed = viewed.slice(0, 5);
    localStorage.setItem('lastViewedProducts', JSON.stringify(viewed));
  }, [product]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getProduct(id);
      setProduct(response.data);
      setMainImage(getImageUrl(response.data.product.image_url));
    } catch (error) {
      toast.error('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-300"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Product not found</h2>
        <Link 
          to="/products" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Products
        </Link>
      </div>
    );
  }

  const { product: prod, flower_grade, seller } = product;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="grid md:grid-cols-2 gap-8 p-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <img
                src={mainImage || 'https://via.placeholder.com/600x600?text=Flower+Image'}
                alt={prod.name}
                className="w-full h-96 object-contain"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/600x600?text=Image+Not+Available';
                }}
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6 ">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900 mb-2">{prod.name}</h1>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-lg font-medium text-gray-900">{formatPrice(prod.price)}</span>
                <span className={`text-xs px-2 py-1 rounded ${prod.stock_quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {prod.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
              <p className="text-gray-600 leading-relaxed">{prod.description}</p>
            </div>

            {/* Grade Information */}
            {flower_grade && (
              <div className="border-t border-b border-gray-100 py-4">
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(flower_grade.grade)}`}>
                    Grade {flower_grade.grade}
                  </span>
                  <span className="text-sm text-gray-500">{flower_grade.explanation}</span>
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center mb-4 gap-2">
              <button
                type="button"
                className="px-2 py-1 bg-gray-500 rounded text-lg font-bold text-white"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                disabled={quantity <= 1}
              >-</button>
              <input
                type="number"
                min="1"
                max={prod.stock_quantity}
                value={quantity}
                onChange={e => {
                  let val = parseInt(e.target.value, 10);
                  if (isNaN(val) || val < 1) val = 1;
                  if (val > prod.stock_quantity) val = prod.stock_quantity;
                  setQuantity(val);
                }}
                className="w-12 text-center border rounded text-black"
                disabled={prod.stock_quantity === 0}
              />
              <button
                type="button"
                className="px-2 py-1 bg-gray-500 rounded text-lg font-bold text-white"
                onClick={() => setQuantity(q => Math.min(prod.stock_quantity, q + 1))}
                disabled={quantity >= prod.stock_quantity}
              >+</button>
            </div>

            {/* Add to Cart */}
            <div className="pt-2">
              <Button
                onClick={() => {
                  addItem(prod, quantity);
                  toast.success(`Added ${quantity} to cart!`);
                }}
                disabled={prod.stock_quantity === 0 || !prod.is_approved || quantity < 1 || quantity > prod.stock_quantity}
                className="w-full md:w-auto"
              >
                {prod.stock_quantity === 0 ? 'Out of Stock' : `Add ${quantity} to Cart`}
              </Button>
            </div>

            {/* Seller Info */}
            <div className="text-sm text-gray-600 pt-4 border-t border-gray-100">
              <p className="mb-1">Sold by: <span className="font-medium text-gray-900">{seller.full_name}</span></p>
              <p>Category: <span className="font-medium text-gray-900 capitalize">{prod.category}</span></p>
            </div>

            {/* Back Link */}
            <div className="pt-4">
              <Link 
                to="/products" 
                className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to all products
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;