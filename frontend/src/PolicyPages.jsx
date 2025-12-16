import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PolicyLayout = ({ title, children }) => (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm">
            <Link to="/" className="inline-flex items-center text-green-600 hover:text-green-700 mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">{title}</h1>
            <div className="prose prose-green max-w-none text-gray-600">
                {children}
            </div>
        </div>
    </div>
);

export const PrivacyPolicy = () => (
    <PolicyLayout title="Privacy Policy">
        <p>Last updated: {new Date().toLocaleDateString()}</p>

        <h3>1. Introduction</h3>
        <p>Welcome to ChittorgarhVlog. We respect your privacy and are committed to protecting your personal data.</p>

        <h3>2. Data We Collect</h3>
        <p>We may collect the following information:</p>
        <ul>
            <li>Name and contact information (email, phone number)</li>
            <li>Payment information (processed securely by Razorpay)</li>
            <li>Video content you upload for our services</li>
        </ul>

        <h3>3. How We Use Your Data</h3>
        <p>We use your data to:</p>
        <ul>
            <li>Provide our video storytelling services</li>
            <li>Process payments</li>
            <li>Communicate with you about your booking</li>
        </ul>

        <h3>4. Contact Us</h3>
        <p>If you have any questions about this Privacy Policy, please contact us at info@chittorgarh_vlog.com.</p>
    </PolicyLayout>
);

export const TermsAndConditions = () => (
    <PolicyLayout title="Terms and Conditions">
        <p>Last updated: {new Date().toLocaleDateString()}</p>

        <h3>1. Acceptance of Terms</h3>
        <p>By accessing and using ChittorgarhVlog's services, you accept and agree to be bound by the terms and provision of this agreement.</p>

        <h3>2. Services</h3>
        <p>We provide video storytelling and social media promotion services. Specific deliverables are outlined in each service plan.</p>

        <h3>3. User Content</h3>
        <p>You retain all rights to the video content you upload. By uploading, you grant us a license to edit and distribute the content as part of the agreed service.</p>

        <h3>4. Payments</h3>
        <p>Payments are processed securely via Razorpay or manual bank transfer. Services will commence only after payment confirmation.</p>
    </PolicyLayout>
);

export const RefundPolicy = () => (
    <PolicyLayout title="Refund Policy">
        <p>Last updated: {new Date().toLocaleDateString()}</p>

        <h3>1. Refund Eligibility</h3>
        <p>We offer refunds under the following circumstances:</p>
        <ul>
            <li>If we are unable to deliver the service as described.</li>
            <li>If you cancel your booking within 24 hours of payment, provided work has not commenced.</li>
        </ul>

        <h3>2. Non-Refundable Items</h3>
        <p>Once the editing process has begun or the video has been posted, services are non-refundable.</p>

        <h3>3. Processing Time</h3>
        <p>Approved refunds will be processed within 5-7 business days to the original payment method.</p>
    </PolicyLayout>
);
