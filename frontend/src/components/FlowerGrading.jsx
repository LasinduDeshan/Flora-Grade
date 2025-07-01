import { useState, useRef, useEffect } from 'react'
import { Upload, Zap, Download, Camera, Award, BarChart3, Sparkles, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

function FlowerGrading() {
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const fileInputRef = useRef(null)
  
  // Mock user data - replace with actual auth store
  const user = { role: 'seller' } // This would come from useAuthStore()
  const isSeller = user && (user.role === 'seller' || user.role === 'admin')

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      setImage(file)
      setPreview(URL.createObjectURL(file))
      setResult(null)
      setError(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!image) return
    setLoading(true)
    setResult(null)
    setError(null)
    const formData = new FormData()
    formData.append('file', image)
    try {
      const response = await fetch('http://localhost:8001/flower-api/grade-flower', {
        method: 'POST',
        body: formData,
      })
      if (!response.ok) throw new Error('Grading failed')
      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError('Grading failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadReport = async () => {
    if (!image) return
    setLoading(true)
    setError(null)
    
    // Simulate download
    setTimeout(() => {
      const link = document.createElement('a')
      link.href = '#'
      link.download = 'flower_report.pdf'
      link.click()
      setLoading(false)
    }, 1000)
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
      case 'A': return <Award className="w-8 h-8" />
      case 'B': return <CheckCircle className="w-8 h-8" />
      case 'C': return <AlertCircle className="w-8 h-8" />
      default: return <XCircle className="w-8 h-8" />
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

      <div className="py-12 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 mb-8 text-sm font-medium text-violet-300 shadow-2xl">
              <Sparkles className="w-4 h-4" />
              AI-Powered Quality Assessment
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-pink-300 bg-clip-text text-transparent">
                Flower Grading
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300/80 max-w-3xl mx-auto leading-relaxed font-light">
              Upload your flower image and receive instant 
              <span className="text-transparent bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text font-medium"> AI-powered analysis</span> 
              with detailed quality metrics
            </p>
          </div>

          <div className="grid xl:grid-cols-2 gap-12">
            {/* Enhanced Upload Section */}
            <div className="space-y-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/[0.02] rounded-3xl blur-xl" />
                <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-2xl flex items-center justify-center">
                      <Upload className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">Upload Image</h2>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div
                      className={`group relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-500 p-12 text-center ${
                        isDragging 
                          ? 'border-violet-400 bg-violet-500/10 scale-105' 
                          : 'border-white/20 hover:border-violet-400/50 hover:bg-white/[0.02]'
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
                      <div className="space-y-6">
                        <div className="relative inline-block">
                          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto transition-all duration-500 ${
                            isDragging 
                              ? 'bg-gradient-to-br from-violet-500 to-fuchsia-500 scale-110' 
                              : 'bg-gradient-to-br from-violet-600/30 to-fuchsia-600/30 group-hover:scale-110'
                          }`}>
                            <Camera className={`w-10 h-10 transition-colors duration-300 ${
                              isDragging ? 'text-white' : 'text-violet-400 group-hover:text-violet-300'
                            }`} />
                          </div>
                          {isDragging && (
                            <div className="absolute inset-0 bg-gradient-to-br from-violet-400 to-fuchsia-400 rounded-2xl animate-pulse opacity-50" />
                          )}
                        </div>
                        <div>
                          <p className={`text-2xl font-bold mb-3 transition-colors duration-300 ${
                            isDragging ? 'text-violet-300' : 'text-white group-hover:text-violet-200'
                          }`}>
                            {isDragging ? 'Drop your image here' : 'Drag & drop your flower image'}
                          </p>
                          <p className={`text-lg transition-colors duration-300 ${
                            isDragging ? 'text-violet-200' : 'text-gray-400 group-hover:text-gray-300'
                          }`}>
                            or click to browse (JPEG, PNG up to 10MB)
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={!image || loading}
                      className="w-full group relative overflow-hidden bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold py-5 px-8 rounded-2xl transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed text-xl shadow-2xl hover:shadow-violet-500/25 transform hover:scale-105 disabled:hover:scale-100"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-fuchsia-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="relative flex items-center justify-center gap-3">
                        {loading ? (
                          <>
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Analyzing Flower...</span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-6 h-6 group-hover:animate-pulse" />
                            <span>Grade Flower</span>
                          </>
                        )}
                      </div>
                    </button>
                  </form>
                </div>
              </div>

              {/* Enhanced Image Preview */}
              {preview && (
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/[0.02] rounded-3xl blur-xl" />
                  <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
                        <Camera className="w-5 h-5 text-white" />
                      </div>
                      Image Preview
                    </h3>
                    <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Results Section */}
            <div className="space-y-8">
              {result && (
                <>
                  {/* Enhanced Grade Result */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/[0.02] rounded-3xl blur-xl" />
                    <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                      <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-xl flex items-center justify-center">
                          <Award className="w-6 h-6 text-white" />
                        </div>
                        Grading Result
                      </h2>
                      
                      <div className="relative overflow-hidden rounded-2xl mb-8">
                        <div className={`bg-gradient-to-br ${getGradeColor(result.grade)} p-8 text-center text-white relative`}>
                          <div className="absolute inset-0 bg-black/10" />
                          <div className="relative">
                            <div className="flex items-center justify-center gap-4 mb-4">
                              {getGradeIcon(result.grade)}
                              <div className="text-7xl font-black">Grade {result.grade}</div>
                            </div>
                            <p className="text-2xl font-semibold opacity-90">
                              {result.grade === 'A' && 'Exceptional Quality'}
                              {result.grade === 'B' && 'Premium Quality'}
                              {result.grade === 'C' && 'Standard Quality'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Add Product Button */}
                      {(result.grade === 'A' || result.grade === 'B') && (
                        <div className="mb-8">
                          {isSeller ? (
                            <button
                              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 text-lg shadow-xl hover:shadow-emerald-500/25 transform hover:scale-105"
                            >
                              <span className="flex items-center justify-center gap-3">
                                <CheckCircle className="w-6 h-6" />
                                Add Product to Store
                              </span>
                            </button>
                          ) : (
                            <div className="text-center p-6 bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl border border-white/10">
                              <p className="text-white text-lg mb-4 font-medium">Ready to sell this premium flower?</p>
                              <button
                                className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105"
                              >
                                Login as Seller
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl p-6 border border-white/10">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-violet-400" />
                          AI Analysis Summary
                        </h3>
                        <p className="text-gray-300 leading-relaxed text-lg">{result.explanation}</p>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Metrics */}
                  {result.metrics && (
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/[0.02] rounded-3xl blur-xl" />
                      <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                            <BarChart3 className="w-5 h-5 text-white" />
                          </div>
                          Detailed Metrics
                        </h3>
                        <div className="grid grid-cols-2 gap-6">
                          {[
                            { label: 'Color Vibrancy', value: result.metrics.color_vibrancy, color: 'from-purple-500 to-pink-500' },
                            { label: 'Symmetry', value: result.metrics.symmetry, color: 'from-blue-500 to-cyan-500' },
                            { label: 'Shape Uniformity', value: result.metrics.circularity, color: 'from-emerald-500 to-teal-500' },
                            { label: 'Damage Level', value: (result.metrics.edge_density + result.metrics.brown_ratio), color: 'from-red-500 to-orange-500', invert: true }
                          ].map((metric, index) => (
                            <div key={index} className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-xl p-6 border border-white/10">
                              <div className="text-sm text-gray-400 mb-2 font-medium uppercase tracking-wide">{metric.label}</div>
                              <div className={`text-3xl font-black bg-gradient-to-r ${metric.color} bg-clip-text text-transparent mb-3`}>
                                {(metric.value * 100).toFixed(1)}%
                              </div>
                              <div className="w-full bg-white/10 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full bg-gradient-to-r ${metric.color} transition-all duration-1000 ease-out`}
                                  style={{ width: `${metric.value * 100}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Enhanced Download Report */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/[0.02] rounded-3xl blur-xl" />
                    <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                      <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                          <Download className="w-5 h-5 text-white" />
                        </div>
                        Download Report
                      </h3>
                      <button
                        onClick={handleDownloadReport}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-xl hover:shadow-green-500/25 transform hover:scale-105"
                      >
                        <span className="flex items-center justify-center gap-3">
                          {loading ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Generating Report...
                            </>
                          ) : (
                            <>
                              <Download className="w-5 h-5" />
                              Download PDF Report
                            </>
                          )}
                        </span>
                      </button>
                    </div>
                  </div>
                </>
              )}

              {error && (
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-red-600/10 rounded-3xl blur-xl" />
                  <div className="relative bg-red-900/20 backdrop-blur-xl border border-red-500/30 text-red-300 p-8 rounded-3xl">
                    <div className="flex items-center gap-3 mb-4">
                      <XCircle className="w-6 h-6 text-red-400" />
                      <h3 className="text-xl font-bold">Error</h3>
                    </div>
                    <p className="text-lg">{error}</p>
                  </div>
                </div>
              )}

              {/* Loading State */}
              {loading && !result && (
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/[0.02] rounded-3xl blur-xl" />
                  <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center shadow-2xl">
                    <div className="w-16 h-16 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin mx-auto mb-6" />
                    <h3 className="text-2xl font-bold text-white mb-4">Analyzing Your Flower</h3>
                    <p className="text-gray-400 text-lg">Our AI is examining color, symmetry, and quality indicators...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FlowerGrading