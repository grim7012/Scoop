
"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { flavors } from "@/lib/flavors";

const FEATURES = [
  { 
    img: "https://images.unsplash.com/photo-1488900128323-21503983a07e?w=80&h=80&fit=crop",
    title: "50+ Artisanal Flavors", 
    desc: "Curated from the world's finest frozen dessert traditions.", 
    metric: "85% Unique Recipes" 
  },
  { 
    img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=80&h=80&fit=crop",
    title: "Dietary Aware", 
    desc: "Vegan, gluten-free, nut-free — your preferences, always respected.", 
    metric: "12 Dietary Tags" 
  },
  { 
    img: "https://images.unsplash.com/photo-1514361892635-6b07e31e75f9?w=80&h=80&fit=crop",
    title: "Expert Pairings", 
    desc: "Beverages, toppings, desserts — chosen for harmony, not conflict.", 
    metric: "200+ Pairings" 
  },
  { 
    img: "https://images.unsplash.com/photo-1676299081847-824916de030a?w=80&h=80&fit=crop",
    title: "AI Sommelier", 
    desc: "Warm, human guidance. No jargon, just sensory storytelling.", 
    metric: "24/7 Guidance" 
  },
];

const PHILOSOPHY_IMAGES = [
  "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=600",
  "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=600",
  "https://images.unsplash.com/photo-1514517521153-1be72277b32f?w=400&h=600"
];

const SHOWCASE_FLAVORS = ["v7-lavender-honeycomb", "v24-pistachio-rose", "v40-raspberry-rose-champagne", "v8-ube-coconut", "v11-mango-chili-lime"];

