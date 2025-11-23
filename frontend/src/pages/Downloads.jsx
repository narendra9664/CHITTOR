import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download, FileText, CheckCircle, CreditCard, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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

    const handlePurchasePDF = async () => {
        if (!purchaseData.name || !purchaseData.email || !purchaseData.phone) {
            alert('Please fill all fields');
            return;
        }

        setProcessing(true);

        try {
            // Create purchase order
            const response = await axios.post(`${API_URL}/api/pdf-purchase/`, purchaseData);
            const { order_id, amount } = response.data;

            // Open Razorpay
            const options = {
                key: RAZORPAY_KEY,
                amount: amount * 100,
                currency: 'INR',
                name: 'Chittorgarh Vlog',
                description: 'Chittorgarh Tourism Guide PDF',
                order_id: order_id,
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
                            setShowPurchaseForm(false);
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
        } catch (error) {
            alert('Error: ' + (error.response?.data?.error || 'Failed to initiate purchase'));
            setProcessing(false);
        }
    };

    const handleDownloadPaidPDF = () => {
        if (downloadToken) {
            window.open(`${API_URL}/api/pdf-download/${downloadToken}/`, '_blank');
        }
    };

    const handleDownloadFreePDF = async (filename, pdfName, fileSize) => {
        try {
            // Track download
            await axios.post(`${API_URL}/api/mediakit-track/`, {
                pdf_name: pdfName,
                file_size_mb: fileSize
            });

            // Download file
            window.open(`${API_URL}/api/mediakit-download/${filename}/`, '_blank');
        } catch (error) {
            console.error('Error downloading media kit:', error);
            // Still allow download even if tracking fails
            window.open(`${API_URL}/api/mediakit-download/${filename}/`, '_blank');
        }
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
                                                onClick={() => handleDownloadFreePDF(pdf.filename, pdf.name, 3.2)}
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

                {/* Info Footer */}
                <div className="mt-12 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                    <h3 className="font-bold text-lg mb-3">Need Help?</h3>
                    <p className="text-gray-600 mb-2">
                        For any questions about downloads or payment issues, contact us:
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                        <span>📧 narendrakumar9664@gmail.com</span>
                        <span>📱 +91 6377 595 978</span>
                        <span>📸 @chittorgarh_vlog</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Downloads;
