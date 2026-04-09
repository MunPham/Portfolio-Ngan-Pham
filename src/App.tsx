/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { Menu, X, ArrowUpRight, ArrowDown } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "motion/react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import ProjectDetail from "./ProjectDetail";

const Magnetic = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current?.getBoundingClientRect() || { left: 0, top: 0, width: 0, height: 0 };
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    setPosition({ x: x * 0.4, y: y * 0.4 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const { x, y } = position;

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x, y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
    >
      {children}
    </motion.div>
  );
};

const ProjectBox = ({ src, title, className, index, onHover }: { src: string, title: string, className?: string, index: number, onHover: (hovering: boolean) => void, key?: React.Key }) => {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  return (
    <motion.div 
      ref={containerRef}
      onHoverStart={() => { setIsHovered(true); onHover(true); }}
      onHoverEnd={() => { setIsHovered(false); onHover(false); }}
      onClick={() => navigate(`/project/${index % 5}`)}
      className={`bg-white/5 overflow-hidden relative group shrink-0 h-[65vh] md:h-[75vh] cursor-pointer ${className}`}
    >
      <motion.div
        animate={{ 
          scale: isHovered ? 1.15 : 1,
          filter: isHovered ? "contrast(1.1) brightness(1.1)" : "contrast(1) brightness(1)",
        }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="w-full h-full relative"
      >
        <motion.img 
          src={src} 
          alt={title} 
          className="w-full h-full object-cover" 
        />
        
        {/* Partial blur bar that rises from bottom */}
        <motion.div 
          initial={{ y: "100%" }}
          animate={{ y: isHovered ? "0%" : "100%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="absolute bottom-0 left-0 right-0 h-1/3 bg-white/10 backdrop-blur-xl border-t border-white/10"
        />
      </motion.div>

      <div className="absolute bottom-0 right-0 p-8 md:p-12 pointer-events-none z-10 w-full flex flex-col items-end">
        <div className="flex flex-col gap-4 items-end">
          <div className="flex items-center gap-4 flex-row-reverse">
            <motion.div 
              animate={{ width: isHovered ? 64 : 24, backgroundColor: isHovered ? "#fff" : "rgba(255,255,255,0.6)" }}
              className="h-px" 
            />
            <span className="text-[8px] tracking-[0.6em] text-white/60 uppercase">Project {index + 1}</span>
          </div>
          <motion.h3 
            animate={{ 
              y: isHovered ? 0 : 10,
              opacity: isHovered ? 1 : 0.6
            }}
            className="text-xl md:text-5xl font-medium text-white tracking-tight leading-none text-right" 
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            {title}
          </motion.h3>
        </div>
      </div>
    </motion.div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/project/:id" element={<ProjectDetail />} />
      </Routes>
    </Router>
  );
}

function Home() {
  const [activeTab, setActiveTab] = useState("About");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHoveringProject, setIsHoveringProject] = useState(false);
  
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  useEffect(() => {
    if (isAutoScrolling) {
      autoScrollIntervalRef.current = setInterval(() => {
        if (scrollContainerRef.current && !isDraggingRef.current) {
          const { scrollLeft, scrollWidth } = scrollContainerRef.current;
          if (scrollLeft >= scrollWidth / 2) {
            scrollContainerRef.current.scrollLeft = 0;
          } else {
            scrollContainerRef.current.scrollLeft += 1;
          }
        }
      }, 20);
    } else {
      if (autoScrollIntervalRef.current) clearInterval(autoScrollIntervalRef.current);
    }
    return () => {
      if (autoScrollIntervalRef.current) clearInterval(autoScrollIntervalRef.current);
    };
  }, [isAutoScrolling]);

  const pauseAutoScroll = () => {
    setIsAutoScrolling(false);
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      setIsAutoScrolling(true);
    }, 3000);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    startXRef.current = e.pageX - (scrollContainerRef.current?.offsetLeft || 0);
    scrollLeftRef.current = scrollContainerRef.current?.scrollLeft || 0;
    pauseAutoScroll();
  };

  const handleMouseMoveDrag = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - (scrollContainerRef.current.offsetLeft || 0);
    const walk = (x - startXRef.current) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleScrollUpdate = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth } = scrollContainerRef.current;
      const totalProjects = 5; // Based on the array length
      const scrollPos = scrollLeft % (scrollWidth / 2);
      const index = Math.floor((scrollPos / (scrollWidth / 2)) * totalProjects);
      setCurrentProjectIndex(index);
    }
  };

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    
    const handleScroll = () => {
      const sections = ["about", "projects", "expertise", "contact"];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 300 && rect.bottom >= 300) {
            const label = section === "projects" ? "Projects" : section === "expertise" ? "Expertise" : section.charAt(0).toUpperCase() + section.slice(1);
            setActiveTab(label);
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0a0a0a] text-foreground selection:bg-white/20">
      {/* Global Noise Overlay */}
      <div className="fixed inset-0 opacity-[0.04] pointer-events-none z-[9999] mix-blend-overlay" 
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />

      {/* Progress Bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-white/20 z-[100] origin-left" style={{ scaleX }} />

      {/* Custom Cursor */}
      <motion.div
        animate={{ 
          x: mousePos.x - 12,
          y: mousePos.y - 12,
          scale: isHoveringProject ? 2 : 1,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 400, mass: 0.2 }}
        className="fixed top-0 left-0 w-6 h-6 rounded-full border border-white/40 pointer-events-none z-[100] mix-blend-difference flex items-center justify-center"
      >
        <div className="w-1 h-1 bg-white rounded-full" />
      </motion.div>

      {/* Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/10 backdrop-blur-md border-b border-white/5">
        <nav className="relative mx-auto flex max-w-[1800px] items-center justify-between px-6 py-6 md:px-12">
          <div 
            className="text-2xl tracking-tight text-foreground z-50 cursor-pointer"
            style={{ fontFamily: "'Instrument Serif', serif" }}
            onClick={() => scrollToSection("about")}
          >
            Ngan Pham<sup className="text-[10px]">®</sup>
          </div>

          <div className="hidden items-center gap-12 md:flex">
            {["About", "Projects", "Expertise", "Contact"].map((tab) => (
              <div key={tab}>
                <Magnetic>
                  <button 
                    onClick={() => scrollToSection(tab.toLowerCase())}
                    className={`text-[10px] uppercase tracking-[0.4em] transition-all cursor-pointer relative py-2 ${activeTab === tab ? "text-foreground font-bold" : "text-white/40 hover:text-white"}`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <motion.div layoutId="navUnderline" className="absolute bottom-0 left-0 right-0 h-px bg-white" />
                    )}
                  </button>
                </Magnetic>
              </div>
            ))}
          </div>

          <button 
            className="md:hidden z-50 text-foreground p-2 -mr-2 cursor-pointer"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-black backdrop-blur-xl flex flex-col items-center justify-center gap-12"
          >
            {["About", "Projects", "Expertise", "Contact"].map((tab) => (
              <button 
                key={tab}
                onClick={() => scrollToSection(tab.toLowerCase())}
                className="text-4xl tracking-tighter text-white font-medium"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                {tab}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {/* Section: About (Hero) */}
        <section id="about" className="relative h-screen w-full flex items-center justify-center overflow-hidden">
          <motion.video
            autoPlay loop muted playsInline
            style={{ 
              scale: useTransform(scrollYProgress, [0, 0.2], [1, 1.2])
            }}
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src="/RIMOWA Holiday _ A gift that inspires - (1080p).mp4" type="video/mp4" />
          </motion.video>
          
          <div className="relative z-10 text-center px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: "circOut" }}
            >
              <div className="mt-32 flex flex-col items-center gap-6">
                <div className="h-32 w-px bg-gradient-to-b from-white/60 to-transparent" />
                <button 
                  onClick={() => scrollToSection("projects")} 
                  className="group px-8 py-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-[10px] tracking-[0.5em] uppercase text-white hover:bg-white/10 hover:border-white/20 transition-all duration-500 flex items-center gap-4 font-bold"
                >
                  Scroll to explore 
                  <motion.div
                    animate={{ y: [0, 4, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ArrowDown size={14} className="group-hover:translate-y-1 transition-transform duration-500" />
                  </motion.div>
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Section: Works (Horizontal Scroll) */}
        <section id="projects" className="py-32 bg-[#0a0a0a] relative">
          <div className="px-6 md:px-12 mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <span className="text-[10px] tracking-[0.6em] uppercase text-white/40 mb-4 block">01 / Projects</span>
              <h2 className="text-6xl md:text-9xl font-medium tracking-tighter text-white leading-none" style={{ fontFamily: "'Instrument Serif', serif" }}>
                Design<br/>Lab
              </h2>
            </div>
            <div className="flex flex-col items-start md:items-end gap-8">
              <a 
                href="https://www.behance.net/mun1210" 
                target="_blank" 
                rel="noopener noreferrer"
                className="relative w-32 h-32 flex items-center justify-center group"
              >
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0"
                >
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="none" />
                    <text className="text-[7.5px] uppercase tracking-[0.1em] fill-white font-medium">
                      <textPath xlinkHref="#circlePath">
                        Discover others project on Behance — Discover others project on Behance —
                      </textPath>
                    </text>
                  </svg>
                </motion.div>
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <span className="text-black font-bold text-xs">Bē</span>
                </div>
              </a>
              <p className="text-white/40 text-sm max-w-xs leading-relaxed tracking-wide text-left md:text-right">
                Things I Built.<br/>
                Fueled by coffee.<br/>
                Driven by passion.
              </p>
            </div>
          </div>

          <div 
            ref={scrollContainerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMoveDrag}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={pauseAutoScroll}
            onTouchStart={pauseAutoScroll}
            onScroll={handleScrollUpdate}
            className="mt-24 flex overflow-x-auto no-scrollbar relative cursor-grab active:cursor-grabbing"
          >
            <div className="flex gap-12 px-6 md:px-12 pb-12">
              {[
                { src: "/Generated Image April 08, 2026 - 3_32AM.png", title: "Ethereal Light", width: "w-[85vw] md:w-[50vw]" },
                { src: "/Generated Image April 08, 2026 - 3_33AM.png", title: "Urban Solitude", width: "w-[85vw] md:w-[40vw]" },
                { src: "/Generated Image April 08, 2026 - 3_38AM.png", title: "Midnight Bloom", width: "w-[85vw] md:w-[45vw]" },
                { src: "/Generated Image April 08, 2026 - 3_32AM.png", title: "Golden Hour", width: "w-[85vw] md:w-[55vw]" },
                { src: "/Generated Image April 08, 2026 - 3_34AM.png", title: "Silent Echoes", width: "w-[85vw] md:w-[60vw]" }
              ].map((p, i) => (
                <ProjectBox key={i} index={i} src={p.src} title={p.title} className={p.width} onHover={setIsHoveringProject} />
              ))}
              {/* Duplicate for seamless loop */}
              {[
                { src: "/Generated Image April 08, 2026 - 3_32AM.png", title: "Ethereal Light", width: "w-[85vw] md:w-[50vw]" },
                { src: "/Generated Image April 08, 2026 - 3_33AM.png", title: "Urban Solitude", width: "w-[85vw] md:w-[40vw]" },
                { src: "/Generated Image April 08, 2026 - 3_38AM.png", title: "Midnight Bloom", width: "w-[85vw] md:w-[45vw]" },
                { src: "/Generated Image April 08, 2026 - 3_32AM.png", title: "Golden Hour", width: "w-[85vw] md:w-[55vw]" },
                { src: "/Generated Image April 08, 2026 - 3_34AM.png", title: "Silent Echoes", width: "w-[85vw] md:w-[60vw]" }
              ].map((p, i) => (
                <ProjectBox key={`dup-${i}`} index={i} src={p.src} title={p.title} className={p.width} onHover={setIsHoveringProject} />
              ))}
            </div>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-3 mt-8 pb-24">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                initial={false}
                animate={{ 
                  scale: currentProjectIndex === i ? 1.2 : 1,
                  opacity: currentProjectIndex === i ? 1 : 0.2,
                  width: currentProjectIndex === i ? 24 : 8
                }}
                className="h-2 bg-white rounded-full transition-all duration-300"
              />
            ))}
          </div>
        </section>

        {/* Section: Services (Technical Treatment) */}
        <section id="expertise" className="py-32 bg-[#0a0a0a] border-t border-white/5 relative">
          <div className="px-6 md:px-12 mb-24">
            <span className="text-[10px] tracking-[0.6em] uppercase text-white/40 mb-4 block">03 / Expertise</span>
            <h2 className="text-6xl md:text-9xl font-medium tracking-tighter text-white leading-none" style={{ fontFamily: "'Instrument Serif', serif" }}>
              Creative<br/>& Design
            </h2>
          </div>

          <div className="px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: "Art Direction", desc: "I develop and execute Art Direction for social/digital content, creating distinct visual styles that resonate with target audiences and effectively convey brand messages." },
              { title: "AI-Driven", desc: "Proficiently leveraging AI tools (Midjourney, Gemini, Sora) to innovate concepts, visualize ideas, and optimize design workflows for rapid, novel aesthetics." },
              { title: "Project Management", desc: "Skilled in efficient timeline, resource, and workflow management. I thrive in collaborative team settings, fostering clear communication to achieve shared creative goals efficiently." }
            ].map((service, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-8 border border-white/5 hover:border-white/20 transition-colors relative overflow-hidden"
              >
                <h3 className="text-xl font-medium text-white mb-4 tracking-tight uppercase text-balance">{service.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed text-pretty">{service.desc}</p>
                <div className="mt-8 h-px w-0 group-hover:w-full bg-white/40 transition-all duration-700" />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Section: Contact */}
        <section id="contact" className="min-h-screen flex flex-col justify-between py-32 px-6 md:px-12 bg-black relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          
          <div className="relative z-10">
            <span className="text-[10px] tracking-[0.6em] uppercase text-white/40 mb-8 block">04 / Contact</span>
            <h2 className="text-5xl md:text-[8vw] font-medium tracking-tighter text-white leading-[0.85]" style={{ fontFamily: "'Instrument Serif', serif" }}>
              Create Without<br/>Boundaries.
            </h2>
          </div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12 mt-12 border-t border-white/10 pt-12">
            <div>
              <p className="text-[10px] tracking-[0.4em] uppercase text-white/40 mb-6">Socials</p>
              <div className="flex flex-col gap-4">
                <a href="https://www.instagram.com/mun.1210/" target="_blank" rel="noopener noreferrer" className="text-sm tracking-widest hover:text-white/60 transition-colors">Instagram</a>
                <a href="https://www.behance.net/mun1210" target="_blank" rel="noopener noreferrer" className="text-sm tracking-widest hover:text-white/60 transition-colors">Behance</a>
                <a href="https://www.linkedin.com/in/mun1210/" target="_blank" rel="noopener noreferrer" className="text-sm tracking-widest hover:text-white/60 transition-colors">LinkedIn</a>
              </div>
            </div>
            <div>
              <p className="text-[10px] tracking-[0.4em] uppercase text-white/40 mb-6">Inquiries</p>
              <div className="flex flex-col gap-2">
                <a href="mailto:ptngan163@gmail.com" className="text-sm tracking-widest hover:text-white/60 transition-colors">ptngan163@gmail.com</a>
                <p className="text-sm tracking-widest text-white/60">0903889145</p>
              </div>
            </div>
            <div className="flex flex-col justify-end items-start md:items-end">
              <p className="text-[10px] tracking-[0.4em] uppercase text-white/20">© 2026 Ngan Pham</p>
              <p className="text-[10px] tracking-[0.4em] uppercase text-white/20 mt-2">All rights reserved</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}



