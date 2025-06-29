import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X, Flower } from 'lucide-react';
import { useAuthStore, useCartStore } from '../lib/store';
import Button from './ui/Button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const { getItemCount } = useCartStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black backdrop-blur-sm ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
              FloraGrade
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-300 hover:text-purple-300 transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-gray-300 hover:text-purple-300 transition-colors">
              Products
            </Link>
            <Link to="/flower-grading" className="text-gray-300 hover:text-purple-300 transition-colors">
              Flower Grading
            </Link>
            {user && (
              <>
                <Link to="/cart" className="text-gray-300 hover:text-purple-300 transition-colors">
                  Cart
                </Link>
                {user.role === 'seller' && (
                  <Link to="/seller/dashboard" className="text-gray-300 hover:text-purple-300 transition-colors">
                    Seller Dashboard
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link to="/admin/dashboard" className="text-gray-300 hover:text-purple-300 transition-colors">
                    Admin Dashboard
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* User Menu / Auth */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-gray-300 hover:text-purple-300 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden sm:block">{user.username}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-2">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      My Orders
                    </Link>
                    {user.role === 'seller' && (
                      <Link
                        to="/seller/add-product"
                        className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Add Product
                      </Link>
                    )}
                    <hr className="border-gray-700 my-2" />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-purple-300 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-4 py-2 rounded-lg transition-all duration-300"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-300 hover:text-purple-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-gray-300 hover:text-purple-300 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/products"
                className="text-gray-300 hover:text-purple-300 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                to="/flower-grading"
                className="text-gray-300 hover:text-purple-300 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Flower Grading
              </Link>
              {user && (
                <>
                  <Link
                    to="/cart"
                    className="text-gray-300 hover:text-purple-300 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Cart
                  </Link>
                  {user.role === 'seller' && (
                    <Link
                      to="/seller/dashboard"
                      className="text-gray-300 hover:text-purple-300 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Seller Dashboard
                    </Link>
                  )}
                  {user.role === 'seller' && (
                    <Link
                      to="/seller/add-product"
                      className="text-gray-300 hover:text-purple-300 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Add Product
                    </Link>
                  )}
                  {user.role === 'admin' && (
                    <Link
                      to="/admin/dashboard"
                      className="text-gray-300 hover:text-purple-300 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 