// ConsultingContactWidget.jsx
import { Phone, Mail, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const ConsultingContactWidget = () => {
  return (
    <section className="relative py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="relative bg-gradient-to-r from-slate-800/40 to-slate-900/20 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden p-12">
          {/* Gradient accent */}
          <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 via-transparent to-transparent opacity-50"></div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Enterprise-Grade Security Consulting
              </h2>
              <p className="text-slate-300 text-lg mb-6 leading-relaxed">
                Need a custom engagement? Our certified security engineers are ready to help you architect a secure future.
              </p>
              
              {/* Features List */}
              <div className="space-y-3 mb-8">
                {[
                  'Manual Pen-Testing',
                  'Red Teaming',
                  'Compliance Audits'
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
                    <span className="text-slate-200 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right CTA Buttons */}
            <div className="flex flex-col gap-4">
              <Link
                to="/contact"
                className="group relative px-8 py-4 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-lg transition-all shadow-lg flex items-center justify-center gap-2 hover:shadow-xl"
              >
                <Phone size={20} />
                Book Consultation
              </Link>

              <a
                href="mailto:sales@vapttool.io"
                className="group relative px-8 py-4 bg-transparent hover:bg-slate-800/50 border-2 border-slate-600 hover:border-slate-500 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <Mail size={20} />
                Contact Sales
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConsultingContactWidget;