// frontend/src/pages/TermsAndConditions.jsx
import { ChevronUp } from 'lucide-react';
import { useState } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const TermsAndConditions = () => {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (id) => {
    setExpandedSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const sections = [
    {
      id: 'agreement',
      title: '1. Agreement to Terms',
      content: `By accessing and using the VAPT Bolt platform (the "Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service. VAPT Bolt reserves the right to make changes to the terms of service at any time without notice. Your continued use of the Service will constitute your acceptance of any revised terms of service.`
    },
    {
      id: 'service',
      title: '2. Use License',
      content: `Permission is granted to temporarily download one copy of the materials (information or software) on VAPT Bolt's platform for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:

• Modify or copy the materials
• Use the materials for any commercial purpose or for any public display
• Attempt to reverse engineer any software contained on VAPT Bolt's platform
• Remove any copyright or other proprietary notations from the materials
• Transfer the materials to another person or "mirror" the materials on any other server
• Violate any applicable laws or regulations in the operation of the Service

This license shall automatically terminate if you violate any of these restrictions and may be terminated by VAPT Bolt at any time. Upon terminating your viewing of these materials or upon the termination of this license, you must destroy any downloaded materials in your possession whether in electronic or printed format.`
    },
    {
      id: 'liability',
      title: '3. Disclaimer of Warranties',
      content: `The materials on VAPT Bolt's platform are provided on an 'as is' basis. VAPT Bolt makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.

Further, VAPT Bolt does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its Internet web site or otherwise relating to such materials or on any sites linked to this site.`
    },
    {
      id: 'limitations',
      title: '4. Limitations of Liability',
      content: `In no event shall VAPT Bolt or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on VAPT Bolt's platform, even if VAPT Bolt or an authorized representative has been notified orally or in writing of the possibility of such damage.

Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.`
    },
    {
      id: 'accuracy',
      title: '5. Accuracy of Materials',
      content: `The materials appearing on VAPT Bolt's platform could include technical, typographical, or photographic errors. VAPT Bolt does not warrant that any of the materials on its platform are accurate, complete, or current. VAPT Bolt may make changes to the materials contained on its platform at any time without notice.`
    },
    {
      id: 'materials',
      title: '6. Materials Copyright',
      content: `The materials on VAPT Bolt's platform are included as a service to the public and may be used for personal, non-commercial, educational, and research purposes provided the user retains all copyright and other proprietary notices. Commercial use of any of the materials is prohibited without express written permission of VAPT Bolt.`
    },
    {
      id: 'links',
      title: '7. Links',
      content: `VAPT Bolt has not reviewed all of the sites linked to its platform and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by VAPT Bolt of the site. Use of any such linked website is at the user's own risk.

If you believe we are directly infringing your copyrights, please notify us by email at legal@vapttool.io with the following information: your physical or electronic signature, identification of the copyrighted material, identification of the infringing use, your contact information, a statement of good faith belief, and your signature.`
    },
    {
      id: 'modifications',
      title: '8. Modifications to Service',
      content: `VAPT Bolt may revise these terms of service for its platform at any time without notice. By using this platform, you are agreeing to be bound by the then current version of these terms of service.

We reserve the right to refuse service, terminate accounts, and/or cancel orders at our sole discretion, including any accounts or orders associated with fraudulent activity or violation of these terms.`
    },
    {
      id: 'security',
      title: '9. Security & Authorization',
      content: `You are responsible for maintaining the confidentiality of your account information and password and for restricting access to your computer. You agree to accept responsibility for all activities that occur under your account or password. You must notify VAPT Bolt immediately of any unauthorized use of your account.

You warrant that you are of legal age to enter into binding agreements and possess the legal authority to do so.`
    },
    {
      id: 'restrictions',
      title: '10. Permitted & Restricted Uses',
      content: `You agree NOT to use the Service:
• To conduct security testing on third-party systems without explicit written authorization
• To store sensitive data not related to vulnerability assessment
• To transmit viruses or malicious code
• To harass, abuse, or harm others
• To engage in illegal activities
• To violate intellectual property rights
• To bypass or circumvent any security features

Authorized penetration testing is limited to systems you own or have explicit written permission to test. Unauthorized testing may violate the Computer Fraud and Abuse Act (CFAA) and other applicable laws.`
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
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Terms and Conditions</h1>
            <p className="text-slate-400 text-lg">Last updated: February 4, 2026</p>
          </div>

          <div className="space-y-4">
            {sections.map((section) => (
              <div
                key={section.id}
                className="bg-slate-900/50 border border-slate-800 rounded-lg overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors text-left"
                >
                  <h2 className="text-lg font-semibold text-white">{section.title}</h2>
                  <ChevronUp
                    size={20}
                    className={`text-rose-400 transition-transform ${
                      expandedSections[section.id] ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {expandedSections[section.id] && (
                  <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/30">
                    <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{section.content}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-rose-500/10 border border-rose-500/20 rounded-lg">
            <p className="text-slate-300">
              If you have any questions about these Terms and Conditions, please contact us at{' '}
              <a href="mailto:legal@vapttool.io" className="text-rose-400 hover:text-rose-300 transition-colors">
                legal@vapttool.io
              </a>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TermsAndConditions;