import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  motion, 
  AnimatePresence, 
  useScroll, 
  useTransform, 
  useSpring, 
  useInView,
  Variants 
} from 'framer-motion';
import { 
  ArrowRight, 
  Linkedin, 
  Zap, 
  Shield, 
  TrendingUp, 
  CheckCircle2, 
  Menu, 
  X,
  Mic2,
  Play,
  ExternalLink,
  Lock,
  Cpu,
  RefreshCcw,
  Target,
  FileText,
  ChevronLeft,
  Network,
  Activity,
  Globe
} from 'lucide-react';

// --- Configuration ---
const CALENDLY_URL = "https://calendly.com/snixx23v/30min";
const LINKEDIN_URL = "https://www.linkedin.com/company/snixx23ventures/";

// Define PriceTier interface
interface PriceTier {
  name: string;
  price: string;
  focus: string;
  features: string[];
  recommended?: boolean;
}

// --- Custom Hooks ---

const useActiveSection = (sectionIds: string[]) => {
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3, rootMargin: '-10% 0% -70% 0%' }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sectionIds]);

  return activeSection;
};

// --- Advanced Animation Wrappers ---

const RevealText: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  return (
    <div className={`overflow-hidden max-w-full ${className}`}>
      <motion.div
        initial={{ y: "100%" }}
        whileInView={{ y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
        style={{ transform: 'translateZ(0)' }}
      >
        {children}
      </motion.div>
    </div>
  );
};

const Magnetic: React.FC<{ children: React.ReactElement; className?: string }> = ({ children, className }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (clientX - (left + width / 2)) * 0.15;
    const y = (clientY - (top + height / 2)) * 0.15;
    setPosition({ x, y });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={className}
      style={{ willChange: 'transform' }}
    >
      {children}
    </motion.div>
  );
};

const GlowCard: React.FC<{ children: React.ReactNode; className?: string; overflow?: boolean }> = ({ children, className, overflow = false }) => {
  const mouseX = useSpring(0, { stiffness: 300, damping: 30 });
  const mouseY = useSpring(0, { stiffness: 300, damping: 30 });

  function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const background = useTransform(
    [mouseX, mouseY],
    ([x, y]) => `radial-gradient(400px circle at ${x}px ${y}px, rgba(255,255,255,0.04), transparent 60%)`
  );

  return (
    <div
      onMouseMove={onMouseMove}
      className={`relative group rounded-3xl border border-white/5 bg-white/[0.01] transition-colors hover:border-white/20 ${overflow ? '' : 'overflow-hidden'} ${className}`}
      style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background, willChange: 'opacity' }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
};

// --- Sub-Pages & Portals ---

