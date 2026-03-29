import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useInView } from "framer-motion";
import {
  Copy, Check, ExternalLink, Github, Linkedin, Mail, ChevronDown,
  Brain, Shield, Leaf, Cpu, Zap, Code2, Database, Globe,
  GraduationCap, Briefcase, Award, FlaskConical, Network,
  TerminalSquare, Layers, Eye, BookOpen, Star, ArrowRight,
  Menu, X, MapPin, Calendar, TrendingUp
} from "lucide-react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  bg0:    "#080a0d",
  bg1:    "#0d1017",
  bg2:    "#111520",
  bg3:    "#161c2b",
  border: "#1e2535",
  borderH:"#2a3347",
  gold:   "#b8976a",
  goldL:  "#d4b896",
  silver: "#6b7a99",
  dim:    "#3d4a62",
  white:  "#e8eaf0",
  whiteD: "#9aa3b8",
};

// ─── DATA ────────────────────────────────────────────────────────────────────

const NAV = ["About", "Timeline", "Research", "Skills", "Achievements", "Contact"];

const SKILLS = [
  { name: "Python",            pct: 95, icon: <TerminalSquare size={13}/>, cert: "#placeholder-python" },
  { name: "PyTorch",           pct: 90, icon: <Brain size={13}/>,           cert: "#placeholder-pytorch" },
  { name: "TensorFlow",        pct: 82, icon: <Layers size={13}/>,          cert: "#placeholder-tensorflow" },
  { name: "OpenCV",            pct: 88, icon: <Eye size={13}/>,             cert: "#placeholder-opencv" },
  { name: "GANs",              pct: 85, icon: <Network size={13}/>,         cert: "#placeholder-gans" },
  { name: "Computer Vision",   pct: 87, icon: <Cpu size={13}/>,             cert: "#placeholder-cv" },
  { name: "SQL",               pct: 78, icon: <Database size={13}/>,        cert: "#placeholder-sql" },
  { name: "Scikit-Learn",      pct: 84, icon: <Code2 size={13}/>,           cert: "#placeholder-sklearn" },
  { name: "Deep Learning",     pct: 88, icon: <Zap size={13}/>,             cert: "#placeholder-dl" },
  { name: "Cybersecurity",     pct: 75, icon: <Shield size={13}/>,          cert: "#placeholder-cyber" },
  { name: "NLP",               pct: 72, icon: <Globe size={13}/>,           cert: "#placeholder-nlp" },
  { name: "Signal Processing", pct: 80, icon: <FlaskConical size={13}/>,    cert: "#placeholder-signal" },
];

const TIMELINE = [
  {
    year: "2018 – 2022",
    role: "B.Tech, Computer Science",
    org: "Himachal Pradesh University",
    loc: "Shimla, India",
    detail: "Foundation in algorithms, data structures, operating systems, and software engineering principles.",
    type: "edu",
  },
  {
    year: "2022",
    role: "Cybersecurity Research Intern",
    org: "C-DAC",
    loc: "Hyderabad, India",
    detail: "Analyzed adversarial phishing bypass techniques on enterprise email security gateways. Identified six distinct evasion patterns using Unicode homoglyphs, obfuscation, and redirect chains.",
    type: "work",
  },
  {
    year: "2023",
    role: "ML Research Intern",
    org: "IIT Mandi",
    loc: "Mandi, India",
    detail: "Developed lightweight computer vision pipelines for plant disease classification under resource-constrained agricultural field conditions.",
    type: "work",
  },
  {
    year: "2023",
    role: "GATE Qualified — CS & DA",
    org: "IIT / IISc",
    loc: "National",
    detail: "Cleared both the Computer Science and Data Analysis streams of the national GATE examination.",
    type: "award",
  },
  {
    year: "2023 – 2024",
    role: "M.Tech, Computer Science",
    org: "Thapar Institute of Engineering & Technology",
    loc: "Patiala, India",
    detail: "Specialized in AI and Machine Learning. Completed the Stanford/DeepLearning.AI ML Specialization concurrently.",
    type: "edu",
  },
  {
    year: "2024",
    role: "Visiting Researcher",
    org: "University of Seville",
    loc: "Seville, Spain",
    detail: "International collaboration on brain tumor MRI synthesis using Wasserstein GANs. Improved minority-class classifier accuracy by 14%.",
    type: "work",
  },
  {
    year: "2024 – Present",
    role: "Junior Research Fellow",
    org: "Thapar Institute × University of Queensland",
    loc: "Patiala / Brisbane",
    detail: "Leading funded research on Deepfake Detection & Explanation for social media video content. International research collaboration.",
    type: "current",
    current: true,
  },
];

const PROJECTS = [
  {
    title: "Deepfake Detection & Explanation",
    tag: "Primary Research",
    org: "Thapar Institute × University of Queensland",
    icon: <Eye size={18}/>,
    challenge: "Social-media deepfakes exploit subtle pixel-level inconsistencies imperceptible to the human eye. Naive RGB-space detectors are brittle against compression artifacts and generalize poorly across GAN architectures.",
    solution: "Engineered a multi-domain feature extraction pipeline combining Complex Steerable Pyramids (CSP) for orientation-selective frequency decomposition with Fourier Transform analysis to surface spectral manipulation artifacts invisible in RGB space. A temporal attention module enforces inter-frame coherence constraints across video sequences. GradCAM + SHAP explainability layer generates forensic heatmaps localizing manipulated facial regions.",
    impact: "State-of-the-art detection accuracy on FaceForensics++ and DFDC benchmarks. Explainability output is suitable for deployment in content-moderation workflows.",
    stack: ["PyTorch", "OpenCV", "Fourier Analysis", "CSP", "GradCAM", "SHAP", "FFmpeg"],
  },
  {
    title: "Brain Tumor MRI Synthesis via GANs",
    tag: "Medical AI",
    org: "University of Seville, Spain",
    icon: <Brain size={18}/>,
    challenge: "Medical imaging datasets suffer from extreme class imbalance — rare tumor subtypes have very few annotated MRI volumes, directly limiting diagnostic model generalization.",
    solution: "Designed a conditional Wasserstein GAN (WGAN-GP) to synthesize anatomically faithful tumor MRI slices conditioned on tumor type and grade. Gradient penalty regularization stabilized adversarial training and prevented mode collapse. SSIM and FID metrics validated synthesis quality against real clinical data.",
    impact: "Dataset augmented 4× for minority classes. Downstream diagnostic classifier accuracy improved by 14% on rare tumor subtypes compared to the non-augmented baseline.",
    stack: ["PyTorch", "WGAN-GP", "MONAI", "3D CNNs", "SSIM", "FID"],
  },
  {
    title: "Phishing Bypass Analysis",
    tag: "Cybersecurity",
    org: "C-DAC, Hyderabad",
    icon: <Shield size={18}/>,
    challenge: "Modern phishing campaigns craft adversarial payloads that exploit heuristic gaps in enterprise email security gateways, evading both signature-based and ML-based filters.",
    solution: "Performed systematic adversarial probing of filter decision boundaries. Identified and documented six distinct bypass patterns: Unicode homoglyphs, MIME obfuscation, redirect chain manipulation, polyglot attachments, header spoofing, and base64 payload staging. Proposed a meta-ensemble detection layer resistant to these techniques.",
    impact: "Findings contributed to an updated threat intelligence ruleset adopted in C-DAC's security operations. Research documented as internal technical report.",
    stack: ["Python", "SMTP Forensics", "Regex", "ML Classifiers", "OSINT"],
  },
  {
    title: "Plant Leaf Disease Detection",
    tag: "Agricultural AI",
    org: "IIT Mandi",
    icon: <Leaf size={18}/>,
    challenge: "Deploying computer vision in rural agricultural settings demands operation under limited compute, inconsistent lighting, low-resolution cameras, and without internet connectivity.",
    solution: "Fine-tuned a lightweight MobileNetV3 backbone using knowledge distillation from a ResNet-50 teacher model. Applied aggressive augmentation (color jitter, random crop, grid distortion) to handle field-condition variability. Exported to TensorFlow Lite for on-device inference.",
    impact: "94.2% accuracy on the PlantVillage dataset. Model footprint small enough to run entirely on-device — suitable for offline rural deployment.",
    stack: ["PyTorch", "MobileNetV3", "Knowledge Distillation", "TFLite", "Flask"],
  },
];

