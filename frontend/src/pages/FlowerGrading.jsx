import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../lib/store'
import { Upload, Zap, Download, Camera, Award, BarChart2, CheckCircle, XCircle, AlertCircle, PlusCircle, LogIn, Sparkles } from 'lucide-react'
import { toast } from 'react-hot-toast'

function FlowerGrading() {
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const fileInputRef = useRef(null)
  const navigate = useNavigate()
  
  const { user, isAuthenticated } = useAuthStore()
  const isSeller = isAuthenticated && user && (user.role === 'seller' || user.role === 'admin')

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      setPreview(URL.createObjectURL(file))
      setResult(null)
      setError(null)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      handleImageChange({ target: { files: [file] } })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!image) return
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', image)
      const response = await fetch('http://localhost:8001/flower-api/grade-flower', {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError('Grading failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getGradeColor = (grade) => {
    switch (grade?.toUpperCase()) {
      case 'A': return 'from-emerald-500 to-teal-500'
      case 'B': return 'from-blue-500 to-cyan-500'
      case 'C': return 'from-amber-500 to-orange-500'
      default: return 'from-gray-500 to-slate-500'
    }
  }

  const getGradeIcon = (grade) => {
    switch (grade?.toUpperCase()) {
      case 'A': return <Award className="w-6 h-6" />
      case 'B': return <CheckCircle className="w-6 h-6" />
      case 'C': return <AlertCircle className="w-6 h-6" />
      default: return <XCircle className="w-6 h-6" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950 overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div 
          className="absolute w-96 h-96 rounded-full opacity-10 blur-3xl transition-all duration-1000 ease-out"
          style={{
            background: 'radial-gradient(circle, rgba(168,85,247,0.4) 0%, rgba(236,72,153,0.2) 70%)',
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
          }}
        />
        <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-violet-600/10 to-fuchsia-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-32 left-20 w-80 h-80 bg-gradient-to-tr from-indigo-600/10 to-pink-600/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 py-12 relative">
        {/* Header Section */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 mb-6 text-sm font-medium text-violet-300 shadow-lg">
            <Sparkles className="w-4 h-4" />
            AI-Powered Quality Assessment
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-violet-300 via-fuchsia-300 to-pink-300 bg-clip-text text-transparent">
            Flower Grading
          </h1>
          <p className="text-lg text-gray-300/80">
            Upload your flower image for instant quality analysis and grading
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Column */}
          <div className="space-y-6">
            {/* Upload Card */}
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-lg flex items-center justify-center">
                  <Upload className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-white">Upload Flower Image</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div
                  className={`relative cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all ${
                    isDragging 
                      ? 'border-violet-400 bg-violet-500/10' 
                      : 'border-white/20 hover:border-violet-400/50'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg, image/png"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <div className="space-y-4">
                    <div className={`mx-auto w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                      isDragging 
                        ? 'bg-gradient-to-br from-violet-500 to-fuchsia-500' 
                        : 'bg-gradient-to-br from-violet-600/30 to-fuchsia-600/30'
                    }`}>
                      <Camera className={`w-6 h-6 ${isDragging ? 'text-white' : 'text-violet-400'}`} />
                    </div>
                    <div>
                      <p className={`font-medium ${isDragging ? 'text-violet-300' : 'text-white'}`}>
                        {isDragging ? 'Drop your image here' : 'Drag & drop your flower image'}
                      </p>
                      <p className={`text-sm ${isDragging ? 'text-violet-200' : 'text-gray-400'}`}>
                        or click to browse (JPEG, PNG up to 10MB)
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!image || loading}
                  className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-medium py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      Grade Flower
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Preview Card */}
            {preview && (
              <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <Camera className="w-5 h-5 text-violet-400" />
                  <h3 className="text-lg font-semibold text-white">Image Preview</h3>
                </div>
                <div className="aspect-square rounded-xl overflow-hidden border border-white/10">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Results Column */}
          <div className="space-y-6">
            {loading && !result && (
              <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center shadow-xl">
                <div className="w-12 h-12 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">Analyzing Your Flower</h3>
                <p className="text-gray-400">Processing image quality metrics...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-900/20 backdrop-blur-xl border border-red-500/30 text-red-300 p-6 rounded-2xl">
                <div className="flex items-center gap-3 mb-2">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <h3 className="font-medium">Error</h3>
                </div>
                <p>{error}</p>
              </div>
            )}

            {result && (
              <>
                {/* Grade Result Card */}
                <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-lg flex items-center justify-center">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-semibold text-white">Grading Result</h2>
                  </div>
                  
                  <div className={`bg-gradient-to-br ${getGradeColor(result.grade)} p-6 rounded-xl mb-6 text-center text-white`}>
                    <div className="flex items-center justify-center gap-3 mb-3">
                      {getGradeIcon(result.grade)}
                      <div className="text-2xl font-bold">Grade {result.grade}</div>
                    </div>
                    <p className="font-medium">
                      {result.grade === 'A' && 'Exceptional Quality'}
                      {result.grade === 'B' && 'Premium Quality'}
                      {result.grade === 'C' && 'Standard Quality'}
                    </p>
                  </div>

                  {(result.grade === 'A' || result.grade === 'B') && (
                    <div className="mb-6">
                      {isSeller ? (
                        <button
                          onClick={() => navigate('/seller/add-product')}
                          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                          <PlusCircle className="w-5 h-5" />
                          Add Product to Store
                        </button>
                      ) : (
                        <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                          <p className="text-white mb-3">Ready to sell this premium flower?</p>
                          <button
                            onClick={() => navigate('/login')}
                            className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-medium py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-2 mx-auto"
                          >
                            <LogIn className="w-4 h-4" />
                            Login as Seller
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-3">
                      <BarChart2 className="w-5 h-5 text-violet-400" />
                      <h3 className="font-medium text-white">AI Analysis Summary</h3>
                    </div>
                    <p className="text-gray-300 text-sm">{result.explanation}</p>
                  </div>
                </div>

                {/* Metrics Card */}
                {result.metrics && (
                  <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                        <BarChart2 className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-xl font-semibold text-white">Quality Metrics</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: 'Color', value: result.metrics.color_vibrancy, color: 'from-purple-500 to-pink-500' },
                        { label: 'Symmetry', value: result.metrics.symmetry, color: 'from-blue-500 to-cyan-500' },
                        { label: 'Shape', value: result.metrics.circularity, color: 'from-emerald-500 to-teal-500' },
                        { label: 'Damage', value: (result.metrics.edge_density + result.metrics.brown_ratio), color: 'from-amber-500 to-orange-500' }
                      ].map((metric, index) => (
                        <div key={index} className="bg-white/5 rounded-lg p-3 border border-white/10">
                          <div className="text-xs text-gray-400 mb-1 font-medium">{metric.label}</div>
                          <div className={`text-lg font-bold mb-2 bg-gradient-to-r ${metric.color} bg-clip-text text-transparent`}>
                            {(metric.value * 100).toFixed(1)}%
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full bg-gradient-to-r ${metric.color}`}
                              style={{ width: `${metric.value * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Download Card */}
                <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                      <Download className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-semibold text-white">Download Report</h2>
                  </div>
                  <button
                    onClick={() => toast.success('Report download started')}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-medium py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Download className="w-5 h-5" />
                    Download PDF Report
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FlowerGrading