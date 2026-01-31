import { Check, Zap } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const Pricing = () => {
  const { user, updateCredits } = useAuth();

  const plans = [
    {
      name: "Starter",
      credits: 10,
      price: "₹199",
      description: "Perfect for testing",
      features: ["10 Scan Credits", "30-day validity", "Basic reports", "Email support"],
      highlighted: false,
      planId: "BASIC_10"
    },
    {
      name: "Professional",
      credits: 20,
      price: "₹349",
      description: "Best for regular testing",
      features: ["20 Scan Credits", "90-day validity", "Advanced reports", "Priority support", "Save 1.5% per credit"],
      highlighted: true,
      planId: "PRO_20"
    },
    {
      name: "Enterprise",
      credits: 30,
      price: "₹499",
      description: "For continuous monitoring",
      features: ["30 Scan Credits", "180-day validity", "Full analytics", "24/7 support", "Account manager"],
      highlighted: false,
      planId: "ADV_30"
    }
  ];

  const handleBuyNow = async (plan) => {
    if (!user) {
      alert('Please login first');
      return;
    }

    try {
      const { data } = await api.post('/api/payment/create-order', { plan: plan.planId });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: 'INR',
        order_id: data.orderId,
        handler: async (response) => {
          const verify = await api.post('/api/payment/verify', {
            ...response,
            plan: plan.planId
          });

          updateCredits(verify.data.scanCredits);
          alert('Payment successful! Credits added.');
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert(err.response?.data?.error || 'Payment failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-200 flex flex-col">
      <Navigation />

      <div className="absolute inset-0 opacity-20 pointer-events-none z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(244, 63, 94, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)`,
          }}
        ></div>
      </div>

      <div className="relative z-10 flex-1 max-w-7xl mx-auto px-6 pt-28 pb-20 w-full">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Simple, Transparent Pricing</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Buy scan credits and use them anytime. No subscriptions, no hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`rounded-2xl border backdrop-blur p-8 transition-all duration-300 flex flex-col relative ${
                plan.highlighted
                  ? 'bg-gradient-to-b from-rose-950/40 to-slate-900/60 border-rose-500/60 lg:scale-105 lg:shadow-2xl lg:shadow-rose-500/25'
                  : 'bg-slate-900/40 border-slate-800/60 hover:border-slate-700/80 hover:bg-slate-900/50'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-rose-500 text-white text-xs font-bold rounded-full">
                  Most Popular
                </div>
              )}

              <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
              <p className="text-slate-400 text-sm mb-6">{plan.description}</p>

              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-slate-400 text-sm">{plan.credits} credits</span>
                </div>
                <p className="text-xs text-slate-400">₹{Math.round(parseInt(plan.price.replace('₹', '')) / plan.credits)} per credit</p>
              </div>

              <button
                onClick={() => handleBuyNow(plan)}
                className={`w-full px-6 py-3 rounded-lg font-semibold mb-8 transition-all duration-200 flex items-center justify-center gap-2 ${
                  plan.highlighted
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-500/30 hover:shadow-rose-500/40'
                    : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                }`}
              >
                <Zap size={18} />
                Buy Now
              </button>

              <ul className="space-y-3 flex-1">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <Check size={18} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Pricing;