import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Star, Zap, Shield, Camera, Video, FileText, Mail, Phone, MapPin, Instagram, Twitter, Facebook, Linkedin, ChevronDown, ChevronUp, Menu, X, Upload, Loader, Download } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './index.css';

gsap.registerPlugin(ScrollTrigger);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY || 'rzp_test_Rg4YanWeF28b9d';

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [bookingData, setBookingData] = useState({
    name: '',
    email: '',
    contact: '',
    videoFile: null,
    plan: '',
    amount: 0
  });
  const [currentBrandIndex, setCurrentBrandIndex] = useState(0);
  const [bookingStatus, setBookingStatus] = useState('idle');
  const [bookingId, setBookingId] = useState('');
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [showManualPayment, setShowManualPayment] = useState(false);
  const [manualTxnId, setManualTxnId] = useState('');

  // Mock data for services
  const services = [
    {
      id: 1,
      title: "One Day Story",
      description: "Capture your special moment with our professional one-day storytelling service.",
      price: 999,
      features: ["24-hour story coverage", "Basic editing", "Social media ready format", "1-day posting"],
      icon: <Camera className="w-8 h-8" />
    },
    {
      id: 2,
      title: "Two's Story & Post",
      description: "Perfect for couples or partners with extended coverage and premium post-production.",
      price: 1499,
      features: ["48-hour story coverage", "Advanced editing", "Custom transitions", "2-day posting"],
      icon: <Video className="w-8 h-8" />
    },
    {
      id: 3,
      title: "Seven Days Premium",
      description: "Comprehensive storytelling experience with extended coverage and premium features.",
      price: 4999,
      features: ["7-day story coverage", "Professional editing suite", "Custom graphics", "7-day posting", "Priority support"],
      icon: <Zap className="w-8 h-8" />
    },
    {
      id: 4,
      title: "Permanent Posting",
      description: "Create timeless memories with unlimited posting duration and archival quality.",
      price: 7999,
      features: ["Unlimited story coverage", "Premium editing & effects", "Archival quality", "Permanent posting", "Dedicated account manager", "Priority support"],
      icon: <Shield className="w-8 h-8" />
    }
  ];

  // Mock data for case studies
  const caseStudies = [
    {
      id: 1,
      client: "Jeeja Fashion",
      result: "+200% engagement",
      description: "Our storytelling approach helped Jeeja Fashion increase their social media engagement by 200% through compelling visual narratives."
    },
    {
      id: 2,
      client: "Udan",
      result: "+150% conversions",
      description: "By implementing our video storytelling strategy, Udan saw a 150% increase in conversion rates from their marketing campaigns."
    },
    {
      id: 3,
      client: "S.Tech Group",
      result: "+300% brand awareness",
      description: "S.Tech Group achieved tripled brand awareness through our comprehensive seven-day storytelling package."
    }
  ];

  // Mock data for trusted brands
  const trustedBrands = [
    { name: "Jeeja Fashion", logo: "JF" },
    { name: "Udan", logo: "U" },
    { name: "Savari", logo: "S" },
    { name: "S.Tech Group", logo: "STG" },
    { name: "RK Enterprises", logo: "RKE" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBrandIndex((prevIndex) => (prevIndex + 1) % trustedBrands.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // GSAP Animation Refs
  const heroVideoRef = useRef(null);
  const serviceCardsRef = useRef([]);
  const pricingCardsRef = useRef([]);

  // Hero 3D Animation Effect
  useEffect(() => {
    if (heroVideoRef.current) {
      // Create floating 3D effect for the video icon
      gsap.to(heroVideoRef.current, {
        y: -20,
        rotationX: 15,
        rotationY: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        transformPerspective: 1000,
        transformStyle: "preserve-3d"
      });

      // Pulsing glow effect
      gsap.to(heroVideoRef.current.querySelector('.video-icon-glow'), {
        scale: 1.1,
        opacity: 0.8,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });
    }
  }, []);

  // Scroll-triggered animations for service cards
  useEffect(() => {
    serviceCardsRef.current.forEach((card, index) => {
      if (card) {
        gsap.fromTo(card,
          {
            opacity: 0,
            y: 100,
            rotationX: -30,
            transformPerspective: 1000
          },
          {
            opacity: 1,
            y: 0,
            rotationX: 0,
            duration: 1,
            delay: index * 0.2,
            scrollTrigger: {
              trigger: card,
              start: "top 80%",
              end: "top 20%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
    });
  }, []);

  // Scroll-triggered animations for pricing cards
  useEffect(() => {
    pricingCardsRef.current.forEach((card, index) => {
      if (card) {
        gsap.fromTo(card,
          {
            opacity: 0,
            scale: 0.8,
            rotationY: -45,
            transformPerspective: 1000
          },
          {
            opacity: 1,
            scale: 1,
            rotationY: 0,
            duration: 0.8,
            delay: index * 0.15,
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
    });
  }, []);

  const handleBookNow = (plan) => {
    setSelectedPlan(plan);
    setBookingData(prev => ({
      ...prev,
      plan: plan.title,
      amount: plan.price
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo'];
      if (!allowedTypes.includes(file.type)) {
        alert('Only MP4, MPEG, MOV, and AVI video files are allowed');
        return;
      }

      // Validate file size (max 500MB)
      const maxSize = 500 * 1024 * 1024; // 500MB in bytes
      if (file.size > maxSize) {
        alert('File size exceeds 500MB limit');
        return;
      }

      setBookingData(prev => ({
        ...prev,
        videoFile: file
      }));
    }
  };

  const submitBooking = async () => {
    setBookingStatus('submitting');

    const formData = new FormData();
    formData.append('name', bookingData.name);
    formData.append('email', bookingData.email);
    formData.append('contact', bookingData.contact);
    formData.append('video_file', bookingData.videoFile);
    formData.append('plan', bookingData.plan);
    formData.append('amount', bookingData.amount);

    try {
      const response = await fetch(`${API_URL}/api/create/`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (response.ok) {
        setBookingId(data.booking_id);
        setBookingStatus('booking_created');
        setBookingId(data.booking_id);
        setBookingStatus('booking_created');
        // Show payment options instead of auto-initiating Razorpay
        setShowPaymentOptions(true);
      } else {
        alert(`Booking failed: ${data.error || 'Unknown error'}`);
        setBookingStatus('error');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      setBookingStatus('error');
    }
  };

  const initiatePayment = async (bookingId) => {
    setPaymentProcessing(true);

    try {
      // Check if Razorpay is loaded
      if (!window.Razorpay) {
        console.error('Razorpay SDK not loaded');
        setBookingStatus('error');
        setPaymentProcessing(false);
        return;
      }

      const response = await fetch(`${API_URL}/api/create-order/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          booking_id: bookingId
        })
      });

      const orderData = await response.json();

      if (response.ok) {
        // Initialize Razorpay
        const options = {
          key: RAZORPAY_KEY,
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'chittorgarh_vlog',
          description: bookingData.plan,
          order_id: orderData.order_id,
          handler: async function (response) {
            // Verify payment
            const verifyResponse = await fetch(`${API_URL}/api/verify-payment/`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                booking_id: bookingId
              })
            });

            if (verifyResponse.ok) {
              setShowSuccess(true);
              setBookingStatus('completed');
            } else {
              const errorData = await verifyResponse.json();
              alert(`Payment failed: ${errorData.error || 'Unknown error'}`);
              setBookingStatus('error');
            }
          },
          prefill: {
            name: bookingData.name,
            email: bookingData.email,
            contact: bookingData.contact
          },
          theme: {
            color: '#00ff88'
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        setBookingStatus('error');
      }
    } catch (error) {
      console.error('Error initiating payment:', error);
      setBookingStatus('error');
    } finally {
      setPaymentProcessing(false);
    }
  };

  const submitManualPayment = async () => {
    if (!manualTxnId.trim()) {
      alert('Please enter the Transaction ID');
      return;
    }

    setPaymentProcessing(true);
    try {
      const response = await fetch(`${API_URL}/api/submit-manual-payment/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          booking_id: bookingId,
          transaction_id: manualTxnId
        })
      });

      const data = await response.json();
      if (response.ok) {
        setShowManualPayment(false);
        setShowSuccess(true);
        setBookingStatus('completed');
      } else {
        alert(`Error: ${data.error || 'Failed to submit'}`);
      }
    } catch (error) {
      console.error('Error submitting manual payment:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setPaymentProcessing(false);
    }
  };

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setActiveSection(sectionId);
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="text-2xl font-bold text-gray-900">Chittorgarh<span className="text-green-500">Vlog</span></div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection('home')}
                className={`text-sm font-medium transition-colors ${activeSection === 'home' ? 'text-green-500' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('services')}
                className={`text-sm font-medium transition-colors ${activeSection === 'services' ? 'text-green-500' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Services
              </button>
              <button
                onClick={() => scrollToSection('pricing')}
                className={`text-sm font-medium transition-colors ${activeSection === 'pricing' ? 'text-green-500' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Pricing
              </button>
              <Link
                to="/heritage-view"
                className="text-sm font-medium transition-colors text-gray-600 hover:text-gray-900 flex items-center gap-1"
              >
                <Download className="w-4 h-4" />
                Heritage View
              </Link>
              <Link
                to="/contact"
                className="text-sm font-medium transition-colors text-gray-600 hover:text-gray-900"
              >
                Contact
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <button className="hidden md:block px-6 py-2 bg-green-500 text-white rounded-full text-sm font-medium hover:bg-green-600 transition-colors">
                Get Started
              </button>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 text-gray-600 hover:text-gray-900"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-gray-100"
            >
              <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
                <button
                  onClick={() => scrollToSection('home')}
                  className={`text-sm font-medium py-2 ${activeSection === 'home' ? 'text-green-500' : 'text-gray-600'}`}
                >
                  Home
                </button>
                <button
                  onClick={() => scrollToSection('services')}
                  className={`text-sm font-medium py-2 ${activeSection === 'services' ? 'text-green-500' : 'text-gray-600'}`}
                >
                  Services
                </button>
                <button
                  onClick={() => scrollToSection('pricing')}
                  className={`text-sm font-medium py-2 ${activeSection === 'pricing' ? 'text-green-500' : 'text-gray-600'}`}
                >
                  Pricing
                </button>
                <Link
                  to="/heritage-view"
                  className="text-sm font-medium py-2 text-gray-600 flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Download className="w-4 h-4" />
                  Heritage View
                </Link>
                <Link
                  to="/contact"
                  className="text-sm font-medium py-2 text-gray-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
                <button className="px-6 py-2 bg-green-500 text-white rounded-full text-sm font-medium hover:bg-green-600 transition-colors">
                  Get Started
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section id="home" className="pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Promote Your Brand to <span className="text-green-500">Chittorgarh's Audience</span>
              </h1>
              <p className="text-xl text-gray-600">
                Reach 100,000+ engaged viewers in Chittorgarh with our professional video storytelling services. We specialize in connecting businesses with the local community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => scrollToSection('pricing')}
                  className="px-8 py-3 bg-green-500 text-white rounded-full text-lg font-medium hover:bg-green-600 transition-colors"
                >
                  Start Your Campaign
                </button>
                <button className="px-8 py-3 border border-gray-300 text-gray-700 rounded-full text-lg font-medium hover:bg-gray-50 transition-colors">
                  Learn More
                </button>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative">
                <div className="absolute inset-0 bg-green-500 rounded-full opacity-10 transform -rotate-6"></div>
                <div className="relative bg-white p-6 rounded-2xl shadow-lg">
                  <div
                    className="aspect-video rounded-lg flex items-center justify-center overflow-hidden relative"
                    style={{
                      backgroundImage: 'url(https://images.unsplash.com/photo-1609920658906-8223bd289001?q=80&w=2000)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    {/* Dark overlay for better text visibility */}
                    <div className="absolute inset-0 bg-black bg-opacity-40"></div>

                    <div className="text-center relative z-10" ref={heroVideoRef} style={{ transformStyle: 'preserve-3d' }}>
                      <div className="relative inline-block">
                        {/* Glowing background effect */}
                        <div className="video-icon-glow absolute inset-0 bg-green-400 rounded-full blur-xl opacity-60"></div>
                        {/* Main play icon */}
                        <div className="relative w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl cursor-pointer hover:scale-110 transition-transform">
                          <Video className="w-12 h-12 text-white" />
                        </div>
                      </div>
                      <p className="text-white font-bold text-xl drop-shadow-lg">Your story starts here</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted Brands Row */}
      <section className="py-12 bg-gray-50 overflow-hidden">
        <div className="container mx-auto px-4 mb-8">
          <h2 className="text-2xl font-bold text-center">Trusted by Local Businesses</h2>
        </div>

        <div className="relative flex overflow-x-hidden">
          <motion.div
            className="flex py-4 gap-12 whitespace-nowrap"
            animate={{
              x: [0, -1035], // Adjust based on content width
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 20,
                ease: "linear",
              },
            }}
          >
            {[...trustedBrands, ...trustedBrands, ...trustedBrands, ...trustedBrands].map((brand, index) => (
              <div
                key={index}
                className="flex items-center justify-center min-w-[160px] h-16 bg-white rounded-lg shadow-sm hover:shadow-md transition-all"
              >
                <span className="text-lg font-bold text-gray-800">{brand.name}</span>
              </div>
            ))}
          </motion.div>

          <motion.div
            className="flex py-4 gap-12 whitespace-nowrap absolute left-full"
            animate={{
              x: [0, -1035],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 20,
                ease: "linear",
              },
            }}
            aria-hidden="true"
          >
            {/* Duplicate for seamless loop if needed, but the first one with enough duplicates is usually simpler. 
                 Let's stick to a single long strip. 
             */}
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Chittorgarh<span className="text-green-500">Vlog</span>?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're not just another video service – we're your local partner in reaching Chittorgarh's vibrant community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div ref={el => serviceCardsRef.current[0] = el} className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <Star className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Massive Local Reach</h3>
                  <p className="text-gray-600">
                    Promote your brand with 100,000+ of the Chittorgarh audience. Our platform connects you directly with the community that matters most to your business.
                  </p>
                </div>
              </div>
            </div>

            <div ref={el => serviceCardsRef.current[1] = el} className="bg-gray-900 text-white rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 rounded-full bg-green-500 text-white">
                  <Zap className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Proven Results</h3>
                  <p className="text-gray-300">
                    Average reach with ChittorgarhVlog is around 15,000 to 30,000 per story. Our content consistently delivers high engagement and measurable results.
                  </p>
                </div>
              </div>
            </div>

            <div ref={el => serviceCardsRef.current[2] = el} className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <Check className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Trusted Partner</h3>
                  <p className="text-gray-600">
                    Working with 80+ happy customers across Chittorgarh. We've built lasting relationships by delivering exceptional value and personalized service.
                  </p>
                </div>
              </div>
            </div>

            <div ref={el => serviceCardsRef.current[3] = el} className="bg-gray-900 text-white rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 rounded-full bg-green-500 text-white">
                  <Shield className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Local Expertise</h3>
                  <p className="text-gray-300">
                    Particularly built for the Chittorgarh audience. We understand local culture, preferences, and what resonates with the community.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA Strip */}
      <section id="contact" className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Reach Chittorgarh?</h2>
            <p className="text-xl mb-8 text-gray-300">
              Contact us today to learn more about how our local storytelling services can help grow your business in Chittorgarh.
            </p>
            <button className="px-8 py-3 bg-green-500 text-white rounded-full text-lg font-medium hover:bg-green-600 transition-colors">
              Get Your Free Proposal
            </button>
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See how we've helped local businesses achieve remarkable results with our storytelling services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {caseStudies.map((study, index) => (
              <div
                key={study.id}
                className="bg-gray-900 text-white rounded-2xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Star className="w-6 h-6 text-yellow-400" />
                  <span className="text-lg font-bold">{study.client}</span>
                </div>
                <div className="text-2xl font-bold text-green-400 mb-4">{study.result}</div>
                <p className="text-gray-300">{study.description}</p>
                <button className="mt-4 text-green-400 hover:text-green-300 font-medium flex items-center gap-1">
                  Learn More <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the perfect plan for your storytelling needs. All plans include professional editing and social media optimization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {services.map((plan, index) => (
              <div
                key={plan.id}
                ref={el => pricingCardsRef.current[index] = el}
                className={`rounded-2xl p-6 transition-all duration-300 hover:shadow-lg ${index === 2
                  ? 'border-2 border-green-500 relative'
                  : 'border border-gray-200'
                  }`}
              >
                {index === 2 && (
                  <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                    Most Popular
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-2">{plan.title}</h3>
                  <div className="text-3xl font-bold mb-2">₹{plan.price}</div>
                  <p className="text-gray-600">per project</p>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleBookNow(plan)}
                  className={`w-full py-3 rounded-full font-medium transition-colors ${index === 2
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  Choose Plan
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-12 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-2xl font-bold mb-4">Chittorgarh<span className="text-green-500">Vlog</span></div>
              <p className="text-gray-400 mb-4">
                Connecting local businesses with Chittorgarh's vibrant community through professional video storytelling.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><button onClick={() => scrollToSection('home')} className="text-gray-400 hover:text-white">Home</button></li>
                <li><button onClick={() => scrollToSection('services')} className="text-gray-400 hover:text-white">Services</button></li>
                <li><button onClick={() => scrollToSection('pricing')} className="text-gray-400 hover:text-white">Pricing</button></li>
                <li><button onClick={() => scrollToSection('contact')} className="text-gray-400 hover:text-white">Contact</button></li>
                <li><Link to="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-gray-400 hover:text-white">Terms & Conditions</Link></li>
                <li><Link to="/refund-policy" className="text-gray-400 hover:text-white">Refund Policy</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Contact Us</h4>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 mt-1" />
                  <span>info@chittorgarh_vlog.com</span>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 mt-1" />
                  <span>+91 7733 072 738</span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 mt-1" />
                  <span>House No. 2, Nayapura, Mandor, Jodhpur, Rajasthan</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} ChittorgarhVlog. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Payment Options Modal */}
      <AnimatePresence>
        {showPaymentOptions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative"
            >
              <button
                onClick={() => setShowPaymentOptions(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>

              <h3 className="text-2xl font-bold mb-6 text-center">Choose Payment Method</h3>

              <div className="space-y-4">
                <button
                  onClick={() => {
                    setShowPaymentOptions(false);
                    initiatePayment(bookingId);
                  }}
                  className="w-full py-4 px-6 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-3"
                >
                  <Zap className="w-6 h-6" />
                  Pay Online (Instant)
                </button>

                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="flex-shrink-0 mx-4 text-gray-400">OR</span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <button
                  onClick={() => {
                    setShowPaymentOptions(false);
                    setShowManualPayment(true);
                  }}
                  className="w-full py-4 px-6 bg-gray-100 text-gray-800 rounded-xl font-bold text-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-3"
                >
                  <FileText className="w-6 h-6" />
                  Manual Payment (UPI/Bank)
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Manual Payment Modal */}
      <AnimatePresence>
        {showManualPayment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setShowManualPayment(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>

              <h3 className="text-2xl font-bold mb-4 text-center">Manual Payment</h3>

              <div className="bg-gray-50 p-4 rounded-xl mb-6 border border-gray-200">
                <p className="text-sm text-gray-600 mb-2 font-medium">Scan QR Code or Transfer to:</p>
                <div className="space-y-1 text-sm">
                  <p><span className="font-bold">UPI ID:</span> narendrakumar9664@oksbi</p>
                  <p><span className="font-bold">Bank:</span> State Bank of Bikaner and Jaipur</p>
                  <p><span className="font-bold">Account:</span> 61266429919</p>
                  <p><span className="font-bold">IFSC:</span> SBIN0032343</p>
                </div>

                <div className="mt-4 space-y-2 text-sm text-gray-700">
                  <p className="font-bold">Step-by-Step Process:</p>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Scan the QR code or Transfer to the bank details above.</li>
                    <li><strong>Important:</strong> Send the screenshot of the payment to our WhatsApp number: <a href="https://wa.me/916377595978" target="_blank" className="text-green-600 font-bold hover:underline">+91 63775 95978</a></li>
                    <li>Enter the Transaction ID below and hit Submit.</li>
                  </ol>
                </div>
                {/* Dynamic QR Code for UPI */}
                <div className="mt-4 flex flex-col items-center justify-center">
                  <div className="bg-white p-2 border border-gray-200 rounded-lg shadow-sm">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=narendrakumar9664@oksbi&pn=ChittorgarhVlog&am=${bookingData.amount}&cu=INR`}
                      alt="Payment QR Code"
                      className="w-32 h-32"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Scan with any UPI App</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Enter Transaction ID / UTR
                  </label>
                  <input
                    type="text"
                    value={manualTxnId}
                    onChange={(e) => setManualTxnId(e.target.value)}
                    placeholder="e.g. 1234567890"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <button
                  onClick={submitManualPayment}
                  disabled={paymentProcessing}
                  className="w-full py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-colors disabled:opacity-50"
                >
                  {paymentProcessing ? 'Submitting...' : 'Submit Payment Details'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Booking Modal */}
      < AnimatePresence >
        {selectedPlan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedPlan(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Book Your Plan</h3>
                <button onClick={() => setSelectedPlan(null)} className="text-gray-500 hover:text-gray-700">
                  <X size={20} />
                </button>
              </div>

              <div className="mb-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={bookingData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Your full name"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={bookingData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="your@email.com"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Contact Number</label>
                  <input
                    type="tel"
                    name="contact"
                    value={bookingData.contact}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Your contact number"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Upload Video (MP4)</label>
                  <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${bookingData.videoFile ? 'border-green-500 bg-green-50' : 'border-gray-300'
                    }`}>
                    {bookingData.videoFile ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex flex-col items-center"
                      >
                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-3">
                          <Check className="w-8 h-8 text-white" />
                        </div>
                        <p className="text-green-700 font-medium mb-1">{bookingData.videoFile.name}</p>
                        <p className="text-sm text-green-600">
                          {(bookingData.videoFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                        <label htmlFor="video-upload" className="mt-3 text-sm text-green-600 hover:text-green-700 cursor-pointer underline">
                          Change Video
                        </label>
                      </motion.div>
                    ) : (
                      <>
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600 mb-2">Drag & drop your video here</p>
                        <p className="text-sm text-gray-500 mb-2">or</p>
                        <label htmlFor="video-upload" className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors cursor-pointer inline-block">
                          Browse Files
                        </label>
                        <p className="text-xs text-gray-500 mt-2">MP4 format only, max 500MB</p>
                      </>
                    )}
                    <input
                      type="file"
                      accept="video/mp4"
                      onChange={handleFileChange}
                      className="hidden"
                      id="video-upload"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Selected Plan</label>
                    <div className="px-3 py-2 bg-gray-100 rounded-md">{selectedPlan.title}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Total Amount</label>
                    <div className="px-3 py-2 bg-gray-100 rounded-md">₹{selectedPlan.price}</div>
                  </div>
                </div>
              </div>

              <button
                onClick={submitBooking}
                disabled={bookingStatus === 'submitting' || paymentProcessing}
                className="w-full py-3 bg-green-500 text-white rounded-full font-medium hover:bg-green-600 transition-colors flex items-center justify-center"
              >
                {paymentProcessing ? (
                  <>
                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  'Proceed to Payment'
                )}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence >

      {/* Success Modal */}
      < AnimatePresence >
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="bg-white rounded-2xl p-8 w-full max-w-md mx-auto text-center"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Congratulations!</h3>
              <p className="text-gray-600 mb-4">
                Your booking has been successfully completed. We'll process your video and notify you when it's ready.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Booking ID: {bookingId}
              </p>
              <button
                onClick={() => {
                  setShowSuccess(false);
                  setSelectedPlan(null);
                  setBookingData({
                    name: '',
                    email: '',
                    contact: '',
                    videoFile: null,
                    plan: '',
                    amount: 0
                  });
                }}
                className="px-6 py-2 bg-green-500 text-white rounded-full font-medium hover:bg-green-600 transition-colors"
              >
                Continue Browsing
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence >
    </div >
  );
};

export default App;
