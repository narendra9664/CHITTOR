import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download, FileText, CheckCircle, CreditCard, Loader, Code, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY;

const Downloads = () => {
    const navigate = useNavigate();
    const [pdfInfo, setPdfInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    // Paid PDF state
    const [showPurchaseForm, setShowPurchaseForm] = useState(false);
    const [purchaseData, setPurchaseData] = useState({ name: '', email: '', phone: '' });
    const [processing, setProcessing] = useState(false);
    const [downloadToken, setDownloadToken] = useState(null);
    const [showPaymentOptions, setShowPaymentOptions] = useState(false);
    const [showManualPayment, setShowManualPayment] = useState(false);
    const [manualTxnId, setManualTxnId] = useState('');
    const [currentPurchaseId, setCurrentPurchaseId] = useState(null);
    const [razorpayOrderId, setRazorpayOrderId] = useState(null);

    // Free PDF download modal state
    const [showFreeDownloadModal, setShowFreeDownloadModal] = useState(false);
    const [selectedFreePdf, setSelectedFreePdf] = useState(null);
    const [freeDownloadData, setFreeDownloadData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    });
    const [isSubmittingFree, setIsSubmittingFree] = useState(false);

    useEffect(() => {
        fetchPDFInfo();
    }, []);

    const fetchPDFInfo = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/pdf-info/`);
            setPdfInfo(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching PDF info:', error);
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setPurchaseData({
            ...purchaseData,
            [e.target.name]: e.target.value
        });
    };

    const handleFreeDownloadInputChange = (e) => {
        setFreeDownloadData({
            ...freeDownloadData,
            [e.target.name]: e.target.value
        });
    };

    const handlePurchasePDF = async () => {
        if (!purchaseData.name || !purchaseData.email || !purchaseData.phone) {
            alert('Please fill all fields');
            return;
        }

        setProcessing(true);

        try {
            // Create purchase order
            const response = await axios.post(`${API_URL}/api/pdf-purchase/`, purchaseData);
            const { order_id, purchase_id } = response.data;

            setCurrentPurchaseId(purchase_id);
            setRazorpayOrderId(order_id);
            setProcessing(false);
            setShowPurchaseForm(false);
            setShowPaymentOptions(true);
        } catch (error) {
            alert('Error: ' + (error.response?.data?.error || 'Failed to initiate purchase'));
            setProcessing(false);
        }
    };

    const initiateRazorpay = async () => {
        if (!razorpayOrderId) return;

        setProcessing(true);
        // Open Razorpay
        const options = {
            key: RAZORPAY_KEY,
            amount: 9 * 100, // ₹9 default, but should ideally come from backend
            currency: 'INR',
            name: 'Chittorgarh Vlog',
            description: 'Chittorgarh Tourism Guide PDF',
            order_id: razorpayOrderId,
            handler: async function (razorpayResponse) {
                // Verify payment
                try {
                    const verifyResponse = await axios.post(`${API_URL}/api/pdf-verify-payment/`, {
                        razorpay_order_id: razorpayResponse.razorpay_order_id,
                        razorpay_payment_id: razorpayResponse.razorpay_payment_id,
                        razorpay_signature: razorpayResponse.razorpay_signature
                    });

                    if (verifyResponse.data.success) {
                        setDownloadToken(verifyResponse.data.download_token);
                        setShowPaymentOptions(false);
                        alert('Payment successful! You can now download the PDF.');
                    }
                } catch (error) {
                    alert('Payment verification failed: ' + (error.response?.data?.error || 'Unknown error'));
                }
                setProcessing(false);
            },
            prefill: {
                name: purchaseData.name,
                email: purchaseData.email,
                contact: purchaseData.phone
            },
            theme: {
                color: '#22c55e'
            }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
            alert('Payment failed: ' + response.error.description);
            setProcessing(false);
        });
        rzp.open();
    };

    const submitManualPayment = async () => {
        if (!manualTxnId.trim()) {
            alert('Please enter Transaction ID');
            return;
        }

        setProcessing(true);
        try {
            const response = await axios.post(`${API_URL}/api/pdf-submit-manual-payment/`, {
                purchase_id: currentPurchaseId,
                transaction_id: manualTxnId
            });

            if (response.data.success) {
                setDownloadToken(response.data.download_token);
                setShowManualPayment(false);
                alert('Success! Your manual payment details have been submitted. You can now download the PDF.');
            }
        } catch (error) {
            alert('Error: ' + (error.response?.data?.error || 'Failed to submit'));
        } finally {
            setProcessing(false);
        }
    };

    const handleDownloadPaidPDF = () => {
        if (downloadToken) {
            window.open(`${API_URL}/api/pdf-download/${downloadToken}/`, '_blank');
        }
    };

    const handleDownloadFreePDF = async (filename, pdfName, fileSizeMB) => {
        try {
            // Track the download
            await axios.post(`${API_URL}/api/mediakit-track/`, {
                pdf_name: pdfName,
                file_size_mb: fileSizeMB
            });
        } catch (error) {
            console.warn('Tracking failed, but proceeding with download:', error);
        }
        // Open the download
        window.open(`${API_URL}/api/mediakit-download/${filename}/`, '_blank');
    };

    const handleInitiateFreeDownload = (pdf) => {
        setSelectedFreePdf(pdf);
        setShowFreeDownloadModal(true);
    };

    const handleFreeDownloadSubmit = async (e) => {
        e.preventDefault();

        if (!freeDownloadData.firstName || !freeDownloadData.lastName || !freeDownloadData.email || !freeDownloadData.phone) {
            alert('Please fill in all required fields.');
            return;
        }

        setIsSubmittingFree(true);

        // Collect user data
        const userData = {
            name: `${freeDownloadData.firstName} ${freeDownloadData.lastName}`,
            email: freeDownloadData.email,
            phone: freeDownloadData.phone,
            timestamp: new Date().toISOString(),
            source: 'free_pdf_download',
            pdf_name: selectedFreePdf.name
        };

        console.log('User data collected for free download:', userData);

        // Simulate API call
        setTimeout(async () => {
            try {
                // Track download
                await axios.post(`${API_URL}/api/mediakit-track/`, {
                    pdf_name: selectedFreePdf.name,
                    file_size_mb: 3.2
                });

                // Download file
                window.open(`${API_URL}/api/mediakit-download/${selectedFreePdf.filename}/`, '_blank');

                // Show success message
                alert('Thank you! Your download will start shortly.');

                // Reset form and close modal
                setFreeDownloadData({ firstName: '', lastName: '', email: '', phone: '' });
                setShowFreeDownloadModal(false);
                setSelectedFreePdf(null);
            } catch (error) {
                console.error('Error downloading media kit:', error);
                // Still allow download even if tracking fails
                window.open(`${API_URL}/api/mediakit-download/${selectedFreePdf.filename}/`, '_blank');
            } finally {
                setIsSubmittingFree(false);
            }
        }, 1500);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader className="w-12 h-12 text-green-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-8 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-medium">Back to Home</span>
                </button>

                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                        Download Center
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Get your Chittorgarh tourism guide and free media kit resources
                    </p>
                </div>

                {/* Paid PDF Section */}
                {pdfInfo?.paid_pdf && (
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                            <CreditCard className="w-8 h-8 text-green-600" />
                            Premium Tourism Guide
                        </h2>

                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-green-200 hover:shadow-2xl transition-shadow">
                            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-2xl font-bold mb-2">{pdfInfo.paid_pdf.name}</h3>
                                        <p className="text-green-100">{pdfInfo.paid_pdf.description}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-5xl font-bold">₹{pdfInfo.paid_pdf.price}</div>
                                        <div className="text-green-100 text-sm">One-time payment</div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8">
                                {downloadToken ? (
                                    <div className="text-center">
                                        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                                        <h4 className="text-2xl font-bold text-green-900 mb-2">Payment Successful!</h4>
                                        <p className="text-gray-600 mb-6">Your tourism guide is ready to download</p>
                                        <button
                                            onClick={handleDownloadPaidPDF}
                                            className="bg-green-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-600 transition-colors shadow-lg hover:shadow-xl flex items-center gap-3 mx-auto"
                                        >
                                            <Download className="w-6 h-6" />
                                            Download PDF Now
                                        </button>
                                        <p className="text-sm text-gray-500 mt-4">Download link expires in 1 hour</p>
                                    </div>
                                ) : showPurchaseForm ? (
                                    <div className="max-w-md mx-auto">
                                        <h4 className="text-xl font-bold mb-4">Complete Your Purchase</h4>
                                        <div className="space-y-4">
                                            <input
                                                type="text"
                                                name="name"
                                                placeholder="Your Name *"
                                                value={purchaseData.name}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                            />
                                            <input
                                                type="email"
                                                name="email"
                                                placeholder="Email Address *"
                                                value={purchaseData.email}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                            />
                                            <input
                                                type="tel"
                                                name="phone"
                                                placeholder="Phone Number *"
                                                value={purchaseData.phone}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                            />
                                            <button
                                                onClick={handlePurchasePDF}
                                                disabled={processing}
                                                className="w-full bg-green-500 text-white px-6 py-4 rounded-lg font-bold text-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                            >
                                                {processing ? (
                                                    <>
                                                        <Loader className="w-5 h-5 animate-spin" />
                                                        Processing...
                                                    </>
                                                ) : (
                                                    <>
                                                        <CreditCard className="w-5 h-5" />
                                                        Proceed to Payment
                                                    </>
                                                )}
                                            </button>
                                            <button
                                                onClick={() => setShowPurchaseForm(false)}
                                                className="w-full text-gray-600 hover:text-gray-800 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <ul className="text-left max-w-md mx-auto mb-6 space-y-3">
                                            <li className="flex items-start gap-3">
                                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                                <span className="text-gray-700">Complete 97MB tourism guide with maps and photos</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                                <span className="text-gray-700">Historical information about Chittorgarh Fort</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                                <span className="text-gray-700">Travel tips and local recommendations</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                                <span className="text-gray-700">Instant download after payment</span>
                                            </li>
                                        </ul>
                                        <button
                                            onClick={() => setShowPurchaseForm(true)}
                                            className="bg-green-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-600 transition-colors shadow-lg hover:shadow-xl"
                                        >
                                            Buy Now for ₹{pdfInfo.paid_pdf.price}
                                        </button>
                                        <p className="text-sm text-gray-500 mt-4">Secure payment via Razorpay</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Free Media Kit Section */}
                {pdfInfo?.free_pdfs && pdfInfo.free_pdfs.length > 0 && (
                    <div>
                        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                            <FileText className="w-8 h-8 text-green-600" />
                            Free Media Kit
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Download our brand assets and promotional materials - completely free!
                        </p>

                        <div className="grid md:grid-cols-2 gap-6">
                            {pdfInfo.free_pdfs.map((pdf, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all border border-gray-200 hover:border-green-300"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="bg-green-100 p-3 rounded-lg">
                                            <FileText className="w-8 h-8 text-green-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold mb-2">{pdf.name}</h3>
                                            <p className="text-gray-600 mb-4 text-sm">{pdf.description}</p>
                                            <button
                                                onClick={() => handleInitiateFreeDownload(pdf)}
                                                className="bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
                                            >
                                                <Download className="w-5 h-5" />
                                                Free Download
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Heritage View Source Code Section */}
                <div className="mt-16 mb-16">
                    <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                        <div className="bg-purple-100 p-2 rounded-lg">
                            <Code className="w-8 h-8 text-purple-600" />
                        </div>
                        Heritage View Project
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Download the complete source code for our Heritage View virtual tour project.
                    </p>

                    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all border border-gray-200 hover:border-purple-300">
                        <div className="flex items-start gap-4">
                            <div className="bg-purple-100 p-3 rounded-lg">
                                <Code className="w-8 h-8 text-purple-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold mb-2">Heritage View Source Code</h3>
                                <p className="text-gray-600 mb-4 text-sm">Full source code including HTML, CSS, JS and assets for the virtual tour experience.</p>
                                <button
                                    onClick={() => handleDownloadFreePDF('heritage-view.zip', 'Heritage View Source', 15.0)}
                                    className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
                                >
                                    <Download className="w-5 h-5" />
                                    Download Source Code (ZIP)
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Footer */}
                <div className="mt-12 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                    <h3 className="font-bold text-lg mb-3">Need Help?</h3>
                    <p className="text-gray-600 mb-2">
                        For any questions about downloads or payment issues, contact us:
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                        <span>📧 narendrakumar9664@gmail.com</span>
                        <span>📱 +91 7733 072 738</span>
                        <span>📸 @chittorgarh_vlog</span>
                    </div>
                </div>
            </div>

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

                            <h3 className="text-2xl font-bold mb-6 text-center">Payment Method</h3>

                            <div className="space-y-4">
                                <button
                                    onClick={() => {
                                        setShowPaymentOptions(false);
                                        initiateRazorpay();
                                    }}
                                    className="w-full py-4 px-6 bg-green-500 text-white rounded-xl font-bold text-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-3"
                                >
                                    <CreditCard className="w-6 h-6" />
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
                                    Manual (UPI/Bank)
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
                            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative"
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
                                    <p><span className="font-bold">Name:</span> NARENDRA KUMAR</p>
                                    <p><span className="font-bold">UPI ID:</span> 7733072738@naviaxis</p>
                                </div>

                                <div className="mt-4 space-y-2 text-sm text-gray-700">
                                    <p className="font-bold">Step-by-Step Process:</p>
                                    <ol className="list-decimal pl-5 space-y-1">
                                        <li>Scan the QR code or Transfer to the UPI ID above.</li>
                                        <li><strong>Important:</strong> Send the screenshot of the payment to our WhatsApp number: <a href="https://wa.me/916377595978" target="_blank" className="text-green-600 font-bold hover:underline">+91 63775 95978</a></li>
                                        <li>Enter the Transaction ID below and hit Submit.</li>
                                    </ol>
                                </div>

                                <div className="mt-4 flex flex-col items-center justify-center">
                                    <div className="bg-white p-2 border border-gray-200 rounded-lg shadow-sm">
                                        <img
                                            src="/payment-qr.jpg"
                                            alt="Payment QR Code - NARENDRA KUMAR"
                                            className="w-40 h-auto"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">Scan with GPay, PhonePe, Paytm or any UPI App</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <input
                                    type="text"
                                    value={manualTxnId}
                                    onChange={(e) => setManualTxnId(e.target.value)}
                                    placeholder="Enter Transaction ID / UTR"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                />
                                <button
                                    onClick={submitManualPayment}
                                    disabled={processing}
                                    className="w-full py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-colors disabled:opacity-50"
                                >
                                    {processing ? 'Submitting...' : 'Submit Payment Details'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Free Download Modal */}
            <AnimatePresence>
                {showFreeDownloadModal && selectedFreePdf && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowFreeDownloadModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
                        >
                            <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white relative">
                                <button
                                    onClick={() => setShowFreeDownloadModal(false)}
                                    className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                                <h3 className="text-2xl font-bold mb-2">Download {selectedFreePdf.name}</h3>
                                <p className="text-green-100">Enter your details to get instant access</p>
                            </div>

                            <form onSubmit={handleFreeDownloadSubmit} className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            First Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={freeDownloadData.firstName}
                                            onChange={handleFreeDownloadInputChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
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
                                            value={freeDownloadData.lastName}
                                            onChange={handleFreeDownloadInputChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
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
                                        value={freeDownloadData.email}
                                        onChange={handleFreeDownloadInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
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
                                        value={freeDownloadData.phone}
                                        onChange={handleFreeDownloadInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                        placeholder="+91 98765 43210"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmittingFree}
                                    className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-lg font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isSubmittingFree ? (
                                        <>
                                            <Loader className="w-5 h-5 animate-spin" />
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
                                    By downloading, you agree to receive updates about our services
                                </p>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Downloads;
