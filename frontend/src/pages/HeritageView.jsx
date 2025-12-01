import React, { useState } from 'react';
import { ArrowLeft, Download, MapPin, Camera, Clock, Star, CheckCircle, X, Users, Award, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const HeritageView = () => {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleDownload = async (e) => {
        e.preventDefault();

        if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
            alert('Please fill in all required fields.');
            return;
        }

        setIsSubmitting(true);

        // Simulate API call to collect user data
        const userData = {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            phone: formData.phone,
            timestamp: new Date().toISOString(),
            source: 'heritage_view_download'
        };

        console.log('User data collected for Heritage View download:', userData);

        // Simulate a short delay
        setTimeout(() => {
            // Trigger download
            const link = document.createElement('a');
            link.href = '/HARITAGE VIEW/downloads/chittorgarh-guide.pdf';
            link.download = 'chittorgarh-guide.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Show success message
            alert('Thank you! Your download will start shortly.');

            // Reset form and close modal
            setFormData({ firstName: '', lastName: '', email: '', phone: '' });
            setShowModal(false);
            setIsSubmitting(false);
        }, 1500);
    };

    const features = [
        {
            icon: <BookOpen className="w-6 h-6" />,
            title: "19 Pages of Expert Content",
            description: "Comprehensive guide covering every aspect of Chittorgarh"
        },
        {
            icon: <MapPin className="w-6 h-6" />,
            title: "Complete Fort Exploration",
            description: "Detailed walkthrough of the magnificent Chittorgarh Fort"
        },
        {
            icon: <Camera className="w-6 h-6" />,
            title: "Photography Spots",
            description: "Best locations and timing for stunning photographs"
        },
        {
            icon: <Clock className="w-6 h-6" />,
            title: "Historical Context",
            description: "Rich stories and historical significance of each location"
        },
        {
            icon: <Users className="w-6 h-6" />,
            title: "Local Markets Guide",
            description: "Shopping tips and authentic local experiences"
        },
        {
            icon: <Award className="w-6 h-6" />,
            title: "Sacred Temples Directory",
            description: "Complete guide to historic temples and their significance"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span className="font-medium">Back to Home</span>
                        </button>
                        <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-green-600 bg-clip-text text-transparent">
                            Heritage View
                        </div>
                        <button
                            onClick={() => setShowModal(true)}
                            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-full font-medium hover:shadow-lg transition-all"
                        >
                            Download Guide
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="pt-32 pb-16 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-12">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-purple-500 to-green-600 bg-clip-text text-transparent"
                        >
                            Discover India's Hidden Heritage
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-gray-600 max-w-3xl mx-auto mb-8"
                        >
                            Premium digital travel guide that unlocks secret destinations and local experiences across Chittorgarh's rich cultural landscape. Expertly crafted for travelers seeking authentic heritage adventures.
                        </motion.p>
                        <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            onClick={() => setShowModal(true)}
                            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-full text-lg font-bold hover:shadow-2xl hover:scale-105 transition-all"
                        >
                            Download Free Guide
                        </motion.button>
                    </div>

                    {/* Featured Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="relative rounded-3xl overflow-hidden shadow-2xl mb-16"
                    >
                        <img
                            src="/chittorgarh-fort.jpg"
                            alt="Chittorgarh Fort"
                            className="w-full h-[500px] object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end">
                            <div className="p-8 text-white">
                                <h3 className="text-3xl font-bold mb-2">Hidden Gems of Chittorgarh</h3>
                                <p className="text-lg text-gray-200">Complete guide to Chittorgarh Fort, ancient palaces, sacred temples, and bustling local markets</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-16 px-4 bg-white">
                <div className="container mx-auto max-w-6xl">
                    <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
                        What's Inside the Guide
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-gradient-to-br from-purple-50 to-green-50 rounded-2xl p-6 hover:shadow-xl transition-all border border-purple-100 hover:border-purple-300"
                            >
                                <div className="bg-gradient-to-br from-purple-600 to-purple-700 text-white p-3 rounded-xl w-fit mb-4">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-2 text-gray-900">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Guide Details */}
            <section className="py-16 px-4">
                <div className="container mx-auto max-w-4xl">
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-purple-200">
                        <div className="bg-gradient-to-r from-purple-600 to-green-600 p-8 text-white">
                            <h2 className="text-3xl font-bold mb-4">Complete Heritage Guide</h2>
                            <p className="text-purple-100 text-lg">Everything you need to explore Chittorgarh like a local</p>
                        </div>
                        <div className="p-8">
                            <div className="grid md:grid-cols-2 gap-6 mb-8">
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-1">Complete Fort Exploration</h4>
                                        <p className="text-gray-600 text-sm">Detailed walkthrough of every palace, tower, and monument</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-1">Historic Palaces</h4>
                                        <p className="text-gray-600 text-sm">Stories and architecture of royal residences</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-1">Sacred Temples</h4>
                                        <p className="text-gray-600 text-sm">Complete directory with historical significance</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-1">Local Markets</h4>
                                        <p className="text-gray-600 text-sm">Shopping tips and authentic experiences</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-1">Photography Guide</h4>
                                        <p className="text-gray-600 text-sm">Best spots and timing for stunning photos</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-1">Instant Download</h4>
                                        <p className="text-gray-600 text-sm">PDF format, ready to use on any device</p>
                                    </div>
                                </div>
                            </div>
                            <div className="text-center">
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="px-10 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-full text-lg font-bold hover:shadow-2xl hover:scale-105 transition-all inline-flex items-center gap-3"
                                >
                                    <Download className="w-6 h-6" />
                                    Download Guide Now
                                </button>
                                <p className="text-sm text-gray-500 mt-4">Free • Instant Download • 97MB PDF</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Download Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
                        >
                            <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 text-white relative">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                                <h3 className="text-2xl font-bold mb-2">Download Heritage Guide</h3>
                                <p className="text-purple-100">Enter your details to get instant access</p>
                            </div>

                            <form onSubmit={handleDownload} className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            First Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                            placeholder="John"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Last Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                            placeholder="Doe"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                        placeholder="john@example.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                        placeholder="+91 98765 43210"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 rounded-lg font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Download className="w-5 h-5" />
                                            Download Now
                                        </>
                                    )}
                                </button>

                                <p className="text-xs text-gray-500 text-center">
                                    By downloading, you agree to receive updates about Chittorgarh tourism
                                </p>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Footer CTA */}
            <section className="py-16 px-4 bg-gradient-to-r from-purple-600 to-green-600 text-white">
                <div className="container mx-auto max-w-4xl text-center">
                    <h2 className="text-4xl font-bold mb-4">Ready to Explore Chittorgarh?</h2>
                    <p className="text-xl text-purple-100 mb-8">
                        Download your free heritage guide and start planning your adventure today
                    </p>
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-10 py-4 bg-white text-purple-600 rounded-full text-lg font-bold hover:shadow-2xl hover:scale-105 transition-all"
                    >
                        Get Your Free Guide
                    </button>
                </div>
            </section>
        </div>
    );
};

export default HeritageView;
