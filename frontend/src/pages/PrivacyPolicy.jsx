import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
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

                <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
                <p className="text-gray-600 mb-8">Last Updated: {new Date().toLocaleDateString()}</p>

                <div className="space-y-6 text-gray-700">
                    <section>
                        <h2 className="text-2xl font-bold mb-3">1. Information We Collect</h2>
                        <p>We collect the following information when you use our services:</p>
                        <ul className="list-disc pl-6 space-y-2 mt-2">
                            <li><strong>Personal Information:</strong> Name, email address, phone number</li>
                            <li><strong>Payment Information:</strong> Processed securely by Razorpay (we don't store card details)</li>
                            <li><strong>Content:</strong> Videos and media files you upload for promotion</li>
                            <li><strong>Usage Data:</strong> IP address, browser type, pages visited, time spent</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-3">2. How We Use Your Information</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>To provide and deliver the services you requested</li>
                            <li>To process payments and send booking confirmations</li>
                            <li>To communicate with you about your bookings and our services</li>
                            <li>To improve our services and user experience</li>
                            <li>To comply with legal obligations</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-3">3. Data Storage and Security</h2>
                        <p>
                            Your data is stored securely on our servers with industry-standard encryption. We implement appropriate
                            technical and organizational measures to protect your personal information against unauthorized access,
                            alteration, disclosure, or destruction.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-3">4. Data Sharing</h2>
                        <p>We do NOT sell, rent, or share your personal information with third parties except:</p>
                        <ul className="list-disc pl-6 space-y-2 mt-2">
                            <li>Payment processing through Razorpay (subject to their privacy policy)</li>
                            <li>When required by law or legal process</li>
                            <li>To protect our rights and prevent fraud</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-3">5. Cookies and Tracking</h2>
                        <p>
                            We use essential cookies to maintain your session and improve user experience. We do not use third-party
                            advertising cookies. You can disable cookies in your browser settings, though this may affect functionality.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-3">6. Your Rights</h2>
                        <p>You have the right to:</p>
                        <ul className="list-disc pl-6 space-y-2 mt-2">
                            <li>Access your personal data</li>
                            <li>Request correction of inaccurate data</li>
                            <li>Request deletion of your data (subject to legal obligations)</li>
                            <li>Opt-out of marketing communications</li>
                            <li>Withdraw consent for data processing</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-3">7. Data Retention</h2>
                        <p>
                            We retain your personal information for as long as necessary to provide our services and comply with
                            legal obligations. Booking data is typically retained for 3 years for accounting purposes.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-3">8. Children's Privacy</h2>
                        <p>
                            Our services are not intended for individuals under 18 years of age. We do not knowingly collect
                            personal information from children.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-3">9. Changes to Privacy Policy</h2>
                        <p>
                            We may update this Privacy Policy from time to time. We will notify you of significant changes via
                            email or prominent notice on our website.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-3">10. Contact Us</h2>
                        <p>
                            For privacy-related questions or to exercise your rights, contact us at:
                            <br />
                            Email: narendrakumar9664@gmail.com
                            <br />
                            Phone: +91 7733 072 738
                            <br />
                            Instagram: @chittorgarh_vlog
                            <br />
                            Owner: Pawan Salvi
                            <br />
                            Location: Chittorgarh, Rajasthan, India
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