export default function PremiumLanding() {
  const [scrolled, setScrolled] = useState(false);
  const [hoveredFlavor, setHoveredFlavor] = useState<string | null>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const showcase = flavors.filter(f => SHOWCASE_FLAVORS.includes(f.id));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Video reverse animation effect
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoLoaded) return;

    let animationFrameId: number;
    let startTime: number;
    let direction = 1; // 1 = forward, -1 = reverse
    const duration = 5000; // 5 seconds total cycle (2.5s forward, 2.5s reverse)
    const halfDuration = duration / 2;

    const playReverseSegment = () => {
      let segmentStartTime = performance.now();
      
      const animate = (currentTime: number) => {
        const elapsed = currentTime - segmentStartTime;
        let progress = Math.min(elapsed / halfDuration, 1);
        
        if (direction === 1) {
          // Play forward
          video.currentTime = video.duration * progress;
        } else {
          // Play reverse
          video.currentTime = video.duration * (1 - progress);
        }
        
        if (progress < 1) {
          animationFrameId = requestAnimationFrame(animate);
        } else {
          // Switch direction
          direction *= -1;
          segmentStartTime = performance.now();
          animationFrameId = requestAnimationFrame(animate);
        }
      };
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    // Wait for video to be ready
    const handleCanPlay = () => {
      video.currentTime = 0;
      playReverseSegment();
    };
    
    video.addEventListener('canplay', handleCanPlay);
    video.play();
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [videoLoaded]);

  return (
    <div className="min-h-screen selection:bg-[#F7E7CE] selection:text-black" style={{ background: "#050505", color: "#fff" }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap');
        
        :root {
          --gold: #F7E7CE;
          --glass: rgba(255, 255, 255, 0.03);
          --border: rgba(255, 255, 255, 0.08);
        }

        body {
          font-family: 'Inter', sans-serif;
          -webkit-font-smoothing: antialiased;
          background: #050505;
        }

        .serif-swirl {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
        }

        .premium-glass {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .gold-gradient {
          background: linear-gradient(135deg, #F7E7CE 0%, #B8860B 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }

        .float-animation {
          animation: float 4s ease-in-out infinite;
        }

        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }

        .shimmer-text {
          background: linear-gradient(90deg, #F7E7CE 0%, #B8860B 50%, #F7E7CE 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .video-fade-in {
          animation: fadeIn 1s ease-out;
        }

        @media (max-width: 768px) {
          .bento-grid {
            gap: 0.75rem !important;
          }
          .bento-card {
            padding: 1rem !important;
          }
        }
      `}</style>

      {/* ── NAVIGATION ─────────────────────────────────────────────── */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'py-3 bg-black/60 backdrop-blur-xl border-b border-white/5' : 'py-6'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <motion.span 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="text-xl text-[#F7E7CE]"
            >
              ✧
            </motion.span>
            <span className="serif-swirl text-xl tracking-widest uppercase font-light">Scoop</span>
          </div>
          <div className="flex items-center gap-4 sm:gap-6 md:gap-8">
            <div className="hidden md:flex gap-6 text-[10px] uppercase tracking-[0.2em] text-white/50">
              <a href="#cellar" className="hover:text-[#F7E7CE] transition-colors">The Cellar</a>
              <a href="#features" className="hover:text-[#F7E7CE] transition-colors">Features</a>
              <a href="#philosophy" className="hover:text-[#F7E7CE] transition-colors">Philosophy</a>
            </div>
            <Link href="/chat">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 sm:px-6 py-2 rounded-full bg-[#F7E7CE] text-black text-[11px] font-semibold tracking-widest uppercase transition-all hover:shadow-[0_0_20px_rgba(247,231,206,0.2)]"
              >
                Enter the Cellar
              </motion.button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO SECTION ───────────────────────────────────────────── */}
      <section className="relative pt-28 sm:pt-32 pb-12 sm:pb-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="serif-swirl text-4xl sm:text-5xl md:text-7xl font-extralight mb-4 sm:mb-6 leading-[1.15]"
          >
            The Art of the <span className="gold-gradient shimmer-text">Lingering</span> Finish.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/50 text-sm sm:text-base max-w-2xl mx-auto font-light px-4"
          >
            Discover flavors curated for your mood, your meal, and your moment — guided by an AI Sommelier who speaks in taste.
          </motion.p>
        </div>

        {/* ── BENTO GRID ─────────────────────────── */}
        <div className="max-w-6xl mx-auto mt-8 sm:mt-12 grid grid-cols-12 gap-2 sm:gap-3 auto-rows-[160px] sm:auto-rows-[180px] md:auto-rows-[160px] px-4 sm:px-0">
          
          {/* Main Cinematic Visual - VIDEO with reverse animation */}
          <motion.div 
            whileHover={{ scale: 0.99 }}
            className="col-span-12 md:col-span-7 row-span-2 premium-glass rounded-2xl overflow-hidden relative group"
          >
            <img src="/222120.gif" alt="Cinematic Visual" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-4 sm:p-6 flex flex-col justify-end">
              <motion.h3 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="serif-swirl text-lg sm:text-xl mb-1"
              >
                Atmospheric Pairings
              </motion.h3>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-white/50 text-xs max-w-xs"
              >
                Beyond flavor: we curate the temperature, the vessel, and the vintage accompaniment.
              </motion.p>
            </div>
            <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-black/40 backdrop-blur-sm rounded-full px-2 py-0.5 text-[8px] text-[#F7E7CE]">
              Live Tasting
            </div>
          </motion.div>

          {/* Sommelier Quote Card - with large commas and inline layout */}
          <motion.div 
            whileHover={{ y: -2 }}
            className="col-span-12 md:col-span-5 row-span-1 premium-glass rounded-2xl p-4 sm:p-6 flex items-center gap-2 sm:gap-4"
          >
            <span className="text-[#F7E7CE] text-5xl sm:text-7xl md:text-8xl font-serif leading-none mb-0">“</span>
            <div className="flex-1">
              <p className="serif-swirl text-base sm:text-xl leading-relaxed italic text-white/80">
                A dessert without a story is merely calories. We prefer poetry.
              </p>
              <p className="text-white/30 text-[8px] sm:text-[10px] mt-2">— AI Sommelier, v2.0</p>
            </div>
            <span className="text-[#F7E7CE] text-5xl sm:text-7xl md:text-8xl font-serif leading-none mt-auto self-end">”</span>
          </motion.div>

          {/* Real-time Status Card */}
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="col-span-6 md:col-span-2 row-span-1 premium-glass rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-center text-center"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#F7E7CE] animate-pulse mb-2 shadow-[0_0_6px_#F7E7CE]" />
            <span className="text-[12px] sm:text-[15px] tracking-widest uppercase text-white/40">The Cellar is</span>
            <span className="text-[14px] sm:text-[18px] text-[#F7E7CE] font-medium mt-0.5">Chilled & Ready</span>
            <span className="text-[10px] sm:text-[12px] text-white/30 mt-1">12°C • 68% Humidity</span>
          </motion.div>

          {/* Interaction Card */}
          <Link href="/chat" className="col-span-6 md:col-span-3 row-span-1 bg-gradient-to-br from-[#F7E7CE] to-[#B8860B] rounded-2xl p-4 sm:p-5 group overflow-hidden relative">
            <motion.div 
              whileHover={{ x: 3 }}
              className="relative z-10 h-full flex flex-col justify-between"
            >
              <motion.span 
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-black text-4xl sm:text-5xl"
              >
                <img src="/img.png" alt="Ice Cream Icon" className="w-14 h-14 sm:w-20 sm:h-20" />
              </motion.span>
              <div>
                <span className="text-black font-semibold text-[14px] sm:text-[18px] uppercase tracking-tighter group-hover:translate-x-1 transition-transform block">
                  Start the Session →
                </span>
                <span className="text-black/50 text-[7px] sm:text-[8px] mt-1 block">AI-powered tasting guide</span>
              </div>
            </motion.div>
            <div className="absolute -right-3 -bottom-3 text-6xl opacity-10 text-black">🍦</div>
          </Link>

          {/* Flavor Showcase Card */}
          <div className="col-span-12 md:col-span-4 row-span-1 premium-glass rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-[8px] sm:text-[9px] tracking-[0.2em] text-white/30 uppercase">Signature Note</span>
              <span className="serif-swirl text-[#F7E7CE] text-[10px] sm:text-[11px]">V.11</span>
            </div>
            <div className="mt-2">
              <h4 className="serif-swirl text-base sm:text-lg">Miso Butterscotch</h4>
              <p className="text-white/40 text-[8px] sm:text-[9px] uppercase tracking-widest mt-1">Umami • Velvety • Deep</p>
              <div className="mt-2 flex gap-1.5">
                {['🔥 94%', '🎯 Perfect'].map((badge, i) => (
                  <span key={i} className="text-[6px] sm:text-[7px] bg-white/5 px-2 py-0.5 rounded-full text-white/50">{badge}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Data Analysis Bento */}
          <div className="col-span-12 md:col-span-8 row-span-1 premium-glass rounded-2xl p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 items-center">
            <div className="space-y-1">
              <span className="text-[8px] sm:text-[9px] text-white/30 uppercase tracking-[.2em]">Terroir Range</span>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: "85%" }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="h-full bg-[#F7E7CE]" 
                />
              </div>
              <span className="text-[6px] sm:text-[7px] text-white/40">Global sourcing • 12 regions</span>
            </div>
            <div className="space-y-1">
              <span className="text-[8px] sm:text-[9px] text-white/30 uppercase tracking-[.2em]">Acidity Balance</span>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: "62%" }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="h-full bg-[#F7E7CE]" 
                />
              </div>
              <span className="text-[6px] sm:text-[7px] text-white/40">Optimized for palate</span>
            </div>
            <div className="space-y-1">
              <span className="text-[8px] sm:text-[9px] text-white/30 uppercase tracking-[.2em]">Finish Length</span>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: "94%" }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="h-full bg-[#F7E7CE]" 
                />
              </div>
              <span className="text-[6px] sm:text-[7px] text-white/40">Extended • 45+ seconds</span>
            </div>
          </div>

        </div>

        </section>

      {/* ── PHILOSOPHY SECTION ─────────────────────────────────────────── */}
<section id="philosophy" className="py-16 sm:py-20 px-4 sm:px-6 bg-gradient-to-b from-transparent via-white/[0.01] to-transparent">
  <div className="max-w-6xl mx-auto">
    
    {/* Heading */}
    <div className="text-center mb-10 sm:mb-14">
      <motion.p 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="text-[#F7E7CE] text-[9px] sm:text-[10px] tracking-[0.4em] uppercase mb-3"
      >
        Our Philosophy
      </motion.p>

      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="serif-swirl text-3xl sm:text-4xl md:text-5xl font-light text-white"
      >
        Taste with intention,
        <br />
        <span className="gold-gradient">savor with presence</span>
      </motion.h2>
    </div>

    {/* Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
      
      {/* Card 1 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        whileHover={{ y: -6 }}
        className="premium-glass rounded-2xl overflow-hidden group"
      >
        <div className="overflow-hidden">
          <img 
            src={PHILOSOPHY_IMAGES[0]} 
            alt="Intentional Curation"
            className="w-full h-44 sm:h-52 object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="p-5 sm:p-6 text-center">
          <h3 className="serif-swirl text-base sm:text-lg text-white mb-2">
            Intentional Curation
          </h3>
          <p className="text-white/40 text-xs leading-relaxed">
            Every flavor tells a story. We source ingredients that honor tradition while embracing innovation.
          </p>
        </div>
      </motion.div>

      {/* Card 2 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        whileHover={{ y: -6 }}
        className="premium-glass rounded-2xl overflow-hidden group"
      >
        <div className="overflow-hidden">
          <img 
            src={PHILOSOPHY_IMAGES[1]} 
            alt="Conscious Creation"
            className="w-full h-44 sm:h-52 object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="p-5 sm:p-6 text-center">
          <h3 className="serif-swirl text-base sm:text-lg text-white mb-2">
            Conscious Creation
          </h3>
          <p className="text-white/40 text-xs leading-relaxed">
            Respect for ingredients, respect for dietary needs, respect for the moment you choose to indulge.
          </p>
        </div>
      </motion.div>

      {/* Card 3 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        whileHover={{ y: -6 }}
        className="premium-glass rounded-2xl overflow-hidden group"
      >
        <div className="overflow-hidden">
          <img 
            src={PHILOSOPHY_IMAGES[2]} 
            alt="Sensory Storytelling"
            className="w-full h-44 sm:h-52 object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="p-5 sm:p-6 text-center">
          <h3 className="serif-swirl text-base sm:text-lg text-white mb-2">
            Sensory Storytelling
          </h3>
          <p className="text-white/40 text-xs leading-relaxed">
            Beyond taste—texture, temperature, and memory. We guide you to flavors that resonate.
          </p>
        </div>
      </motion.div>

    </div>

    {/* Quote */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mt-10 sm:mt-14 text-center"
    >
      <div className="inline-block premium-glass rounded-2xl p-6 sm:p-8 max-w-2xl">
        <span className="text-[#F7E7CE] text-5xl sm:text-7xl md:text-8xl font-serif leading-none">
          “
        </span>

        <p className="serif-swirl text-sm sm:text-base italic text-white/70 leading-relaxed">
          We believe the best dessert isn't just eaten—it's experienced. A moment of connection, 
          a story worth savoring, a finish that lingers in memory.
        </p>

        <p className="text-white/30 text-[9px] sm:text-[10px] mt-4 tracking-wider">
          — The Scoop Philosophy
        </p>
      </div>
    </motion.div>

  </div>
</section>
      {/* ── FEATURES SECTION ─────────────────────────────────────────── */}
      <section id="features" className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-[#F7E7CE] text-[9px] sm:text-[10px] tracking-[0.4em] uppercase mb-3"
            >
              Why Scoop
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="serif-swirl text-3xl sm:text-4xl md:text-5xl font-light text-white"
            >
              Thoughtfully crafted,
              <br />
              <span className="gold-gradient">deeply delicious</span>
            </motion.h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="premium-glass rounded-2xl p-5 sm:p-6 transition-all duration-300"
              >
                <img 
                  src={feature.img} 
                  alt={feature.title}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl object-cover mb-3"
                />
                <h3 className="serif-swirl text-base sm:text-lg text-white mb-2">{feature.title}</h3>
                <p className="text-white/40 text-xs leading-relaxed mb-3">{feature.desc}</p>
                <div className="border-t border-white/5 pt-3 mt-1">
                  <span className="text-[#F7E7CE] text-[9px] sm:text-[10px] tracking-wider">{feature.metric}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FLAVOR GALLERY ─────────────────────────────────────────── */}
      <section id="cellar" className="py-16 sm:py-20 px-4 sm:px-6 bg-gradient-to-b from-transparent via-white/[0.01] to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <p className="text-[#F7E7CE] text-[9px] sm:text-[10px] tracking-[0.4em] uppercase mb-3">The Cellar</p>
            <h2 className="serif-swirl text-3xl sm:text-4xl font-light">A taste of what awaits</h2>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {flavors.slice(13, 24).map((flavor, i) => (
              <motion.div
                key={flavor.id}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -3 }}
                className="premium-glass rounded-xl overflow-hidden cursor-pointer group"
              >
                <div 
                  className="h-20 sm:h-24 flex items-center justify-center text-3xl sm:text-4xl transition-transform group-hover:scale-110 duration-500"
                  style={{ background: `linear-gradient(135deg, ${flavor.hex_color}30, ${flavor.hex_color}10)` }}
                >
                  <img src={flavor.image_url} alt={flavor.flavor_name} className="w-full h-full object-cover" />
                </div>
                <div className="p-3 sm:p-4">
                  <h3 className="serif-swirl text-sm sm:text-base mb-0.5">{flavor.flavor_name}</h3>
                  <p className="text-white/40 text-[8px] sm:text-[10px] uppercase tracking-wider">{flavor.mood_tag}</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-8 sm:mt-10">
            <Link href="/chat">
              <motion.button
                whileHover={{ scale: 1.01 }}
                className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-[#F7E7CE] text-black text-[11px] sm:text-xs font-semibold tracking-widest uppercase transition-all hover:shadow-[0_0_30px_rgba(247,231,206,0.2)]"
              >
                Discover All 50+ Flavors →
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer className="py-8 sm:py-12 border-t border-white/5 bg-black/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-8">
          <div className="text-center sm:text-left">
            <motion.p 
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="serif-swirl text-xl sm:text-2xl mb-2 text-[#F7E7CE]"
            >
              Hungry for a story?
            </motion.p>
            <p className="text-white/30 text-[10px] sm:text-xs font-light tracking-wide">
              Handcrafted in the digital cellar using Gemini 1.5 Flash technology.
            </p>
          </div>
          <div className="flex gap-6 sm:gap-8 text-[8px] sm:text-[9px] uppercase tracking-[0.3em] text-white/40">
            {['Instagram', 'Cellar Logs', 'Privacy'].map((item) => (
              <motion.span 
                key={item}
                whileHover={{ color: '#F7E7CE' }}
                className="cursor-pointer transition-colors"
              >
                {item}
              </motion.span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}