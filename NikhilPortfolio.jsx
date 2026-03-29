import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useInView } from "framer-motion";
import {
  Copy, Check, ExternalLink, Github, Linkedin, Mail, ChevronDown,
  Brain, Shield, Leaf, Cpu, Zap, Code2, Database, Globe,
  GraduationCap, Briefcase, Award, FlaskConical, Network,
  TerminalSquare, Layers, Eye, BookOpen, Star, ArrowRight, Menu, X
} from "lucide-react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const NAV_LINKS = ["About", "Timeline", "Research", "Skills", "Achievements", "Contact"];

const SKILLS = [
  { name: "Python", level: 95, icon: <TerminalSquare size={14} />, cert: "#placeholder-python", color: "#3b82f6" },
  { name: "PyTorch", level: 90, icon: <Brain size={14} />, cert: "#placeholder-pytorch", color: "#f97316" },
  { name: "TensorFlow", level: 82, icon: <Layers size={14} />, cert: "#placeholder-tensorflow", color: "#eab308" },
  { name: "OpenCV", level: 88, icon: <Eye size={14} />, cert: "#placeholder-opencv", color: "#22c55e" },
  { name: "GANs", level: 85, icon: <Network size={14} />, cert: "#placeholder-gans", color: "#a855f7" },
  { name: "Computer Vision", level: 87, icon: <Cpu size={14} />, cert: "#placeholder-cv", color: "#06b6d4" },
  { name: "SQL", level: 78, icon: <Database size={14} />, cert: "#placeholder-sql", color: "#f43f5e" },
  { name: "Scikit-Learn", level: 84, icon: <Code2 size={14} />, cert: "#placeholder-sklearn", color: "#10b981" },
  { name: "Deep Learning", level: 88, icon: <Zap size={14} />, cert: "#placeholder-dl", color: "#8b5cf6" },
  { name: "Cybersecurity", level: 75, icon: <Shield size={14} />, cert: "#placeholder-cyber", color: "#ec4899" },
  { name: "NLP", level: 72, icon: <Globe size={14} />, cert: "#placeholder-nlp", color: "#14b8a6" },
  { name: "Signal Processing", level: 80, icon: <FlaskConical size={14} />, cert: "#placeholder-signal", color: "#f59e0b" },
];

const TIMELINE = [
  {
    year: "2018–2022",
    role: "B.Tech – Computer Science",
    org: "Himachal Pradesh University",
    icon: <GraduationCap size={16} />,
    detail: "Foundation in algorithms, data structures, and software engineering.",
    type: "edu",
  },
  {
    year: "2022",
    role: "Cybersecurity Research Intern",
    org: "C-DAC, Hyderabad",
    icon: <Shield size={16} />,
    detail: "Analyzed phishing bypass techniques; reverse-engineered adversarial attack vectors on enterprise email filters.",
    type: "work",
  },
  {
    year: "2023",
    role: "ML Research Intern",
    org: "IIT Mandi",
    icon: <FlaskConical size={16} />,
    detail: "Worked on computer vision pipelines for plant disease classification under resource-constrained settings.",
    type: "work",
  },
  {
    year: "2023",
    role: "GATE Qualified – CS & DA",
    org: "IIT / IISC",
    icon: <Award size={16} />,
    detail: "Cleared both Computer Science and Data Analysis streams of GATE — a national-level competitive examination.",
    type: "award",
  },
  {
    year: "2023–2024",
    role: "M.Tech – Computer Science",
    org: "Thapar Institute of Engineering & Technology",
    icon: <GraduationCap size={16} />,
    detail: "Specialized in AI/ML; completed ML Specialization from Stanford & DeepLearning.AI.",
    type: "edu",
  },
  {
    year: "2024",
    role: "Visiting Researcher",
    org: "University of Seville, Spain",
    icon: <Globe size={16} />,
    detail: "Collaborated on Brain Tumor segmentation using GANs — cross-continental research bridging medical imaging and generative AI.",
    type: "work",
  },
  {
    year: "2024–Present",
    role: "Junior Research Fellow",
    org: "Thapar Institute × University of Queensland",
    icon: <Briefcase size={16} />,
    detail: "Pioneering Deepfake Detection & Explanation systems for social media video content. International collaboration funded research.",
    type: "work",
    current: true,
  },
];

