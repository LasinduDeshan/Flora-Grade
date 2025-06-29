import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:8001/admin/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      } else {
        setError('Failed to fetch dashboard stats')
      }
    } catch (error) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-100 mb-4">Admin Dashboard</h1>
          <p className="text-gray-400">Manage your FloraGrade e-commerce platform</p>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-8">
            {error}
          </div>
        )}

        {stats && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-400">Total Users</p>
                    <p className="text-2xl font-bold text-gray-100">{stats.total_users}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-400">Total Products</p>
                    <p className="text-2xl font-bold text-gray-100">{stats.total_products}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-400">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-100">{stats.total_orders}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-400">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-100">${stats.total_revenue.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* User Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-100 mb-4">User Distribution</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Customers</span>
                    <span className="text-purple-400 font-semibold">{stats.user_distribution.customers}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Sellers</span>
                    <span className="text-green-400 font-semibold">{stats.user_distribution.sellers}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Admins</span>
                    <span className="text-blue-400 font-semibold">{stats.user_distribution.admins}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-100 mb-4">Flower Grade Distribution</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Grade A</span>
                    <span className="text-emerald-400 font-semibold">{stats.flower_grade_distribution.grade_a}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Grade B</span>
                    <span className="text-blue-400 font-semibold">{stats.flower_grade_distribution.grade_b}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Grade C</span>
                    <span className="text-amber-400 font-semibold">{stats.flower_grade_distribution.grade_c}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-100 mb-4">Recent Activity (Last 7 Days)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400 mb-2">{stats.recent_activity.new_users}</div>
                  <div className="text-gray-400">New Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400 mb-2">{stats.recent_activity.new_products}</div>
                  <div className="text-gray-400">New Products</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-2">{stats.recent_activity.new_orders}</div>
                  <div className="text-gray-400">New Orders</div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Quick Actions */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-100 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/admin/users"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-4 py-3 rounded-lg text-center transition-all duration-300"
            >
              Manage Users
            </Link>
            <Link
              to="/admin/products"
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-4 py-3 rounded-lg text-center transition-all duration-300"
            >
              Manage Products
            </Link>
            <Link
              to="/admin/orders"
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-4 py-3 rounded-lg text-center transition-all duration-300"
            >
              View Orders
            </Link>
            <Link
              to="/admin/flower-grades"
              className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white px-4 py-3 rounded-lg text-center transition-all duration-300"
            >
              Flower Grades
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard 