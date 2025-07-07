import { useState } from 'react';
import { useCartStore } from '../lib/store';
import { formatPrice } from '../lib/utils';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../lib/store';
import { ordersAPI } from '../lib/api';

const Checkout = () => {
  const { items, getTotal, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [agree, setAgree] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
    if (!address.trim() || !phone.trim() || !location.trim() || !agree) {
      toast.error('Please fill all fields and agree to the terms.');
      return;
    }
    setIsPlacingOrder(true);
    try {
      const orderData = {
        shipping_address: address,
        total_amount: getTotal(),
        items: items.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          unit_price: item.price,
        })),
      };
      await ordersAPI.createOrder(orderData);
      clearCart();
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      toast.error('Failed to place order');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 rounded-xl">
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Your cart is empty</h2>
          <p className="mb-6 text-gray-600">Add some products to your cart before checking out.</p>
          <Button onClick={() => navigate('/products')}>Browse Products</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Shipping & Payment Form - Left Side */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Shipping & Payment</h2>
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-gray-700 bg-gray-50"
                value={user?.email || ''}
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-gray-700 bg-gray-50"
                value={user?.full_name || user?.username || ''}
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                type="text"
                placeholder="Enter your city or location"
                value={location}
                onChange={e => setLocation(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Address</label>
              <textarea
                className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="Enter your shipping address..."
                value={address}
                onChange={e => setAddress(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
              <select
                className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value)}
              >
                <option value="credit_card">Credit Card</option>
                <option value="paypal">PayPal</option>
                <option value="cod">Cash on Delivery</option>
              </select>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  id="agree"
                  checked={agree}
                  onChange={e => setAgree(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="agree" className="text-gray-700">
                  I agree to the <a href="/terms" target="_blank" className="text-blue-600 hover:text-blue-800">Terms and Conditions</a>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary - Right Side */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-fit sticky top-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Order Summary</h2>
          <ul className="mb-4 divide-y divide-gray-100">
            {items.map(item => (
              <li key={item.id} className="flex justify-between py-3">
                <span className="text-gray-700">
                  {item.name} <span className="text-gray-500">× {item.quantity}</span>
                </span>
                <span className="font-medium text-gray-900">{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-4 text-gray-900">
            <span>Total:</span>
            <span>{formatPrice(getTotal())}</span>
          </div>

          <Button
            className="w-full mt-6"
            loading={isPlacingOrder}
            disabled={isPlacingOrder}
            onClick={handlePlaceOrder}
          >
            {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;