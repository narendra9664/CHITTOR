import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Check, Star, Zap, Shield, Camera, Video,
  Mail, Phone, MapPin, Instagram, Facebook, ChevronDown,
  Menu, X, MessageCircle, TrendingUp, Users, Award, Eye
} from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './index.css';

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────
   WHATSAPP NUMBER (change once here)
───────────────────────────────────────── */
const WA_NUMBER = '919602221576';

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const plans = [
  {
    id: 1,
    title: 'One Day Story',
    price: 999,
    popular: false,
    icon: <Camera className="w-6 h-6" />,
    color: '#00d4ff',
    features: [
      '24-hour story coverage',
      'Basic professional editing',
      'Instagram & Facebook ready',
      '1-day posting duration',
      'Dedicated WhatsApp support',
    ],
  },
  {
    id: 2,
    title: "Two's Story & Post",
    price: 1499,
    popular: false,
    icon: <Video className="w-6 h-6" />,
    color: '#a855f7',
    features: [
      '48-hour story coverage',
      'Advanced editing & cuts',
      'Custom transitions & graphics',
      '2-day posting duration',
      'Analytics report',
    ],
  },
  {
    id: 3,
    title: 'Seven Days Premium',
    price: 4999,
    popular: true,
    icon: <Zap className="w-6 h-6" />,
    color: '#00ff88',
    features: [
      '7-day story coverage',
      'Pro editing suite + music',
      'Custom motion graphics',
      '7-day posting duration',
      'Priority support & analytics',
    ],
  },
  {
    id: 4,
    title: 'Permanent Posting',
    price: 7999,
    popular: false,
    icon: <Shield className="w-6 h-6" />,
    color: '#f59e0b',
    features: [
      'Unlimited story coverage',
      'Cinematic editing + effects',
      'Archival 4K quality',
      'Permanent posting forever',
      'Dedicated account manager',
    ],
  },
];

const testimonials = [
  {
    id: 1,
    name: 'Ramesh Sharma',
    business: 'Jeeja Fashion',
    result: '+200% Engagement',
    rating: 5,
    text: 'ChittorgarhVlog completely transformed our online presence. Our stories reached 28,000 people in a single day — something we never imagined possible. Sales went up significantly!',
    avatar: 'RS',
    avatarColor: '#00ff88',
  },
  {
    id: 2,
    name: 'Priya Meena',
    business: 'Udan Cafe',
    result: '+150% Footfall',
    rating: 5,
    text: 'Booked the 7-Day Premium and it was worth every rupee. The editing quality is cinema-level and the local reach is unmatched. My cafe was packed every single day of that week.',
    avatar: 'PM',
    avatarColor: '#00d4ff',
  },
  {
    id: 3,
    name: 'Suresh Patel',
    business: 'S.Tech Group',
    result: '+300% Brand Awareness',
    rating: 5,
    text: 'As a tech company in a small city, we struggled to find local clients. One week with ChittorgarhVlog and we tripled our brand recognition. Highly recommend the permanent plan!',
    avatar: 'SP',
    avatarColor: '#a855f7',
  },
  {
    id: 4,
    name: 'Anita Rajput',
    business: 'Rajput Jewellers',
    result: '+80% Enquiries',
    rating: 5,
    text: "The team is very professional and understands the local culture perfectly. Our Diwali campaign video got 35,000+ views. This is the best marketing investment I've ever made.",
    avatar: 'AR',
    avatarColor: '#f59e0b',
  },
];

const brands = ['Jeeja Fashion', 'Udan Cafe', 'S.Tech Group', 'RK Enterprises', 'Savari', 'Rajput Jewellers', 'City Hospital', 'Metro Mart', 'Green Valley Hotel', 'Chittorgarh Motors'];

const stats = [
  { value: '1,00,000+', label: 'Engaged Followers', icon: <Users className="w-6 h-6" /> },
  { value: '80+', label: 'Happy Businesses', icon: <Award className="w-6 h-6" /> },
  { value: '30K+', label: 'Avg. Story Views', icon: <Eye className="w-6 h-6" /> },
  { value: '3 Years', label: 'Local Expertise', icon: <TrendingUp className="w-6 h-6" /> },
];

