import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TermsAndConditions = () => {
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

                <h1 className="text-4xl font-bold mb-6">Terms and Conditions</h1>
                <p className="text-gray-600 mb-8">Last Updated: {new Date().toLocaleDateString()}</p>

                <div className="space-y-6 text-gray-700">
                    <section>
                        <h2 className="text-2xl font-bold mb-3">1. Acceptance of Terms</h2>
                        <p>
                            By accessing and using chittorgarh_vlog's services, you agree to be bound by these Terms and Conditions.
                            If you do not agree with any part of these terms, you may not use our services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-3">2. Service Description</h2>
                        <p>
                            chittorgarh_vlog provides video promotion services for businesses and individuals through our Instagram
                            platform. We promote customer-provided content to our audience of 100,000+ followers in Chittorgarh.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-3">3. User Responsibilities</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>You must provide accurate contact and payment information</li>
                            <li>Uploaded videos must not contain illegal, offensive, or copyrighted content</li>
                            <li>You retain ownership of your content but grant us license to promote it</li>
                            <li>Video files must be under 500MB and in supported formats (MP4, MOV, AVI, MPEG)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-3">4. Payment Terms</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>All payments are processed securely through Razorpay</li>
                            <li>Prices are clearly displayed and must be paid in full before service delivery</li>
                            <li>We reserve the right to update pricing with 7 days notice</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-3">5. Service Delivery</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Content will be posted according to the selected plan duration</li>
                            <li>Posting schedule may vary based on optimal engagement times</li>
                            <li>We do not guarantee specific reach numbers, though we state average performance</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-3">6. Content Guidelines</h2>
                        <p>We reserve the right to reject content that:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Violates Instagram's Community Guidelines</li>
                            <li>Contains hate speech, violence, or adult content</li>
                            <li>Promotes illegal activities or scams</li>
                            <li>Infringes on third-party intellectual property rights</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-3">7. Limitation of Liability</h2>
                        <p>
                            chittorgarh_vlog is not liable for any indirect, incidental, or consequential damages arising from
                            the use of our services. Our maximum liability is limited to the amount paid for the specific service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-3">8. Modifications to Terms</h2>
                        <p>
                            We reserve the right to modify these terms at any time. Users will be notified of significant changes
                            via email. Continued use of services constitutes acceptance of modified terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-3">9. Contact Information</h2>
                        <p>
                            For questions about these Terms and Conditions, please contact us at:
                            <br />
                            Email: narendrakumar9664@gmail.com
                            <br />
                            Phone: +91 7733 072 738
                            <br />
                            Instagram: @chittorgarh_vlog (Owner: Pawan Salvi)
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default TermsAndConditions;
