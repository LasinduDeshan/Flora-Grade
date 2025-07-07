import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Heart } from 'lucide-react';
import { useCartStore } from '../lib/store';
import { formatPrice } from '../lib/utils';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const Cart = () => {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const navigate = useNavigate();

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `http://localhost:8001${imageUrl}`;
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(productId);
      toast.success('Item removed from cart');
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center py-20">
            <div className="mb-8">
              <div className="bg-white rounded-full p-8 shadow-sm border border-gray-200 inline-block">
                <ShoppingBag className="w-16 h-16 text-gray-700" />
              </div>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Your cart is empty
            </h2>
            <p className="text-xl text-gray-600 mb-12 max-w-md mx-auto leading-relaxed">
              Discover our collection of fresh flowers and add some to your cart.
            </p>
            <Link to="/products">
              <Button className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 text-lg font-semibold">
                Explore Flowers
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Shopping Cart
          </h1>
          <p className="text-lg text-gray-600">
            {items.length} item{items.length !== 1 ? 's' : ''} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-100 p-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <ShoppingBag className="w-6 h-6 mr-3 text-gray-700" />
                  Your Items
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div key={item.id} className="group">
                      <div className="flex items-center space-x-6 p-6 rounded-xl bg-white border border-gray-200 hover:border-gray-300 transition-all duration-200">
                        <div className="relative">
                          <img
                            src={getImageUrl(item.image_url)}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-lg"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/80x80?text=Image+Not+Available';
                            }}
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">{item.name}</h3>
                          <p className="text-sm text-gray-600">
                            {formatPrice(item.price)} each
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1 border">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 flex items-center justify-center transition-all duration-200"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <div className="w-8 text-center">
                            <span className="text-sm font-medium text-gray-900 px-2 py-1">
                              {item.quantity}
                            </span>
                          </div>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 flex items-center justify-center transition-all duration-200"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        
                        <div className="text-right min-w-0">
                          <p className="text-lg font-bold text-gray-900">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                        
                        <button
                          onClick={() => {
                            removeItem(item.id);
                            toast.success('Item removed from cart');
                          }}
                          className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 flex items-center justify-center transition-all duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="xl:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-100 p-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <Heart className="w-6 h-6 mr-3 text-gray-700" />
                    Order Summary
                  </h2>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <span className="text-gray-600 font-medium">Subtotal</span>
                      <span className="text-lg font-bold text-gray-900">{formatPrice(getTotal())}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <span className="text-gray-600 font-medium">Shipping</span>
                      <span className="text-md font-medium text-gray-600">Free</span>
                    </div>
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between items-center p-4 bg-gray-900 rounded-lg text-white">
                        <span className="text-lg font-bold">Total</span>
                        <span className="text-xl font-bold">{formatPrice(getTotal())}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button
                      onClick={handleCheckout}
                      className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 text-md font-bold"
                      loading={isCheckingOut}
                      disabled={isCheckingOut}
                    >
                      {isCheckingOut ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Processing...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          Secure Checkout
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </div>
                      )}
                    </Button>
                    
                    <Button
                      onClick={() => {
                        clearCart();
                        toast.success('Cart cleared');
                      }}
                      className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 font-medium"
                    >
                      Clear Cart
                    </Button>
                  </div>

                  <div className="mt-6 text-center">
                    <Link
                      to="/products"
                      className="inline-flex items-center text-md text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200"
                    >
                      Continue Shopping
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;