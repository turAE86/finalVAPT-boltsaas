import React from 'react';
import { Zap, AlertCircle, CheckCircle, Clock, Shield, Radar, Bug, Lock, LogIn, Download, Server, Shield as ShieldIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import ClickwrapAgreement from '../components/ClickwrapAgreement';

const Scanner = () => {
  const { user, login: updateAuthUser, updateCredits } = useAuth();
  const [target, setTarget] = useState('');
  const [scanStarted, setScanStarted] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanComplete, setScanComplete] = useState(false);
  const [activeTab, setActiveTab] = useState('scanner');
  const [currentScan, setCurrentScan] = useState(null);
  const [scans, setScans] = useState([]);
  const [showAgreement, setShowAgreement] = useState(false);
  const [agreementAccepted, setAgreementAccepted] = useState(false);
  const [acceptingAgreement, setAcceptingAgreement] = useState(false);

  useEffect(() => {
    if (user) {
      setAgreementAccepted(user.scannerAgreementAccepted || false);
      if (!user.scannerAgreementAccepted) {
        setShowAgreement(true);
      }
    }
  }, [user]);

  useEffect(() => {
    if (user && activeTab === 'history' && agreementAccepted) {
      fetchScanHistory();
    }
  }, [user, activeTab, agreementAccepted]);

  const fetchScanHistory = async () => {
    try {
      const res = await api.get('/api/scans');
      setScans(res.data);
    } catch (err) {
      console.error('Failed to fetch scans:', err);
    }
  };

  const handleAcceptAgreement = async () => {
    if (user) {
      setAcceptingAgreement(true);
      try {
        const res = await api.post('/api/auth/accept-scanner-agreement');
        updateAuthUser({
          user: res.data.user,
          token: localStorage.getItem('token')
        });
        setAgreementAccepted(true);
        setShowAgreement(false);
      } catch (err) {
        console.error('Failed to accept agreement:', err);
        alert('Failed to accept agreement. Please try again.');
      } finally {
        setAcceptingAgreement(false);
      }
    }
  };

  const handleDeclineAgreement = () => {
    setShowAgreement(false);
  };

  const startScan = async () => {
    if (!target.trim()) {
      alert('Please enter a target URL');
      return;
    }

    if (!user) {
      alert('Please login to start scanning');
      return;
    }

    if (!agreementAccepted) {
      alert('You must accept the scanner usage agreement first');
      setShowAgreement(true);
      return;
    }

    if ((user?.scanCredits || 0) <= 0) {
      alert('No scan credits available. Please upgrade your plan.');
      return;
    }

    setScanStarted(true);
    setScanProgress(0);
    setScanComplete(false);

    try {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 90) {
          setScanProgress(90);
        } else {
          setScanProgress(progress);
        }
      }, 800);

      const res = await api.post('/api/scan', { target });

      clearInterval(interval);
      setScanProgress(100);
      setCurrentScan(res.data);
      setScanComplete(true);
      updateCredits((user.scanCredits || 0) - 1);
      await fetchScanHistory();
    } catch (err) {
      if (err.response?.status === 403) {
        alert('Scan limit reached. Please upgrade your plan.');
      } else {
        alert(err.response?.data?.error || 'Scan failed');
      }
      setScanStarted(false);
    }
  };

  const startNewScan = () => {
    setScanStarted(false);
    setScanProgress(0);
    setScanComplete(false);
    setTarget('');
    setCurrentScan(null);
  };

  const downloadReport = async (scanId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Authentication required. Please login again.");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/report/${scanId}`,
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/pdf"
          }
        }
      );

      if (!response.ok) {
        const contentType = response.headers.get("content-type") || "";
        let message = "Failed to download report";

        if (contentType.includes("application/json")) {
          const data = await response.json();
          message = data.details || data.error || message;
        } else {
          const text = await response.text();
          if (text) message = text;
        }

        console.error("Report download failed:", response.status, message);
        alert(message);
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const timestamp = new Date().toISOString().split("T")[0];
      link.setAttribute("download", `vapt-scan-report-${scanId.substring(0, 8)}-${timestamp}.pdf`);
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      }, 100);
    } catch (err) {
      console.error("Download error:", err);
      alert("Failed to download report");
    }
  };

  const getSeverityColor = (severity) => {
    const severityMap = {
      CRITICAL: 'bg-red-500/15 text-red-400 border border-red-500/20',
      HIGH: 'bg-orange-500/15 text-orange-400 border border-orange-500/20',
      MEDIUM: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20',
      LOW: 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
    };
    return severityMap[severity] || severityMap.MEDIUM;
  };

  const getSeverityIcon = (severity) => {
    const iconMap = {
      CRITICAL: '🔴',
      HIGH: '🟠',
      MEDIUM: '🟡',
      LOW: '🔵'
    };
    return iconMap[severity] || '⚠️';
  };

  const getVulnIcon = (type) => {
    const iconMap = {
      'XSS': '🎯',
      'SQLI': '🗄️',
      'COMMAND_INJECTION': '⚡',
      'DIRECTORY_TRAVERSAL': '📁',
      'SSRF': '🌐',
      'OPEN_REDIRECT': '🔀',
      'OPEN_PORTS': '🔌',
      'HEADERS': '📋'
    };
    return iconMap[type] || '⚠️';
  };

  const normalizeList = (value) => {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  };

  const VulnerabilityCard = ({ finding, index }) => (
    <div className={`bg-linear-to-br from-slate-900/60 to-slate-900/30 border ${
      finding.severity === 'CRITICAL' ? 'border-red-500/30' :
      finding.severity === 'HIGH' ? 'border-orange-500/30' :
      finding.severity === 'MEDIUM' ? 'border-yellow-500/30' :
      'border-slate-700/50'
    } backdrop-blur rounded-xl p-6 shadow-lg hover:shadow-lg transition-all`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4 flex-1">
          <div className="text-3xl">{getVulnIcon(finding.type)}</div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              {finding.type.replace(/_/g, ' ')}
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${getSeverityColor(finding.severity)}`}>
                {finding.severity}
              </span>
            </h3>
            <p className="text-slate-300 text-sm">{finding.description}</p>
          </div>
        </div>
      </div>

      {/* Evidence Section */}
      {normalizeList(finding.evidence).length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-700/30">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Evidence</p>
          <div className="space-y-2">
            {normalizeList(finding.evidence).map((item, idx) => (
              <div key={idx} className="bg-slate-800/50 rounded px-3 py-2 text-xs text-slate-300 font-mono overflow-x-auto">
                {typeof item === 'string' ? item : JSON.stringify(item)}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payload/Details Section */}
      {normalizeList(finding.details).length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-700/30">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Details</p>
          <div className="space-y-2">
            {normalizeList(finding.details).map((detail, idx) => (
              <div key={idx} className="bg-slate-800/50 rounded px-3 py-2 text-xs text-slate-300">
                {detail && typeof detail === 'object' ? (
                  <>
                    {detail.param && <p><strong>Parameter:</strong> {detail.param}</p>}
                    {detail.payload && <p className="font-mono text-rose-300"><strong>Payload:</strong> {detail.payload}</p>}
                    {detail.description && <p><strong>Description:</strong> {detail.description}</p>}
                    {detail.URL && <p><strong>URL:</strong> {detail.URL}</p>}
                  </>
                ) : (
                  <p>{String(detail)}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* OWASP Section */}
      {finding.owasp && (
        <div className="mt-4 pt-4 border-t border-slate-700/30">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">OWASP Reference</p>
          <p className="text-sm text-slate-300 bg-slate-800/30 rounded px-3 py-2">{finding.owasp}</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-200 flex flex-col">
      <Navigation />

      {showAgreement && user && (
        <ClickwrapAgreement
          onAccept={handleAcceptAgreement}
          onDecline={handleDeclineAgreement}
          isLoading={acceptingAgreement}
        />
      )}

      <div className="absolute inset-0 opacity-30 pointer-events-none z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(244, 63, 94, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)`,
          }}
        ></div>
      </div>

      <div className="relative z-10 flex-1 max-w-7xl mx-auto px-6 pt-28 pb-20 w-full">
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-3">
            <Radar className="text-rose-500" size={32} strokeWidth={1.5} />
            <h1 className="text-5xl font-bold text-white">Security Scanner</h1>
          </div>
          <p className="text-slate-400 text-lg">Launch comprehensive vulnerability assessments. Scan your target and get instant insights.</p>
        </div>

        {user && (
          <div className="mb-6 p-4 bg-slate-800/40 border border-slate-700/50 rounded-lg flex justify-between items-center">
            <div className="text-sm">
              <span className="text-slate-300">Available Credits:</span>
              <span className="ml-2 text-lg font-bold text-rose-400">{user.scanCredits || 0}</span>
            </div>
            <a href="/pricing" className="text-rose-400 hover:text-rose-300 text-sm font-medium">Buy More Credits</a>
          </div>
        )}

        {agreementAccepted && user && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3">
            <CheckCircle size={20} className="text-green-400" />
            <span className="text-green-300 text-sm font-medium">Scanner agreement accepted. Ready to scan.</span>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-3 mb-8 border-b border-slate-800">
          <button
            onClick={() => setActiveTab('scanner')}
            className={`px-6 py-3 font-medium text-sm transition-all border-b-2 -mb-px ${
              activeTab === 'scanner'
                ? 'text-rose-400 border-b-rose-500'
                : 'text-slate-400 border-b-transparent hover:text-slate-300'
            }`}
          >
            Scanner
          </button>
          <button
            onClick={() => {
              if (!user) alert('Please login');
              else if (!agreementAccepted) setShowAgreement(true);
              else setActiveTab('history');
            }}
            className={`px-6 py-3 font-medium text-sm transition-all border-b-2 -mb-px ${
              activeTab === 'history'
                ? 'text-rose-400 border-b-rose-500'
                : 'text-slate-400 border-b-transparent hover:text-slate-300'
            }`}
          >
            Scan History
          </button>
        </div>

        {/* Scanner Tab */}
        {activeTab === 'scanner' && (
          <div className="animate-fade-in">
            {/* Scan Input Card */}
            <div className="bg-linear-to-br from-slate-900/60 to-slate-900/30 border border-slate-800/60 backdrop-blur rounded-2xl p-8 shadow-2xl mb-12">
              <div className="flex items-center gap-3 mb-8">
                <Shield className="text-rose-500" size={24} />
                <h2 className="text-2xl font-semibold text-white">Start New Scan</h2>
              </div>

              <div className="space-y-6 mb-8">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-3 uppercase">Target URL</label>
                  <input
                    type="text"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    placeholder="https://example.com or 192.168.1.1"
                    disabled={!user || (scanStarted && scanProgress < 100) || !agreementAccepted}
                    className="w-full bg-slate-800/40 border border-slate-700/50 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500/50 transition-all"
                  />
                </div>

                {scanStarted && (
                  <div className="p-6 bg-slate-800/30 border border-slate-700/50 rounded-lg">
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-300">Analysis Progress</span>
                        <span className="text-sm font-bold text-rose-400">{Math.round(scanProgress)}%</span>
                      </div>
                      <div className="w-full bg-slate-700/30 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-linear-to-r from-rose-500 to-pink-400 h-full transition-all duration-300"
                          style={{ width: `${scanProgress}%` }}
                        ></div>
                      </div>
                    </div>
                    {scanProgress < 100 && (
                      <div className="text-xs text-slate-400 flex items-center gap-2">
                        <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
                        Performing vulnerability analysis...
                      </div>
                    )}
                  </div>
                )}
              </div>

              {!user ? (
                <button className="w-full px-6 py-3.5 bg-linear-to-r from-rose-600 to-rose-500 text-white font-semibold rounded-lg flex items-center justify-center gap-2">
                  <LogIn size={18} />
                  Sign In to Start Scanning
                </button>
              ) : (
                <button
                  onClick={scanComplete ? startNewScan : startScan}
                  disabled={(scanStarted && scanProgress < 100) || !target.trim() || (user?.scanCredits || 0) <= 0 || !agreementAccepted}
                  className="w-full px-6 py-3.5 bg-linear-to-r from-rose-600 to-rose-500 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <Zap size={18} />
                  {scanComplete ? 'Start New Scan' : scanStarted && scanProgress < 100 ? 'Scanning...' : 'Launch Scan'}
                </button>
              )}
            </div>

            {/* Findings Display */}
            {currentScan && (
              <div className="animate-fade-in">
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-8">
                    <Bug className="text-rose-500" size={28} />
                    <h2 className="text-3xl font-bold text-white">Found Vulnerabilities</h2>
                    <span className="px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold ml-auto">
                      {currentScan.findings?.length || 0} findings
                    </span>
                  </div>

                  {(currentScan.findings || []).length === 0 ? (
                    <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-8 text-center">
                      <CheckCircle className="mx-auto mb-3 text-green-400" size={32} />
                      <p className="text-green-300 font-semibold">No vulnerabilities found!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {(currentScan.findings || []).map((finding, idx) => (
                        <VulnerabilityCard key={idx} finding={finding} index={idx} />
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    onClick={startNewScan}
                    className="flex-1 px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold rounded-lg transition-all"
                  >
                    Start New Scan
                  </button>
                  <button
                    onClick={() => downloadReport(currentScan._id)}
                    className="flex-1 px-6 py-3 bg-linear-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-semibold rounded-lg flex items-center justify-center gap-2"
                  >
                    <Download size={18} />
                    Download Report
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="animate-fade-in">
            <div className="bg-linear-to-br from-slate-900/60 to-slate-900/30 border border-slate-800/60 backdrop-blur rounded-2xl p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="text-rose-500" size={24} />
                <h2 className="text-2xl font-semibold text-white">Scan History</h2>
              </div>

              {scans.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-slate-400">No scans yet. Start your first scan!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {scans.map((scan) => (
                    <div key={scan._id} className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4 flex items-center justify-between hover:bg-slate-800/50 transition-all">
                      <div>
                        <p className="text-white font-semibold">{scan.target}</p>
                        <p className="text-slate-400 text-sm">{new Date(scan.createdAt).toLocaleString()}</p>
                      </div>
                      <button
                        onClick={() => downloadReport(scan._id)}
                        className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-lg flex items-center gap-2"
                      >
                        <Download size={16} />
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Scanner;