const VisionHub: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1200] bg-black overflow-y-auto"
    >
      <div className="max-w-7xl mx-auto px-6 py-10">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-20 group"
        >
          <ChevronLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Home
        </button>

        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <RevealText>
              <h1 className="text-4xl sm:text-5xl md:text-8xl font-black mb-8 tracking-tighter uppercase leading-[0.9]">The Vision <br/><span className="text-white/20 italic">Hub.</span></h1>
            </RevealText>
            <p className="text-xl md:text-2xl text-white/60 mb-12 max-w-xl leading-relaxed">
              We are building a Deal Flow Machine. We leverage proprietary synthesis to turn investor intuition into an unfair market advantage.
            </p>

            <div className="space-y-12 mb-16">
              {[
                { title: "Network Gravity", desc: "Your name appearing in front of the right founders, exactly when they need a partner.", icon: <Network size={20} /> },
                { title: "Alpha Scaling", desc: "Scaling your investment thesis without scaling your workload.", icon: <Activity size={20} /> },
                { title: "The Deal Flow Machine", desc: "A constant inbound loop of high-quality decks triggered by passive authority.", icon: <RefreshCcw size={20} /> }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <div className="w-12 h-12 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center shrink-0">
                    <span className="text-white/60">{item.icon}</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2 uppercase tracking-tight">{item.title}</h4>
                    <p className="text-white/40 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Magnetic>
              <a 
                href={CALENDLY_URL}
                target="_blank"
                className="bg-white text-black px-12 py-5 rounded-full font-black text-xl flex items-center gap-3 hover:scale-105 transition-transform inline-flex"
              >
                Secure Your Moat <ArrowRight size={24} />
              </a>
            </Magnetic>
          </div>

          <div className="relative">
            <GlowCard className="p-12 md:p-16 h-full flex flex-col justify-center border-white/10 bg-white/[0.02]">
               <h3 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tighter mb-8 text-white/80">The Inbound Loop</h3>
               <div className="space-y-8">
                 <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                   <p className="text-white/80 font-bold mb-2">Phase 01: Synthesis</p>
                   <p className="text-white/40 text-sm">We extract your unique investment thesis through 15-minute weekly downloads.</p>
                 </div>
                 <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                   <p className="text-white/80 font-bold mb-2">Phase 02: Distribution</p>
                   <p className="text-white/40 text-sm">Your insights are architected into high-IQ LinkedIn content that commands respect.</p>
                 </div>
                 <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                   <p className="text-white/80 font-bold mb-2">Phase 03: Inbound</p>
                   <p className="text-white/40 text-sm">The network responds. Founders and co-investors reach out to the 'Visible Authority'.</p>
                 </div>
               </div>
            </GlowCard>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const PrivacyPortal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const protocolPoints = [
    {
      id: "01",
      title: "The \"Ghost\" Protocol",
      icon: <Lock size={20} />,
      content: "We are your Invisibility Insurance. We operate as a silent extension of your team. Our relationship is protected by a strict NDA from day one. We never use your name for our own marketing unless explicitly requested."
    },
    {
      id: "02",
      title: "Intellectual Property (IP)",
      icon: <FileText size={20} />,
      content: "Every word, visual, and strategy we produce belongs 100% to you. We just architect it. You keep every piece of content and all the growth data forever."
    },
    {
      id: "03",
      title: "Data Security",
      icon: <Shield size={20} />,
      content: "We handle your reputation. Your raw audio briefings are deleted immediately after transcription. We use secure access delegates for LinkedIn—never your primary password."
    },
    {
      id: "04",
      title: "No \"Copy-Paste\" Policy",
      icon: <RefreshCcw size={20} />,
      content: "We never reuse content between clients. Your thesis is unique. We ensure your voice remains distinct so you never sound like your competitors."
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[2000] bg-black overflow-y-auto px-6 py-20 md:py-32"
    >
      <div className="max-w-4xl mx-auto relative">
        <button 
          onClick={onClose}
          className="fixed top-6 right-6 text-white/40 hover:text-white transition-colors z-[2100] bg-white/10 p-4 rounded-full border border-white/20"
        >
          <X size={24} />
        </button>

        <RevealText>
          <h2 className="text-4xl md:text-7xl font-black mb-6 tracking-tighter uppercase">Privacy & Confidentiality</h2>
        </RevealText>
        <p className="text-white/40 text-xl md:text-2xl mb-20 max-w-2xl italic font-serif">
          Our protocol for ensuring your digital moat remains impenetrable.
        </p>

        <div className="space-y-16">
          {protocolPoints.map((point) => (
            <motion.div 
              key={point.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid md:grid-cols-[100px_1fr] gap-8 border-t border-white/10 pt-16"
            >
              <div className="text-white/20 font-black text-2xl tracking-tighter">{point.id}</div>
              <div>
                <div className="flex items-center gap-3 mb-6 text-white">
                  <span className="p-2 bg-white/5 rounded-lg border border-white/10">{point.icon}</span>
                  <h3 className="text-2xl font-black uppercase tracking-tight">{point.title}</h3>
                </div>
                <p className="text-white/60 text-lg leading-relaxed whitespace-pre-line font-medium">
                  {point.content}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-32 pt-16 border-t border-white/10 flex flex-col items-center text-center">
          <p className="text-white/40 text-sm mb-8">Questions regarding the Ghost Protocol?</p>
          <a href="mailto:hello@snixx.vc" className="text-white underline text-xl font-bold">hello@snixx.vc</a>
          <button 
            onClick={onClose}
            className="mt-16 bg-white text-black px-10 py-4 rounded-full font-black uppercase tracking-widest text-sm hover:scale-105 transition-transform"
          >
            Back to Home
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Optimized Background Component
const AnimatedBackground: React.FC = React.memo(() => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const particles = useMemo(() => {
    // Significantly reduce particles on mobile for performance
    const count = isMobile ? 8 : 15;
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      duration: Math.random() * 15 + 15,
    }));
  }, [isMobile]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-black">
      <style>{`
        @keyframes drift {
          0% { transform: translate(0, 0); }
          50% { transform: translate(20px, -20px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes drift-alt {
          0% { transform: translate(0, 0); }
          50% { transform: translate(-30px, 30px); }
          100% { transform: translate(0, 0); }
        }
        .bg-blob {
          will-change: transform;
          filter: blur(60px);
          opacity: 0.1;
          transform: translateZ(0);
        }
      `}</style>
      
      <div 
        className="bg-blob absolute top-[-5%] left-[-5%] w-[50%] h-[50%] bg-white rounded-full"
        style={{ animation: 'drift 20s infinite ease-in-out' }}
      />
      <div 
        className="bg-blob absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-white rounded-full"
        style={{ animation: 'drift-alt 25s infinite ease-in-out' }}
      />

      {particles.map((p) => (
        <motion.div 
          key={p.id} 
          initial={{ opacity: 0 }} 
          animate={{ opacity: [0, 0.2, 0], y: ['0%', '-10%'] }}
          transition={{ duration: p.duration, repeat: Infinity, ease: "easeInOut" }}
          style={{ 
            position: 'absolute', 
            left: `${p.x}%`, 
            top: `${p.y}%`, 
            width: `${p.size}px`, 
            height: `${p.size}px`, 
            backgroundColor: '#fff', 
            borderRadius: '50%',
            willChange: 'transform, opacity',
            transform: 'translateZ(0)'
          }}
        />
      ))}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
});

// localized Hero Particles for depth
const HeroParticles = React.memo(() => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const particles = useMemo(() => {
    const count = isMobile ? 12 : 35;
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 8 + 6,
      delay: Math.random() * 10,
    }));
  }, [isMobile]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white/20"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.5, 0],
            scale: [0.3, 1.2, 0.3],
            y: ['0%', '-20%'],
            x: ['0%', `${(Math.random() - 0.5) * 50}px`]
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: -p.delay,
            ease: "linear",
          }}
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            willChange: 'transform, opacity',
            transform: 'translateZ(0)'
          }}
        />
      ))}
    </div>
  );
});