const ACHIEVEMENTS = [
  { icon: <Award size={16}/>,        title: "GATE Qualified",                    sub: "CS & DA Streams — National competitive examination" },
  { icon: <FlaskConical size={16}/>, title: "IIT Mandi Research Intern",          sub: "Competitive national selection for research role" },
  { icon: <Globe size={16}/>,        title: "IELTS Band 7.0",                    sub: "C1 English Proficiency — International standard" },
  { icon: <Star size={16}/>,         title: "Stanford ML Specialization",         sub: "DeepLearning.AI — Coursera (Andrew Ng)" },
  { icon: <Briefcase size={16}/>,    title: "International Research Fellowship",  sub: "Thapar Institute × University of Queensland" },
  { icon: <BookOpen size={16}/>,     title: "University of Seville Collaboration",sub: "Cross-continental medical imaging AI research" },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function useTypewriter(words, speed = 75, pause = 2200) {
  const [display, setDisplay] = useState("");
  const [wi, setWi] = useState(0);
  const [ci, setCi] = useState(0);
  const [del, setDel] = useState(false);
  useEffect(() => {
    const w = words[wi];
    let t;
    if (!del && ci <= w.length)     t = setTimeout(() => { setDisplay(w.slice(0,ci)); setCi(c=>c+1); }, speed);
    else if (!del && ci > w.length) t = setTimeout(() => setDel(true), pause);
    else if (del && ci >= 0)        t = setTimeout(() => { setDisplay(w.slice(0,ci)); setCi(c=>c-1); }, speed/2);
    else { setDel(false); setWi(i=>(i+1)%words.length); }
    return () => clearTimeout(t);
  }, [ci, del, wi, words, speed, pause]);
  return display;
}

function FadeIn({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}>
      {children}
    </motion.div>
  );
}

function Divider() {
  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="h-px" style={{ background: `linear-gradient(90deg, transparent, ${C.border}, transparent)` }} />
    </div>
  );
}

function SectionTitle({ eyebrow, title, sub }) {
  return (
    <div className="mb-14">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-px w-8" style={{ background: C.gold }} />
        <span className="text-xs font-semibold tracking-[0.25em] uppercase" style={{ color: C.gold, fontFamily: "monospace" }}>
          {eyebrow}
        </span>
      </div>
      <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight" style={{ color: C.white, fontFamily: "Georgia, 'Times New Roman', serif" }}>
        {title}
      </h2>
      {sub && <p className="text-base max-w-xl leading-relaxed" style={{ color: C.whiteD }}>{sub}</p>}
    </div>
  );
}

// ─── NAVBAR ──────────────────────────────────────────────────────────────────

