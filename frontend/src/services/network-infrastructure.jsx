import { Server, CheckCircle, AlertCircle, Shield, Network } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const NetworkInfra = () => {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-[#0B1120] text-slate-200 pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Header */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center justify-center">
                <Server className="text-rose-500" size={32} />
              </div>
              <div>
                <h1 className="text-5xl font-bold text-white">Network Infrastructure Assessment</h1>
                <p className="text-slate-400 mt-2">Internal and external network scanning to detect open ports, weak configurations, and legacy services</p>
              </div>
            </div>
          </div>

          {/* Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <div className="lg:col-span-2 p-8 rounded-xl bg-slate-900/50 border border-slate-800">
              <h2 className="text-2xl font-bold text-white mb-4">Overview</h2>
              <p className="text-slate-300 leading-relaxed mb-6">
                Our Network Infrastructure Assessment service provides comprehensive evaluation of your internal and external network environments. We identify exposed services, weak configurations, and legacy systems that could serve as entry points for attackers.
              </p>
              <p className="text-slate-300 leading-relaxed">
                From port scanning and service enumeration to vulnerability detection and risk prioritization, we give you complete visibility into your network attack surface. Perfect for organizations of all sizes, from startups to enterprises.
              </p>
            </div>

            {/* Quick Facts */}
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
                <p className="text-slate-400 text-sm mb-1">Scope Types</p>
                <p className="text-white font-semibold">Internal & External</p>
              </div>
              <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
                <p className="text-slate-400 text-sm mb-1">Assessment Time</p>
                <p className="text-white font-semibold">2-5 hours</p>
              </div>
              <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
                <p className="text-slate-400 text-sm mb-1">Coverage</p>
                <p className="text-white font-semibold">Full Network Stack</p>
              </div>
            </div>
          </div>

          {/* Assessment Types */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-8">Assessment Types</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: 'External Network Scan',
                  description: 'From the perspective of an external threat actor. Tests perimeter security, firewall rules, and publicly exposed services.',
                  items: ['Internet-facing Asset Discovery', 'Firewall Rule Assessment', 'Public Service Enumeration', 'Multi-layer Penetration']
                },
                {
                  title: 'Internal Network Scan',
                  description: 'Simulates internal threats and lateral movement. Identifies weak segmentation, rogue devices, and legacy systems.',
                  items: ['Network Segmentation Testing', 'Internal Service Mapping', 'Lateral Movement Detection', 'Privilege Escalation Paths']
                },
                {
                  title: 'Wireless Network Assessment',
                  description: 'Evaluates Wi-Fi security, encryption strength, and authentication mechanisms.',
                  items: ['WEP/WPA2/WPA3 Analysis', 'Rogue AP Detection', 'Weak Credentials Testing', 'Captive Portal Bypass']
                },
                {
                  title: 'Active Directory Assessment',
                  description: 'Deep dive into AD misconfigurations, privilege escalation paths, and credential weaknesses.',
                  items: ['Password Policy Review', 'Privilege Escalation Testing', 'Trust Relationship Analysis', 'Kerberos Attacks']
                }
              ].map((assessment, i) => (
                <div key={i} className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
                  <h3 className="text-lg font-semibold text-white mb-3">{assessment.title}</h3>
                  <p className="text-slate-300 text-sm mb-4">{assessment.description}</p>
                  <ul className="space-y-2">
                    {assessment.items.map((item, j) => (
                      <li key={j} className="flex items-center gap-2 text-slate-300 text-sm">
                        <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Vulnerabilities Detected */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-8">Vulnerabilities & Issues Detected</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                'Open Unnecessary Ports',
                'Outdated Service Versions',
                'Default Credentials',
                'Weak Encryption Protocols',
                'Unpatched Systems',
                'Network Segmentation Gaps',
                'Rogue Devices/APs',
                'Weak SSH/RDP Configurations',
                'DNS Vulnerabilities',
                'SNMP Information Disclosure',
                'VPN Weaknesses',
                'NetBIOS Exposure',
                'SMB Vulnerabilities',
                'SMTP Relay Issues',
                'Anonymous FTP Access',
                'Insecure Protocols (Telnet, HTTP)'
              ].map((vuln, i) => (
                <div key={i} className="p-4 rounded-lg bg-slate-900/50 border border-slate-800 flex items-start gap-3">
                  <AlertCircle className="text-rose-500 mt-1 flex-shrink-0" size={20} />
                  <span className="text-slate-300">{vuln}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tools & Technologies */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-8">Tools & Technologies Used</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  category: 'Scanning',
                  tools: ['Nmap', 'Masscan', 'Zmap', 'Shodan']
                },
                {
                  category: 'Enumeration',
                  tools: ['Nessus', 'OpenVAS', 'Qualys', 'Rapid7']
                },
                {
                  category: 'Exploitation',
                  tools: ['Metasploit', 'Burp Suite', 'Mimikatz', 'BloodHound']
                }
              ].map((toolset, i) => (
                <div key={i} className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
                  <h3 className="text-white font-semibold mb-4">{toolset.category}</h3>
                  <ul className="space-y-2">
                    {toolset.tools.map((tool, j) => (
                      <li key={j} className="text-slate-300 flex items-center gap-2">
                        <Network size={14} className="text-rose-500" />
                        {tool}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Methodology */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-8">Our Methodology</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { step: '1', title: 'Reconnaissance', desc: 'Map network topology and identify assets' },
                { step: '2', title: 'Scanning', desc: 'Port scanning and service enumeration' },
                { step: '3', title: 'Analysis', desc: 'Vulnerability identification and prioritization' },
                { step: '4', title: 'Reporting', desc: 'Risk assessment and remediation roadmap' }
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

          {/* Benefits */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-8">Key Benefits</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                'Complete Network Visibility',
                'Identify Lateral Movement Paths',
                'Detect Rogue & Unauthorized Devices',
                'Prioritized Risk Assessment',
                'Compliance Gap Identification',
                'Actionable Remediation Steps'
              ].map((benefit, i) => (
                <div key={i} className="p-6 rounded-lg bg-slate-900/50 border border-slate-800 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="text-rose-500" size={20} />
                  </div>
                  <span className="text-slate-300 font-medium pt-1">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="p-12 rounded-xl bg-gradient-to-r from-rose-500/10 to-pink-500/10 border border-rose-500/30 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Assess Your Network Security Today</h2>
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
              Get complete visibility into your network infrastructure. Identify vulnerabilities, weak configurations, and lateral movement paths with our comprehensive assessment.
            </p>
            <Link 
              to="/scanner"
              className="inline-block px-8 py-3 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-lg transition-all"
            >
              Start Network Assessment
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default NetworkInfra;