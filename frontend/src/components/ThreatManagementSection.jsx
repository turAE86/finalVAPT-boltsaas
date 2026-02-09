import { Globe, Server, Layers, Code } from 'lucide-react';

const ThreatManagementSection = () => {
  const services = [
    {
      icon: Globe,
      title: "Web App Security",
      desc: "In-depth DAST and SAST scanning to identify OWASP Top 10 vulnerabilities in real-time.",
      color: "rose"
    },
    {
      icon: Server,
      title: "Network Infra",
      desc: "Internal and external network scanning to detect open ports, weak configs, and legacy services.",
      color: "rose"
    },
    {
      icon: Layers,
      title: "Cloud Security",
      desc: "CSPM and workload protection for AWS, Azure, and GCP environments.",
      color: "rose"
    },
    {
      icon: Code,
      title: "API Security",
      desc: "Automated discovery and testing of REST, GraphQL, and SOAP endpoints for logic flaws.",
      color: "rose"
    }
  ];

  return (
    <section className="relative py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Complete Threat Management
          </h2>
          <p className="text-slate-300 text-lg md:text-xl max-w-3xl mx-auto">
            Protecting your organization from every angle. Our comprehensive suite covers infrastructure, applications, and human elements.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="group bg-gradient-to-br from-slate-800/30 to-slate-900/20 backdrop-blur-xl p-8 rounded-xl border border-slate-700/50 hover:border-rose-500/50 transition-all duration-300 hover:bg-gradient-to-br hover:from-slate-800/50 hover:to-slate-900/30 hover:-translate-y-2"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-rose-500/20 to-rose-600/10 flex items-center justify-center text-rose-400 group-hover:text-rose-300 transition-colors flex-shrink-0">
                    <Icon size={28} strokeWidth={1.5} />
                  </div>
                </div>
                
                <h3 className="text-white font-bold text-xl mb-3 group-hover:text-rose-300 transition-colors">
                  {service.title}
                </h3>
                
                <p className="text-slate-400 text-base leading-relaxed">
                  {service.desc}
                </p>

                <div className="mt-6 flex items-center text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm font-semibold">
                  Learn more
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ThreatManagementSection;