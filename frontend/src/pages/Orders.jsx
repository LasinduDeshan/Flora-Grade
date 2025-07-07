import { useEffect, useState } from 'react';
import { ordersAPI } from '../lib/api';
import { formatPrice, getStatusColor, formatDate } from '../lib/utils';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';
import { Clock, CheckCircle, Truck, XCircle, Package, CreditCard } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getOrders();
      setOrders(response.data);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="w-4 h-4 mr-1" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 mr-1" />;
      case 'shipped':
        return <Truck className="w-4 h-4 mr-1" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 mr-1" />;
      default:
        return <Package className="w-4 h-4 mr-1" />;
    }
  };

  const getPaymentMethodIcon = (method) => {
    if (!method) return <CreditCard className="w-4 h-4 mr-1" />;
    switch (method.toLowerCase()) {
      case 'credit_card':
        return <CreditCard className="w-4 h-4 mr-1" />;
      default:
        return <CreditCard className="w-4 h-4 mr-1" />;
    }
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return 'https://placehold.co/80x80?text=No+Image';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `http://localhost:8001${imageUrl}`;
  };

  const getOrderSubtotal = (order) =>
    order.items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center">
          <Package className="w-6 h-6 text-purple-300-500 mr-2" />
          My Orders
        </h1>
        <Button variant="outline" size="sm" onClick={fetchOrders}>
          Refresh Orders
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-500 border-t-transparent"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">No Orders Found</h3>
          <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
          <Button onClick={() => window.location.href = '/products'}>
            Browse Products
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div 
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleOrderDetails(order.id)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="mb-2 sm:mb-0">
                    <div className="font-semibold text-gray-800">Order #{order.id}</div>
                    <div className="text-sm text-gray-500">
                      {formatDate(order.created_at)}{' '}
                      {new Date(order.created_at).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </div>
                    <div className="font-medium text-gray-800">
                      {formatPrice(order.total_amount)}
                    </div>
                  </div>
                </div>
              </div>

              {expandedOrder === order.id && (
                <div className="border-t border-gray-200 p-4 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium text-gray-700 mb-2">Shipping Information</h3>
                      <div className="bg-white p-3 rounded border border-gray-200">
                        <p className="text-gray-800">{order.shipping_address}</p>
                        <p className="text-gray-600 mt-1">{order.location}</p>
                        <p className="text-gray-600">{order.phone}</p>
                      </div>

                      <h3 className="font-medium text-gray-700 mt-4 mb-2">Payment Method</h3>
                      <div className="bg-white p-3 rounded border border-gray-200 flex items-center">
                        {getPaymentMethodIcon(order.payment_method)}
                        <span className="text-gray-800 capitalize">
                          {order.payment_method?.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-700 mb-2">Order Items</h3>
                      <ul className="space-y-3">
                        {order.items.map(item => (
                          <li key={item.id} className="bg-white p-3 rounded border border-gray-200 flex items-start">
                            <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded overflow-hidden">
                              <img
                                src={getImageUrl(item.product && item.product.image_url ? item.product.image_url : undefined)}
                                alt={item.product && item.product.name ? item.product.name : `Product #${item.product_id}`}
                                className="w-full h-full object-cover"
                                onError={e => { e.target.src = 'https://placehold.co/80x80?text=No+Image'; }}
                              />
                            </div>
                            <div className="ml-3 flex-1">
                              <h4 className="text-sm font-medium text-gray-800">
                                {item.product?.name || `Product #${item.product_id}`}
                              </h4>
                              <p className="text-xs text-gray-500 mt-1">
                                Quantity: {item.quantity}
                              </p>
                              <p className="text-sm text-gray-700 mt-1">
                                {formatPrice(item.unit_price)} each
                              </p>
                            </div>
                            <div className="text-sm font-medium text-gray-800">
                              {formatPrice(item.unit_price * item.quantity)}
                            </div>
                          </li>
                        ))}
                      </ul>

                      <div className="bg-white p-3 rounded border border-gray-200 mt-3">
                        <div className="flex justify-between py-1">
                          <span className="text-gray-600">Subtotal:</span>
                          <span className="text-gray-800">{formatPrice(getOrderSubtotal(order))}</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-gray-600">Shipping:</span>
                          <span className="text-gray-800">{formatPrice(order.shipping_cost || 0)}</span>
                        </div>
                        <div className="flex justify-between py-1 font-medium">
                          <span className="text-gray-800">Total:</span>
                          <span className="text-gray-800">{formatPrice(order.total_amount)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end space-x-3">
                    {order.status === 'pending' && (
                      <Button variant="outline" size="sm" onClick={() => toast('Cancellation coming soon!')} className='text-black'>
                        Cancel Order
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => toast('Tracking coming soon!')} className='text-black'>
                      Track Order
                    </Button>
                    <Button size="sm" onClick={() => toast('Reorder coming soon!')}>
                      Reorder
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;