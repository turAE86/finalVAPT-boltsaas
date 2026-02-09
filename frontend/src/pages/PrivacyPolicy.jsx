// frontend/src/pages/PrivacyPolicy.jsx
import { Shield, Lock, Eye, Share2, Trash2, Mail } from 'lucide-react';
import { useState } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const PrivacyPolicy = () => {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (id) => {
    setExpandedSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const sections = [
    {
      id: 'overview',
      icon: Eye,
      title: '1. Introduction & Overview',
      content: `VAPT Bolt ("Company," "we," "us," or "our") operates the VAPT Bolt platform. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.

We use your data to provide and improve the Service. By using the Service, you agree to the collection and use of information in accordance with this policy. Unless otherwise defined in this Privacy Policy, capitalized terms used in this Privacy Policy have the same meaning as in our Terms and Conditions.`
    },
    {
      id: 'collection',
      icon: Lock,
      title: '2. Information Collection and Use',
      content: `We collect several different types of information for various purposes to provide and improve our Service to you.

Information You Provide:
• Account registration details (name, email, password, company information)
• Billing and payment information (processed through Razorpay)
• Contact information from support requests
• Configuration details for scanned targets
• API keys and authentication tokens

Automatically Collected Information:
• Log data (IP address, browser type, pages visited, timestamps)
• Device information (device type, operating system, unique device identifiers)
• Scan data and vulnerability reports
• Usage analytics and performance metrics
• Cookies and similar tracking technologies

We do NOT intentionally collect sensitive personal information such as:
• Social security numbers
• Financial account information beyond what's necessary for billing
• Health or medical information
• Biometric data
• Government-issued identification numbers`
    },
    {
      id: 'usage',
      icon: Share2,
      title: '3. Use of Data',
      content: `VAPT Bolt uses the collected data for various purposes:

• To provide, maintain, and improve the Service
• To notify you about changes to our Service
• To allow you to participate in interactive features
• To provide customer support and respond to inquiries
• To gather analysis and feedback to improve user experience
• To monitor the usage of our Service
• To detect, prevent, and address technical and security issues
• To send promotional emails (with your consent)
• To comply with legal obligations
• To protect the rights, privacy, safety, or property of VAPT Bolt

Scan Data and Vulnerability Reports:
Your vulnerability scan results and reports are stored securely and are accessible only to you and authorized administrators of your account. We do not share your scan data with third parties unless explicitly authorized by you or required by law.`
    },
    {
      id: 'security',
      icon: Shield,
      title: '4. Security of Data',
      content: `The security of your data is important to us but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.

Our security measures include:
• AES-256 encryption for data in transit and at rest
• TLS 1.2+ for all network communications
• Regular security audits and penetration testing
• ISO 27001 compliance
• Secure authentication and authorization mechanisms
• Regular backups and disaster recovery procedures
• Employee access controls and confidentiality agreements
• Compliance with GDPR, CCPA, and other data protection regulations`
    },
    {
      id: 'retention',
      icon: Trash2,
      title: '5. Data Retention',
      content: `VAPT Bolt will retain your Personal Data only for as long as necessary for the purposes set out in this Privacy Policy. We will retain and use your Personal Data to the extent necessary to comply with our legal obligations.

Retention Periods:
• Account data: Retained for the duration of your account
• Scan reports: Retained for 2 years by default (configurable)
• Billing information: Retained for 7 years (tax compliance)
• Log data: Retained for 90 days
• Support tickets: Retained for 1 year

You may request deletion of your data at any time, subject to legal obligations. Deletion may take up to 30 days to complete.`
    },
    {
      id: 'sharing',
      icon: Share2,
      title: '6. Disclosure of Data',
      content: `Under certain circumstances, VAPT Bolt may disclose your Personal Data if required to do so by law or in response to valid requests by public authorities.

We may disclose your Personal Data in the good faith belief that such action is necessary to:
• Comply with a legal obligation
• Protect and defend the rights or property of VAPT Bolt
• Prevent or investigate possible wrongdoing in connection with the Service
• Protect the personal safety of users of the Service or the public
• Protect against legal liability

We do NOT sell, trade, or rent your Personal Data to third parties. Service providers who handle personal data on our behalf are contractually obligated to maintain confidentiality and use the data only for purposes necessary to provide the Service.`
    },
    {
      id: 'rights',
      icon: Mail,
      title: '7. Your Rights',
      content: `You have the following rights regarding your personal data:

Right to Access: You can request a copy of the personal data we hold about you.

Right to Rectification: You can request correction of inaccurate or incomplete data.

Right to Erasure: You can request deletion of your personal data, subject to legal obligations.

Right to Restrict Processing: You can request that we limit how we use your data.

Right to Data Portability: You can request your data in a portable format.

Right to Withdraw Consent: You can withdraw consent for data processing at any time.

Right to Object: You can object to certain types of data processing.

To exercise any of these rights, please contact us at privacy@vapttool.io. We will respond to your request within 30 days.

These rights are subject to applicable laws in your jurisdiction and may be limited by legal obligations.`
    },
    {
      id: 'cookies',
      icon: Lock,
      title: '8. Cookies and Tracking Technologies',
      content: `We use cookies and similar tracking technologies to track activity on our Service and maintain certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.

Types of Cookies We Use:
• Essential Cookies: Required for the Service to function
• Performance Cookies: Help us understand how users interact with the Service
• Functional Cookies: Remember your preferences
• Marketing Cookies: Track your preferences for targeted content (with consent)

Most browsers allow you to refuse cookies and alert you when cookies are being sent. However, refusing cookies may negatively impact the functionality of our Service.`
    },
    {
      id: 'thirdparty',
      icon: Share2,
      title: '9. Third-Party Links',
      content: `Our Service may contain links to third-party websites that are not operated by us. This Privacy Policy applies only to the information we collect through our Service, and we are not responsible for the privacy practices of third-party websites.

We recommend reviewing the privacy policies of any third-party services before providing them with your personal information. We are not responsible for the privacy or security practices or the content of those websites.`
    },
    {
      id: 'children',
      icon: Shield,
      title: '10. Children\'s Privacy',
      content: `Our Service is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If we discover that a child under 13 has provided us with personal information, we will delete such information from our systems immediately.

If you are a parent or guardian and believe your child has provided personal information to us, please contact us immediately at privacy@vapttool.io. We comply with the Children's Online Privacy Protection Act (COPPA) and other applicable laws.`
    },
    {
      id: 'changes',
      icon: Eye,
      title: '11. Changes to This Privacy Policy',
      content: `We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top of this page.

You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.

If you do not agree with the new Privacy Policy, you may discontinue use of our Service.`
    },
    {
      id: 'contact',
      icon: Mail,
      title: '12. Contact Us',
      content: `If you have any questions about this Privacy Policy, please contact us:

By Email: privacy@vapttool.io
By Mail:
VAPT Bolt Security
123 Security Lane
Tech City, TC 12345
India

By Phone: +91 (987) 654-3210

Data Protection Officer: dpo@vapttool.io

We will respond to your privacy inquiry within 30 days.`
    }
  ];

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-[#0B1120] text-slate-200 pt-28 pb-20">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(#334155 1px, transparent 1px)`,
              backgroundSize: '24px 24px',
              maskImage: 'linear-gradient(to bottom, black 20%, transparent 90%)'
            }}
          ></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Privacy Policy</h1>
            <p className="text-slate-400 text-lg">Last updated: February 4, 2026</p>
          </div>

          <div className="space-y-4">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <div
                  key={section.id}
                  className="bg-slate-900/50 border border-slate-800 rounded-lg overflow-hidden transition-all hover:border-rose-500/30"
                >
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors text-left gap-4"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <Icon size={24} className="text-rose-400 flex-shrink-0" />
                      <h2 className="text-lg font-semibold text-white">{section.title}</h2>
                    </div>
                    <div
                      className={`text-rose-400 transition-transform flex-shrink-0 ${
                        expandedSections[section.id] ? 'rotate-180' : ''
                      }`}
                    >
                      ▼
                    </div>
                  </button>

                  {expandedSections[section.id] && (
                    <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/30">
                      <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{section.content}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-12 p-6 bg-slate-800/50 border border-slate-700 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-3">Your Privacy Matters</h3>
            <p className="text-slate-300 mb-4">
              We are committed to protecting your privacy. If you have any concerns about how we handle your data or if you would like to exercise your rights, please don't hesitate to contact us.
            </p>
            <a
              href="mailto:privacy@vapttool.io"
              className="text-rose-400 hover:text-rose-300 transition-colors font-semibold"
            >
              Contact our Privacy Team →
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;