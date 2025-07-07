import { useEffect, useState } from 'react';
import { productsAPI, flowerGradingAPI } from '../lib/api';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';
import { FiEdit2, FiLink, FiPackage, FiCheckCircle, FiXCircle, FiDollarSign } from 'react-icons/fi';

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
      toast.success('Flower grade linked successfully!');
      fetchData();
    } catch (error) {
      toast.error('Failed to link grade');
    }
  };

  return (
    <div className="w-full bg-slate-50">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Seller Dashboard</h1>
        <p className="mt-2 text-gray-500">Manage your products and flower grades</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <FiPackage className="mr-2" /> My Products
          </h2>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {products.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 mb-4">You haven't added any products yet</div>
                <Button>Add First Product</Button>
              </div>
            ) : (
              products.map(product => (
                <div key={product.id} className="p-6 hover:bg-gray-50 transition-colors duration-150">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1 flex items-start gap-4">
                      <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                        <img
                          src={product.image_url ? (product.image_url.startsWith('http') ? product.image_url : `http://localhost:8001${product.image_url}`) : 'https://via.placeholder.com/100x100?text=No+Image'}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={e => { e.target.src = 'https://via.placeholder.com/100x100?text=No+Image'; }}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            product.is_approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {product.is_approved ? 'Approved' : 'Pending Approval'}
                          </span>
                        </div>
                        <p className="mt-1 text-gray-600">{product.description}</p>
                        <div className="mt-3 flex flex-wrap gap-4">
                          <div className="flex items-center text-sm text-gray-500">
                            <FiPackage className="mr-1.5" />
                            Stock: {product.stock_quantity}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <FiDollarSign className="mr-1.5" />
                            Price: ${product.price.toFixed(2)}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            {product.is_active ? (
                              <FiCheckCircle className="mr-1.5 text-green-500" />
                            ) : (
                              <FiXCircle className="mr-1.5 text-red-500" />
                            )}
                            {product.is_active ? 'Active' : 'Inactive'}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-3 min-w-[250px]">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Link Flower Grade</label>
                        <div className="flex gap-2 text-black ">
                          <select
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm bg-slate-200"
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
                          <Button 
                            variant="outline" 
                            size="sm" 
                            icon={<FiLink />}
                            className="whitespace-nowrap text-black"
                          >
                            Link
                          </Button>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        icon={<FiEdit2 />}
                        onClick={() => toast('Edit product coming soon!')}
                        className='bg-black'
                      >
                        Edit Product
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default SellerDashboard;