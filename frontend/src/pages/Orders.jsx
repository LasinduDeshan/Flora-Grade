import { useEffect, useState } from 'react';
import { ordersAPI } from '../lib/api';
import { formatPrice, getStatusColor } from '../lib/utils';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center text-gray-600">No orders found.</div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                <div>
                  <div className="font-semibold text-lg">Order #{order.id}</div>
                  <div className="text-sm text-gray-500">Placed: {new Date(order.created_at).toLocaleString()}</div>
                </div>
                <div className={`mt-2 md:mt-0 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </div>
              </div>
              <div className="mb-2">
                <span className="font-medium">Shipping Address:</span> {order.shipping_address}
              </div>
              <div className="mb-2">
                <span className="font-medium">Total:</span> {formatPrice(order.total_amount)}
              </div>
              <div className="mb-2">
                <span className="font-medium">Items:</span>
                <ul className="ml-4 list-disc text-sm">
                  {order.items.map(item => (
                    <li key={item.id}>
                      {item.quantity} x {item.product_id} @ {formatPrice(item.unit_price)}
                    </li>
                  ))}
                </ul>
              </div>
              <Button variant="outline" size="sm" onClick={() => toast('Order details coming soon!')}>View Details</Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders; 