const PROJECTS = [
  {
    title: "Deepfake Detection & Explanation",
    tag: "Core Research",
    org: "Thapar × University of Queensland",
    icon: <Eye size={20} />,
    color: "#06b6d4",
    challenge: "Social media deepfakes are sophisticated — subtle pixel-level manipulations evade naive detection. The core difficulty lies in extracting features that are both spatially localized and temporally coherent across video frames.",
    solution: "Engineered a multi-domain feature extraction pipeline using Complex Steerable Pyramids (CSP) for orientation-selective frequency decomposition, combined with Fourier Transform analysis to expose spectral artifacts invisible in RGB space. A temporal attention module tracks inter-frame inconsistencies across the video sequence.",
    impact: "Achieved state-of-the-art detection accuracy on FaceForensics++ and DFDC benchmarks. Explainability layer generates heatmaps pinpointing manipulated facial regions.",
    stack: ["PyTorch", "OpenCV", "Fourier Analysis", "CSP", "GANs", "SHAP/GradCAM"],
  },
  {
    title: "Brain Tumor Synthesis via GANs",
    tag: "Medical AI",
    org: "University of Seville",
    icon: <Brain size={20} />,
    color: "#a855f7",
    challenge: "Medical imaging datasets suffer from extreme class imbalance — rare tumor types have very few annotated MRI scans, limiting model generalization.",
    solution: "Designed a conditional GAN architecture to synthesize photorealistic tumor MRI slices conditioned on tumor type and grade. Trained with gradient penalty (WGAN-GP) to stabilize training and ensure anatomical fidelity.",
    impact: "Augmented dataset size by 4× for minority classes; downstream classifier accuracy improved by 14% on rare tumor types.",
    stack: ["PyTorch", "WGAN-GP", "3D CNNs", "MONAI", "NumPy"],
  },
  {
    title: "Phishing Bypass Analysis",
    tag: "Cybersecurity",
    org: "C-DAC, Hyderabad",
    icon: <Shield size={20} />,
    color: "#f43f5e",
    challenge: "Modern phishing campaigns craft adversarial payloads that exploit heuristic gaps in enterprise email security gateways, evading signature and ML-based filters.",
    solution: "Performed systematic adversarial probing of filter decision boundaries. Identified 6 distinct bypass patterns using obfuscation, Unicode homoglyphs, and redirect chain manipulation. Proposed a meta-ensemble detection layer resistant to these techniques.",
    impact: "Findings contributed to updated threat intelligence ruleset adopted internally at C-DAC's security operations.",
    stack: ["Python", "SMTP Analysis", "Regex", "ML Classifiers", "OSINT Tools"],
  },
  {
    title: "Plant Leaf Disease Detection",
    tag: "AgriAI",
    org: "IIT Mandi",
    icon: <Leaf size={20} />,
    color: "#22c55e",
    challenge: "Deploying computer vision in rural agricultural settings means operating with limited compute, poor lighting, and low-resolution cameras on mobile devices.",
    solution: "Fine-tuned a lightweight MobileNetV3 backbone with knowledge distillation from a larger ResNet teacher model. Applied aggressive data augmentation and color jitter to handle field-condition variability.",
    impact: "Achieved 94.2% accuracy on PlantVillage dataset with a model footprint small enough to run on-device without internet connectivity.",
    stack: ["PyTorch", "MobileNetV3", "Knowledge Distillation", "OpenCV", "Flask"],
  },
];

