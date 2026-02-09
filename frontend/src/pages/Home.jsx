import Hero from '../components/Hero';
import ThreatManagementSection from '../components/ThreatManagementSection';
import ConsultingContactWidget from '../components/ConsultingContactWidget';
import MethodologySection from '../components/MethodologySection';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-200 font-sans selection:bg-rose-500/30 flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(#334155 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
            maskImage: 'linear-gradient(to bottom, black 20%, transparent 90%)'
          }}
        ></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-rose-500/10 blur-[120px] rounded-full pointer-events-none"></div>
      </div>

      <Navigation />

      <div className="relative z-10 flex-1 flex flex-col">
        <main className="relative z-10 flex-1 flex flex-col items-center px-6 pb-20 text-center pt-20">
          <Hero />
          <ThreatManagementSection />
          <ConsultingContactWidget />
          <MethodologySection />
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Home;