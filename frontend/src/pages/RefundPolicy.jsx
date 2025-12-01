import React from 'react';
import { ArrowLeft, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RefundPolicy = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-6"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Home
                </button>

                <h1 className="text-4xl font-bold mb-6">Refund & Cancellation Policy</h1>
                <p className="text-gray-600 mb-8">Last Updated: {new Date().toLocaleDateString()}</p>

                <div className="space-y-6 text-gray-700">
                    <section>
                        <h2 className="text-2xl font-bold mb-3">Refund Timeline</h2>
                        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Clock className="w-5 h-5 text-green-600" />
                                <p className="font-bold text-green-900">Processing Time: 5-7 Business Days</p>
                            </div>
                            <p className="text-green-800">
                                Approved refunds will be processed within 5-7 business days and credited back to your original
                                payment method.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                            Eligible for Refund
                        </h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>
                                <strong>Cancellation within 24 hours of booking:</strong> Full refund (100%) if content has not
                                been posted
                            </li>
                            <li>
                                <strong>Service not delivered:</strong> Full refund if we fail to post your content within the
                                agreed timeline
                            </li>
                            <li>
                                <strong>Technical issues on our end:</strong> Full refund if we cannot process your video due to
                                technical problems
                            </li>
                            <li>
                                <strong>Content rejected:</strong> Full refund if your content violates guidelines and cannot be posted
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
                            <XCircle className="w-6 h-6 text-red-600" />
                            NOT Eligible for Refund
                        </h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>
                                <strong>After content is posted:</strong> No refund once your story/post goes live on our Instagram
                            </li>
                            <li>
                                <strong>Poor performance:</strong> We do not guarantee specific reach numbers; no refunds for
                                lower-than-expected engagement
                            </li>
                            <li>
                                <strong>Change of mind:</strong> No refunds if you simply change your mind after 24 hours
                            </li>
                            <li>
                                <strong>User error:</strong> Wrong video uploaded or incorrect information provided by you
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-3">Cancellation Process</h2>
                        <ol className="list-decimal pl-6 space-y-2">
                            <li>Contact us via email at narendrakumar9664@gmail.com or call +91 7733 072 738</li>
                            <li>Provide your Booking ID and reason for cancellation</li>
                            <li>Our team will review your request within 24-48 hours</li>
                            <li>If approved, refund will be initiated within 2 business days</li>
                            <li>Amount will be credited to your original payment method in 5-7 business days</li>
                        </ol>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-3">Partial Refunds</h2>
                        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                            <p>
                                In certain cases, partial refunds may be issued:
                            </p>
                            <ul className="list-disc pl-6 space-y-1 mt-2">
                                <li>If content is posted for fewer days than purchased (proportional refund)</li>
                                <li>If there are quality issues with our service delivery</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-3">Payment Gateway Charges</h2>
                        <p>
                            Razorpay payment gateway charges (typically 2-3%) are non-refundable and will be deducted from
                            the refund amount.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-3">Dispute Resolution</h2>
                        <p>
                            If you're unsatisfied with our refund decision, you can:
                        </p>
                        <ol className="list-decimal pl-6 space-y-2 mt-2">
                            <li>Contact our customer support for further review</li>
                            <li>Escalate to management via email</li>
                            <li>File a dispute through your payment provider (Razorpay)</li>
                        </ol>
                    </section>

                    <section className="border-t pt-6 mt-8">
                        <h2 className="text-2xl font-bold mb-3">Contact for Refunds</h2>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="mb-2">
                                <strong>Email:</strong> <a href="mailto:narendrakumar9664@gmail.com" className="text-green-600 hover:underline">narendrakumar9664@gmail.com</a>
                            </p>
                            <p className="mb-2">
                                <strong>Phone:</strong> <a href="tel:+917733072738" className="text-green-600 hover:underline">+91 7733 072 738</a>
                            </p>
                            <p className="mb-2">
                                <strong>Instagram:</strong> <a href="https://instagram.com/chittorgarh_vlog" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">@chittorgarh_vlog</a> (Owner: Pawan Salvi)
                            </p>
                            <p>
                                <strong>Response Time:</strong> 24-48 hours
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default RefundPolicy;