const Navbar: React.FC<{ 
  onOpenPrivacy: () => void; 
  onViewChange: (v: 'home' | 'vision') => void; 
  currentView: string;
  onScrollTo: (id: string) => void;
}> = ({ onOpenPrivacy, onViewChange, currentView, onScrollTo }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const navLinks = [
    { name: 'Thesis', id: 'thesis' },
    { name: 'Vision', id: 'vision_link' },
    { name: 'Method', id: 'method' },
    { name: 'Privacy', id: 'privacy' },
    { name: 'Tiers', id: 'tiers' },
  ];

  const activeSectionId = useActiveSection(['thesis', 'vision', 'method', 'tiers']);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    if (id === 'privacy') {
      onOpenPrivacy();
    } else if (id === 'vision_link') {
      onViewChange('vision');
    } else {
      onViewChange('home');
      setTimeout(() => onScrollTo(id), 50);
    }
    setIsOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[1500] transition-all duration-300 ${scrolled ? 'bg-black/95 border-b border-white/10 py-3' : 'bg-transparent py-6'}`}>
      <motion.div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white origin-left" style={{ scaleX }} />
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); onViewChange('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="text-2xl font-extrabold tracking-tighter text-white"
        >
          SNIXX
        </a>
        
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <motion.a 
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => handleLinkClick(e, link.id)}
              className={`text-sm font-medium transition-colors relative group ${activeSectionId === link.id || (link.id === 'vision_link' && currentView === 'vision') ? 'text-white' : 'text-white/70 hover:text-white'}`}
            >
              {link.name}
              <motion.span 
                initial={false}
                animate={{ width: (activeSectionId === link.id || (link.id === 'vision_link' && currentView === 'vision')) ? '100%' : '0%' }}
                className="absolute -bottom-1 left-0 h-[1px] bg-white transition-all" 
              />
            </motion.a>
          ))}
          <Magnetic>
            <a 
              href={CALENDLY_URL}
              target="_blank"
              className="bg-white text-black px-5 py-2 rounded-full text-sm font-bold hover:bg-white/90 transition-all"
            >
              Book Chat
            </a>
          </Magnetic>
        </div>

        <button className="md:hidden text-white z-[1700] p-2" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-[1600] flex flex-col justify-center items-center space-y-10 p-10 md:hidden overflow-hidden"
          >
            {navLinks.map((link, i) => (
              <motion.a 
                key={link.id} 
                href={`#${link.id}`} 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={(e) => handleLinkClick(e, link.id)} 
                className={`text-4xl font-black tracking-tighter uppercase transition-colors ${activeSectionId === link.id || (link.id === 'vision_link' && currentView === 'vision') ? 'text-white' : 'text-white/30'}`}
              >
                {link.name}
              </motion.a>
            ))}
            <motion.a 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              href={CALENDLY_URL} 
              target="_blank"
              className="bg-white text-black text-center py-6 px-16 rounded-full font-black text-xl shadow-2xl mt-4"
            >
              Book Chat
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero: React.FC<{ onOpenExplainer: () => void }> = ({ onOpenExplainer }) => {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="relative min-h-screen flex items-center pt-20 px-6 overflow-hidden">
      <HeroParticles />
      <div className="max-w-7xl mx-auto z-10 w-full">
        <motion.div 
          style={{ opacity, transform: 'translateZ(0)' }}
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block border border-white/20 rounded-full px-4 py-1.5 text-[10px] font-semibold tracking-widest uppercase mb-8 text-white/60 bg-black/50 backdrop-blur-sm">
            Invisibility Insurance for Early-Stage Investors
          </span>
          
          <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black leading-[0.95] mb-10 tracking-tighter uppercase max-w-4xl">
            <RevealText>Network Equity</RevealText>
            <RevealText className="text-white/30 italic font-serif py-2">is the Only Moat.</RevealText>
          </h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-2xl text-white/50 max-w-2xl leading-relaxed mb-12"
          >
            15 minutes a week. One unfair advantage. Turning silent VCs into industry voices that attract high-quality inbound deal flow while you sleep.
          </motion.p>
          
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
            <Magnetic>
              <a 
                href={CALENDLY_URL}
                target="_blank"
                className="bg-white text-black px-10 py-5 rounded-full font-bold text-lg flex items-center justify-center group"
              >
                Secure The Voice <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            </Magnetic>
            <Magnetic>
              <button onClick={onOpenExplainer} className="border border-white/20 hover:border-white/40 backdrop-blur-sm px-10 py-5 rounded-full font-bold text-lg flex items-center justify-center gap-2 transition-colors">
                <Play size={18} fill="white" /> Watch The Vision
              </button>
            </Magnetic>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Thesis: React.FC = () => {
  const points = [
    { title: "Money is no longer a secret", desc: "In the early-stage world, every investor has a checkbook. If your only value is money, you are a commodity. The best founders want a partner who gets it." },
    { title: "The First Call Advantage", desc: "Founders don't pick the silent investor for their first call. They pick the one who has been showing up on their feed with smart advice for months." },
    { title: "Stop Hunting for Deals", desc: "Chasing founders is slow. When you build a strong voice, founders come to you. You stop hunting and start choosing. Your profile becomes a magnet." },
    { title: "Invisibility is a Risk", desc: "If a founder has to ask Who is this? when you email them, you have already lost. Visibility ensures that hot startups already respect your name." },
    { title: "Your Ideas are the Asset", desc: "We take 15 minutes of your raw thoughts and turn them into Thought Leadership. You focus on the deals; we make sure the world knows you are the expert." },
    { title: "One Deal Pays for Everything", desc: "If your LinkedIn presence brings you just one unicorn deal that you would have missed, this service has paid for itself for the next decade." }
  ];

  return (
    <section id="thesis" className="relative py-32 px-6 border-t border-white/5 z-10 scroll-mt-32">
      <div className="max-w-7xl mx-auto">
        <RevealText>
          <h2 className="text-3xl sm:text-5xl md:text-7xl font-black mb-16 tracking-tighter uppercase">The Thesis</h2>
        </RevealText>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {points.map((p, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.05 }}
              style={{ transform: 'translateZ(0)' }}
            >
              <GlowCard className="p-8 h-full">
                <span className="text-5xl font-serif italic text-white/5 mb-6 block">0{i + 1}</span>
                <h4 className="text-xl font-bold mb-4">{p.title}</h4>
                <p className="text-white/40 leading-relaxed text-sm">{p.desc}</p>
              </GlowCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ValueProp: React.FC = () => {
  return (
    <section id="vision" className="relative py-32 px-6 bg-white/[0.01] z-10 scroll-mt-32 overflow-hidden">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 md:gap-20 items-center">
        <div>
          <RevealText>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 md:mb-8 tracking-tighter uppercase leading-tight">Capital Is Everywhere.</h2>
          </RevealText>
          <RevealText>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-8 tracking-tighter uppercase text-white/40 italic leading-tight">Access Is Not.</h2>
          </RevealText>
          <div className="space-y-6">
            <p className="text-lg md:text-xl text-white/70 leading-relaxed font-medium">
              Founders don’t choose investors when they raise. They choose them months earlier subconsciously. From who they see. From who they recognize. From who they trust.
            </p>
            <p className="text-lg md:text-xl text-white/50 leading-relaxed">
              If your name isn’t already in their feed before the round, you’re not early. You’re late. We fix that.
            </p>
          </div>
        </div>
        
        <div className="relative">
          <GlowCard className="p-8 md:p-12 h-full flex flex-col justify-center backdrop-blur-sm">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-6">Our Vision</h4>
            <p className="text-2xl sm:text-3xl md:text-4xl font-light italic leading-snug mb-10 relative z-10">
              End the Hidden Genius Era. We want to live in a world where a founder doesn't meet you for the first time on a Zoom call. They have already read your thoughts for months.
            </p>
            <div className="flex items-center space-x-4 relative z-10 border-t border-white/10 pt-8 mt-auto">
              <div className="w-12 h-12 rounded-full bg-white/10 overflow-hidden ring-1 ring-white/20 shrink-0">
                 <img src="https://picsum.photos/seed/gp/100/100" alt="GP" className="w-full h-full object-cover" />
              </div>
              <div className="overflow-hidden">
                <p className="font-bold truncate">The Silent GP</p>
                <p className="text-sm text-white/40 truncate">Managing $50M+</p>
              </div>
            </div>
          </GlowCard>
        </div>
      </div>
    </section>
  );
};

const Method: React.FC = () => {
  return (
    <section id="method" className="relative py-32 px-6 bg-white text-black rounded-[2rem] md:rounded-[4rem] mx-4 md:mx-6 my-20 z-10 scroll-mt-32">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 md:mb-20">
          <RevealText>
            <h2 className="text-3xl sm:text-5xl md:text-8xl font-black mb-6 tracking-tighter uppercase leading-tight">The Deep Download</h2>
          </RevealText>
          <p className="text-lg md:text-2xl text-black/60 max-w-2xl mx-auto font-medium">15 minutes of raw thought. One competitive advantage.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 mb-20">
          {[
            { icon: <Mic2 size={32} />, title: "Raw Input", desc: "You give us 15 minutes of audio a week. No scripts. No prep. Just raw thoughts while you are between meetings." },
            { icon: <Cpu size={32} />, title: "High-IQ Output", desc: "We extract the Signal. We turn your raw intuition into sharp market narratives and visual frameworks." },
            { icon: <RefreshCcw size={32} />, title: "Compounding", desc: "We handle the execution. Your visibility compounds while you stay focused on the deal flow." }
          ].map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg">
                {step.icon}
              </div>
              <h3 className="text-xl sm:text-2xl font-black mb-4 uppercase tracking-tight">{step.title}</h3>
              <p className="text-black/60 leading-relaxed font-medium px-4 text-sm sm:text-base">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto bg-black/5 p-8 md:p-12 rounded-[2rem] border border-black/5">
          <h3 className="text-xl font-black mb-8 text-center uppercase tracking-tight">The Mechanism Loop</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {['Thinking', 'Recognition', 'Trust', 'Inbound', 'Moat'].map((item, i) => (
              <div key={i} className="bg-white text-black px-4 sm:px-6 py-3 sm:py-4 rounded-xl font-bold text-[10px] sm:text-xs uppercase tracking-widest border border-black/5 shadow-sm">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Pricing: React.FC = () => {
  const tiers: PriceTier[] = [
    {
      name: "The Specialist",
      price: "1,800 USDT/mo",
      focus: "Presence Stabilization",
      features: [
        "3 posts per week",
        "Strategic Daily Engagement",
        "Clean Positioning Audit",
        "Zero visibility leaks"
      ]
    },
    {
      name: "The Authority",
      price: "3,200 USDT/mo",
      recommended: true,
      focus: "The Go-To Voice",
      features: [
        "5 posts per week",
        "1hr+ Strategic Daily Engagement",
        "High-IQ interaction strategy",
        "Priority Inbound Triage"
      ]
    },
    {
      name: "The Partner",
      price: "5,600 USDT/mo",
      focus: "Deal Flow Dominance",
      features: [
        "Daily strategic posts",
        "Full DM & Inbox Management",
        "Organizing your inbound flow",
        "Premium Visual Assets"
      ]
    }
  ];

  return (
    <section id="tiers" className="relative py-32 px-6 z-10 scroll-mt-32">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 text-center md:text-left">
          <div>
            <RevealText>
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-black mb-4 tracking-tighter uppercase">Investment Tiers</h2>
            </RevealText>
            <p className="text-white/50 text-lg sm:text-xl">3-6 month retainers. High-IQ market positioning.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="h-full"
              style={{ transform: 'translateZ(0)' }}
            >
              <GlowCard overflow className={`h-full p-8 md:p-10 flex flex-col ${tier.recommended ? 'ring-2 ring-white/10' : ''}`}>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-40">{tier.name}</h3>
                <div className="text-2xl sm:text-3xl md:text-4xl font-black mb-6 tracking-tighter">{tier.price}</div>
                <p className="text-white/40 italic mb-10 text-[9px] sm:text-xs font-bold uppercase tracking-widest bg-white/5 inline-block py-1 px-3 rounded-md self-start">{tier.focus}</p>
                
                <div className="flex-grow space-y-5 mb-12 border-t border-white/5 pt-10">
                  {tier.features.map((f, j) => (
                    <div key={j} className="flex items-start space-x-4">
                      <CheckCircle2 size={16} className="text-white/60 mt-0.5 shrink-0" />
                      <span className="text-white/70 text-sm font-medium leading-tight">{f}</span>
                    </div>
                  ))}
                </div>
                
                <Magnetic className="w-full">
                  <a 
                    href={CALENDLY_URL}
                    target="_blank"
                    className={`block w-full py-5 rounded-2xl font-black text-center text-xs sm:text-sm uppercase tracking-widest transition-all ${tier.recommended ? 'bg-white text-black hover:bg-white/90 shadow-lg' : 'bg-transparent border border-white/20 hover:border-white'}`}
                  >
                    Select Plan
                  </a>
                </Magnetic>
              </GlowCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TargetMarket: React.FC = () => {
  return (
    <section className="relative py-32 px-6 z-10 scroll-mt-32">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-20 text-center">Engineered for Specific Success</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { 
              title: "The Silent GP", 
              desc: "Managing $50M+ with a strong private reputation - but little public presence. You need visibility to win the hottest deals.",
              badge: "REPUTATION"
            },
            { 
              title: "The Angel Operator", 
              desc: "A successful founder now investing - looking to attract the next generation of top operators naturally.",
              badge: "GRAVITY"
            },
            { 
              title: "The Global Investor", 
              desc: "Based anywhere, deploying into specific high-growth markets. You need to look present and plugged in.",
              badge: "GLOBAL"
            }
          ].map((target, i) => (
            <div key={i}>
              <GlowCard className="p-10 h-full">
                <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-30 mb-8 block">{target.badge}</span>
                <h4 className="text-xl sm:text-2xl font-bold mb-5 tracking-tight">{target.title}</h4>
                <p className="text-white/40 leading-relaxed font-medium text-sm">{target.desc}</p>
              </GlowCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer: React.FC<{ onOpenPrivacy: () => void }> = ({ onOpenPrivacy }) => {
  return (
    <footer id="cta" className="relative py-32 px-6 bg-white text-black z-10 scroll-mt-32">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        <RevealText>
          <h2 className="text-5xl sm:text-6xl md:text-9xl font-black tracking-tighter mb-12 uppercase leading-none">SNIXX</h2>
        </RevealText>
        <p className="text-xl sm:text-2xl md:text-5xl font-light max-w-4xl mb-20 leading-[1.1] tracking-tight">
          The smartest fund doesn't always win the deal. <br />
          <span className="font-bold underline decoration-1 underline-offset-8">The most trusted name</span> at the right moment does.
        </p>
        <div className="w-full max-w-md">
          <Magnetic className="w-full">
            <motion.a 
              whileTap={{ scale: 0.98 }} 
              href={CALENDLY_URL} 
              target="_blank"
              className="w-full bg-black text-white py-6 sm:py-8 rounded-3xl font-black text-lg sm:text-xl shadow-2xl flex items-center justify-center gap-3 uppercase tracking-widest"
            >
              Start The Deep Download
            </motion.a>
          </Magnetic>
        </div>
        <div className="mt-40 pt-16 border-t border-black/10 w-full flex flex-col md:flex-row justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-black/40">
          <p className="text-center md:text-left mb-6 md:mb-0">© 2024 Snixx Protocol - All Rights Reserved</p>
          <div className="flex space-x-8 sm:space-x-12">
            <a href={LINKEDIN_URL} target="_blank" className="hover:text-black transition-colors flex items-center gap-2">
              <Linkedin size={14} /> LinkedIn
            </a>
            <button onClick={() => onOpenPrivacy()} className="hover:text-black transition-colors uppercase">Privacy Protocol</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Utility Functions ---

/**
 * Utility for smooth scrolling to sections.
 */
const scrollToSection = (id: string) => {
  const el = document.getElementById(id);
  if (el) {
    const offset = 80;
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = el.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

export default function App() {
  const [view, setView] = useState<'home' | 'vision'>('home');
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  // Handle scroll to for anchors
  const handleScrollTo = (id: string) => {
    scrollToSection(id);
  };

  return (
    <div className="relative bg-black text-white min-h-screen selection:bg-white selection:text-black antialiased">
      <AnimatedBackground />
      <Navbar 
        onOpenPrivacy={() => setIsPrivacyOpen(true)} 
        onViewChange={setView} 
        currentView={view} 
        onScrollTo={handleScrollTo}
      />
      
      <AnimatePresence mode="wait">
        {view === 'home' ? (
          <motion.div 
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <main>
              <Hero onOpenExplainer={() => setView('vision')} />
              <Thesis />
              <ValueProp />
              <Method />
              <TargetMarket />
              <Pricing />
              
              <section className="relative py-32 px-6 z-10 scroll-mt-32">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="max-w-5xl mx-auto bg-gradient-to-br from-[#111] to-[#000] border border-white/10 p-8 sm:p-12 md:p-24 rounded-[2rem] sm:rounded-[3rem] text-center relative overflow-hidden"
                >
                  <div className="mb-12 inline-flex items-center space-x-3 bg-white/5 px-4 sm:px-6 py-2 rounded-full border border-white/10">
                    <Zap size={14} className="text-white" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Zero-Risk Accelerator</span>
                  </div>
                  <h3 className="text-3xl sm:text-4xl md:text-7xl font-black mb-12 leading-[0.9] tracking-tighter uppercase">
                    Try for 90 Days. <br />
                    <span className="text-white/30 italic font-serif lowercase">or we work for free.</span>
                  </h3>
                  <p className="text-white/50 text-base sm:text-xl md:text-2xl leading-relaxed mb-16 max-w-3xl mx-auto font-medium">
                    If by Day 90 you haven't seen a significant jump in profile views from founders or received a high-quality inbound deck, we work for the next month for free.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
                    <div className="flex items-center space-x-4 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
                      <CheckCircle2 size={16} />
                      <span>15 mins/week call</span>
                    </div>
                    <div className="flex items-center space-x-4 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
                      <CheckCircle2 size={16} />
                      <span>2 high-signal posts/week</span>
                    </div>
                  </div>
                </motion.div>
              </section>
            </main>
            <Footer onOpenPrivacy={() => setIsPrivacyOpen(true)} />
          </motion.div>
        ) : (
          <VisionHub key="vision" onBack={() => setView('home')} />
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {isPrivacyOpen && (
          <PrivacyPortal 
            isOpen={isPrivacyOpen} 
            onClose={() => setIsPrivacyOpen(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
