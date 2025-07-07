import { useEffect, useState } from 'react';

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [approving, setApproving] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8001/products?approved_only=false', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        setError('Failed to fetch products');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const approveProduct = async (productId) => {
    setApproving(productId);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8001/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ is_approved: true })
      });
      if (response.ok) {
        await fetchProducts();
      } else {
        setError('Failed to approve product');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setApproving(null);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Admin - Manage Products</h1>
      {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Seller</th>
              <th className="px-4 py-2">Approved</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item) => (
              <tr key={item.product.id} className="border-t">
                <td className="px-4 py-2">{item.product.id}</td>
                <td className="px-4 py-2">{item.product.name}</td>
                <td className="px-4 py-2">{item.seller ? item.seller.username : '-'}</td>
                <td className="px-4 py-2">{item.product.is_approved ? 'Yes' : 'No'}</td>
                <td className="px-4 py-2">
                  {!item.product.is_approved && (
                    <button
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:opacity-50"
                      onClick={() => approveProduct(item.product.id)}
                      disabled={approving === item.product.id}
                    >
                      {approving === item.product.id ? 'Approving...' : 'Approve'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminProducts; 