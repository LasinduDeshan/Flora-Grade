import { useState, useRef } from 'react'

function App() {
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

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
  }

  const handleDrop = (e) => {
    e.preventDefault()
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
      const res = await fetch('http://localhost:8000/grade-flower', {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) throw new Error('Failed to grade image')
      const data = await res.json()
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadReport = async () => {
    if (!image) return
    setLoading(true)
    setError(null)
    const formData = new FormData()
    formData.append('file', image)
    try {
      const res = await fetch('http://localhost:8000/download-report', {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) throw new Error('Failed to download report')
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'flower_report.pdf'
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getGradeColor = (grade) => {
    switch (grade?.toUpperCase()) {
      case 'A': return 'text-emerald-400 bg-gradient-to-r from-emerald-900/50 to-emerald-800/30 border-emerald-700/50'
      case 'B': return 'text-blue-400 bg-gradient-to-r from-blue-900/50 to-blue-800/30 border-blue-700/50'
      case 'C': return 'text-amber-400 bg-gradient-to-r from-amber-900/50 to-amber-800/30 border-amber-700/50'
      default: return 'text-gray-400 bg-gradient-to-r from-gray-900/50 to-gray-800/30 border-gray-700/50'
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Glowing background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -right-40 w-96 h-96 bg-purple-900/20 rounded-full filter blur-3xl opacity-30"></div>
        <div className="absolute bottom-20 -left-40 w-96 h-96 bg-pink-900/20 rounded-full filter blur-3xl opacity-30"></div>
      </div>
      
      <div className="relative z-10 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
                </svg>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">FloraGrade</h1>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-purple-300 transition-colors">Features</a>
              <a href="#" className="text-gray-400 hover:text-purple-300 transition-colors">About</a>
              <a href="#" className="text-gray-400 hover:text-purple-300 transition-colors">Contact</a>
            </div>
          </div>

          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-gray-800/50 rounded-full border border-gray-700 mb-6 text-sm text-purple-300 font-medium">
              AI-Powered Flower Analysis
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 max-w-3xl mx-auto leading-tight">
              <span className="bg-gradient-to-r from-[#24243e] to-[#7303c0] bg-clip-text text-transparent">Precision Grading</span> for Your Blooms
            </h1>
            <p className="tex-xl md:text-sm text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Advanced computer vision analyzes your flowers for quality, health, and aesthetic perfection.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Upload Section */}
            <div className="space-y-8">
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6 shadow-xl">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  Upload Flower Image
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div
                    className="group relative cursor-pointer bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-700 hover:border-purple-500/50 transition-all duration-300 p-8 text-center"
                    onDragOver={handleDragOver}
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
                      <div className="relative inline-block">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mx-auto">
                          <svg className="w-8 h-8 text-purple-500 group-hover:text-purple-300 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <p className="text-lg font-medium text-white mb-2 group-hover:text-purple-200 transition-colors duration-300">
                          Drag & drop your flower image
                        </p>
                        <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                          or click to browse (JPEG, PNG up to 10MB)
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!image || loading}
                    className="w-full group relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center justify-center space-x-2">
                      {loading ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Analyzing...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          <span>Grade My Flower</span>
                        </>
                      )}
                    </div>
                  </button>
                </form>
              </div>

              {preview && (
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6 shadow-xl">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <div className="w-6 h-6 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    Image Preview
                  </h3>
                  <div className="relative group overflow-hidden rounded-lg">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>
              )}
            </div>

            {/* Results Section */}
            <div className="space-y-8">
              {loading && (
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-8 animate-pulse">
                  <div className="text-center py-8">
                    <div className="relative w-20 h-20 mx-auto mb-6">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full animate-spin opacity-20"></div>
                      <div className="absolute inset-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">AI Analysis in Progress</h3>
                    <p className="text-gray-400">Examining flower characteristics with advanced algorithms...</p>
                    <div className="mt-4 flex justify-center space-x-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-900/20 backdrop-blur-sm rounded-xl border border-red-800 p-6">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-red-900/30 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-red-300 mb-2">Analysis Error</h3>
                      <p className="text-red-200 text-sm">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {result && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  {/* Grade Display */}
                  <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6 shadow-xl">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-green-600 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      Quality Assessment
                    </h2>
                    
                    <div className="text-center mb-6">
                      <div className={`inline-flex items-center px-6 py-3 rounded-xl text-3xl font-bold border ${getGradeColor(result.grade)} shadow-lg`}>
                        <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
                        </svg>
                        Grade: {result.grade}
                      </div>
                    </div>
                    
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                      <h4 className="font-bold text-white mb-3 text-md flex items-center">
                        <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        AI Analysis Summary
                      </h4>
                      <p className="text-gray-300 text-sm leading-relaxed">{result.explanation}</p>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6 shadow-xl">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      Performance Metrics
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(result.metrics).map(([key, value], index) => (
                        <div key={key} className="group bg-gray-800/50 rounded-lg p-4 border border-gray-700 hover:bg-gray-800 transition-all duration-300" style={{animationDelay: `${index * 100}ms`}}>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-gray-300 capitalize">
                              {key.replace(/_/g, ' ')}
                            </span>
                            <span className="text-lg font-bold text-white">
                              {(value * 100).toFixed(0)}%
                            </span>
                          </div>
                          <div className="relative w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out"
                              style={{ 
                                width: `${Math.min(Math.max(value * 100, 0), 100)}%`,
                                animationDelay: `${index * 200}ms`
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Download Report */}
                  <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6 shadow-xl">
                    <div className="text-center">
                      <div className="w-14 h-14 bg-gradient-to-br from-pink-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3">Comprehensive Report</h3>
                      <p className="text-gray-400 text-sm mb-6">Download a detailed PDF analysis with expert insights</p>
                      <button
                        onClick={handleDownloadReport}
                        disabled={loading}
                        className="group relative overflow-hidden bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-medium py-2 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative flex items-center justify-center space-x-2">
                          <svg className="w-5 h-5 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span>Download Report</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-20 pt-8 border-t border-gray-800">
            <div className="flex items-center justify-center space-x-6 mb-4">
              <a href="#" className="text-gray-500 hover:text-purple-300 transition-colors text-sm">Privacy</a>
              <a href="#" className="text-gray-500 hover:text-purple-300 transition-colors text-sm">Terms</a>
              <a href="#" className="text-gray-500 hover:text-purple-300 transition-colors text-sm">Contact</a>
            </div>
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} FloraGrade. AI-powered flower analysis.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App