function Navbar() {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  const bdr = useTransform(scrollY, [0, 80], [0, 1]);

  const copy = () => {
    navigator.clipboard.writeText("nikhilsahotra836@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <motion.nav className="fixed top-0 left-0 right-0 z-50" style={{ background: C.bg0 }}>
      <motion.div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: C.border, opacity: bdr }} />
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded flex items-center justify-center border"
            style={{ borderColor: C.gold, background: `${C.gold}15` }}>
            <span className="text-[10px] font-bold" style={{ color: C.gold, fontFamily: "monospace" }}>NS</span>
          </div>
          <span className="text-sm font-bold tracking-wide" style={{ color: C.white, fontFamily: "Georgia, serif" }}>
            Nikhil Sahotra
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {NAV.map(l => (
            <a key={l} href={`#${l.toLowerCase()}`}
              className="text-[11px] font-medium tracking-widest uppercase transition-colors duration-200"
              style={{ color: C.silver, fontFamily: "monospace" }}
              onMouseEnter={e => e.target.style.color = C.goldL}
              onMouseLeave={e => e.target.style.color = C.silver}>
              {l}
            </a>
          ))}
        </div>

        <div className="hidden md:block">
          <button onClick={copy}
            className="flex items-center gap-2 px-4 py-2 rounded text-[11px] font-semibold border transition-all duration-200"
            style={{ borderColor: C.gold, color: C.gold, background: `${C.gold}10`, fontFamily: "monospace" }}
            onMouseEnter={e => { e.currentTarget.style.background = `${C.gold}20`; }}
            onMouseLeave={e => { e.currentTarget.style.background = `${C.gold}10`; }}>
            {copied ? <Check size={11}/> : <Copy size={11}/>}
            {copied ? "Copied" : "Copy Email"}
          </button>
        </div>

        <button className="md:hidden" style={{ color: C.silver }} onClick={() => setOpen(o=>!o)}>
          {open ? <X size={20}/> : <Menu size={20}/>}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t" style={{ background: C.bg0, borderColor: C.border }}>
            <div className="px-6 py-5 flex flex-col gap-4">
              {NAV.map(l => (
                <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setOpen(false)}
                  className="text-[11px] uppercase tracking-widest" style={{ color: C.silver, fontFamily: "monospace" }}>{l}</a>
              ))}
              <button onClick={copy} className="flex items-center gap-2 text-[11px]" style={{ color: C.gold, fontFamily: "monospace" }}>
                {copied ? <Check size={11}/> : <Copy size={11}/>} {copied ? "Copied" : "Copy Email"}
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
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const yAnim   = useTransform(scrollY, [0, 400], [0, 50]);

  return (
    <section id="about" className="relative min-h-screen flex flex-col justify-center px-6 overflow-hidden" style={{ background: C.bg0 }}>
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: `linear-gradient(${C.silver} 1px,transparent 1px),linear-gradient(90deg,${C.silver} 1px,transparent 1px)`, backgroundSize: "80px 80px" }} />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] opacity-[0.07]"
          style={{ background: `radial-gradient(circle at top right, ${C.gold}, transparent 65%)` }} />
        <div className="absolute bottom-0 left-0 w-80 h-80 opacity-[0.05]"
          style={{ background: `radial-gradient(circle at bottom left, ${C.gold}, transparent 70%)` }} />
      </div>

      <motion.div style={{ opacity, y: yAnim }} className="max-w-7xl mx-auto w-full pt-20">
        <div className="grid md:grid-cols-5 gap-12 items-center">

          {/* Left — 3 cols */}
          <div className="md:col-span-3">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.22,1,0.36,1] }}>

              <div className="inline-flex items-center gap-2.5 mb-10 px-4 py-2 rounded border"
                style={{ borderColor: C.border, background: C.bg2 }}>
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: C.gold }} />
                <span className="text-[11px] font-medium tracking-widest uppercase" style={{ color: C.silver, fontFamily: "monospace" }}>
                  Junior Research Fellow · Thapar × UQ
                </span>
              </div>

              <h1 style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: C.white }} className="leading-none mb-2">
                <span className="block text-6xl md:text-7xl lg:text-[88px] font-bold">Nikhil</span>
                <span className="block text-6xl md:text-7xl lg:text-[88px] font-bold" style={{ color: C.gold }}>Sahotra</span>
              </h1>

              <div className="mt-8 mb-8 flex items-center gap-3">
                <div className="h-px w-8" style={{ background: C.dim }} />
                <span className="text-sm" style={{ color: C.whiteD, fontFamily: "monospace" }}>
                  <span style={{ color: C.dim }}>→ </span>
                  <span style={{ color: C.goldL }}>{typed}</span>
                  <span className="animate-pulse" style={{ color: C.gold }}>_</span>
                </span>
              </div>

              <p className="text-base leading-8 mb-10 max-w-lg" style={{ color: C.whiteD }}>
                AI researcher building explainable deepfake detection systems for social media. Working at the intersection
                of signal processing, generative models, and digital forensics — in collaboration with the University of Queensland.
              </p>

              <div className="flex flex-wrap gap-3">
                <a href="#research"
                  className="px-7 py-3 rounded text-sm font-semibold transition-all duration-200 border"
                  style={{ background: C.gold, borderColor: C.gold, color: C.bg0, fontFamily: "monospace" }}
                  onMouseEnter={e => { e.currentTarget.style.background = C.goldL; e.currentTarget.style.borderColor = C.goldL; }}
                  onMouseLeave={e => { e.currentTarget.style.background = C.gold; e.currentTarget.style.borderColor = C.gold; }}>
                  View Research
                </a>
                <a href="#contact"
                  className="px-7 py-3 rounded text-sm font-semibold transition-all duration-200 border"
                  style={{ borderColor: C.border, color: C.whiteD, background: "transparent", fontFamily: "monospace" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.color = C.gold; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.whiteD; }}>
                  Get in Touch
                </a>
                <a href="https://linkedin.com/in/" target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 px-5 py-3 rounded text-sm border transition-all duration-200"
                  style={{ borderColor: C.border, color: C.silver, background: "transparent", fontFamily: "monospace" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.borderH; e.currentTarget.style.color = C.whiteD; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.silver; }}>
                  <Linkedin size={13}/> LinkedIn
                </a>
              </div>
            </motion.div>
          </div>

          {/* Right — 2 cols */}
          <motion.div className="md:col-span-2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.25, ease: [0.22,1,0.36,1] }}>
            <div className="rounded-xl border p-7" style={{ background: C.bg2, borderColor: C.border }}>
              <div className="text-[10px] font-bold uppercase tracking-widest mb-5 pb-4 border-b"
                style={{ color: C.gold, borderColor: C.border, fontFamily: "monospace" }}>
                Research Profile
              </div>
              {[
                { label: "Institution",    val: "Thapar × Univ. of Queensland", icon: <Briefcase size={12}/> },
                { label: "Focus Area",     val: "Deepfake Detection & Explainability", icon: <Eye size={12}/> },
                { label: "Specialization", val: "GANs · CV · Signal Processing", icon: <Brain size={12}/> },
                { label: "GATE",           val: "Qualified — CS & Data Analysis", icon: <Award size={12}/> },
                { label: "IELTS",          val: "Band 7.0 (C1 English)", icon: <Globe size={12}/> },
                { label: "Location",       val: "Patiala, India", icon: <MapPin size={12}/> },
              ].map((row, i, arr) => (
                <div key={i} className={`flex items-start gap-3 py-3 ${i < arr.length-1 ? "border-b" : ""}`}
                  style={{ borderColor: C.border }}>
                  <span style={{ color: C.dim, marginTop: 1 }}>{row.icon}</span>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest mb-0.5" style={{ color: C.dim, fontFamily: "monospace" }}>{row.label}</div>
                    <div className="text-xs font-medium" style={{ color: C.white }}>{row.val}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
        animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 2.5 }}>
        <span className="text-[9px] uppercase tracking-widest" style={{ color: C.dim, fontFamily: "monospace" }}>Scroll</span>
        <ChevronDown size={13} style={{ color: C.dim }} />
      </motion.div>
    </section>
  );
}

