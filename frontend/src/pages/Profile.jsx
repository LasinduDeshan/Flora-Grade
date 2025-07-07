import { useState } from 'react';
import { User, Mail, AtSign, Save, Edit3, Shield, Camera } from 'lucide-react';
import { useAuthStore } from '../lib/store';

const Button = ({ children, onClick, className, type, ...props }) => (
  <button
    type={type}
    onClick={onClick}
    className={className}
    {...props}
  >
    {children}
  </button>
);

const Profile = () => {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    username: user?.username || '',
  });
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      alert('Profile updated (local only)');
      setIsEditing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">
            My Profile
          </h1>
          <p className="text-gray-400">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-xl border border-gray-800 p-6 text-center">
              <div className="relative inline-block mb-4">
                <div className="w-32 h-32 rounded-full bg-gray-800 p-1">
                  <img
                    src={user?.avatar}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/128x128?text=User';
                    }}
                  />
                </div>
                <button className="absolute bottom-2 right-2 w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center text-gray-300 transition-all duration-200">
                  <Camera className="w-3 h-3" />
                </button>
              </div>
              
              <h2 className="text-xl font-bold text-white mb-1">{user?.full_name}</h2>
              <p className="text-gray-400 mb-3">@{user?.username}</p>
              
              <div className="space-y-2">
                <div className="flex items-center justify-center text-gray-400">
                  <Mail className="w-4 h-4 mr-2" />
                  <span className="text-sm">{user?.email}</span>
                </div>
                <div className="flex items-center justify-center text-gray-400">
                  <Shield className="w-4 h-4 mr-2" />
                  <span className="text-sm">Verified Account</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
              {/* Header */}
              <div className="bg-gray-800 p-6 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    <User className="w-5 h-5 mr-2 text-gray-400" />
                    Account Information
                  </h3>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>{isEditing ? 'Cancel' : 'Edit'}</span>
                  </button>
                </div>
              </div>

              {/* Form */}
              <div className="p-6 space-y-6">
                {/* Full Name */}
                <div className="group">
                  <label className="flex items-center text-sm font-medium text-gray-400 mb-2">
                    <User className="w-4 h-4 mr-2 text-gray-500" />
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none ${
                        errors.full_name 
                          ? 'border-red-500 focus:border-red-500' 
                          : 'border-gray-700 focus:border-gray-500'
                      } ${!isEditing ? 'bg-gray-800/50 cursor-not-allowed' : ''}`}
                    />
                    {errors.full_name && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.full_name}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="group">
                  <label className="flex items-center text-sm font-medium text-gray-400 mb-2">
                    <Mail className="w-4 h-4 mr-2 text-gray-500" />
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none ${
                        errors.email 
                          ? 'border-red-500 focus:border-red-500' 
                          : 'border-gray-700 focus:border-gray-500'
                      } ${!isEditing ? 'bg-gray-800/50 cursor-not-allowed' : ''}`}
                    />
                    {errors.email && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Username */}
                <div className="group">
                  <label className="flex items-center text-sm font-medium text-gray-400 mb-2">
                    <AtSign className="w-4 h-4 mr-2 text-gray-500" />
                    Username
                    <span className="ml-2 px-2 py-1 bg-gray-800 text-xs rounded text-gray-400">Read Only</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      disabled={true}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-400 cursor-not-allowed"
                    />
                    <div className="absolute inset-y-0 right-4 flex items-center">
                      <Shield className="w-4 h-4 text-gray-600" />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                {isEditing && (
                  <div className="pt-2">
                    <Button
                      onClick={onSubmit}
                      className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg transition-all duration-200 text-md font-medium flex items-center justify-center space-x-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Update Profile</span>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Settings Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
            <h3 className="text-lg font-bold text-white mb-3 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-gray-400" />
              Security Settings
            </h3>
            <p className="text-gray-400 mb-4">Manage your password and security preferences</p>
            <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-all duration-200">
              Change Password
            </button>
          </div>

          <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
            <h3 className="text-lg font-bold text-white mb-3 flex items-center">
              <Mail className="w-5 h-5 mr-2 text-gray-400" />
              Notifications
            </h3>
            <p className="text-gray-400 mb-4">Configure your email and push notifications</p>
            <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-all duration-200">
              Manage Alerts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
