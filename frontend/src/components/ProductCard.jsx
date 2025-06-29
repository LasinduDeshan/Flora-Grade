import { ShoppingCart, Eye } from 'lucide-react';
import { useCartStore } from '../lib/store';
import { formatPrice, getGradeColor } from '../lib/utils';
import Button from './ui/Button';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addItem } = useCartStore();

  // Construct full image URL
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `http://localhost:8001${imageUrl}`;
  };

  const handleAddToCart = () => {
    addItem(product, 1);
    toast.success('Added to cart!');
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={getImageUrl(product.image_url)}
          alt={product.name}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
          }}
        />
        {product.flower_grade && (
          <div className="absolute top-2 right-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(product.flower_grade.grade)}`}>
              Grade {product.flower_grade.grade}
            </span>
          </div>
        )}
        {!product.is_approved && (
          <div className="absolute top-2 left-2">
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Pending Approval
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-green-600">{formatPrice(product.price)}</span>
          <span className="text-sm text-gray-500">Stock: {product.stock_quantity}</span>
        </div>

        {product.flower_grade && (
          <div className="mb-3 p-2 bg-gray-50 rounded text-xs">
            <p className="text-gray-600">{product.flower_grade.explanation}</p>
          </div>
        )}

        <div className="flex space-x-2">
          <Link to={`/products/${product.id}`}>
            <Button variant="outline" size="sm" className="flex-1">
              <Eye className="w-4 h-4 mr-1" />
              View Details
            </Button>
          </Link>
          <Button
            variant="primary"
            size="sm"
            onClick={handleAddToCart}
            disabled={product.stock_quantity === 0 || !product.is_approved}
            className="flex-1"
          >
            <ShoppingCart className="w-4 h-4 mr-1" />
            Add to Cart
          </Button>
        </div>

        {product.stock_quantity === 0 && (
          <p className="text-red-600 text-sm mt-2 text-center">Out of stock</p>
        )}
      </div>
    </div>
  );
};

export default ProductCard; 