// ─── TIMELINE ────────────────────────────────────────────────────────────────

function Timeline() {
  const dotColor = { edu: C.silver, work: C.gold, award: C.goldL, current: C.gold };

  return (
    <section id="timeline" className="py-28 px-6" style={{ background: C.bg1 }}>
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <SectionTitle eyebrow="Career Journey" title="Timeline"
            sub="A progression from foundational study to funded international research collaboration." />
        </FadeIn>

        <div className="relative">
          {/* Centre spine */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px"
            style={{ background: `linear-gradient(to bottom, ${C.gold}80, ${C.border} 80%, transparent)` }} />

          <div className="space-y-5">
            {TIMELINE.map((item, i) => {
              const isLeft = i % 2 === 0;
              return (
                <FadeIn key={i} delay={i * 0.07}>
                  <div className={`md:flex md:items-start relative gap-8 ${isLeft ? "" : "md:flex-row-reverse"}`}>
                    {/* Dot */}
                    <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-6 z-10 w-2.5 h-2.5 rounded-full border-2"
                      style={{ borderColor: dotColor[item.type], background: item.current ? dotColor[item.type] : C.bg0 }} />

                    <div className={`md:w-[46%] ${isLeft ? "md:ml-auto md:pr-8" : "md:mr-auto md:pl-8"}`}>
                      <div className="rounded-xl border p-6 transition-all duration-300"
                        style={{ background: item.current ? `${C.gold}07` : C.bg2, borderColor: item.current ? `${C.gold}60` : C.border }}>
                        {item.current && (
                          <div className="inline-flex items-center gap-1.5 mb-3 px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest"
                            style={{ background: `${C.gold}20`, color: C.gold, fontFamily: "monospace" }}>
                            <span className="w-1 h-1 rounded-full animate-pulse" style={{ background: C.gold }} />
                            Active
                          </div>
                        )}
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar size={10} style={{ color: C.dim }} />
                          <span className="text-[10px] uppercase tracking-widest font-semibold"
                            style={{ color: item.current ? C.gold : C.silver, fontFamily: "monospace" }}>
                            {item.year}
                          </span>
                        </div>
                        <h3 className="font-bold text-base mb-1" style={{ color: C.white, fontFamily: "Georgia, serif" }}>{item.role}</h3>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs font-medium" style={{ color: C.gold }}>{item.org}</span>
                          <span style={{ color: C.dim }} className="text-xs">·</span>
                          <span className="text-xs" style={{ color: C.dim }}>{item.loc}</span>
                        </div>
                        <p className="text-sm leading-relaxed" style={{ color: C.whiteD }}>{item.detail}</p>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── RESEARCH ────────────────────────────────────────────────────────────────

function ProjectCard({ p, idx }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: idx * 0.1, ease: [0.22,1,0.36,1] }}>
      <div className="rounded-xl border overflow-hidden transition-all duration-300"
        style={{ background: C.bg2, borderColor: open ? `${C.gold}60` : C.border }}>

        <div className="p-6 md:p-8">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded border flex items-center justify-center flex-shrink-0"
                style={{ background: `${C.gold}10`, borderColor: `${C.gold}30` }}>
                <span style={{ color: C.gold }}>{p.icon}</span>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest mb-2 px-2 py-0.5 rounded-sm inline-block"
                  style={{ background: `${C.gold}12`, color: C.gold, fontFamily: "monospace" }}>
                  {p.tag}
                </div>
                <h3 className="font-bold text-lg leading-tight" style={{ color: C.white, fontFamily: "Georgia, serif" }}>{p.title}</h3>
                <p className="text-xs mt-0.5" style={{ color: C.silver }}>{p.org}</p>
              </div>
            </div>
            <button onClick={() => setOpen(o=>!o)}
              className="w-8 h-8 rounded border flex items-center justify-center flex-shrink-0 transition-all duration-200"
              style={{ borderColor: open ? C.gold : C.border, color: open ? C.gold : C.dim, background: open ? `${C.gold}10` : "transparent" }}>
              <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}>
                <ChevronDown size={13} />
              </motion.span>
            </button>
          </div>

          {/* Challenge — always visible */}
          <div className="rounded-lg p-4" style={{ background: C.bg0, border: `1px solid ${C.border}` }}>
            <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: C.silver, fontFamily: "monospace" }}>
              // Challenge
            </div>
            <p className="text-sm leading-relaxed" style={{ color: C.whiteD }}>{p.challenge}</p>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.22,1,0.36,1] }} className="overflow-hidden">
              <div className="px-6 md:px-8 pb-6 md:pb-8 space-y-3 border-t pt-4" style={{ borderColor: C.border }}>
                <div className="rounded-lg p-4" style={{ background: C.bg0, border: `1px solid ${C.border}` }}>
                  <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: C.gold, fontFamily: "monospace" }}>
                    // Technical Solution
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: C.whiteD }}>{p.solution}</p>
                </div>
                <div className="rounded-lg p-4" style={{ background: C.bg0, border: `1px solid ${C.border}` }}>
                  <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: C.goldL, fontFamily: "monospace" }}>
                    // Impact & Outcomes
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: C.whiteD }}>{p.impact}</p>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: C.dim, fontFamily: "monospace" }}>
                    Technology Stack
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {p.stack.map(s => (
                      <span key={s} className="px-2.5 py-1 rounded-sm text-[11px] font-medium border"
                        style={{ borderColor: C.border, color: C.silver, background: C.bg3, fontFamily: "monospace" }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button onClick={() => setOpen(o=>!o)}
          className="w-full px-6 md:px-8 py-3 flex items-center gap-2 border-t text-[11px] font-semibold transition-colors duration-200"
          style={{ borderColor: C.border, color: open ? C.gold : C.silver, fontFamily: "monospace",
            background: open ? `${C.gold}05` : C.bg3 }}>
          <ArrowRight size={11} />
          {open ? "Collapse Details" : "Technical Deep-Dive →"}
        </button>
      </div>
    </motion.div>
  );
}

function Research() {
  return (
    <section id="research" className="py-28 px-6" style={{ background: C.bg0 }}>
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <SectionTitle eyebrow="Technical Challenges & Solutions" title="Research Work"
            sub="Expand each project to explore the full technical methodology, solution architecture, and research outcomes." />
        </FadeIn>
        <div className="grid md:grid-cols-2 gap-5">
          {PROJECTS.map((p,i) => <ProjectCard key={i} p={p} idx={i} />)}
        </div>
      </div>
    </section>
  );
}

// ─── SKILLS ──────────────────────────────────────────────────────────────────

function Skills() {
  return (
    <section id="skills" className="py-28 px-6" style={{ background: C.bg1 }}>
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <SectionTitle eyebrow="Technical Expertise" title="Skill Cloud"
            sub="Click any skill tile to open its associated certification. Proficiency reflects hands-on research and project work." />
        </FadeIn>
        <FadeIn delay={0.08}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {SKILLS.map((sk, i) => (
              <motion.a key={sk.name} href={sk.cert} target="_blank" rel="noreferrer"
                initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i*0.04, duration: 0.6, ease: [0.22,1,0.36,1] }}
                whileHover={{ y: -2 }}
                className="group block rounded-xl border p-5 transition-all duration-300"
                style={{ background: C.bg2, borderColor: C.border }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${C.gold}70`; e.currentTarget.style.background = `${C.gold}07`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.bg2; }}>
                <div className="flex items-center justify-between mb-3">
                  <span style={{ color: C.gold }}>{sk.icon}</span>
                  <ExternalLink size={10} style={{ color: C.dim }} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-sm font-semibold mb-3" style={{ color: C.white }}>{sk.name}</p>
                <div className="h-0.5 rounded-full mb-1.5" style={{ background: C.border }}>
                  <motion.div className="h-full rounded-full" style={{ background: C.gold }}
                    initial={{ width: 0 }} whileInView={{ width: `${sk.pct}%` }}
                    viewport={{ once: true }} transition={{ delay: i*0.04+0.3, duration: 1.2, ease: "easeOut" }} />
                </div>
                <p className="text-[10px]" style={{ color: C.dim, fontFamily: "monospace" }}>{sk.pct}%</p>
              </motion.a>
            ))}
          </div>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p className="mt-5 text-[10px] text-center" style={{ color: C.dim, fontFamily: "monospace" }}>
            Certification links are placeholders — update with your LinkedIn certificate URLs
          </p>
        </FadeIn>
      </div>
    </section>
  );
}

// ─── ACHIEVEMENTS ────────────────────────────────────────────────────────────

function Achievements() {
  return (
    <section id="achievements" className="py-28 px-6" style={{ background: C.bg0 }}>
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <SectionTitle eyebrow="Recognition" title="Achievements"
            sub="Academic distinctions, competitive qualifications, and international research milestones." />
        </FadeIn>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {ACHIEVEMENTS.map((a, i) => (
            <FadeIn key={i} delay={i*0.07}>
              <div className="group rounded-xl border p-6 flex items-start gap-4 transition-all duration-300"
                style={{ background: C.bg2, borderColor: C.border }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${C.gold}60`; e.currentTarget.style.background = `${C.gold}06`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.bg2; }}>
                <div className="w-9 h-9 rounded border flex items-center justify-center flex-shrink-0"
                  style={{ background: `${C.gold}12`, borderColor: `${C.gold}30` }}>
                  <span style={{ color: C.gold }}>{a.icon}</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold mb-1" style={{ color: C.white }}>{a.title}</h4>
                  <p className="text-xs leading-relaxed" style={{ color: C.silver }}>{a.sub}</p>
                </div>
              </div>
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
  const copy = () => { navigator.clipboard.writeText(email); setCopied(true); setTimeout(() => setCopied(false), 2500); };

  return (
    <section id="contact" className="py-28 px-6" style={{ background: C.bg1 }}>
      <div className="max-w-4xl mx-auto">
        <FadeIn>
          <SectionTitle eyebrow="Get in Touch" title="Contact"
            sub="Open to research collaborations, fellowship opportunities, and conversations in AI and machine learning." />
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="grid md:grid-cols-2 gap-5">
            {/* Email */}
            <div className="rounded-xl border p-7" style={{ background: C.bg2, borderColor: C.border }}>
              <div className="text-[10px] font-bold uppercase tracking-widest mb-5 pb-4 border-b"
                style={{ color: C.gold, borderColor: C.border, fontFamily: "monospace" }}>
                Direct Contact
              </div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded border flex items-center justify-center flex-shrink-0"
                  style={{ background: `${C.gold}10`, borderColor: `${C.gold}30` }}>
                  <Mail size={14} style={{ color: C.gold }} />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest mb-0.5" style={{ color: C.dim, fontFamily: "monospace" }}>Email</div>
                  <span className="text-xs font-medium" style={{ color: C.white, fontFamily: "monospace" }}>{email}</span>
                </div>
              </div>
              <button onClick={copy}
                className="w-full flex items-center justify-center gap-2 py-3 rounded text-sm font-semibold border transition-all duration-200"
                style={{ background: `${C.gold}12`, borderColor: C.gold, color: C.gold, fontFamily: "monospace" }}
                onMouseEnter={e => { e.currentTarget.style.background = `${C.gold}22`; }}
                onMouseLeave={e => { e.currentTarget.style.background = `${C.gold}12`; }}>
                <AnimatePresence mode="wait">
                  {copied
                    ? <motion.span key="c" initial={{scale:0}} animate={{scale:1}} exit={{scale:0}} className="flex items-center gap-2"><Check size={13}/> Copied to Clipboard</motion.span>
                    : <motion.span key="u" initial={{scale:0}} animate={{scale:1}} exit={{scale:0}} className="flex items-center gap-2"><Copy size={13}/> Copy Email Address</motion.span>
                  }
                </AnimatePresence>
              </button>
            </div>

            {/* Links */}
            <div className="rounded-xl border p-7" style={{ background: C.bg2, borderColor: C.border }}>
              <div className="text-[10px] font-bold uppercase tracking-widest mb-5 pb-4 border-b"
                style={{ color: C.gold, borderColor: C.border, fontFamily: "monospace" }}>
                Professional Profiles
              </div>
              <div className="space-y-2.5">
                {[
                  { icon: <Linkedin size={13}/>,    label: "LinkedIn",       sub: "Professional profile",    href: "https://linkedin.com/in/" },
                  { icon: <Github size={13}/>,      label: "GitHub",         sub: "Code & repositories",     href: "https://github.com/" },
                  { icon: <BookOpen size={13}/>,    label: "Publications",   sub: "Research papers",         href: "#placeholder-publications" },
                  { icon: <TrendingUp size={13}/>,  label: "Google Scholar", sub: "Citation index",          href: "#placeholder-scholar" },
                ].map(l => (
                  <a key={l.label} href={l.href} target="_blank" rel="noreferrer"
                    className="group flex items-center gap-3.5 p-3.5 rounded-lg border transition-all duration-200"
                    style={{ background: C.bg3, borderColor: C.border }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = `${C.gold}60`; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; }}>
                    <div className="w-8 h-8 rounded border flex items-center justify-center flex-shrink-0"
                      style={{ background: `${C.gold}10`, borderColor: `${C.gold}30` }}>
                      <span style={{ color: C.gold }}>{l.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold" style={{ color: C.white }}>{l.label}</div>
                      <div className="text-[10px]" style={{ color: C.dim }}>{l.sub}</div>
                    </div>
                    <ExternalLink size={10} style={{ color: C.dim }} className="flex-shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t py-8 px-6" style={{ background: C.bg0, borderColor: C.border }}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded border flex items-center justify-center" style={{ borderColor: C.gold, background: `${C.gold}12` }}>
            <span className="text-[9px] font-bold" style={{ color: C.gold, fontFamily: "monospace" }}>NS</span>
          </div>
          <span className="text-xs" style={{ color: C.dim, fontFamily: "monospace" }}>
            Nikhil Sahotra · Junior Research Fellow · Deepfake Detection & AI
          </span>
        </div>
        <p className="text-[10px]" style={{ color: C.dim, fontFamily: "monospace" }}>
          © 2025 · React · Tailwind CSS · Framer Motion
        </p>
      </div>
    </footer>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────

export default function App() {
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      * { scrollbar-width: thin; scrollbar-color: #1e2535 #080a0d; box-sizing: border-box; }
      ::-webkit-scrollbar { width: 5px; }
      ::-webkit-scrollbar-track { background: #080a0d; }
      ::-webkit-scrollbar-thumb { background: #1e2535; border-radius: 3px; }
      ::-webkit-scrollbar-thumb:hover { background: #2a3347; }
      html { scroll-behavior: smooth; }
      ::selection { background: rgba(184,151,106,0.25); color: #d4b896; }
      body { margin: 0; }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "#080a0d", color: "#e8eaf0" }}>
      <Navbar />
      <Hero />
      <Divider />
      <Timeline />
      <Divider />
      <Research />
      <Divider />
      <Skills />
      <Divider />
      <Achievements />
      <Divider />
      <Contact />
      <Footer />
    </div>
  );
}
