import { Mail, Phone, Clock, Send } from 'lucide-react';
import { useState } from 'react';
import api from '../services/api';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      await api.post('/api/contact', formData);
      setSuccessMessage('Message sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      setErrorMessage(err.response?.data?.error || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-[#0B1120] text-slate-200 pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Get in Touch</h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Have questions? Our security experts are ready to help you protect your infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8">
              <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mb-4 text-rose-500">
                <Mail size={24} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Email</h3>
              <p className="text-slate-400 mb-4">Send us your inquiry at any time.</p>
              <a href="mailto:support@vapttool.io" className="text-rose-400 hover:text-rose-300 transition-colors">
                support@vapttool.io
              </a>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8">
              <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mb-4 text-rose-500">
                <Phone size={24} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Phone</h3>
              <p className="text-slate-400 mb-4">Call our support team during business hours.</p>
              <a href="tel:+919876543210" className="text-rose-400 hover:text-rose-300 transition-colors">
                +91 (987) 654-3210
              </a>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8">
              <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mb-4 text-rose-500">
                <Clock size={24} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Hours</h3>
              <p className="text-slate-400 mb-4">We're available Monday to Friday.</p>
              <p className="text-slate-300">9:00 AM - 6:00 PM IST</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-white mb-8">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-800/40 border border-slate-700/50 rounded-lg px-4 py-3 text-white placeholder-slate-500/70 focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/20 transition-all"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-800/40 border border-slate-700/50 rounded-lg px-4 py-3 text-white placeholder-slate-500/70 focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/20 transition-all"
                    placeholder="you@company.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full bg-slate-800/40 border border-slate-700/50 rounded-lg px-4 py-3 text-white placeholder-slate-500/70 focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/20 transition-all resize-none"
                    placeholder="Tell us about your security needs..."
                  ></textarea>
                </div>

                {successMessage && (
                  <div className="p-4 bg-emerald-500/15 border border-emerald-500/20 rounded-lg text-emerald-400 text-sm">
                    {successMessage}
                  </div>
                )}

                {errorMessage && (
                  <div className="p-4 bg-red-500/15 border border-red-500/20 rounded-lg text-red-400 text-sm">
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-rose-600 hover:bg-rose-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <Send size={18} />
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            <div className="space-y-8">
              <div className="bg-linear-to-br from-rose-950/40 to-slate-900 border border-rose-500/20 rounded-xl p-8">
                <h3 className="text-xl font-bold text-white mb-4">Quick Response</h3>
                <p className="text-slate-400 mb-6">
                  We typically respond to inquiries within 2 business hours during working hours. For urgent matters, please call our support line.
                </p>
                <a href="tel:+919876543210" className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-medium rounded-lg transition-all">
                  <Phone size={18} />
                  Call Support
                </a>
              </div>

              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8">
                <h3 className="text-xl font-bold text-white mb-4">Office Information</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Based in India with a global reach. Our team works to provide you the best security assessment services available.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contact;