/* ─────────────────────────────────────────
   FLOATING PARTICLES
───────────────────────────────────────── */
const Particles = () => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 8,
    duration: Math.random() * 10 + 8,
  }));
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            width: p.size, height: p.size,
            left: p.left, bottom: '-10px',
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
};

/* ─────────────────────────────────────────
   3D HERO VISUAL
───────────────────────────────────────── */
const Hero3D = () => (
  <div className="relative w-full max-w-[480px] mx-auto h-[400px] flex items-center justify-center">
    {/* Central glowing orb */}
    <div className="absolute w-64 h-64 rounded-full"
      style={{ background: 'radial-gradient(circle, rgba(0,255,136,0.18) 0%, transparent 70%)', filter: 'blur(20px)' }}
    />

    {/* Main floating card */}
    <motion.div
      animate={{ y: [0, -16, 0], rotateZ: [0, 1, -1, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      className="glass relative z-10 p-6 w-64 shadow-2xl"
      style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.5), 0 0 40px rgba(0,255,136,0.15)' }}
    >
      {/* Mock video screen */}
      <div className="rounded-xl overflow-hidden bg-black mb-4 aspect-video relative">
        <video
          src="/hero-motion.mp4"
          className="w-full h-full object-cover"
          autoPlay loop muted playsInline
        />
        {/* Overlay badge */}
        <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/70 rounded-full px-2 py-1">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-white text-[10px] font-bold tracking-wider uppercase">Live</span>
        </div>
        <div className="absolute bottom-2 right-2 bg-black/70 rounded-full px-2 py-1 text-[10px] text-white font-bold">
          28.4K Views
        </div>
      </div>
      <div className="text-sm font-semibold text-white">Chittorgarh<span style={{ color: '#00ff88' }}>Vlog</span></div>
      <div className="text-xs mt-1" style={{ color: '#8ca0be' }}>Trending in Chittorgarh 🔥</div>
    </motion.div>

    {/* Orbiting badge 1 */}
    <motion.div
      style={{ position: 'absolute', top: '50%', left: '50%', translateX: '-50%', translateY: '-50%' }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
        style={{ width: 200, height: 200, position: 'relative' }}
      >
        <div className="badge-bounce absolute -top-4 left-1/2 -translate-x-1/2"
          style={{
            background: 'rgba(0,212,255,0.15)',
            border: '1px solid rgba(0,212,255,0.4)',
            borderRadius: 12,
            padding: '6px 12px',
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ color: '#00d4ff', fontWeight: 700, fontSize: 12 }}>📈 +200% Reach</span>
        </div>
      </motion.div>
    </motion.div>

    {/* Orbiting badge 2 */}
    <motion.div
      style={{ position: 'absolute', top: '50%', left: '50%', translateX: '-50%', translateY: '-50%' }}
    >
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        style={{ width: 260, height: 260, position: 'relative' }}
      >
        <div className="badge-bounce absolute bottom-0 right-0"
          style={{
            background: 'rgba(168,85,247,0.15)',
            border: '1px solid rgba(168,85,247,0.4)',
            borderRadius: 12,
            padding: '6px 12px',
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ color: '#a855f7', fontWeight: 700, fontSize: 12 }}>⭐ 80+ Clients</span>
        </div>
      </motion.div>
    </motion.div>

    {/* Pulse rings */}
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className="pulse-ring absolute rounded-full border"
        style={{
          width: 120 + i * 60, height: 120 + i * 60,
          top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          borderColor: 'rgba(0,255,136,0.15)',
          animationDelay: `${i * 0.7}s`,
        }}
      />
    ))}
  </div>
);

