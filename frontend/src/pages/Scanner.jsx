import React from 'react';
import { Zap, AlertCircle, CheckCircle, Clock, TrendingUp, Shield, Radar, Bug, Lock, LogIn, Download } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import ClickwrapAgreement from '../components/ClickwrapAgreement';
import SeverityChart from '../components/SeverityChart';

const Scanner = () => {
  const { user, login: updateAuthUser } = useAuth();
  const [target, setTarget] = useState('');
  const [scanStarted, setScanStarted] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanComplete, setScanComplete] = useState(false);
  const [activeTab, setActiveTab] = useState('scanner');
  const [currentScan, setCurrentScan] = useState(null);
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAgreement, setShowAgreement] = useState(false);
  const [agreementAccepted, setAgreementAccepted] = useState(false);
  const [acceptingAgreement, setAcceptingAgreement] = useState(false);

  // Check if user has already accepted the agreement from DB
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
        
        // Update auth context with new user data
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
    // User cannot use scanner without accepting
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
      await fetchScanHistory();
    } catch (err) {
      clearInterval(interval);
      if (err.response?.status === 403) {
        alert('Scan limit reached. Please upgrade your plan.');
      } else {
        alert(err.response?.data?.error || 'Scan failed');
      }
      setScanStarted(false);
    }
  };

  // Example (pseudo-code)
const handleScan = async () => {
  const response = await api.scan(target);
  setScanResult(response.scanResult);
  setCredits(response.credits); // <-- update credits here
};

  const startNewScan = () => {
    setScanStarted(false);
    setScanProgress(0);
    setScanComplete(false);
    setTarget('');
    setCurrentScan(null);
  };

// Update the downloadReport function in frontend/src/pages/Scanner.jsx
// In frontend/src/pages/Scanner.jsx - Replace the downloadReport function with this:

const downloadReport = async (scanId) => {
  try {
    const token = localStorage.getItem("token");
    
    if (!token) {
      alert("Authentication required. Please login again.");
      return;
    }

    // Show loading state (optional - you can add a loading indicator)
    console.log("Downloading report for scan:", scanId);

    // Fetch with proper authorization
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

    // Handle response
    if (!response.ok) {
      let errorMsg = "Failed to download report";
      try {
        const errorData = await response.json();
        errorMsg = errorData.error || errorMsg;
      } catch (e) {
        // Response wasn't JSON
      }
      alert(errorMsg);
      return;
    }

    // Get the blob
    const blob = await response.blob();

    // Verify it's a PDF
    if (blob.type !== "application/pdf") {
      console.error("Invalid file type received:", blob.type);
      alert("Invalid file format received. Please try again.");
      return;
    }

    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    // Set filename with timestamp
    const timestamp = new Date().toISOString().split("T")[0];
    const filename = `vapt-scan-report-${scanId.substring(0, 8)}-${timestamp}.pdf`;
    link.setAttribute("download", filename);

    // Append to body, click, and cleanup
    document.body.appendChild(link);
    link.click();

    // Cleanup
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    }, 100);

    console.log("Report downloaded successfully");
  } catch (err) {
    console.error("Download error:", err);
    alert("Failed to download report. Please check your connection and try again.");
  }
};

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return 'bg-red-500/15 text-red-400 border border-red-500/20';
      case 'high':
        return 'bg-orange-500/15 text-orange-400 border border-orange-500/20';
      case 'medium':
        return 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20';
      case 'low':
        return 'bg-blue-500/15 text-blue-400 border border-blue-500/20';
      default:
        return 'bg-slate-500/15 text-slate-400 border border-slate-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-200 flex flex-col">
      <Navigation />

      {/* Show agreement modal if needed */}
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
            <a href="/pricing" className="text-rose-400 hover:text-rose-300 text-sm font-medium transition">
              Buy More Credits
            </a>
          </div>
        )}

        {agreementAccepted && user && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3">
            <CheckCircle size={20} className="text-green-400" />
            <span className="text-green-300 text-sm font-medium">Scanner agreement accepted. You can now proceed with scanning.</span>
          </div>
        )}

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
              if (!user) alert('Please login to view scan history');
              else if (!agreementAccepted) {
                alert('Please accept the scanner agreement first');
                setShowAgreement(true);
              } else setActiveTab('history');
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

        {activeTab === 'scanner' && (
          <div className="animate-fade-in">
            <div className="bg-gradient-to-br from-slate-900/60 to-slate-900/30 border border-slate-800/60 backdrop-blur rounded-2xl p-8 shadow-2xl mb-12">
              <div className="flex items-center gap-3 mb-8">
                <Shield className="text-rose-500" size={24} strokeWidth={1.5} />
                <h2 className="text-2xl font-semibold text-white">Start New Scan</h2>
              </div>

              <div className="space-y-6 mb-8">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">Target URL</label>
                  <input
                    type="text"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    placeholder="https://example.com or 192.168.1.1"
                    disabled={!user || (scanStarted && scanProgress < 100) || !agreementAccepted}
                    className="w-full bg-slate-800/40 border border-slate-700/50 rounded-lg px-4 py-3 text-white placeholder-slate-500/70 focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  {user && !agreementAccepted && (
                    <p className="text-xs text-amber-400 mt-2 flex items-center gap-1">
                      <AlertCircle size={14} />
                      Accept the scanner agreement to enable scanning
                    </p>
                  )}
                </div>

                {scanStarted && (
                  <div className="p-6 bg-slate-800/30 border border-slate-700/50 rounded-lg animate-fade-in">
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-300">Analysis Progress</span>
                        <span className="text-sm font-bold text-rose-400">{Math.round(scanProgress)}%</span>
                      </div>
                      <div className="relative w-full bg-slate-700/30 rounded-full h-3 overflow-hidden border border-slate-700/30">
                        <div
                          className="bg-gradient-to-r from-rose-500 via-rose-400 to-pink-400 h-full transition-all duration-300 rounded-full shadow-lg shadow-rose-500/20"
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
                    {scanProgress === 100 && (
                      <div className="text-xs text-emerald-400 flex items-center gap-2">
                        <CheckCircle size={14} />
                        Scan completed! Results shown below.
                      </div>
                    )}
                  </div>
                )}
              </div>

              {!user ? (
                <button className="w-full px-6 py-3.5 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40">
                  <LogIn size={18} />
                  Sign In to Start Scanning
                </button>
              ) : (
                <button
                  onClick={scanComplete ? startNewScan : startScan}
                  disabled={(scanStarted && scanProgress < 100) || !target.trim() || (user?.scanCredits || 0) <= 0 || !agreementAccepted}
                  className="w-full px-6 py-3.5 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 disabled:shadow-none"
                >
                  {scanComplete ? (
                    <>
                      <Zap size={18} />
                      Start New Scan
                    </>
                  ) : scanStarted && scanProgress < 100 ? (
                    <>
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                      <span>Scanning in Progress</span>
                    </>
                  ) : (
                    <>
                      <Zap size={18} />
                      Launch Scan
                    </>
                  )}
                </button>
              )}
            </div>

            {currentScan && (
              <div className="animate-fade-in">
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Bug className="text-rose-500" size={24} strokeWidth={1.5} />
                    <h2 className="text-2xl font-semibold text-white">Found Vulnerabilities</h2>
                    <span className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-semibold ml-auto">
                      {currentScan.findings?.length || 0} findings
                    </span>
                  </div>

                  <div className="space-y-4">
                    {(currentScan.findings || []).map((vuln, idx) => (
                      <div
                        key={idx}
                        className="bg-gradient-to-br from-slate-900/60 to-slate-900/30 border border-slate-800/60 backdrop-blur rounded-xl p-6 shadow-lg hover:shadow-lg hover:shadow-slate-700/20 transition-all hover:border-slate-700/80"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start gap-3 flex-1">
                            <div className={`p-2 rounded-lg ${getSeverityColor(vuln.severity).split(' ')[0]}`}>
                              <AlertCircle size={18} />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-base font-semibold text-white mb-1">{vuln.type}</h3>
                              <div className="flex flex-wrap gap-2 items-center">
                                <span className={`inline-block px-2.5 py-1 rounded text-xs font-medium ${getSeverityColor(vuln.severity)}`}>
                                  {vuln.severity}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="pl-11 space-y-3">
                          <div>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Details</p>
                            <p className="text-sm text-slate-300">{vuln.description}</p>
                          </div>

                          <div>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">OWASP</p>
                            <p className="text-sm text-slate-300">{vuln.owasp}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {currentScan && (
                  <div className="flex gap-4 mt-8">
                    <button
                      onClick={startNewScan}
                      className="flex-1 px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold rounded-lg transition-all"
                    >
                      Start New Scan
                    </button>
                    <button
                      onClick={() => downloadReport(currentScan._id)}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                      <Download size={18} />
                      Download Report
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="animate-fade-in">
            <div className="bg-gradient-to-br from-slate-900/60 to-slate-900/30 border border-slate-800/60 backdrop-blur rounded-2xl p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="text-rose-500" size={24} strokeWidth={1.5} />
                <h2 className="text-2xl font-semibold text-white">Scan History</h2>
              </div>

              {scans.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-slate-400">No scans yet. Start your first scan above!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {scans.map((scan) => (
                    <div
                      key={scan._id}
                      className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4 flex items-center justify-between hover:bg-slate-800/50 transition-all"
                    >
                      <div>
                        <p className="text-white font-semibold">{scan.target}</p>
                        <p className="text-slate-400 text-sm">{new Date(scan.createdAt).toLocaleString()}</p>
                      </div>
                      <button
                        onClick={() => downloadReport(scan._id)}
                        className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-lg transition-all flex items-center gap-2"
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