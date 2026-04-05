import { Globe, CheckCircle, AlertCircle, Zap, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const WebAppSecurity = () => {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-[#0B1120] text-slate-200 pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Header */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center justify-center">
                <Globe className="text-rose-500" size={32} />
              </div>
              <div>
                <h1 className="text-5xl font-bold text-white">Web Application Security</h1>
                <p className="text-slate-400 mt-2">In-depth DAST and SAST scanning to identify OWASP Top 10 vulnerabilities</p>
              </div>
            </div>
          </div>

          {/* Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <div className="lg:col-span-2 p-8 rounded-xl bg-slate-900/50 border border-slate-800">
              <h2 className="text-2xl font-bold text-white mb-4">Overview</h2>
              <p className="text-slate-300 leading-relaxed mb-6">
                Our Web Application Security service provides comprehensive testing for modern web applications. We combine dynamic application security testing (DAST) with static analysis to identify vulnerabilities before they reach production.
              </p>
              <p className="text-slate-300 leading-relaxed">
                From SQL injection and XSS to broken authentication and insecure deserialization, we test against all OWASP Top 10 vulnerabilities with real-time results and actionable remediation guidance.
              </p>
            </div>

            {/* Quick Facts */}
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
                <p className="text-slate-400 text-sm mb-1">Assessment Time</p>
                <p className="text-white font-semibold">2-4 hours</p>
              </div>
              <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
                <p className="text-slate-400 text-sm mb-1">Report Delivery</p>
                <p className="text-white font-semibold">24 hours</p>
              </div>
              <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
                <p className="text-slate-400 text-sm mb-1">Coverage</p>
                <p className="text-white font-semibold">Full & API Testing</p>
              </div>
            </div>
          </div>

          {/* Vulnerabilities Detected */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-8">Vulnerabilities Detected</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                'SQL Injection',
                'Cross-Site Scripting (XSS)',
                'Cross-Site Request Forgery (CSRF)',
                'Broken Authentication',
                'Sensitive Data Exposure',
                'XML External Entities (XXE)',
                'Broken Access Control',
                'Security Misconfiguration',
                'Insecure Deserialization',
                'Using Components with Known Vulnerabilities',
                'Insufficient Logging & Monitoring',
                'Server-Side Template Injection'
              ].map((vuln, i) => (
                <div key={i} className="p-4 rounded-lg bg-slate-900/50 border border-slate-800 flex items-start gap-3">
                  <AlertCircle className="text-rose-500 mt-1 flex-shrink-0" size={20} />
                  <span className="text-slate-300">{vuln}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Methodology */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-8">Our Methodology</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { step: '1', title: 'Reconnaissance', desc: 'Map application architecture and endpoints' },
                { step: '2', title: 'Analysis', desc: 'Dynamic & Static analysis scanning' },
                { step: '3', title: 'Testing', desc: 'Manual exploitation of identified flaws' },
                { step: '4', title: 'Reporting', desc: 'Detailed executive & technical reports' }
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="w-12 h-12 bg-rose-500 text-white font-bold rounded-full flex items-center justify-center mx-auto mb-4 text-lg">
                    {item.step}
                  </div>
                  <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                  <p className="text-slate-400 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="p-12 rounded-xl bg-gradient-to-r from-rose-500/10 to-pink-500/10 border border-rose-500/30 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Secure Your Application?</h2>
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
              Get started with our Web Application Security assessment today. Our experts will identify vulnerabilities and provide actionable remediation guidance.
            </p>
            <Link 
              to="/scanner"
              className="inline-block px-8 py-3 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-lg transition-all"
            >
              Start Scanning Now
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default WebAppSecurity;