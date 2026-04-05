// MethodologySection.jsx
import { CheckCircle2 } from 'lucide-react';

const MethodologySection = () => {
  const methodology = [
    {
      number: '01',
      title: 'Reconnaissance',
      description: 'Passive and active gathering of intelligence to map your attack surface.'
    },
    {
      number: '02',
      title: 'Scanning & Enumeration',
      description: 'Automated identification of potential entry points and weak configurations.'
    },
    {
      number: '03',
      title: 'Exploitation',
      description: 'Controlled validation of vulnerabilities to determine real-world risk.'
    },
    {
      number: '04',
      title: 'Reporting & Remediation',
      description: 'Detailed executive and technical reports with prioritized fix actions.'
    }
  ];

  const certifications = ['ISO 27001', 'SOC 2', 'CISSP', 'OSCP', 'OWASP'];

  return (
    <section className="relative py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Methodology */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Built on Proven<br />Methodologies
            </h2>
            
            <p className="text-slate-300 text-lg mb-12 leading-relaxed">
              We follow industry-standard frameworks including OSSTMM, PTES, and NIST to ensure repeatable, reliable, and actionable results.
            </p>

            {/* Timeline */}
            <div className="space-y-8">
              {methodology.map((item, idx) => (
                <div key={idx} className="relative flex gap-6">
                  {/* Timeline connector */}
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center text-white font-bold text-sm mb-4">
                      {item.number}
                    </div>
                    {idx < methodology.length - 1 && (
                      <div className="w-1 h-12 bg-gradient-to-b from-rose-500 to-transparent"></div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-8">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-slate-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Certifications & Logos */}
          <div>
            <div className="bg-gradient-to-br from-slate-800/30 to-slate-900/20 backdrop-blur-xl rounded-xl border border-slate-700/50 p-8">
              <h3 className="text-2xl font-bold text-white mb-8 text-center">
                Trusted by Security Teams at
              </h3>

              {/* Company Logos Placeholder Grid */}
{/* Company Logos Placeholder Grid */}
<div className="grid grid-cols-3 gap-4 mb-8">
  {[
    { src: '/logos/AWS_logo.png', alt: 'AWS' },
    { src: '/logos/search.png', alt: 'Google Cloud' },
    { src: '/logos/owasp-logo.webp', alt: 'OWASP' },
    { src: '/logos/icons8-cloudflare-100 (1).png', alt: 'Cloudflare' },
    { src: '/logos/GitHub-Logo.png', alt: 'GitHub' },
    { src: '/logos/docker-logo.png', alt: 'Docker' }
  ].map((logo, idx) => (
    <div
      key={idx}
      className="aspect-square bg-slate-700/30 rounded-lg flex items-center justify-center border border-slate-700/50 hover:border-rose-500/30 transition-colors p-4"
    >
      <img 
        src={logo.src} 
        alt={logo.alt}
        className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
        onError={(e) => e.target.style.display = 'none'}
      />
    </div>
  ))}
</div>

              <div className="border-t border-slate-700/50 pt-8">
                <p className="text-slate-400 text-center text-sm mb-6">
                  Accredited by major standards bodies
                </p>
                
                <div className="flex flex-wrap justify-center gap-3">
                  {certifications.map((cert, idx) => (
                    <div
                      key={idx}
                      className="px-6 py-2 border border-slate-700/50 rounded-lg text-white font-semibold text-sm hover:border-rose-500/50 transition-colors cursor-pointer"
                    >
                      {cert}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MethodologySection;