import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

const projects = [
  { id: 0, src: "/Generated Image April 08, 2026 - 3_32AM.png", title: "Ethereal Light", category: "Art Direction", year: "2024" },
  { id: 1, src: "/Generated Image April 08, 2026 - 3_33AM.png", title: "Urban Solitude", category: "Visual Strategy", year: "2024" },
  { id: 2, src: "/Generated Image April 08, 2026 - 3_38AM.png", title: "Midnight Bloom", category: "Creative Direction", year: "2024" },
  { id: 3, src: "/Generated Image April 08, 2026 - 3_32AM.png", title: "Golden Hour", category: "Art Direction", year: "2023" },
  { id: 4, src: "/Generated Image April 08, 2026 - 3_34AM.png", title: "Silent Echoes", category: "Digital Curation", year: "2023" }
];

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const projectIndex = parseInt(id || "0");
  const project = projects[projectIndex] || projects[0];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-white/20">
      {/* Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/10 backdrop-blur-md border-b border-white/5">
        <nav className="relative mx-auto flex max-w-[1800px] items-center justify-between px-6 py-6 md:px-12">
          <div 
            className="text-2xl tracking-tight text-white z-50 cursor-pointer"
            style={{ fontFamily: "'Instrument Serif', serif" }}
            onClick={() => navigate("/")}
          >
            Ngan Pham<sup className="text-[10px]">®</sup>
          </div>

          <div className="flex items-center gap-8">
            <button 
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] hover:opacity-60 transition-opacity"
            >
              <ArrowLeft size={14} /> Back
            </button>
            <div className="hidden md:block text-[10px] uppercase tracking-[0.4em] opacity-40">
              Project {projectIndex + 1} / {projects.length}
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative h-[90vh] w-full overflow-hidden">
        <motion.img 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          src={project.src} 
          alt={project.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
          >
            <span className="text-[10px] tracking-[0.6em] uppercase text-white/40 mb-4 block">{project.category}</span>
            <h1 
              className="text-7xl md:text-[12vw] font-medium tracking-tighter leading-[0.85] mb-8"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              {project.title}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="px-6 md:px-12 py-24 grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-4 space-y-12">
          <div>
            <p className="text-[10px] tracking-[0.4em] uppercase text-white/40 mb-4">Year</p>
            <p className="text-xl">{project.year}</p>
          </div>
          <div>
            <p className="text-[10px] tracking-[0.4em] uppercase text-white/40 mb-4">Role</p>
            <p className="text-xl">Lead Designer & Art Director</p>
          </div>
          <div>
            <p className="text-[10px] tracking-[0.4em] uppercase text-white/40 mb-4">Client</p>
            <p className="text-xl">Experimental Lab</p>
          </div>
        </div>

        <div className="md:col-span-8">
          <p className="text-lg md:text-xl leading-relaxed tracking-tight text-white/80 font-light">
            An exploration into the intersection of light, shadow, and digital emotion. 
            This project sought to redefine how we perceive cinematic storytelling 
            within a static digital medium. By leveraging advanced AI-driven 
            visualization tools, we created a series of immersive environments 
            that challenge the boundaries of traditional art direction.
          </p>
          
          <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="aspect-[4/5] bg-white/5 overflow-hidden">
              <img src={project.src} alt="Detail 1" className="w-full h-full object-cover transition-opacity duration-700" />
            </div>
            <div className="aspect-[4/5] bg-white/5 overflow-hidden mt-12 md:mt-24">
              <img src={project.src} alt="Detail 2" className="w-full h-full object-cover transition-opacity duration-700" />
            </div>
          </div>
        </div>
      </section>

      {/* Next Project Footer */}
      <section className="px-6 md:px-12 py-48 border-t border-white/5 flex flex-col items-center justify-center text-center">
        <span className="text-[10px] tracking-[0.6em] uppercase text-white/40 mb-8 block">Next Project</span>
        <div 
          onClick={() => navigate(`/project/${(projectIndex + 1) % projects.length}`)}
          className="group relative cursor-pointer"
        >
          <h2 
            className="text-5xl md:text-9xl font-medium tracking-tighter leading-none group-hover:opacity-40 transition-opacity"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            {projects[(projectIndex + 1) % projects.length].title}
          </h2>
          <ArrowUpRight className="absolute -top-12 -right-12 w-12 h-12 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0" />
        </div>
      </section>

      {/* Section: Contact (Footer) */}
      <section className="py-32 px-6 md:px-12 bg-black relative overflow-hidden border-t border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
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
    </div>
  );
};

export default ProjectDetail;
