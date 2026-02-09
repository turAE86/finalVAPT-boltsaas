import { Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="relative z-10 border-t border-slate-900 bg-[#0B1120] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-2 text-rose-500 mb-4">
            <Shield className="h-6 w-6" />
            <span className="text-lg font-bold tracking-wider text-white">
              VAPT<span className="text-slate-400 font-light">TOOL</span>
            </span>
          </div>
          <p className="text-slate-500 text-sm leading-relaxed">
            Next-generation security scanning for the modern enterprise. Detect threats before they become breaches.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Platform</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><Link to="/scanner" className="hover:text-rose-400 transition-colors">Scanner Engine</Link></li>
            <li><Link to="/pricing" className="hover:text-rose-400 transition-colors">Pricing</Link></li>
            <li><Link to="/Services" className="hover:text-rose-400 transition-colors">Services</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Legal</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><Link to="/privacy-policy" className="hover:text-rose-400 transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms-and-conditions" className="hover:text-rose-400 transition-colors">Terms & Conditions</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Support</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              <a href="mailto:support@vapttool.io" className="hover:text-rose-400 transition-colors">support@vapttool.io</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-600">
        <p>© 2025 VAPT Tool. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;