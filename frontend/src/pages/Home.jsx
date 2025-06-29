import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Flower2, Star, ArrowRight, Sparkles, Shield, Zap, CheckCircle, Clock, Award } from 'lucide-react';

const Home = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const testimonials = [
    { name: "Sarah Chen", role: "Event Planner", text: "The AI grading gives me complete confidence in flower quality. Every order is perfect!" },
    { name: "Marcus Johnson", role: "Florist", text: "FloraGrade has revolutionized how I source premium flowers. The quality is unmatched." },
    { name: "Emma Rodriguez", role: "Wedding Coordinator", text: "Grade A flowers every time. My brides are always thrilled with the arrangements." }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/50 to-slate-950 overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Background Image */}
        <div className="absolute inset-0 -z-20">
          <img
            src="/images/back.png"
            alt="Beautiful flowers background"
            className="w-full h-full object-cover"
            onError={(e) => {
              console.log('Image failed to load:', e.target.src);
              e.target.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-purple-950/70 to-slate-950/90"></div>
        </div>

        {/* Animated Background */}
        <div className="fixed inset-0 -z-10">
          <div 
            className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl transition-all duration-1000 ease-out"
            style={{
              background: 'radial-gradient(circle, rgba(168,85,247,0.4) 0%, rgba(236,72,153,0.2) 70%)',
              left: mousePosition.x - 192,
              top: mousePosition.y - 192,
            }}
          />
          <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-32 left-20 w-80 h-80 bg-gradient-to-tr from-indigo-600/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="max-w-7xl mx-auto text-center">
          {/* Floating Badge */}
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 mb-8 text-sm font-medium text-violet-300 shadow-2xl animate-float">
            <Sparkles className="w-4 h-4" />
            AI-Powered Flower Quality Assessment
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-6xl font-black mb-8 tracking-tight">
            <span className="block bg-gradient-to-r from-violet-300 via-fuchsia-300 to-pink-300 bg-clip-text text-transparent animate-gradient-x">
              Premium
              <span className=" text-white/90 ml-5 ">
               Flowers
            </span>
            </span>
            
            <span className="block text-3xl md:text-4xl lg:text-3xl font-light text-gray-400 mt-4">
              Curated by AI
            </span>
          </h1>

          <p className="text-xl md:text-sm text-gray-300/80 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
            Experience the future of flower shopping. Our advanced AI analyzes every bloom for 
            <span className="text-transparent bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text font-medium"> perfection</span>, 
            delivering only Grade A & B quality flowers to your doorstep.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <button
              className="group relative px-10 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl font-semibold text-white text-lg shadow-2xl hover:shadow-violet-500/25 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 overflow-hidden"
              onClick={() => window.location.href = '/products'}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-fuchsia-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative flex items-center gap-2">
                Shop Premium Flowers
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <button
              className="group px-10 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl font-semibold text-white text-lg hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
              onClick={() => window.location.href = '/flower-grading'}
            >
              <span className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Grade Your Flowers
              </span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-thin text-white mb-1">99.8%</div>
              <div className="text-sm text-gray-400 uppercase tracking-wide">Accuracy Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-thin text-white mb-1">50K+</div>
              <div className="text-sm text-gray-400 uppercase tracking-wide">Flowers Graded</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-thin text-white mb-1">24hrs</div>
              <div className="text-sm text-gray-400 uppercase tracking-wide">Fresh Delivery</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-thin text-white mb-1">10K+</div>
              <div className="text-sm text-gray-400 uppercase tracking-wide">Happy Customers</div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-1 h-16 bg-gradient-to-b from-transparent via-white/50 to-transparent rounded-full" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Why Choose 
              <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent"> FloraGrade?</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Revolutionary AI technology meets artisanal flower curation for an unparalleled shopping experience
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                icon: <CheckCircle className="w-8 h-8" />,
                title: "AI Quality Assurance",
                description: "Advanced computer vision analyzes color vibrancy, petal symmetry, and structural integrity with 99.8% accuracy",
                gradient: "from-emerald-500 to-teal-500"
              },
              {
                icon: <Award className="w-8 h-8" />,
                title: "Premium Selection",
                description: "Only Grade A and B flowers make it to market, ensuring every purchase meets the highest quality standards",
                gradient: "from-violet-500 to-purple-500"
              },
              {
                icon: <Clock className="w-8 h-8" />,
                title: "Lightning Fast",
                description: "Instant AI grading, same-day processing, and 24-hour fresh delivery straight to your door",
                gradient: "from-orange-500 to-pink-500"
              }
            ].map((feature, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/[0.02] rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
                <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/[0.06] transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              How It <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">Works</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Three simple steps to premium flower perfection
            </p>
          </div>

          <div className="relative">
            {/* Connection Lines */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500/50 via-fuchsia-500/50 to-pink-500/50 transform -translate-y-1/2" />
            
            <div className="grid lg:grid-cols-3 gap-12 relative z-10">
              {[
                {
                  step: "01",
                  title: "Upload & Analyze",
                  description: "Sellers upload flower images. Our AI instantly analyzes 127 quality parameters including color, symmetry, and freshness indicators."
                },
                {
                  step: "02", 
                  title: "Smart Grading",
                  description: "Advanced algorithms assign grades A-F based on comprehensive quality metrics. Only premium grades make it to our marketplace."
                },
                {
                  step: "03",
                  title: "Premium Delivery",
                  description: "Customers browse curated selections with confidence. Every flower is guaranteed fresh and beautiful, delivered within 24 hours."
                }
              ].map((item, index) => (
                <div key={index} className="text-center relative">
                  <div className="relative inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-full text-3xl font-black text-white mb-8 shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-400 to-fuchsia-400 rounded-full animate-pulse opacity-75" />
                    <span className="relative">{item.step}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed max-w-sm mx-auto">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-20">
            Loved by <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">Professionals</span>
          </h2>
          
          <div className="relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-12">
            <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}>
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0">
                  <div className="flex items-center justify-center mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-xl text-white font-light mb-8 leading-relaxed">
                    "{testimonial.text}"
                  </blockquote>
                  <div>
                    <div className="font-semibold text-white text-lg">{testimonial.name}</div>
                    <div className="text-violet-400">{testimonial.role}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial ? 'bg-violet-400' : 'bg-white/30'
                  }`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-5xl mx-auto text-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 rounded-3xl blur-3xl" />
          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-16">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Ready for Premium <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">Flowers?</span>
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands of satisfied customers who trust FloraGrade for their flower needs. 
              Experience the difference that AI-powered quality makes.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/products"
                className="group px-12 py-5 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl font-bold text-white text-xl shadow-2xl hover:shadow-violet-500/25 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1"
              >
                <span className="flex items-center gap-3">
                  <Flower2 className="w-6 h-6" />
                  Start Shopping
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link
                to="/register"
                className="px-12 py-5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl font-bold text-white text-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
              >
                <span className="flex items-center gap-3">
                  <Shield className="w-6 h-6" />
                  Become a Seller
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;