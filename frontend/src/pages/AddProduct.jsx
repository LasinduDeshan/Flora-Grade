import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Upload, Flower, CheckCircle, XCircle } from 'lucide-react';
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
  const [imagePreview, setImagePreview] = useState(null);
  const { user, token } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  // OTP state
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [pendingProductId, setPendingProductId] = useState(null);
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);

  // Get grade data from navigation state
  const gradeData = location.state?.gradeData;
  const initialImagePreview = location.state?.imagePreview;

  useEffect(() => {
    if (initialImagePreview) {
      setImagePreview(initialImagePreview);
    }
  }, [initialImagePreview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    
    // Basic validation
    if (!form.name || !form.description || !form.price || !form.stock_quantity || !form.image) {
      setMessage("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('price', form.price);
    formData.append('stock_quantity', form.stock_quantity);
    formData.append('category', form.category);
    formData.append('image', form.image);
    
    try {
      const res = await fetch("http://localhost:8001/products/initiate-add", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });
      
      const result = await res.json();
      
      if (res.ok) {
        setPendingProductId(result.pending_product_id);
        setShowOtpModal(true);
        toast.success("OTP sent to your email");
      } else {
        throw new Error(result.detail || "Failed to add product");
      }
    } catch (err) {
      setMessage(err.message);
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!otp) {
      setMessage("Please enter the OTP");
      return;
    }
    
    setOtpLoading(true);
    setMessage("");
    
    try {
      const res = await fetch("http://localhost:8001/products/verify-otp", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pending_product_id: pendingProductId,
          otp: otp
        }),
      });
      
      const result = await res.json();
      
      if (res.ok) {
        toast.success("Product added successfully!");
        navigate('/seller/dashboard');
      } else {
        throw new Error(result.detail || "OTP verification failed");
      }
    } catch (err) {
      setMessage(err.message);
      toast.error(err.message);
    } finally {
      setOtpLoading(false);
    }
  };

  // Check if user is a seller
  const isSeller = user && (user.role === 'seller' || user.role === 'admin');
  
  if (!isSeller) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Restricted</h1>
          <p className="text-gray-600 mb-6">
            Only verified sellers can add products. Please contact admin to upgrade your account.
          </p>
          <Button onClick={() => navigate('/login')}>
            Login as Seller
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              Verify Your Email
            </h2>
            <p className="text-gray-600 mb-4">
              We've sent a 6-digit OTP to your registered email address.
            </p>
            
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enter OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  maxLength={6}
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowOtpModal(false)}
                  disabled={otpLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={otpLoading}
                >
                  Verify & Publish
                </Button>
              </div>
              
              {message && (
                <p className="text-sm text-red-500 mt-2">{message}</p>
              )}
            </form>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <Flower className="w-6 h-6 text-green-500 mr-2" />
          Add New Product
        </h1>
        <div className="w-24"></div> {/* Spacer for alignment */}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Form */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Product Details</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                placeholder="Beautiful Red Roses"
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                name="description"
                value={form.description}
                placeholder="Describe your product in detail..."
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (USD) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    placeholder="19.99"
                    step="0.01"
                    min="0"
                    onChange={handleChange}
                    required
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  name="stock_quantity"
                  value={form.stock_quantity}
                  placeholder="50"
                  min="1"
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Image *
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="mx-auto h-40 object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setForm(prev => ({ ...prev, image: null }));
                        }}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-center">
                        <Upload className="w-12 h-12 text-gray-400" />
                      </div>
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                          <span>Upload a file</span>
                          <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="sr-only"
                            required
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG up to 5MB
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {message && (
              <div className="text-red-500 text-sm">{message}</div>
            )}

            <Button
              type="submit"
              className="w-full mt-4"
              loading={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Add Product'}
            </Button>
          </form>
        </div>

        {/* Preview Section */}
        <div className="space-y-6">
          {/* Grade Information */}
          {gradeData && (
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Flower Quality</h3>
              <div className="flex items-center mb-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(gradeData.grade)}`}>
                  Grade {gradeData.grade}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{gradeData.explanation}</p>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">Color Vibrancy</span>
                    <span className="font-medium">{(gradeData.metrics.color_vibrancy * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                      style={{ width: `${gradeData.metrics.color_vibrancy * 100}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">Symmetry</span>
                    <span className="font-medium">{(gradeData.metrics.symmetry * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                      style={{ width: `${gradeData.metrics.symmetry * 100}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">Shape Uniformity</span>
                    <span className="font-medium">{(gradeData.metrics.circularity * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full"
                      style={{ width: `${gradeData.metrics.circularity * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Product Preview */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Product Preview</h3>
            
            <div className="space-y-4">
              {imagePreview ? (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="w-full h-48 object-cover"
                  />
                </div>
              ) : (
                <div className="bg-gray-100 h-48 rounded-lg flex items-center justify-center text-gray-400">
                  Image preview will appear here
                </div>
              )}
              
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">
                  {form.name || "Product Name"}
                </h4>
                <p className="text-gray-600 text-sm">
                  {form.description || "Product description will appear here"}
                </p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg text-gray-900">
                    ${form.price ? parseFloat(form.price).toFixed(2) : "0.00"}
                  </span>
                  <span className="text-sm text-gray-500">
                    {form.stock_quantity || "0"} in stock
                  </span>
                </div>
                <div className="text-sm text-gray-500 capitalize">
                  Category: {form.category || "roses"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;