import { Layers, CheckCircle, AlertCircle, Shield, Cloud } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const CloudSecurity = () => {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-[#0B1120] text-slate-200 pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Header */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center justify-center">
                <Layers className="text-rose-500" size={32} />
              </div>
              <div>
                <h1 className="text-5xl font-bold text-white">Cloud Security & CSPM</h1>
                <p className="text-slate-400 mt-2">Multi-cloud workload protection for AWS, Azure, and GCP with compliance monitoring</p>
              </div>
            </div>
          </div>

          {/* Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <div className="lg:col-span-2 p-8 rounded-xl bg-slate-900/50 border border-slate-800">
              <h2 className="text-2xl font-bold text-white mb-4">Overview</h2>
              <p className="text-slate-300 leading-relaxed mb-6">
                Our Cloud Security & CSPM (Cloud Security Posture Management) service provides comprehensive assessment and continuous monitoring of your cloud infrastructure across AWS, Azure, and Google Cloud Platform.
              </p>
              <p className="text-slate-300 leading-relaxed">
                We identify misconfigurations, overly permissive IAM policies, exposed storage buckets, unencrypted data, and compliance gaps. Our approach combines automated scanning with manual validation to ensure your cloud environment is secure and compliant.
              </p>
            </div>

            {/* Quick Facts */}
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
                <p className="text-slate-400 text-sm mb-1">Platforms Covered</p>
                <p className="text-white font-semibold">AWS, Azure, GCP</p>
              </div>
              <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
                <p className="text-slate-400 text-sm mb-1">Assessment Time</p>
                <p className="text-white font-semibold">1-3 hours</p>
              </div>
              <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
                <p className="text-slate-400 text-sm mb-1">Monitoring</p>
                <p className="text-white font-semibold">Continuous</p>
              </div>
            </div>
          </div>

          {/* Cloud Platforms */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-8">Supported Cloud Platforms</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  name: 'Amazon Web Services',
                  icon: '☁️',
                  services: ['EC2', 'S3', 'RDS', 'Lambda', 'IAM', 'VPC', 'CloudTrail']
                },
                {
                  name: 'Microsoft Azure',
                  icon: '⊞',
                  services: ['Virtual Machines', 'Storage', 'SQL Database', 'Functions', 'RBAC', 'VNets']
                },
                {
                  name: 'Google Cloud',
                  icon: '⬢',
                  services: ['Compute Engine', 'Cloud Storage', 'Cloud SQL', 'Cloud Functions', 'IAM']
                }
              ].map((platform, i) => (
                <div key={i} className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
                  <div className="text-4xl mb-4">{platform.icon}</div>
                  <h3 className="text-lg font-semibold text-white mb-4">{platform.name}</h3>
                  <ul className="space-y-2">
                    {platform.services.map((service, j) => (
                      <li key={j} className="flex items-center gap-2 text-slate-300 text-sm">
                        <CheckCircle size={16} className="text-emerald-500 flex-shrink-0" />
                        {service}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Vulnerabilities Detected */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-8">Security Issues Identified</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                'Overly Permissive IAM Policies',
                'Exposed Storage Buckets (S3, Blob, GCS)',
                'Unencrypted Data at Rest',
                'Unencrypted Data in Transit',
                'Public Database Instances',
                'Missing Multi-Factor Authentication',
                'Outdated or Unpatched Resources',
                'Unused Security Groups/Firewall Rules',
                'Missing CloudTrail/Audit Logging',
                'Non-compliant Resource Tagging',
                'Disabled Encryption Keys',
                'Overly Permissive Network ACLs'
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
                'PCI-DSS 3.2.1',
                'HIPAA',
                'SOC 2 Type II',
                'ISO 27001',
                'GDPR',
                'CIS Benchmarks',
                'FedRAMP',
                'NIST 800-53'
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
                { step: '1', title: 'Discovery', desc: 'Identify all cloud resources and configurations' },
                { step: '2', title: 'Assessment', desc: 'Scan for misconfigurations & vulnerabilities' },
                { step: '3', title: 'Analysis', desc: 'Evaluate compliance against standards' },
                { step: '4', title: 'Reporting', desc: 'Prioritized remediation guidance' }
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
                'Continuous Monitoring & Alert',
                'Policy-as-Code Integration',
                'Risk Score Calculation',
                'Remediation Automation',
                'Multi-account Management',
                'Real-time Threat Detection'
              ].map((feature, i) => (
                <div key={i} className="p-6 rounded-lg bg-slate-900/50 border border-slate-800 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center flex-shrink-0">
                    <Cloud className="text-rose-500" size={20} />
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
            <h2 className="text-3xl font-bold text-white mb-4">Secure Your Cloud Infrastructure Today</h2>
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
              Get comprehensive cloud security assessment across AWS, Azure, and GCP. Identify misconfigurations and compliance gaps with actionable remediation steps.
            </p>
            <Link 
              to="/scanner"
              className="inline-block px-8 py-3 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-lg transition-all"
            >
              Start Cloud Security Scan
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CloudSecurity;