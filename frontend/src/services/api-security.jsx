import { Code, CheckCircle, AlertCircle, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const ApiSecurity = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }, []);
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-[#0B1120] text-slate-200 pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-6">

          {/* Header */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center justify-center">
                <Code className="text-rose-500" size={32} />
              </div>
              <div>
                <h1 className="text-5xl font-bold text-white">API Security Testing</h1>
                <p className="text-slate-400 mt-2">Comprehensive testing of REST, GraphQL, and SOAP endpoints for vulnerabilities and logic flaws</p>
              </div>
            </div>
          </div>

          {/* Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <div className="lg:col-span-2 p-8 rounded-xl bg-slate-900/50 border border-slate-800">
              <h2 className="text-2xl font-bold text-white mb-4">Overview</h2>
              <p className="text-slate-300 leading-relaxed mb-6">
                Our API Security Testing service provides thorough assessment of your API endpoints across REST, GraphQL, and SOAP protocols. We identify authentication flaws, authorization issues, injection vulnerabilities, and business logic errors that could compromise your data and services.
              </p>
              <p className="text-slate-300 leading-relaxed">
                Using automated discovery and manual validation techniques, we ensure your APIs are secure against common attack vectors while maintaining functionality and performance.
              </p>
            </div>

            {/* Quick Facts */}
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
                <p className="text-slate-400 text-sm mb-1">API Types</p>
                <p className="text-white font-semibold">REST, GraphQL, SOAP</p>
              </div>
              <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
                <p className="text-slate-400 text-sm mb-1">Assessment Time</p>
                <p className="text-white font-semibold">2-4 hours</p>
              </div>
              <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
                <p className="text-slate-400 text-sm mb-1">Coverage</p>
                <p className="text-white font-semibold">100% Endpoints</p>
              </div>
            </div>
          </div>

          {/* API Types */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-8">Supported API Types</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  name: 'REST APIs',
                  icon: '🔗',
                  features: ['GET/POST/PUT/DELETE', 'JSON/XML responses', 'HTTP status codes', 'Rate limiting']
                },
                {
                  name: 'GraphQL APIs',
                  icon: '📊',
                  features: ['Query introspection', 'Mutation testing', 'Subscription security', 'Schema validation']
                },
                {
                  name: 'SOAP APIs',
                  icon: '🧼',
                  features: ['WSDL parsing', 'XML injection', 'WS-Security', 'Message integrity']
                }
              ].map((api, i) => (
                <div key={i} className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
                  <div className="text-4xl mb-4">{api.icon}</div>
                  <h3 className="text-lg font-semibold text-white mb-4">{api.name}</h3>
                  <ul className="space-y-2">
                    {api.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-2 text-slate-300 text-sm">
                        <CheckCircle size={16} className="text-emerald-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Vulnerabilities Detected */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-8">Common API Vulnerabilities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                'Broken Authentication & Authorization',
                'API Key Exposure',
                'Mass Assignment Vulnerabilities',
                'Injection Flaws (SQL, NoSQL, Command)',
                'Improper Error Handling',
                'Rate Limiting Bypass',
                'IDOR (Insecure Direct Object References)',
                'Business Logic Flaws',
                'Parameter Tampering',
                'CORS Misconfiguration',
                'Lack of Input Validation',
                'Sensitive Data Exposure'
              ].map((vuln, i) => (
                <div key={i} className="p-4 rounded-lg bg-slate-900/50 border border-slate-800 flex items-start gap-3">
                  <AlertCircle className="text-rose-500 mt-1 flex-shrink-0" size={20} />
                  <span className="text-slate-300">{vuln}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Compliance Standards */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-8">Compliance Coverage</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                'OWASP API Security Top 10',
                'PCI-DSS',
                'HIPAA',
                'GDPR',
                'ISO 27001',
                'NIST SP 800-53',
                'FedRAMP',
                'CSA STAR'
              ].map((standard, i) => (
                <div key={i} className="p-4 rounded-lg bg-slate-900/50 border border-slate-800 flex items-center gap-3">
                  <Shield className="text-emerald-500 flex-shrink-0" size={20} />
                  <span className="text-slate-300 font-medium">{standard}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Methodology */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-8">Our Methodology</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { step: '1', title: 'Discovery', desc: 'Map all API endpoints and parameters' },
                { step: '2', title: 'Authentication', desc: 'Test auth mechanisms and session management' },
                { step: '3', title: 'Vulnerability Scan', desc: 'Automated and manual security testing' },
                { step: '4', title: 'Logic Testing', desc: 'Validate business logic and edge cases' }
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

          {/* Features */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-8">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                'Automated API Discovery',
                'Comprehensive Vulnerability Scanning',
                'Business Logic Testing',
                'Authentication Bypass Detection',
                'Data Exposure Prevention',
                'Real-time Monitoring Integration'
              ].map((feature, i) => (
                <div key={i} className="p-6 rounded-lg bg-slate-900/50 border border-slate-800 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center flex-shrink-0">
                    <Zap className="text-rose-500" size={20} />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{feature}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="p-12 rounded-xl bg-gradient-to-r from-rose-500/10 to-pink-500/10 border border-rose-500/30 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Secure Your API Endpoints Today</h2>
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
              Protect your APIs from vulnerabilities and ensure secure data exchange. Get comprehensive API security assessment with actionable remediation steps.
            </p>
            <Link
              to="/scanner"
              className="inline-block px-8 py-3 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-lg transition-all"
            >
              Start API Security Scan
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ApiSecurity;
