import React, { useState, useEffect } from 'react';
import { Flower2,  ArrowRight, Sparkles, Shield, Zap, CheckCircle, Clock, Award ,Star, Quote, ChevronLeft, ChevronRight} from 'lucide-react';

const Home = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

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
    {
      text: "This platform completely transformed how we approach our workflow. The intuitive design and powerful features saved us countless hours every week.",
      name: "Sarah Chen",
      role: "Product Manager",
      company: "TechFlow",
      avatar: "SC",
      rating: 5
    },
    {
      text: "The level of customization and attention to detail is incredible. It's like having a dedicated team member that never sleeps.",
      name: "Marcus Rodriguez",
      role: "Creative Director",
      company: "DesignLab",
      avatar: "MR",
      rating: 5
    },
    {
      text: "I've tried dozens of similar tools, but nothing comes close to this level of sophistication and ease of use. Game-changing.",
      name: "Emily Watson",
      role: "Startup Founder",
      company: "InnovateCo",
      avatar: "EW",
      rating: 5
    },
    {
      text: "The ROI was immediate. Within the first month, we saw a 40% increase in productivity across all our teams.",
      name: "David Kim",
      role: "Operations Lead",
      company: "ScaleUp",
      avatar: "DK",
      rating: 5
    },
    {
      text: "Outstanding support and seamless integration. Our entire team adopted it within days, not weeks.",
      name: "Lisa Park",
      role: "Tech Lead",
      company: "DevCorp",
      avatar: "LP",
      rating: 5
    },
    {
      text: "The analytics and insights have revolutionized our decision-making process. We're more data-driven than ever.",
      name: "James Wilson",
      role: "Data Analyst",
      company: "Insights Pro",
      avatar: "JW",
      rating: 5
    }
  ];

  // Console log current testimonial for debugging
  useEffect(() => {
    console.log(`Current testimonial: ${currentTestimonial + 1}/${testimonials.length}`);
    console.log(`Showing testimonial from: ${testimonials[currentTestimonial].name}`);
  }, [currentTestimonial]);

  const nextTestimonial = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      const newIndex = (currentTestimonial + 1) % testimonials.length;
      setCurrentTestimonial(newIndex);
      console.log(`Navigation: Next -> Moving to testimonial ${newIndex + 1}`);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const previousTestimonial = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      const newIndex = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
      setCurrentTestimonial(newIndex);
      console.log(`Navigation: Previous -> Moving to testimonial ${newIndex + 1}`);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const goToTestimonial = (index) => {
    if (!isAnimating && index !== currentTestimonial) {
      setIsAnimating(true);
      setCurrentTestimonial(index);
      console.log(`Direct navigation: Moving to testimonial ${index + 1}`);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/50 to-slate-950 overflow-hidden">
  
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-start pl-10 px-4 sm:px-6 lg:pl-[280px] bg-[url('assets/img/back6.png')] bg-right bg-contain bg-no-repeat">
        {/* Background Pattern - Flower-inspired */}
        
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

        <div className="max-w-7xl w-full">
          {/* Floating Badge */}
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 mb-8 text-sm font-medium text-violet-300 shadow-2xl animate-float">
            <Sparkles className="w-4 h-4" />
            AI-Powered Flower Quality Assessment
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-6xl font-black mb-8 tracking-tight text-left">
            <span className="block bg-gradient-to-r from-violet-300 via-fuchsia-300 to-pink-300 bg-clip-text text-transparent animate-gradient-x">
              Premium
              <span className="text-white/90 ml-5">
                Flowers
              </span>
            </span>
            
            <span className="block text-3xl md:text-4xl lg:text-3xl font-light text-gray-400 mt-4 text-left">
              Curated by AI
            </span>
          </h1>

          <p className="text-xl md:text-sm text-gray-300/80 max-w-2xl mb-12 leading-relaxed font-light text-left">
            Experience the future of flower shopping. Our advanced AI analyzes every bloom for 
            <span className="text-transparent bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text font-medium"> perfection</span>, 
            delivering only Grade A & B quality flowers to your doorstep.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 mb-16 justify-start">
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 max-w-3xl">
            <div className="text-left bottom ">
              <div className="text-2xl md:text-3xl font-thin text-white mb-1">99.8%</div>
              <div className="text-sm text-gray-400 uppercase tracking-wide">Accuracy Rate</div>
            </div>
            
            <div className="text-left">
              <div className="text-2xl md:text-3xl font-thin text-white mb-1">50K+</div>
              <div className="text-sm text-gray-400 uppercase tracking-wide">Flowers Graded</div>
            </div>
            <div className="text-left">
              <div className="text-2xl md:text-3xl font-thin text-white mb-1">24hrs</div>
              <div className="text-sm text-gray-400 uppercase tracking-wide">Fresh Delivery</div>
            </div>
            <div className="text-left">
              <div className="text-2xl md:text-3xl font-thin text-white mb-1">10K+</div>
              <div className="text-sm text-gray-400 uppercase tracking-wide">Happy Customers</div>
            </div>
          </div>
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
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-transparent relative overflow-hidden">
      

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-6 py-2 mb-8">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium text-white/80">Trusted by 10,000+ professionals</span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-white mb-6">
            Loved by{' '}
            <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
              Innovators
            </span>
          </h2>
          
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            See why thousands of professionals choose our platform to transform their workflow
          </p>
        </div>

        {/* Single Testimonial Card with Navigation */}
        <div className="relative mb-16">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl border border-white/20 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10"></div>
            
            {/* Navigation buttons */}
            <button
              onClick={previousTestimonial}
              disabled={isAnimating}
              className="absolute left-6 top-1/2 transform -translate-y-1/2 z-20 w-14 h-14 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-6 h-6 text-white group-hover:text-purple-300 transition-colors" />
            </button>
            
            <button
              onClick={nextTestimonial}
              disabled={isAnimating}
              className="absolute right-6 top-1/2 transform -translate-y-1/2 z-20 w-14 h-14 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-6 h-6 text-white group-hover:text-purple-300 transition-colors" />
            </button>

            {/* Testimonial content */}
            <div className="relative px-16 py-16 md:px-24 md:py-20">
              <div className="text-center max-w-4xl mx-auto">
                {/* Quote icon */}
                <div className="flex justify-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg transform transition-transform duration-300">
                    <Quote className="w-10 h-10 text-white" />
                  </div>
                </div>

                {/* Stars */}
                <div className="flex items-center justify-center mb-8 gap-1">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current drop-shadow-sm" />
                  ))}
                </div>

                {/* Testimonial text with animation */}
                <div className="relative h-32 md:h-24 mb-12 flex items-center justify-center">
                  <blockquote className={`absolute inset-0 flex items-center justify-center text-2xl md:text-xl text-white font-light leading-relaxed transition-all duration-500 ${
                    isAnimating ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
                  }`}>
                    "{testimonials[currentTestimonial].text}"
                  </blockquote>
                </div>

                {/* Author info with animation */}
                <div className={`flex items-center justify-center gap-6 transition-all duration-500 delay-100 ${
                  isAnimating ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
                }`}>
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-xl">{testimonials[currentTestimonial].avatar}</span>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-white text-xl">{testimonials[currentTestimonial].name}</div>
                    <div className="text-purple-300 text-lg">{testimonials[currentTestimonial].role}</div>
                    <div className="text-white/60 text-base">{testimonials[currentTestimonial].company}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="flex justify-center mt-8 gap-2">
            <span className="text-white/60 text-sm">
              {currentTestimonial + 1} of {testimonials.length}
            </span>
          </div>

          {/* Pagination dots */}
          <div className="flex justify-center mt-6 gap-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`group relative overflow-hidden transition-all duration-300 ${
                  index === currentTestimonial 
                    ? 'w-12 h-4' 
                    : 'w-4 h-4 hover:w-6'
                }`}
                onClick={() => goToTestimonial(index)}
                disabled={isAnimating}
              >
                <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
                  index === currentTestimonial
                    ? 'bg-gradient-to-r from-purple-400 to-pink-400'
                    : 'bg-white/30 group-hover:bg-white/50'
                }`}></div>
                {index === currentTestimonial && (
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-pulse"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Stats section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { number: '10,000+', label: 'Happy Users' },
            { number: '99.9%', label: 'Uptime' },
            { number: '4.9/5', label: 'Average Rating' },
            { number: '50+', label: 'Countries' }
          ].map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="inline-flex flex-col items-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 transition-all duration-300 group-hover:bg-white/10 group-hover:scale-105 w-full">
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-white/60 text-sm font-medium">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
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
              <button
                className="group px-12 py-5 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl font-bold text-white text-xl shadow-2xl hover:shadow-violet-500/25 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1"
                onClick={() => window.location.href = '/products'}
              >
                <span className="flex items-center gap-3">
                  <Flower2 className="w-6 h-6" />
                  Start Shopping
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              <button
                className="px-12 py-5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl font-bold text-white text-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
                onClick={() => window.location.href = '/register'}
              >
                <span className="flex items-center gap-3">
                  <Shield className="w-6 h-6" />
                  Become a Seller
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;