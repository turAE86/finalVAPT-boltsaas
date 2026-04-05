// frontend/src/components/ClickwrapAgreement.jsx
import { AlertCircle, Check, X } from 'lucide-react';
import { useState } from 'react';

const ClickwrapAgreement = ({ onAccept, onDecline, isLoading }) => {
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const scrollContainerRef = useState(null)[1]; // This was causing an issue

  // Use useRef instead
  const [scrollRef, setScrollRef] = useState(null);

  const handleScroll = (e) => {
    const element = e.target;
    const isAtBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 10;
    setScrolledToBottom(isAtBottom);
  };

  const handleAccept = () => {
    if (scrolledToBottom && accepted) {
      onAccept();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-800 flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-rose-500/20 flex items-center justify-center flex-shrink-0">
            <AlertCircle size={24} className="text-rose-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">User Agreement</h1>
            <p className="text-slate-400 text-sm mt-1">Please read and accept our scanner usage terms before proceeding</p>
          </div>
        </div>

        {/* Scrollable Content */}
        <div
          ref={setScrollRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-8 py-6 space-y-6"
        >
          <div>
            <h2 className="text-lg font-semibold text-white mb-3">Scanner Usage Agreement</h2>
            <p className="text-slate-300 leading-relaxed">
              By using the VAPT Bolt Security Scanner, you agree to comply with the following terms and conditions. This agreement is binding and legally enforceable.
            </p>
          </div>

          <div>
            <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 text-xs font-bold flex items-center justify-center">1</span>
              Authorization & Ownership
            </h3>
            <p className="text-slate-300 leading-relaxed ml-8">
              You certify that you have explicit written authorization from the owner/administrator of any systems you scan. You may only scan:
            </p>
            <ul className="text-slate-300 leading-relaxed ml-16 mt-2 space-y-1">
              <li>• Systems and applications you own</li>
              <li>• Systems and applications you manage or are responsible for</li>
              <li>• Systems and applications where you have obtained written consent from the owner</li>
              <li>• Designated testing environments provided for security research</li>
            </ul>
            <p className="text-red-400 font-semibold mt-3 ml-8">
              ⚠️ Unauthorized scanning of third-party systems is illegal and may violate the Computer Fraud and Abuse Act (CFAA) and similar laws in your jurisdiction.
            </p>
          </div>

          <div>
            <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 text-xs font-bold flex items-center justify-center">2</span>
              No Live Website Scanning Without Consent
            </h3>
            <p className="text-slate-300 leading-relaxed ml-8">
              You agree NOT to scan live production websites, applications, or services that are publicly available or belong to third parties without their explicit written consent. This includes:
            </p>
            <ul className="text-slate-300 leading-relaxed ml-16 mt-2 space-y-1">
              <li>• Public websites and web applications</li>
              <li>• SaaS platforms you don't own or manage</li>
              <li>• Third-party APIs and services</li>
              <li>• Cloud-hosted infrastructure not under your control</li>
            </ul>
            <p className="text-amber-400 font-semibold mt-3 ml-8">
              ⚠️ Unauthorized security testing of live systems may cause service disruptions and could result in legal action.
            </p>
          </div>

          <div>
            <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 text-xs font-bold flex items-center justify-center">3</span>
              Prohibited Uses & Malicious Activity
            </h3>
            <p className="text-slate-300 leading-relaxed ml-8">
              You agree NOT to use the VAPT Bolt scanner for:
            </p>
          
            <ul className="text-slate-300 leading-relaxed ml-16 mt-2 space-y-1">
              <li>• Hacking, unauthorized access, or system compromise</li>
              <li>• Data theft, extraction, or exfiltration</li>
              <li>• Extortion, blackmail, or ransom demands</li>
              <li>• Disrupting or degrading service availability</li>
              <li>• Bypassing security controls for malicious purposes</li>
              <li>• Testing vulnerabilities for exploitation</li>
              <li>• Any illegal activity or violations of local, state, or federal law</li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 text-xs font-bold flex items-center justify-center">4</span>
              Liability & Disclaimer
            </h3>
            <p className="text-slate-300 leading-relaxed ml-8">
              VAPT Bolt is provided "as-is" without liability for:
            </p>
            <ul className="text-slate-300 leading-relaxed ml-16 mt-2 space-y-1">
              <li>• System downtime or performance degradation caused by scans</li>
              <li>• Data loss or corruption</li>
              <li>• Missed vulnerabilities or false positives</li>
              <li>• Misuse of scanning results for unauthorized purposes</li>
            </ul>
            <p className="text-slate-300 leading-relaxed mt-3 ml-8">
              You use the scanner at your own risk and assume full responsibility for any consequences.
            </p>
          </div>

          <div>
            <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 text-xs font-bold flex items-center justify-center">5</span>
              No Association or Liability
            </h3>
            <p className="text-slate-300 leading-relaxed ml-8">
              VAPT Bolt expressly disclaims any association with, affiliation with, or liability for:
            </p>
            <ul className="text-slate-300 leading-relaxed ml-16 mt-2 space-y-1">
              <li>• Any illegal or unauthorized use of the scanner</li>
              <li>• Any harm caused by misuse of scanning results</li>
              <li>• Any data breaches resulting from scanning activities</li>
              <li>• Any claims by third parties related to unauthorized testing</li>
            </ul>
            <p className="text-red-400 font-semibold mt-3 ml-8">
              If you use the VAPT Bolt scanner for illegal purposes, VAPT Bolt will not be held liable and will fully cooperate with law enforcement.
            </p>
          </div>

          <div>
            <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 text-xs font-bold flex items-center justify-center">6</span>
              Compliance with Laws
            </h3>
            <p className="text-slate-300 leading-relaxed ml-8">
              You agree to comply with all applicable local, state, national, and international laws regarding:
            </p>
            <ul className="text-slate-300 leading-relaxed ml-16 mt-2 space-y-1">
              <li>• Computer fraud and unauthorized access (CFAA, GDPR, etc.)</li>
              <li>• Data protection and privacy regulations</li>
              <li>• Intellectual property rights</li>
              <li>• Export controls and sanctions regulations</li>
              <li>• Industry-specific compliance requirements (HIPAA, PCI-DSS, etc.)</li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 text-xs font-bold flex items-center justify-center">7</span>
              Consequences of Violation
            </h3>
            <p className="text-slate-300 leading-relaxed ml-8">
              If you violate this agreement:
            </p>
            <ul className="text-slate-300 leading-relaxed ml-16 mt-2 space-y-1">
              <li>• Your account and access will be immediately terminated</li>
              <li>• VAPT Bolt will cooperate with law enforcement investigations</li>
              <li>• You may be liable for damages and legal fees</li>
              <li>• You may face criminal charges depending on jurisdiction and severity</li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 text-xs font-bold flex items-center justify-center">8</span>
              Responsible Disclosure
            </h3>
            <p className="text-slate-300 leading-relaxed ml-8">
              If you discover vulnerabilities in systems you are authorized to test:
            </p>
            <ul className="text-slate-300 leading-relaxed ml-16 mt-2 space-y-1">
              <li>• Report them responsibly to the system owner</li>
              <li>• Do not disclose vulnerabilities publicly without permission</li>
              <li>• Allow reasonable time for patching before disclosure</li>
              <li>• Do not exploit vulnerabilities for personal gain</li>
            </ul>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 mt-6">
            <p className="text-slate-300 text-sm">
              <strong>Last Updated:</strong> February 4, 2026
            </p>
            <p className="text-slate-400 text-xs mt-2">
              By accepting this agreement, you acknowledge that you have read, understood, and agree to comply with all terms outlined above.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 px-8 py-4 bg-slate-900/50">
          {!scrolledToBottom && (
            <p className="text-xs text-slate-400 text-center mb-4">
              ⬇️ Scroll down to the bottom to read the full agreement
            </p>
          )}

          <div className="space-y-3">
            {scrolledToBottom && (
              <label className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg cursor-pointer hover:bg-slate-800/50 transition-colors">
                <input
                  type="checkbox"
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                  className="w-5 h-5 rounded border-slate-600 text-rose-500 focus:ring-rose-500 cursor-pointer"
                />
                <span className="text-slate-300 text-sm font-medium">
                  I have read and agree to the Scanner Usage Agreement
                </span>
              </label>
            )}

            <div className="flex gap-3">
              <button
                onClick={onDecline}
                disabled={isLoading}
                className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <X size={18} />
                Decline
              </button>
              <button
                onClick={handleAccept}
                disabled={!scrolledToBottom || !accepted || isLoading}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Check size={18} />
                {isLoading ? 'Accepting...' : 'I Accept'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClickwrapAgreement;