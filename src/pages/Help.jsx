import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Mail, Shield, FileText, Home, Search, Phone, MessageCircle } from 'lucide-react';
import ScrollToTop from '../components/ScrollToTop';
import { Link } from 'react-router-dom';

const Help = () => {
  const [activePage, setActivePage] = useState('help');
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const faqData = [
    {
      id: 1,
      question: "How do I set up my email campaigns?",
      answer: "To set up email campaigns, go to 'Campaigns' in your dashboard, click 'Create New Campaign', choose your template, customize your content, select your audience, and schedule or send immediately."
    },
    {
      id: 2,
      question: "What are the email sending limits?",
      answer: "Sending limits depend on your plan: Starter (1,000 emails/month), Professional (10,000 emails/month), Enterprise (unlimited). All plans include real-time analytics and delivery tracking."
    },
    {
      id: 3,
      question: "How do I manage my subscriber lists?",
      answer: "Navigate to 'Contacts' to manage subscribers. You can import CSV files, create segments, manage unsubscribes, and track engagement metrics for better targeting."
    },
    {
      id: 4,
      question: "Can I customize email templates?",
      answer: "Yes! We offer a drag-and-drop editor with pre-built templates. You can customize colors, fonts, images, and layout to match your brand identity."
    },
    {
      id: 5,
      question: "How do I track email performance?",
      answer: "Access detailed analytics in the 'Reports' section. Track open rates, click-through rates, bounce rates, and revenue attribution with real-time updates."
    },
    {
      id: 6,
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. All transactions are secured with SSL encryption."
    }
  ];

  const toggleFAQ = (id) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const filteredFAQ = faqData.filter(item =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const HelpCenter = () => (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
        <p className="text-xl text-gray-600 mb-8">Get the help you need to succeed with AirMailo</p>
      </div>

      {/* Quick Links */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
          <Mail className="w-8 h-8 text-blue-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Getting Started</h3>
          <p className="text-gray-600 mb-4">Learn the basics of setting up your email campaigns</p>
          <a href='#read' className="text-blue-600 font-medium hover:text-blue-700">Read Guide →</a>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
          <MessageCircle className="w-8 h-8 text-green-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact Support</h3>
          <p className="text-gray-600 mb-4">Get direct help from our support team</p>
          <Link to={'/contact'}  className="text-green-600 font-medium hover:text-green-700">Contact Us →</Link>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
          <Phone className="w-8 h-8 text-purple-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone Support</h3>
          <p className="text-gray-600 mb-4">Call us for immediate assistance</p>
          <button className="text-purple-600 font-medium hover:text-purple-700">+91-7412066477</button>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8" id='read'>
        <h2 className="text-2xl font-bold text-gray-900 mb-6" >Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          {filteredFAQ.map((item) => (
            <div key={item.id} className="border border-gray-200 rounded-lg">
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rounded-lg"
                onClick={() => toggleFAQ(item.id)}
              >
                <span className="font-medium text-gray-900">{item.question}</span>
                {expandedFAQ === item.id ? (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-500" />
                )}
              </button>
              {expandedFAQ === item.id && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const PrivacyPolicy = () => (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
        <p className="text-gray-600">Last updated: August 30, 2025</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Introduction</h2>
          <p className="text-gray-600 leading-relaxed">
            At AzzUnique Technologies and AirMailo, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our email marketing platform and services.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information We Collect</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Personal Information</h3>
              <p className="text-gray-600 leading-relaxed">
                We collect information you provide directly, including name, email address, company information, billing details, and account preferences when you register or use our services.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Usage Data</h3>
              <p className="text-gray-600 leading-relaxed">
                We automatically collect information about how you interact with our platform, including email campaign performance, click rates, and platform usage analytics.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Technical Information</h3>
              <p className="text-gray-600 leading-relaxed">
                We collect IP addresses, browser type, device information, and other technical data to provide and improve our services.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
          <ul className="text-gray-600 leading-relaxed space-y-2">
            <li>• Provide and maintain our email marketing services</li>
            <li>• Process transactions and manage your account</li>
            <li>• Send service-related communications</li>
            <li>• Improve our platform and develop new features</li>
            <li>• Ensure platform security and prevent fraud</li>
            <li>• Comply with legal obligations</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Sharing and Disclosure</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            We do not sell, trade, or rent your personal information. We may share information in the following circumstances:
          </p>
          <ul className="text-gray-600 leading-relaxed space-y-2">
            <li>• With service providers who assist in platform operations</li>
            <li>• When required by law or legal process</li>
            <li>• To protect our rights and prevent fraud</li>
            <li>• With your explicit consent</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Security</h2>
          <p className="text-gray-600 leading-relaxed">
            We implement industry-standard security measures including encryption, secure servers, and regular security audits to protect your information. However, no method of transmission over the internet is 100% secure.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Rights</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            You have the right to:
          </p>
          <ul className="text-gray-600 leading-relaxed space-y-2">
            <li>• Access and update your personal information</li>
            <li>• Request deletion of your data</li>
            <li>• Opt-out of marketing communications</li>
            <li>• Export your data</li>
            <li>• Contact us about privacy concerns</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
          <p className="text-gray-600 leading-relaxed">
            If you have questions about this Privacy Policy, please contact us at:
            <br />
            Email: info@airmailo.com
            <br />
          </p>
        </div>
      </div>
    </div>
  );

  const TermsOfService = () => (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
        <p className="text-gray-600">Last updated: August 30, 2025</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Acceptance of Terms</h2>
          <p className="text-gray-600 leading-relaxed">
            By accessing and using AirMailo services provided by AzzUnique Technologies, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Service Description</h2>
          <p className="text-gray-600 leading-relaxed">
            AirMailo is an email marketing platform that allows users to create, send, and track email campaigns. Our services include email template design, contact management, analytics, and automation features.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">User Responsibilities</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Account Security</h3>
              <p className="text-gray-600 leading-relaxed">
                You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Compliance</h3>
              <p className="text-gray-600 leading-relaxed">
                You must comply with all applicable laws, including CAN-SPAM Act, GDPR, and other email marketing regulations. You are responsible for obtaining proper consent from recipients.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Prohibited Activities</h3>
              <ul className="text-gray-600 leading-relaxed space-y-2">
                <li>• Sending spam or unsolicited emails</li>
                <li>• Distributing malware or malicious content</li>
                <li>• Violating intellectual property rights</li>
                <li>• Engaging in fraudulent activities</li>
                <li>• Harassing or threatening recipients</li>
              </ul>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Service Availability</h2>
          <p className="text-gray-600 leading-relaxed">
            We strive to maintain 99.9% uptime but cannot guarantee uninterrupted service. We may perform maintenance that temporarily affects service availability with advance notice when possible.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibent text-gray-900 mb-4">Payment Terms</h2>
          <ul className="text-gray-600 leading-relaxed space-y-2">
            <li>• Subscription fees are billed monthly or annually</li>
            <li>• All fees are non-refundable except as required by law</li>
            <li>• We reserve the right to modify pricing with 30 days notice</li>
            <li>• Accounts may be suspended for non-payment</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Intellectual Property</h2>
          <p className="text-gray-600 leading-relaxed">
            AirMailo platform, including software, templates, and documentation, is owned by AzzUnique Technologies. You retain ownership of your content but grant us license to provide services.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Limitation of Liability</h2>
          <p className="text-gray-600 leading-relaxed">
            Our liability is limited to the amount paid for services in the 12 months preceding any claim. We are not liable for indirect, incidental, or consequential damages.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Termination</h2>
          <p className="text-gray-600 leading-relaxed">
            Either party may terminate service with 30 days notice. We may suspend accounts immediately for violations of these terms. Upon termination, you may export your data for 30 days.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
          <p className="text-gray-600 leading-relaxed">
            For questions about these Terms of Service, contact us at:
            <br />
            Email: info@airmailo.com
            <br />
            Address: AzzUnique Technologies, Jaipur, Rajasthan, India
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-67l mx-auto px-4 my-16">
      <ScrollToTop />
      {/* Page Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActivePage('help')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activePage === 'help'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-4 h-4" />
                <span>Help Center</span>
              </div>
            </button>
            <button
              onClick={() => setActivePage('privacy')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activePage === 'privacy'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Privacy Policy</span>
              </div>
            </button>
            <button
              onClick={() => setActivePage('terms')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activePage === 'terms'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Terms of Service</span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activePage === 'help' && <HelpCenter />}
        {activePage === 'privacy' && <PrivacyPolicy />}
        {activePage === 'terms' && <TermsOfService />}
      </main>
    </div>
  );
};

export default Help;