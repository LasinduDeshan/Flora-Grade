import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from './lib/store'
import Header from './components/Header'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ProductList from './pages/ProductList'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import AddProduct from './pages/AddProduct'
import AdminDashboard from './pages/AdminDashboard'
import SellerDashboard from './pages/SellerDashboard'
import FlowerGrading from './pages/FlowerGrading'
import Profile from './pages/Profile'
import Orders from './pages/Orders'
import Checkout from './pages/Checkout'
import Footer from './components/Footer'

function AppLayout({ children, user, logout }) {
  const location = useLocation();
  const hideHeaderFooter = location.pathname === '/login' || location.pathname === '/register';
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {!hideHeaderFooter && <Header user={user} onLogout={logout} />}
      <main className={!hideHeaderFooter ? "pt-16" : ""}>{children}</main>
      {!hideHeaderFooter && <Footer />}
    </div>
  );
}

function App() {
  const { user, token, isAuthenticated, logout: storeLogout } = useAuthStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // The store will automatically restore state from localStorage via persist middleware
    // We just need to validate the token if it exists
    if (token) {
      validateToken(token)
    } else {
      setLoading(false)
    }
  }, [token])

  const validateToken = async (token) => {
    try {
      const response = await fetch('http://localhost:8001/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        // Token is valid, user data should already be in store
        console.log('Token validated successfully')
      } else {
        // Token is invalid, clear the store
        console.log('Token validation failed, logging out')
        storeLogout()
      }
    } catch (error) {
      console.error('Error validating token:', error)
      storeLogout()
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    try {
      const response = await fetch('http://localhost:8001/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      })

      if (response.ok) {
        return { success: true }
      } else {
        const error = await response.json()
        return { success: false, error: error.detail }
      }
    } catch (error) {
      return { success: false, error: 'Network error' }
    }
  }

  const logout = () => {
    storeLogout()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register onRegister={register} /> : <Navigate to="/" />} />
        <Route
          path="*"
          element={
            <AppLayout user={user} logout={logout}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/flower-grading" element={<FlowerGrading />} />
                <Route path="/profile" element={user ? <Profile user={user} /> : <Navigate to="/login" />} />
                <Route path="/orders" element={user ? <Orders /> : <Navigate to="/login" />} />
                <Route path="/checkout" element={user ? <Checkout /> : <Navigate to="/login" />} />
                {/* Seller Routes */}
                <Route path="/seller/add-product" element={user?.role === 'seller' ? <AddProduct /> : <Navigate to="/login" />} />
                <Route path="/seller/dashboard" element={user?.role === 'seller' ? <SellerDashboard /> : <Navigate to="/login" />} />
                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} />
              </Routes>
            </AppLayout>
          }
        />
      </Routes>
    </Router>
  )
}

export default App 