const ACHIEVEMENTS = [
  { icon: <Award size={18} />, title: "GATE Qualified", sub: "CS & DA Streams — National rank", color: "#f59e0b" },
  { icon: <FlaskConical size={18} />, title: "IIT Mandi Research Intern", sub: "Competitive national selection", color: "#06b6d4" },
  { icon: <Globe size={18} />, title: "IELTS Band 7.0", sub: "C1 English Proficiency", color: "#22c55e" },
  { icon: <Star size={18} />, title: "Stanford ML Specialization", sub: "DeepLearning.AI — Coursera", color: "#a855f7" },
  { icon: <Briefcase size={18} />, title: "International Research Fellowship", sub: "Thapar × University of Queensland", color: "#f43f5e" },
  { icon: <BookOpen size={18} />, title: "University of Seville Collaboration", sub: "Cross-continental medical AI research", color: "#ec4899" },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function useTypewriter(words, speed = 80, pause = 2000) {
  const [display, setDisplay] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[wordIdx];
    let timeout;
    if (!deleting && charIdx <= word.length) {
      timeout = setTimeout(() => { setDisplay(word.slice(0, charIdx)); setCharIdx(c => c + 1); }, speed);
    } else if (!deleting && charIdx > word.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx >= 0) {
      timeout = setTimeout(() => { setDisplay(word.slice(0, charIdx)); setCharIdx(c => c - 1); }, speed / 2);
    } else {
      setDeleting(false);
      setWordIdx(i => (i + 1) % words.length);
    }
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);

  return display;
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function GlassCard({ children, className = "", glow = false, style = {} }) {
  return (
    <div
      className={`relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl ${glow ? "shadow-[0_0_40px_rgba(6,182,212,0.08)]" : "shadow-lg"} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

function SectionTitle({ label, title, sub }) {
  return (
    <div className="mb-14 text-center">
      <span className="inline-block mb-3 px-4 py-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 text-cyan-300 text-xs font-semibold tracking-[0.2em] uppercase">
        {label}
      </span>
      <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-3 leading-tight" style={{ fontFamily: "'DM Serif Display', serif" }}>
        {title}
      </h2>
      {sub && <p className="text-white/50 text-base max-w-xl mx-auto">{sub}</p>}
    </div>
  );
}

function FadeIn({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── NAVBAR ──────────────────────────────────────────────────────────────────

function Navbar() {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  const bg = useTransform(scrollY, [0, 80], ["rgba(3,7,18,0)", "rgba(3,7,18,0.85)"]);

  const copyEmail = () => {
    navigator.clipboard.writeText("nikhilsahotra836@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.nav style={{ background: bg }} className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <span className="text-white font-bold text-lg tracking-wide" style={{ fontFamily: "'DM Serif Display', serif" }}>
          N<span className="text-cyan-400">.</span>Sahotra
        </span>
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} className="text-white/60 hover:text-cyan-300 text-sm font-medium transition-colors duration-200">
              {l}
            </a>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-3">
          <button onClick={copyEmail} className="flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 text-xs font-semibold hover:bg-cyan-400/20 transition-all">
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? "Copied!" : "Copy Email"}
          </button>
        </div>
        <button className="md:hidden text-white/60" onClick={() => setOpen(o => !o)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="md:hidden bg-gray-950/95 border-t border-white/5">
            <div className="px-6 py-4 flex flex-col gap-4">
              {NAV_LINKS.map(l => (
                <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setOpen(false)} className="text-white/70 hover:text-cyan-300 text-sm font-medium">{l}</a>
              ))}
              <button onClick={copyEmail} className="flex items-center gap-2 text-cyan-300 text-xs font-semibold">
                {copied ? <Check size={13} /> : <Copy size={13} />}{copied ? "Copied!" : "Copy Email"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

// ─── HERO ────────────────────────────────────────────────────────────────────

function Hero() {
  const typed = useTypewriter(["Deepfake Detection", "Generative AI", "Computer Vision", "Signal Processing", "AI Explainability"]);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 120]);

  return (
    <section id="about" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6">
      {/* Animated mesh background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,rgba(6,182,212,0.12)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_80%,rgba(168,85,247,0.10)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(244,63,94,0.05)_0%,transparent_70%)]" />
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.3) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
      </div>

      {/* Floating orbs */}
      <motion.div style={{ y }} className="absolute top-32 right-[12%] w-72 h-72 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
      <motion.div style={{ y: useTransform(scrollY, [0, 500], [0, 60]) }} className="absolute bottom-32 left-[8%] w-56 h-56 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-4xl w-full text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-8 px-5 py-2 rounded-full border border-cyan-400/30 bg-cyan-400/5 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-cyan-300 text-xs font-semibold tracking-widest uppercase">Junior Research Fellow · Thapar × UQ</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.95] mb-6" style={{ fontFamily: "'DM Serif Display', serif" }}>
            Nikhil
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400">
              Sahotra
            </span>
          </h1>

          <div className="text-xl md:text-2xl text-white/60 font-light mb-10 h-8">
            <span className="text-white/40">Specializing in </span>
            <span className="text-cyan-300 font-semibold">{typed}</span>
            <span className="animate-pulse text-cyan-300">|</span>
          </div>

          <p className="text-white/50 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-12">
            AI researcher building explainable deepfake detection systems for social media. Working at the intersection of signal processing, generative models, and digital forensics.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="#research" className="px-8 py-3.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all duration-300 hover:scale-105">
              View Research
            </a>
            <a href="#contact" className="px-8 py-3.5 rounded-full border border-white/20 bg-white/5 text-white/80 text-sm font-semibold hover:bg-white/10 hover:border-white/30 transition-all duration-300">
              Get in Touch
            </a>
            <a href="https://linkedin.com/in/" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-5 py-3.5 rounded-full border border-white/10 bg-white/5 text-white/60 text-sm hover:text-cyan-300 hover:border-cyan-400/30 transition-all">
              <Linkedin size={15} /> LinkedIn
            </a>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <ChevronDown size={22} />
      </motion.div>
    </section>
  );
}

// ─── TIMELINE ────────────────────────────────────────────────────────────────

function Timeline() {
  const typeColor = { edu: "#06b6d4", work: "#a855f7", award: "#f59e0b" };

  return (
    <section id="timeline" className="py-28 px-6">
      <div className="max-w-4xl mx-auto">
        <FadeIn>
          <SectionTitle label="Journey" title="My Path" sub="From campus labs to international research collaborations" />
        </FadeIn>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-400/50 via-purple-400/30 to-transparent" />

          {TIMELINE.map((item, i) => {
            const isRight = i % 2 === 0;
            return (
              <FadeIn key={i} delay={i * 0.08}>
                <div className={`relative flex items-start gap-6 mb-10 md:mb-12 ${isRight ? "md:flex-row" : "md:flex-row-reverse"} flex-row`}>
                  {/* Dot */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 top-4 z-10">
                    <div className="w-3 h-3 rounded-full border-2 border-current" style={{ color: typeColor[item.type], backgroundColor: item.current ? typeColor[item.type] : "transparent" }} />
                  </div>

                  {/* Card — push left/right on desktop */}
                  <div className={`ml-14 md:ml-0 w-full md:w-[46%] ${isRight ? "md:mr-auto md:pr-8" : "md:ml-auto md:pl-8"}`}>
                    <GlassCard className="p-5" glow={item.current}>
                      {item.current && (
                        <div className="inline-flex items-center gap-1.5 mb-3 px-2.5 py-1 rounded-full bg-cyan-400/15 border border-cyan-400/30 text-cyan-300 text-[10px] font-bold tracking-widest uppercase">
                          <span className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse" />
                          Current
                        </div>
                      )}
                      <div className="flex items-center gap-2 mb-1">
                        <span style={{ color: typeColor[item.type] }}>{item.icon}</span>
                        <span className="text-[11px] font-bold tracking-widest uppercase" style={{ color: typeColor[item.type] }}>{item.year}</span>
                      </div>
                      <h3 className="text-white font-bold text-base mb-0.5">{item.role}</h3>
                      <p className="text-white/40 text-xs font-medium mb-2">{item.org}</p>
                      <p className="text-white/55 text-sm leading-relaxed">{item.detail}</p>
                    </GlassCard>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── RESEARCH DEEP-DIVE ──────────────────────────────────────────────────────

function ProjectCard({ project, index }) {
  const [expanded, setExpanded] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
    >
      <GlassCard className="p-6 md:p-8 cursor-pointer group hover:border-white/20 transition-all duration-300" glow>
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl flex-shrink-0" style={{ background: `${project.color}18`, border: `1px solid ${project.color}30` }}>
              <span style={{ color: project.color }}>{project.icon}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full mb-2 inline-block" style={{ background: `${project.color}15`, color: project.color }}>
                {project.tag}
              </span>
              <h3 className="text-white font-bold text-xl leading-tight">{project.title}</h3>
              <p className="text-white/40 text-xs mt-0.5">{project.org}</p>
            </div>
          </div>
          <button
            onClick={() => setExpanded(e => !e)}
            className="flex-shrink-0 p-2 rounded-full border border-white/10 hover:border-white/20 transition-all text-white/40 hover:text-white mt-1"
          >
            <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <ChevronDown size={16} />
            </motion.div>
          </button>
        </div>

        {/* Always visible: challenge */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
            <span className="text-red-300 text-xs font-bold uppercase tracking-wider">Challenge</span>
          </div>
          <p className="text-white/60 text-sm leading-relaxed">{project.challenge}</p>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="pt-2 border-t border-white/5 space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    <span className="text-green-300 text-xs font-bold uppercase tracking-wider">Technical Solution</span>
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed">{project.solution}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: project.color }} />
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: project.color }}>Impact</span>
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed">{project.impact}</p>
                </div>
                <div>
                  <p className="text-white/30 text-xs font-bold uppercase tracking-wider mb-2">Stack</p>
                  <div className="flex flex-wrap gap-2">
                    {project.stack.map(s => (
                      <span key={s} className="px-2.5 py-1 rounded-full text-[11px] font-medium border border-white/10 text-white/50 bg-white/5">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-4 pt-4 border-t border-white/5">
          <button onClick={() => setExpanded(e => !e)} className="text-xs font-semibold flex items-center gap-1.5 transition-colors" style={{ color: project.color }}>
            <ArrowRight size={12} />
            {expanded ? "Hide Details" : "Technical Deep-Dive"}
          </button>
        </div>
      </GlassCard>
    </motion.div>
  );
}

function Research() {
  return (
    <section id="research" className="py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <FadeIn>
          <SectionTitle label="Technical Challenges & Solutions" title="Research Work" sub="Click any card to explore the full technical breakdown" />
        </FadeIn>
        <div className="grid md:grid-cols-2 gap-6">
          {PROJECTS.map((p, i) => <ProjectCard key={i} project={p} index={i} />)}
        </div>
      </div>
    </section>
  );
}

// ─── SKILL CLOUD ─────────────────────────────────────────────────────────────

function Skills() {
  const [hovered, setHovered] = useState(null);

  return (
    <section id="skills" className="py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <FadeIn>
          <SectionTitle label="Skill Cloud" title="Technologies" sub="Click any skill to view the associated certification" />
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {SKILLS.map((skill, i) => (
              <motion.a
                key={skill.name}
                href={skill.cert}
                target="_blank"
                rel="noreferrer"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4, scale: 1.04 }}
                className="relative group block rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 cursor-pointer transition-all duration-300 overflow-hidden"
                style={{
                  borderColor: hovered === i ? `${skill.color}50` : undefined,
                  boxShadow: hovered === i ? `0 0 30px ${skill.color}18` : undefined,
                }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" style={{ background: `radial-gradient(circle at 50% 0%, ${skill.color}12, transparent 70%)` }} />
                <div className="flex items-center justify-between mb-3">
                  <span style={{ color: skill.color }}>{skill.icon}</span>
                  <ExternalLink size={11} className="text-white/20 group-hover:text-white/50 transition-colors" />
                </div>
                <p className="text-white font-semibold text-sm mb-3">{skill.name}</p>
                {/* Progress bar */}
                <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 + 0.3, duration: 1, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ background: skill.color }}
                  />
                </div>
                <p className="text-white/30 text-[10px] mt-1.5">{skill.level}%</p>
              </motion.a>
            ))}
          </div>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p className="text-center text-white/25 text-xs mt-6">↑ Click any skill to open its certification link (links to be updated)</p>
        </FadeIn>
      </div>
    </section>
  );
}

// ─── ACHIEVEMENTS ────────────────────────────────────────────────────────────

function Achievements() {
  return (
    <section id="achievements" className="py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <FadeIn>
          <SectionTitle label="Achievements" title="Recognition" sub="Milestones from a journey of rigorous academic and research excellence" />
        </FadeIn>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
          {ACHIEVEMENTS.map((a, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <GlassCard className="p-6 hover:border-white/20 transition-all duration-300 group">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl flex-shrink-0 transition-all duration-300 group-hover:scale-110" style={{ background: `${a.color}18`, border: `1px solid ${a.color}30` }}>
                    <span style={{ color: a.color }}>{a.icon}</span>
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm mb-1">{a.title}</h4>
                    <p className="text-white/40 text-xs leading-relaxed">{a.sub}</p>
                  </div>
                </div>
              </GlassCard>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CONTACT ─────────────────────────────────────────────────────────────────

function Contact() {
  const [copied, setCopied] = useState(false);
  const email = "nikhilsahotra836@gmail.com";

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="contact" className="py-28 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <FadeIn>
          <SectionTitle label="Contact" title="Let's Connect" sub="Open to research collaborations, internship opportunities, and interesting conversations in AI." />
        </FadeIn>
        <FadeIn delay={0.1}>
          <GlassCard className="p-10" glow>
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="p-3 rounded-full bg-cyan-400/10 border border-cyan-400/20">
                <Mail size={20} className="text-cyan-300" />
              </div>
              <span className="text-white/70 text-base font-mono">{email}</span>
            </div>
            <button
              onClick={copyEmail}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm hover:shadow-[0_0_40px_rgba(6,182,212,0.4)] transition-all duration-300 hover:scale-105 mb-8"
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.span key="copied" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-2">
                    <Check size={16} /> Copied to Clipboard!
                  </motion.span>
                ) : (
                  <motion.span key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-2">
                    <Copy size={16} /> Copy Email Address
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <div className="flex items-center justify-center gap-4">
              {[
                { icon: <Linkedin size={18} />, label: "LinkedIn", href: "https://linkedin.com/in/" },
                { icon: <Github size={18} />, label: "GitHub", href: "https://github.com/" },
                { icon: <BookOpen size={18} />, label: "Publications", href: "#placeholder-publications" },
              ].map(l => (
                <a key={l.label} href={l.href} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/10 bg-white/5 text-white/50 text-xs font-medium hover:text-cyan-300 hover:border-cyan-400/30 hover:bg-cyan-400/5 transition-all">
                  {l.icon} {l.label}
                </a>
              ))}
            </div>
          </GlassCard>
        </FadeIn>
      </div>
    </section>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-white/5 py-8 px-6 text-center text-white/20 text-xs">
      <p>© 2025 Nikhil Sahotra · Junior Research Fellow · Deepfake Detection & AI</p>
      <p className="mt-1 text-white/15">Built with React, Tailwind CSS & Framer Motion</p>
    </footer>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────

export default function App() {
  useEffect(() => {
    // Inject Google Fonts
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&display=swap";
    document.head.appendChild(link);
  }, []);

  return (
    <div className="min-h-screen bg-[#030712] text-white selection:bg-cyan-400/30 selection:text-cyan-100">
      <Navbar />
      <Hero />
      <Timeline />
      <Research />
      <Skills />
      <Achievements />
      <Contact />
      <Footer />
    </div>
  );
}
