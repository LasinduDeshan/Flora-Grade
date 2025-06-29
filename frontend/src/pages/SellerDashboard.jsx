import { useEffect, useState } from 'react';
import { productsAPI, flowerGradingAPI } from '../lib/api';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const SellerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, gradeRes] = await Promise.all([
        productsAPI.getMyProducts(),
        flowerGradingAPI.getHistory(),
      ]);
      setProducts(prodRes.data);
      setGrades(gradeRes.data);
    } catch (error) {
      toast.error('Failed to load seller data');
    } finally {
      setLoading(false);
    }
  };

  const handleLinkGrade = async (productId, gradeId) => {
    try {
      await productsAPI.linkFlowerGrade(productId, gradeId);
      toast.success('Flower grade linked!');
      fetchData();
    } catch (error) {
      toast.error('Failed to link grade');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Seller Dashboard</h1>
      <h2 className="text-xl font-semibold mb-4">My Products</h2>
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {products.length === 0 ? (
            <div className="text-center text-gray-500">No products found. Add your first product!</div>
          ) : (
            products.map(product => (
              <div key={product.id} className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="font-semibold text-lg">{product.name}</div>
                  <div className="text-gray-600 text-sm mb-2">{product.description}</div>
                  <div className="text-sm">Stock: {product.stock_quantity}</div>
                  <div className="text-sm">Price: ${product.price}</div>
                  <div className="text-sm">Approved: {product.is_approved ? 'Yes' : 'No'}</div>
                  <div className="text-sm">Active: {product.is_active ? 'Yes' : 'No'}</div>
                </div>
                <div className="mt-4 md:mt-0 flex flex-col gap-2">
                  <div>
                    <label className="block text-xs font-medium mb-1">Link Flower Grade</label>
                    <select
                      className="border rounded px-2 py-1"
                      defaultValue={product.flower_grade_id || ''}
                      onChange={e => handleLinkGrade(product.id, e.target.value)}
                    >
                      <option value="">Select Grade</option>
                      {grades.filter(g => g.grade === 'A' || g.grade === 'B').map(g => (
                        <option key={g.id} value={g.id}>
                          Grade {g.grade} - {g.explanation.slice(0, 30)}...
                        </option>
                      ))}
                    </select>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => toast('Edit product coming soon!')}>Edit</Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SellerDashboard; 