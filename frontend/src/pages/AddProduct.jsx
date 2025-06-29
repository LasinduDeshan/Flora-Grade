import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Upload, Flower } from 'lucide-react';
import Button from '../components/ui/Button';
import { getGradeColor } from '../lib/utils';
import { useAuthStore } from '../lib/store';
import toast from 'react-hot-toast';

const AddProduct = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock_quantity: "",
    category: "roses",
    image: null,
  });
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const { user, token } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Debug logging
  console.log('AddProduct component rendered');
  console.log('User:', user);
  console.log('User role:', user?.role);
  console.log('Store token:', token);
  console.log('LocalStorage token:', localStorage.getItem('token'));
  
  // Get grade data from navigation state or sessionStorage
  let gradeData = location.state?.gradeData;
  let initialImagePreview = location.state?.imagePreview;

  // Persist to sessionStorage if present
  if (gradeData && initialImagePreview) {
    sessionStorage.setItem('gradeData', JSON.stringify(gradeData));
    sessionStorage.setItem('imagePreview', initialImagePreview);
  } else {
    // Try to load from sessionStorage
    const storedGrade = sessionStorage.getItem('gradeData');
    const storedPreview = sessionStorage.getItem('imagePreview');
    if (storedGrade && storedPreview) {
      gradeData = JSON.parse(storedGrade);
      initialImagePreview = storedPreview;
    }
  }

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setForm({ ...form, image: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsSubmitting(true);
    
    const data = new FormData();
    data.append('name', form.name);
    data.append('description', form.description);
    data.append('price', form.price);
    data.append('stock_quantity', form.stock_quantity);
    data.append('category', form.category);
    if (imageFile) {
      data.append('image', imageFile);
    }
    
    try {
      const res = await fetch("http://localhost:8001/products/", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data,
      });
      console.log('Response status:', res.status);
      console.log('Response headers:', res.headers);
      
      const result = await res.json();
      console.log('Response result:', result);
      if (res.ok) {
        toast.success("Product created successfully!");
        // Clear form
        setForm({
          name: "",
          description: "",
          price: "",
          stock_quantity: "",
          category: "roses",
          image: null,
        });
        setImageFile(null);
        setImagePreview(null);
        // Redirect to seller dashboard after a short delay
        setTimeout(() => {
          navigate('/seller/dashboard');
        }, 1500);
      } else {
        const errorMessage = result.detail || "Error creating product.";
        toast.error(errorMessage);
        setMessage(errorMessage);
      }
    } catch (err) {
      console.error('Error creating product:', err);
      setMessage("Network error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if user is a seller
  const isSeller = user && (user.role === 'seller' || user.role === 'admin');
  
  console.log('Is seller check:', isSeller);
  console.log('User role comparison:', user?.role === 'seller', user?.role === 'admin');
  console.log('Token exists:', !!token);
  console.log('User exists:', !!user);
  
  if (!isSeller) {
    console.log('Access denied - not a seller');
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-100 mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-6">Only sellers can add products. Please login as a seller or contact admin to upgrade your account.</p>
          <Button onClick={() => navigate('/login', { state: { redirectTo: '/seller/add-product', gradeData, imagePreview: initialImagePreview } })}>
            Login as Seller
          </Button>
        </div>
      </div>
    );
  }

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Test token validity
  useEffect(() => {
    const testToken = async () => {
      if (token) {
        try {
          const res = await fetch('http://localhost:8001/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          console.log('Token test response status:', res.status);
          if (res.ok) {
            const userData = await res.json();
            console.log('Token test user data:', userData);
          } else {
            console.log('Token test failed:', res.status);
            // Token is invalid, redirect to login
            toast.error('Your session has expired. Please log in again.');
            useAuthStore.getState().logout();
            navigate('/login', { state: { redirectTo: '/seller/add-product', gradeData, imagePreview: initialImagePreview } });
          }
        } catch (err) {
          console.error('Token test error:', err);
          // Network error, redirect to login
          toast.error('Network error. Please log in again.');
          useAuthStore.getState().logout();
          navigate('/login', { state: { redirectTo: '/seller/add-product', gradeData, imagePreview: initialImagePreview } });
        }
      } else {
        // No token, redirect to login
        toast.error('Please log in to continue.');
        navigate('/login', { state: { redirectTo: '/seller/add-product', gradeData, imagePreview: initialImagePreview } });
      }
    };
    testToken();
  }, [token, navigate, gradeData, initialImagePreview]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => navigate('/flower-grading')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Grading
        </Button>
        
        <div className="flex items-center space-x-3 mb-6">
          <Flower className="w-8 h-8 text-green-400" />
          <h1 className="text-3xl font-bold text-gray-100">Add New Product</h1>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Form */}
        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                placeholder="Name"
                onChange={handleChange}
                required
                className={`w-full px-3 py-2 bg-gray-800 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-100 placeholder-gray-400 ${
                  message ? 'border-red-500' : 'border-gray-600'
                }`}
              />
              {message && (
                <p className="mt-1 text-sm text-red-400">{message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                placeholder="Description"
                onChange={handleChange}
                required
                rows={4}
                className={`w-full px-3 py-2 bg-gray-800 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-100 placeholder-gray-400 ${
                  message ? 'border-red-500' : 'border-gray-600'
                }`}
              />
              {message && (
                <p className="mt-1 text-sm text-red-400">{message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Price (USD) *
                </label>
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  step="0.01"
                  min="0"
                  onChange={handleChange}
                  required
                  className={`w-full px-3 py-2 bg-gray-800 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-100 placeholder-gray-400 ${
                    message ? 'border-red-500' : 'border-gray-600'
                  }`}
                />
                {message && (
                  <p className="mt-1 text-sm text-red-400">{message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  name="stock_quantity"
                  placeholder="Stock"
                  min="1"
                  onChange={handleChange}
                  required
                  className={`w-full px-3 py-2 bg-gray-800 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-100 placeholder-gray-400 ${
                    message ? 'border-red-500' : 'border-gray-600'
                  }`}
                />
                {message && (
                  <p className="mt-1 text-sm text-red-400">{message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category
              </label>
              <select
                name="category"
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-100 ${
                  message ? 'border-red-500' : 'border-gray-600'
                }`}
              >
                <option value="roses">Roses</option>
                <option value="tulips">Tulips</option>
                <option value="lilies">Lilies</option>
                <option value="orchids">Orchids</option>
                <option value="sunflowers">Sunflowers</option>
                <option value="daisies">Daisies</option>
                <option value="mixed">Mixed Bouquets</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Product Image *
              </label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                required
                className={`w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-100 ${
                  message ? 'border-red-500' : 'border-gray-600'
                }`}
              />
              <p className="mt-1 text-sm text-gray-400">
                Upload a high-quality image of your flower product
              </p>
            </div>

            <Button
              type="submit"
              className="w-full"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Product...' : 'Create Product'}
            </Button>
          </form>
        </div>

        {/* Preview Section */}
        <div className="space-y-6">
          {/* Grade Information */}
          {gradeData && (
            <div className="border border-gray-600 rounded-lg p-4 bg-gray-800">
              <h3 className="font-semibold text-green-400 mb-2">Flower Grade Information</h3>
              <div className="flex items-center space-x-2 mb-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(gradeData.grade)}`}>
                  Grade {gradeData.grade}
                </span>
              </div>
              <p className="text-sm text-gray-300 mb-3">{gradeData.explanation}</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Color Vibrancy:</span>
                  <span className="text-gray-200">{(gradeData.metrics.color_vibrancy * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Symmetry:</span>
                  <span className="text-gray-200">{(gradeData.metrics.symmetry * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Shape Uniformity:</span>
                  <span className="text-gray-200">{(gradeData.metrics.circularity * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Damage Level:</span>
                  <span className="text-gray-200">{(gradeData.metrics.brown_ratio * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          )}

          {/* Image Preview */}
          {imagePreview && (
            <div className="border border-gray-600 rounded-lg p-4 bg-gray-800">
              <h3 className="font-semibold text-gray-100 mb-3">Product Image Preview</h3>
              <div className="border border-gray-600 rounded-lg overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Product preview"
                  className="w-full h-64 object-cover"
                />
              </div>
            </div>
          )}

          {/* Product Preview */}
          <div className="border border-gray-600 rounded-lg p-4 bg-gray-800">
            <h3 className="font-semibold text-gray-100 mb-3">Product Preview</h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-400">Name:</span>
                <p className="text-gray-100">{form.name || 'Product name will appear here'}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-400">Price:</span>
                <p className="text-gray-100">${form.price || '0.00'}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-400">Stock:</span>
                <p className="text-gray-100">{form.stock_quantity || '0'} units</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-400">Category:</span>
                <p className="text-gray-100 capitalize">{form.category || 'roses'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct; 