/* ─────────────────────────────────────────
   BOOKING MODAL
───────────────────────────────────────── */
const BookingModal = ({ plan, onClose }) => {
  const [form, setForm] = useState({ name: '', email: '', contact: '', message: '' });

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleWhatsApp = () => {
    if (!form.name.trim() || !form.contact.trim()) {
      alert('Please enter your name and contact number.');
      return;
    }

    const msg =
      `Hello ChittorgarhVlog! 🙏 I want to book a plan.\n\n` +
      `*📋 My Details:*\n` +
      `• *Name:* ${form.name}\n` +
      `• *Contact:* ${form.contact}\n` +
      `• *Email:* ${form.email || 'N/A'}\n` +
      `• *Plan:* ${plan.title}\n` +
      `• *Price:* ₹${plan.price}\n` +
      (form.message ? `• *Message:* ${form.message}\n` : '') +
      `\nPlease confirm my booking. Thank you! 🏰`;

    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="modal-overlay"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.85, y: 40, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.85, y: 40, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 280 }}
          className="modal-box"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full transition-colors"
            style={{ color: '#8ca0be', background: 'rgba(255,255,255,0.05)' }}
          >
            <X size={18} />
          </button>

          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${plan.color}18`, color: plan.color, border: `1px solid ${plan.color}33` }}
              >
                {plan.icon}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#8ca0be' }}>Selected Plan</p>
                <h3 className="text-lg font-bold text-white">{plan.title}</h3>
              </div>
            </div>
            <div className="p-3 rounded-xl flex items-center justify-between"
              style={{ background: `${plan.color}0d`, border: `1px solid ${plan.color}22` }}
            >
              <span className="text-sm font-medium" style={{ color: '#8ca0be' }}>Total Amount</span>
              <span className="text-2xl font-black" style={{ color: plan.color }}>₹{plan.price.toLocaleString()}</span>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#c8d8f0' }}>
                Full Name <span style={{ color: '#00ff88' }}>*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="form-input"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#c8d8f0' }}>
                WhatsApp / Phone <span style={{ color: '#00ff88' }}>*</span>
              </label>
              <input
                type="tel"
                name="contact"
                value={form.contact}
                onChange={handleChange}
                placeholder="Your active number"
                className="form-input"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#c8d8f0' }}>
                Email <span style={{ color: '#8ca0be' }}>(optional)</span>
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="form-input"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#c8d8f0' }}>
                Message / Business Info <span style={{ color: '#8ca0be' }}>(optional)</span>
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Tell us about your business or campaign goal..."
                rows={3}
                className="form-input"
                style={{ resize: 'none' }}
              />
            </div>
          </div>

          {/* Submit */}
          <button className="whatsapp-btn" onClick={handleWhatsApp}>
            <MessageCircle size={20} />
            Submit via WhatsApp
          </button>
          <p className="text-center text-xs mt-3" style={{ color: '#8ca0be' }}>
            You'll be redirected to WhatsApp to confirm your booking
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ─────────────────────────────────────────
   MAIN APP
───────────────────────────────────────── */
const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const heroRef = useRef(null);
  const statsRef = useRef([]);

  /* Active section on scroll */
  useEffect(() => {
    const sections = ['home', 'testimonials', 'services', 'pricing', 'contact'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id); });
      },
      { threshold: 0.4 }
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  /* GSAP stat counter animation */
  useEffect(() => {
    statsRef.current.forEach((el) => {
      if (el) {
        gsap.fromTo(el,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, duration: 0.7,
            scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' }
          }
        );
      }
    });
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'testimonials', label: 'Results' },
    { id: 'services', label: 'Why Us' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <div className="min-h-screen grid-bg" style={{ background: '#060b14' }}>

      {/* ────── NAVBAR ────── */}
      <header
        className="fixed top-0 left-0 right-0 z-40"
        style={{
          background: 'rgba(6,11,20,0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0,255,136,0.1)',
        }}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <button onClick={() => scrollTo('home')} className="text-xl font-black tracking-tight">
            Chittorgarh<span style={{ color: '#00ff88' }}>Vlog</span>
            <span className="ml-2 text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(0,255,136,0.12)', color: '#00ff88', border: '1px solid rgba(0,255,136,0.3)' }}
            >SMMA</span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                style={{
                  color: activeSection === link.id ? '#00ff88' : '#8ca0be',
                  background: activeSection === link.id ? 'rgba(0,255,136,0.08)' : 'transparent',
                }}
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => scrollTo('pricing')}
              className="hidden md:flex btn-glow items-center gap-2 px-5 py-2 rounded-full text-sm font-bold"
              style={{ background: '#00ff88', color: '#060b14' }}
            >
              Get Started <ArrowRight size={14} />
            </button>
            <button
              className="md:hidden p-2 rounded-lg"
              style={{ color: '#8ca0be', background: 'rgba(255,255,255,0.05)' }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ borderTop: '1px solid rgba(0,255,136,0.1)', background: 'rgba(6,11,20,0.97)' }}
            >
              <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => scrollTo(link.id)}
                    className="text-left px-4 py-3 rounded-xl text-sm font-medium"
                    style={{
                      color: activeSection === link.id ? '#00ff88' : '#8ca0be',
                      background: activeSection === link.id ? 'rgba(0,255,136,0.08)' : 'transparent',
                    }}
                  >
                    {link.label}
                  </button>
                ))}
                <button
                  onClick={() => scrollTo('pricing')}
                  className="mt-2 px-5 py-3 rounded-full text-sm font-bold"
                  style={{ background: '#00ff88', color: '#060b14' }}
                >
                  Get Started →
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ────── HERO SECTION ────── */}
      <section id="home" className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden" ref={heroRef}>
        <Particles />

        {/* Background gradient blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(0,255,136,0.07) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)', filter: 'blur(60px)' }} />

        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Text side */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="lg:w-1/2 space-y-8"
            >
              <div className="section-label">
                <span>🏰</span> Chittorgarh's #1 Video Platform
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight">
                Promote Your Brand to{' '}
                <span className="gradient-text glow-text">1 Lakh+</span>{' '}
                Local Audience
              </h1>

              <p className="text-lg md:text-xl leading-relaxed" style={{ color: '#8ca0be', maxWidth: '520px' }}>
                Chittorgarh's most trusted influencer platform. We create compelling video stories that put your business in front of the entire local community and drive real results.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => scrollTo('pricing')}
                  className="btn-glow flex items-center justify-center gap-3 px-8 py-4 rounded-full text-base font-bold"
                  style={{ background: '#00ff88', color: '#060b14' }}
                >
                  View Pricing Plans <ArrowRight size={18} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => scrollTo('testimonials')}
                  className="flex items-center justify-center gap-3 px-8 py-4 rounded-full text-base font-semibold transition-all"
                  style={{
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: '#c8d8f0',
                    background: 'rgba(255,255,255,0.03)',
                  }}
                >
                  See Client Results
                </motion.button>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                {['⭐ 5-star rated', '✅ 80+ Clients', '🔒 Secure Process'].map((badge) => (
                  <div key={badge} className="text-sm font-medium px-4 py-2 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#8ca0be' }}
                  >
                    {badge}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* 3D visual side */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
              className="lg:w-1/2"
            >
              <Hero3D />
            </motion.div>
          </div>
        </div>

        {/* Scroll hint */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ color: '#8ca0be' }}
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <ChevronDown size={18} />
        </motion.div>
      </section>

      {/* ────── BRANDS MARQUEE ────── */}
      <section className="py-10 overflow-hidden" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <p className="text-center text-xs font-semibold tracking-widest uppercase mb-6" style={{ color: '#8ca0be' }}>
          Trusted by Chittorgarh's Best Businesses
        </p>
        <div className="relative">
          <div className="marquee-track flex gap-8" style={{ width: 'max-content' }}>
            {[...brands, ...brands].map((brand, i) => (
              <div
                key={i}
                className="flex-shrink-0 px-6 py-3 rounded-full text-sm font-semibold"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  color: '#c8d8f0',
                  whiteSpace: 'nowrap',
                }}
              >
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────── STATS SECTION ────── */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <div
                key={i}
                ref={(el) => (statsRef.current[i] = el)}
                className="stat-card p-6 text-center"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                  style={{ background: 'rgba(0,255,136,0.1)', color: '#00ff88' }}
                >
                  {stat.icon}
                </div>
                <div className="text-2xl md:text-3xl font-black mb-1" style={{ color: '#00ff88' }}>{stat.value}</div>
                <div className="text-sm font-medium" style={{ color: '#8ca0be' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────── TESTIMONIALS ────── */}
      <section id="testimonials" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(0,255,136,0.04) 0%, transparent 70%)' }}
        />
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <div className="section-label mx-auto w-fit">💬 Real Client Results</div>
            <h2 className="text-3xl md:text-4xl font-black mt-4 mb-4">
              What Our Clients <span className="gradient-text">Say</span>
            </h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: '#8ca0be' }}>
              Don't take our word for it. Here's what Chittorgarh's business owners say after working with us.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                className="testimonial-card p-6 card-3d"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={14} style={{ color: '#f59e0b', fill: '#f59e0b' }} />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-base leading-relaxed mb-6" style={{ color: '#c8d8f0' }}>
                  "{t.text}"
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black"
                      style={{ background: `${t.avatarColor}18`, color: t.avatarColor, border: `2px solid ${t.avatarColor}33` }}
                    >
                      {t.avatar}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{t.name}</div>
                      <div className="text-xs" style={{ color: '#8ca0be' }}>{t.business}</div>
                    </div>
                  </div>
                  <div className="text-xs font-black px-3 py-1.5 rounded-full"
                    style={{ background: `${t.avatarColor}12`, color: t.avatarColor, border: `1px solid ${t.avatarColor}28` }}
                  >
                    {t.result}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ────── WHY CHOOSE US ────── */}
      <section id="services" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <div className="section-label mx-auto w-fit">🎯 Why ChittorgarhVlog</div>
            <h2 className="text-3xl md:text-4xl font-black mt-4 mb-4">
              The Unfair Advantage for <span className="gradient-text">Local Businesses</span>
            </h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: '#8ca0be' }}>
              We're not just a page — we're a community. And your ad goes directly to that community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: <Users className="w-8 h-8" />,
                color: '#00ff88',
                title: 'Massive Hyper-Local Reach',
                desc: 'Access our 1,00,000+ Chittorgarh followers. Every single one of them is a potential customer for local businesses. No wasted impressions.',
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                color: '#00d4ff',
                title: 'Proven Story Performance',
                desc: 'Our stories average 15,000–30,000 views per post. That\'s more eyeballs on your brand than any local newspaper or billboard at a fraction of the cost.',
              },
              {
                icon: <Award className="w-8 h-8" />,
                color: '#a855f7',
                title: 'Cinema-Quality Production',
                desc: 'Our editing team creates professional, eye-catching content that stops people mid-scroll. We handle everything — you just share your vision.',
              },
              {
                icon: <Shield className="w-8 h-8" />,
                color: '#f59e0b',
                title: 'Deep Local Understanding',
                desc: 'We speak Chittorgarh\'s language — literally. Our team understands local festivals, culture, and what resonates. We make your brand feel like a neighbor.',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass p-6 card-3d"
              >
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${item.color}14`, color: item.color, border: `1px solid ${item.color}28` }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-black mb-2 text-white">{item.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: '#8ca0be' }}>{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ────── CTA STRIP ────── */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(0,255,136,0.08) 0%, rgba(0,212,255,0.05) 100%)' }} />
        <div className="absolute inset-0" style={{ border: '1px solid rgba(0,255,136,0.12)' }} />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Ready to Dominate <span className="gradient-text">Chittorgarh</span>?
          </h2>
          <p className="text-lg mb-8" style={{ color: '#8ca0be', maxWidth: 480, margin: '0 auto 32px' }}>
            Your competitors are using video marketing. Don't let them own the conversation. Start your campaign today.
          </p>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => scrollTo('pricing')}
            className="btn-glow inline-flex items-center gap-3 px-10 py-4 rounded-full text-lg font-black"
            style={{ background: '#00ff88', color: '#060b14' }}
          >
            Choose Your Plan <ArrowRight size={20} />
          </motion.button>
        </div>
      </section>

      {/* ────── PRICING SECTION ────── */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <div className="section-label mx-auto w-fit">💰 Simple Pricing</div>
            <h2 className="text-3xl md:text-4xl font-black mt-4 mb-4">
              Pick the Plan That <span className="gradient-text">Fits Your Goal</span>
            </h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: '#8ca0be' }}>
              No hidden fees. No contracts. Just powerful local reach at a price that makes sense.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`pricing-card p-6 flex flex-col ${plan.popular ? 'featured' : ''}`}
              >
                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div className="text-xs font-black px-4 py-1.5 rounded-full"
                      style={{ background: '#00ff88', color: '#060b14' }}
                    >
                      ⭐ Most Popular
                    </div>
                  </div>
                )}

                {/* Icon */}
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: `${plan.color}14`, color: plan.color, border: `1px solid ${plan.color}28` }}
                >
                  {plan.icon}
                </div>

                {/* Name */}
                <h3 className="text-lg font-black text-white mb-1">{plan.title}</h3>

                {/* Price */}
                <div className="mb-5">
                  <span className="text-4xl font-black" style={{ color: plan.color }}>₹{plan.price.toLocaleString()}</span>
                  <span className="text-sm ml-1" style={{ color: '#8ca0be' }}>/ project</span>
                </div>

                {/* Divider */}
                <div className="w-full h-px mb-5" style={{ background: `${plan.color}18` }} />

                {/* Features */}
                <ul className="space-y-3 mb-6 flex-1">
                  {plan.features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-2.5 text-sm" style={{ color: '#c8d8f0' }}>
                      <Check size={15} className="flex-shrink-0 mt-0.5" style={{ color: plan.color }} />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedPlan(plan)}
                  className="btn-glow w-full py-3.5 rounded-full font-black text-sm"
                  style={
                    plan.popular
                      ? { background: '#00ff88', color: '#060b14' }
                      : { background: `${plan.color}14`, color: plan.color, border: `1px solid ${plan.color}30` }
                  }
                >
                  Choose Plan →
                </motion.button>
              </motion.div>
            ))}
          </div>

          {/* Bottom note */}
          <p className="text-center text-sm mt-8" style={{ color: '#8ca0be' }}>
            📲 All plans include a WhatsApp consultation. Unsure which plan to pick?{' '}
            <a href={`https://wa.me/${WA_NUMBER}?text=Hi! I need help choosing a plan for my business.`}
              target="_blank" rel="noopener noreferrer"
              style={{ color: '#00ff88', fontWeight: 700 }}
            >
              Chat with us →
            </a>
          </p>
        </div>
      </section>

      {/* ────── HOW IT WORKS ────── */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="section-label mx-auto w-fit">🚀 Simple Process</div>
            <h2 className="text-3xl font-black mt-4" style={{ color: '#f0f6ff' }}>
              Get Started in <span className="gradient-text">3 Easy Steps</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { step: '01', title: 'Choose a Plan', desc: 'Pick the package that best fits your marketing goal and budget.', color: '#00ff88' },
              { step: '02', title: 'Fill Your Details', desc: 'A quick form pops up. Enter your name, number, and business info.', color: '#00d4ff' },
              { step: '03', title: 'Confirm on WhatsApp', desc: 'Click "Submit via WhatsApp" and our team will reach out to get started!', color: '#a855f7' },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="glass-light p-6 text-center"
              >
                <div className="text-5xl font-black mb-4" style={{ color: `${step.color}33`, lineHeight: 1 }}>{step.step}</div>
                <h3 className="text-lg font-black text-white mb-2">{step.title}</h3>
                <p className="text-sm" style={{ color: '#8ca0be' }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ────── CONTACT SECTION ────── */}
      <section id="contact" className="py-20">
        <div className="container mx-auto px-4">
          <div className="glass max-w-2xl mx-auto p-8 md:p-12 text-center">
            <div className="section-label mx-auto w-fit mb-4">📞 Get In Touch</div>
            <h2 className="text-3xl font-black text-white mb-4">Let's Grow Together</h2>
            <p className="mb-8" style={{ color: '#8ca0be' }}>
              Have a question before booking? Reach out on WhatsApp and we'll help you choose the right plan.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {[
                { icon: <Phone size={18} />, label: '+91 9602221576', href: 'tel:+919602221576', color: '#00ff88' },
                { icon: <Mail size={18} />, label: 'info@chittorgarhvlog.com', href: 'mailto:info@chittorgarhvlog.com', color: '#00d4ff' },
                { icon: <MapPin size={18} />, label: 'Chittorgarh, Rajasthan', href: '#', color: '#a855f7' },
              ].map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  className="flex items-center gap-3 p-4 rounded-xl text-sm font-medium transition-all hover:-translate-y-1"
                  style={{
                    background: `${item.color}0a`,
                    border: `1px solid ${item.color}20`,
                    color: '#c8d8f0',
                  }}
                >
                  <span style={{ color: item.color }}>{item.icon}</span>
                  <span className="text-xs">{item.label}</span>
                </a>
              ))}
            </div>

            <a
              href={`https://wa.me/${WA_NUMBER}?text=Hi ChittorgarhVlog! I'd like to know more about your services.`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="whatsapp-btn">
                <MessageCircle size={20} /> Chat on WhatsApp
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* ────── FOOTER ────── */}
      <footer className="py-12" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div>
              <div className="text-xl font-black mb-3">
                Chittorgarh<span style={{ color: '#00ff88' }}>Vlog</span>
              </div>
              <p className="text-sm leading-relaxed mb-5" style={{ color: '#8ca0be' }}>
                Connecting local businesses with Chittorgarh's vibrant 1-lakh+ community through professional video storytelling.
              </p>
              <div className="flex gap-3">
                {[
                  { icon: <Instagram size={16} />, href: 'https://instagram.com/chittorgarh_vlog' },
                  { icon: <Facebook size={16} />, href: '#' },
                ].map((s, i) => (
                  <a
                    key={i}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:-translate-y-1"
                    style={{ background: 'rgba(255,255,255,0.06)', color: '#8ca0be', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div>
              <h4 className="text-sm font-black uppercase tracking-wider mb-4 text-white">Quick Links</h4>
              <ul className="space-y-2">
                {['home', 'testimonials', 'services', 'pricing', 'contact'].map((s) => (
                  <li key={s}>
                    <button
                      onClick={() => scrollTo(s)}
                      className="text-sm capitalize transition-colors hover:text-white"
                      style={{ color: '#8ca0be' }}
                    >
                      {s === 'testimonials' ? 'Client Results' : s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-sm font-black uppercase tracking-wider mb-4 text-white">Legal</h4>
              <ul className="space-y-2">
                {[
                  { to: '/privacy', label: 'Privacy Policy' },
                  { to: '/terms', label: 'Terms & Conditions' },
                  { to: '/refund-policy', label: 'Refund Policy' },
                ].map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="text-sm transition-colors hover:text-white" style={{ color: '#8ca0be' }}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-sm font-black uppercase tracking-wider mb-4 text-white">Contact</h4>
              <div className="space-y-3">
                {[
                  { icon: <Phone size={14} />, text: '+91 9602221576' },
                  { icon: <Mail size={14} />, text: 'info@chittorgarhvlog.com' },
                  { icon: <MapPin size={14} />, text: 'Chittorgarh, Rajasthan' },
                ].map((c, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm" style={{ color: '#8ca0be' }}>
                    <span style={{ color: '#00ff88' }}>{c.icon}</span>
                    {c.text}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-sm" style={{ color: '#8ca0be' }}>
              © {new Date().getFullYear()} ChittorgarhVlog. All rights reserved.
            </p>
            <p className="text-xs" style={{ color: '#4a6080' }}>
              Made with ❤️ in Chittorgarh, Rajasthan 🏰
            </p>
          </div>
        </div>
      </footer>

      {/* ────── BOOKING MODAL ────── */}
      {selectedPlan && (
        <BookingModal plan={selectedPlan} onClose={() => setSelectedPlan(null)} />
      )}
    </div>
  );
};

export default App;
