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
  const { addItem } = useCartStore();

  // Construct full image URL
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `http://localhost:8001${imageUrl}`;
  };

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getProduct(id);
      setProduct(response.data);
    } catch (error) {
      toast.error('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Product not found</h2>
        <Link to="/products" className="text-green-600 hover:underline">Back to Products</Link>
      </div>
    );
  }

  const { product: prod, flower_grade, seller } = product;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <img
            src={getImageUrl(prod.image_url)}
            alt={prod.name}
            className="w-full h-96 object-cover rounded-lg shadow"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
            }}
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{prod.name}</h1>
          <p className="text-gray-600 mb-4">{prod.description}</p>
          <div className="mb-4">
            <span className="text-2xl font-bold text-green-600">{formatPrice(prod.price)}</span>
            <span className="ml-4 text-sm text-gray-500">Stock: {prod.stock_quantity}</span>
          </div>
          {flower_grade && (
            <div className="mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(flower_grade.grade)}`}>
                Grade {flower_grade.grade}
              </span>
              <div className="mt-2 text-xs text-gray-600">{flower_grade.explanation}</div>
            </div>
          )}
          <div className="mb-4">
            <Button
              onClick={() => {
                addItem(prod, 1);
                toast.success('Added to cart!');
              }}
              disabled={prod.stock_quantity === 0 || !prod.is_approved}
            >
              Add to Cart
            </Button>
          </div>
          <div className="text-sm text-gray-500">
            Sold by: <span className="font-medium text-gray-900">{seller.full_name}</span>
          </div>
          <div className="mt-6">
            <Link to="/products" className="text-green-600 hover:underline">Back to Products</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 