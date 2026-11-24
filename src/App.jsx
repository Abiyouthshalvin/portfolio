import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence, MotionConfig, motion, useInView, useMotionValue,
  useMotionValueEvent, useScroll, useSpring, useTransform, useVelocity,
} from "framer-motion";
import "./index.css";

const RESUME = "/Abiyouth_Shalvin_Resume.pdf";
const PHOTO = "/photo.png";

const LINKS = {
  email: "abiyouthshalvin@gmail.com",
  github: "https://github.com/Abiyouthshalvin",
  linkedin: "https://www.linkedin.com/in/abiyouth-shalvin-333014334",
};

// live = website link, code = GitHub link. Leave "" to hide a button.
const PROJECTS = [
  {
    title: "Sanishsoft Company Website",
    text: "Responsive corporate website for a Chennai web design and development company, built during my role at Adot Publishing Services. Multi-page site covering services, products, blog, FAQ, careers and contact, with enquiry forms, call and WhatsApp buttons, testimonials and scroll animations.",
    stack: ["HTML5", "CSS3", "Bootstrap", "JavaScript", "jQuery", "WordPress"],
    live: "https://sanishsoft.com/",
    code: "",
  },
  {
    title: "SayuTech Business Website",
    text: "Responsive business website for a Chennai web design and development company. Service and project showcase with client logos, testimonials, local SEO landing pages and an enquiry form for free quotes.",
    stack: ["HTML5", "CSS3", "Bootstrap", "JavaScript", "PHP"],
    live: "https://www.sayutech.com/web-design-company-in-chennai.php",
    code: "",
  },
  {
    title: "Chennai Company Website",
    text: "Responsive business website for a Chennai company offering web design, advertising and SMS marketing services. Service pages, client showcase, learning center blog and a business directory section, built on WordPress.",
    stack: ["WordPress", "HTML5", "CSS3", "JavaScript"],
    live: "https://www.chennaicompany.com/",
    code: "",
  },
  {
    title: "Movie Ticket Booking Application",
    text: "Full-stack booking platform with movie browsing, showtime selection and a 4-step booking flow with seat selection and real-time seat availability. Admin and User accounts secured with JWT and role-based permissions.",
    stack: ["MongoDB", "Express.js", "React.js", "Node.js", "JWT"],
    live: "https://movie-ticket-booking-abiyouth.vercel.app/",
    code: "https://github.com/Abiyouthshalvin/Movie-Ticket-Booking",
  },
  {
    title: "E-commerce Application",
    text: "Full-stack store with product search, filtering, sorting, cart and order management, plus order history, wishlist and inventory tracking. Admin and Customer roles, Amazon Payment Services, and a MySQL database using joins, foreign keys and stored procedures.",
    stack: ["React.js", "Node.js", "Express.js", "MySQL"],
    live: "",
    code: "",
  },
  {
    title: "Hospital Token Management System",
    text: "Full-stack hospital queue system with Staff, Doctor and Admin logins secured with JWT and role-based access. Per-doctor token generation, a live doctor queue dashboard (call next, done, skip) and a public waiting-room display. Admin panel to manage users and reset passwords, with a MongoDB database.",
    stack: ["React.js", "Node.js", "Express.js", "MongoDB", "JWT"],
    live: "https://token-system-umber.vercel.app",
    code: "https://github.com/Abiyouthshalvin/Token-System",
  },
];

const EXPERIENCE = [
  {
    role: "React JS Developer",
    company: "Adot Publishing Service",
    place: "Chennai, India",
    period: "September 2025 – October 2026",
    points: [
      "Developed and maintained 10+ responsive web pages using React.js, JavaScript (ES6+), HTML5, CSS3 and Bootstrap.",
      "Built 25+ reusable React components and dynamic UI functionality to improve code maintainability.",
      "Integrated RESTful APIs and handled asynchronous data, including loading, error and success states.",
      "Diagnosed and resolved 20+ UI and functional bugs per month, improving usability and cross-browser compatibility.",
      "Implemented responsive layouts for a consistent experience on desktop, tablet and mobile.",
      "Managed code and collaborated with the team using Git and GitHub.",
    ],
    stack: ["React.js", "JavaScript", "Bootstrap", "REST APIs", "Git"],
  },
];

const SKILLS = {
  Languages: ["JavaScript (ES6+)", "HTML5", "CSS3", "SQL"],
  Frontend: ["React.js", "Hooks", "Material UI", "Bootstrap", "Responsive Design"],
  Backend: ["Node.js", "Express.js", "REST APIs", "JWT Auth", "Role-Based Access"],
  Database: ["MongoDB", "MySQL", "Stored Procedures", "Query Optimization"],
  Tools: ["Git", "GitHub", "VS Code", "Vercel", "Render"],
};


const ROLES = ["MERN Stack Developer", "React JS Developer", "Full Stack Builder"];
const MERN = [
  { k: "M", name: "MongoDB", text: "Schemas, aggregation, Mongoose models" },
  { k: "E", name: "Express.js", text: "REST APIs, middleware, JWT auth" },
  { k: "R", name: "React.js", text: "Hooks, reusable components, responsive UI" },
  { k: "N", name: "Node.js", text: "Server logic, role-based access, deployment" },
];
const EASE = [0.16, 1, 0.3, 1];

/* ================= dot-matrix text: particles that fly in and dodge the cursor ================= */

function DotText({ lines, morph, every = 3800, color = "#f4f4f2", maxFs = 260, align = "left", label }) {
  const variants = morph || [lines];
  const key = JSON.stringify(variants); // stable dependency: parent re-renders must not restart the animation
  const wrap = useRef(null);
  const cvs = useRef(null);

  useEffect(() => {
    const wrapEl = wrap.current, canvas = cvs.current, ctx = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const face = '900 100px Inter, "Arial Black", Arial, sans-serif';
    let parts = [], all = [], raf = 0, timer = 0, visible = false, started = 0, last = 0, W = 0, H = 0, builtW = 0, vi = 0;
    const mouse = { x: -999, y: -999 };

    // Point cloud for one word-set
    const sample = (v, gap) => {
      const off = document.createElement("canvas");
      off.width = W; off.height = H;
      const o = off.getContext("2d");
      o.font = `900 ${v.fs}px Inter, "Arial Black", Arial, sans-serif`;
      o.fillStyle = "#fff";
      o.textAlign = align === "center" ? "center" : "left";
      const oy = (H - v.h) / 2;
      v.ls.forEach((l, i) => o.fillText(l, align === "center" ? W / 2 : 2, oy + (i + 1) * v.lineH - v.fs * 0.1));
      const data = o.getImageData(0, 0, W, H).data, pts = [];
      for (let y = gap / 2; y < H; y += gap)
        for (let x = gap / 2; x < W; x += gap)
          if (data[((y | 0) * W + (x | 0)) * 4 + 3] > 140) pts.push({ x, y });
      return pts;
    };

    // Send every dot to a spot in the next word. Dots slide left-to-right so the change reads as one shape morphing into another.
    const assign = (pts, gap, instant) => {
      const T = pts.length;
      while (parts.length < T) parts.push({ x: Math.random() * W, y: Math.random() * H, vx: 0, vy: 0, a: 0, ta: 1, r: gap * 0.36, d: 0, p: Math.random() * 6.28, tx: 0, ty: 0 });
      parts.sort((p, q) => p.x - q.x || p.y - q.y);
      const P = parts.length;
      let prev = -1;
      parts.forEach((p, i) => {
        const j = Math.min(T - 1, Math.floor((i * T) / P));
        p.tx = pts[j].x; p.ty = pts[j].y; p.ta = j !== prev ? 1 : 0; prev = j;
        if (instant) { p.x = p.tx; p.y = p.ty; p.a = p.ta; }
      });
    };

    const build = () => {
      W = wrapEl.clientWidth;
      if (!W) return;
      builtW = W;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const probe = document.createElement("canvas").getContext("2d");
      probe.font = face;
      let cap = maxFs; // every word is drawn at the first word's letter size, so the block never grows
      const info = variants.map((ls) => {
        const widest = Math.max(...ls.map((l) => probe.measureText(l).width));
        const fs = Math.min(cap, ((W * 0.98) / widest) * 100), lineH = fs * 0.92;
        if (cap === maxFs) cap = fs;
        return { ls, fs, lineH, h: Math.ceil(ls.length * lineH + fs * 0.12) };
      });
      H = Math.max(...info.map((i) => i.h));
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + "px"; canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const gap = Math.max(4, Math.round(Math.min(...info.map((i) => i.fs)) / 24));
      all = info.map((v) => sample(v, gap));
      parts = [];
      vi = 0;
      assign(all[0], gap, false);
      parts.forEach((p) => { p.a = 1; p.d = Math.random() * 700; if (reduce) { p.x = p.tx; p.y = p.ty; } else { p.y = (Math.random() - 0.5) * H * 3 + H / 2; } });
      build.gap = gap;
      started = last = performance.now();
      draw(started);
    };

    const draw = (now) => {
      ctx.clearRect(0, 0, W, H);
      const t = now - started;
      const dt = Math.min(Math.max((now - last) / 16.67, 0.5), 3);
      last = now;
      const base = new Path2D(), hot = new Path2D();
      for (const p of parts) {
        if (!reduce && t > p.d) {
          p.vx += (p.tx - p.x) * 0.06 * dt; p.vy += (p.ty - p.y) * 0.06 * dt;
          const dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy;
          if (d2 < 11000) { const d = Math.sqrt(d2) || 1, f = (1 - d / 105) * 7; p.vx += (dx / d) * f * dt; p.vy += (dy / d) * f * dt; }
          const damp = Math.pow(0.85, dt);
          p.vx *= damp; p.vy *= damp; p.x += p.vx * dt; p.y += p.vy * dt;
          p.a += (p.ta - p.a) * 0.12 * dt;
        }
        const rad = p.r * p.a;
        if (rad < 0.4) continue;
        const wob = reduce ? 0 : Math.sin(now / 700 + p.tx / 38 + p.p * 0.1) * 1.1;
        const moving = Math.abs(p.vx) + Math.abs(p.vy) > 1.4, path = moving ? hot : base;
        path.moveTo(p.x + rad, p.y + wob);
        path.arc(p.x, p.y + wob, rad, 0, 6.283);
      }
      ctx.fillStyle = color; ctx.fill(base);
      ctx.fillStyle = "#d71921"; ctx.fill(hot);
      if (visible && !reduce) raf = requestAnimationFrame(draw);
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) { if (!all.length) build(); raf = requestAnimationFrame(draw); }
    }, { threshold: 0.05 });
    io.observe(wrapEl);

    if (variants.length > 1 && !reduce) {
      timer = setInterval(() => {
        if (!visible || !all.length) return;
        vi = (vi + 1) % variants.length;
        assign(all[vi], build.gap, false);
      }, every);
    }

    const move = (e) => {
      const r = canvas.getBoundingClientRect(), pt = e.touches ? e.touches[0] : e;
      mouse.x = pt.clientX - r.left; mouse.y = pt.clientY - r.top;
    };
    const ro = new ResizeObserver(() => {
      if (wrapEl.clientWidth === builtW) return;
      cancelAnimationFrame(raf); build();
      if (visible && !reduce) raf = requestAnimationFrame(draw);
    });
    ro.observe(wrapEl);
    window.addEventListener("mousemove", move);
    window.addEventListener("touchmove", move, { passive: true });
    return () => {
      cancelAnimationFrame(raf); clearInterval(timer); io.disconnect(); ro.disconnect();
      window.removeEventListener("mousemove", move); window.removeEventListener("touchmove", move);
    };
  }, [key, color, maxFs, align, every]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div ref={wrap} className="dottext" role="img" aria-label={label || variants[0].join(" ")}>
      <canvas ref={cvs} aria-hidden="true" />
    </div>
  );
}

/* Section that morphs as it scrolls in: shrunk, rounded card that grows to full-bleed */
function Morph({ id, className, children }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.2"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.86, 1]);
  const borderRadius = useTransform(scrollYProgress, [0, 1], [80, 0]);
  return (
    <motion.section id={id} ref={ref} className={className} style={{ scale, borderRadius, transformOrigin: "50% 100%" }}>
      {children}
    </motion.section>
  );
}

/* ================= small helpers ================= */

function Preloader({ onDone }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setN((v) => Math.min(v + 2, 100)), 22);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    if (n === 100) { const t = setTimeout(onDone, 300); return () => clearTimeout(t); }
  }, [n, onDone]);
  return (
    <motion.div className="preloader" exit={{ clipPath: "circle(0% at 50% 50%)" }} transition={{ duration: 0.9, ease: EASE }}>
      <div className="pre-dots" aria-hidden="true">
        {Array.from({ length: 25 }).map((_, i) => (
          <i key={i} style={{ opacity: n / 100 * 25 > i ? 1 : 0.12, background: i === 12 ? "#d71921" : undefined }} />
        ))}
      </div>
      <p>{String(n).padStart(3, "0")} / 100</p>
    </motion.div>
  );
}

function Cursor() {
  const x = useMotionValue(-100), y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 450, damping: 38, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 450, damping: 38, mass: 0.4 });
  const [big, setBig] = useState(false);
  const [fine, setFine] = useState(false);
  useEffect(() => {
    setFine(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
    const move = (e) => { x.set(e.clientX); y.set(e.clientY); };
    const over = (e) => setBig(!!e.target.closest?.("a, button, input, textarea, .grow"));
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseover", over); };
  }, [x, y]);
  if (!fine) return null;
  return (
    <>
      <motion.div className="cursor" style={{ x: sx, y: sy }} animate={{ scale: big ? 2.6 : 1 }} transition={{ duration: 0.2 }} />
      <motion.div className="cursor-dot" style={{ x, y }} />
    </>
  );
}

function Magnetic({ children, strength = 0.3 }) {
  const ref = useRef(null);
  const x = useSpring(0, { stiffness: 200, damping: 15 });
  const y = useSpring(0, { stiffness: 200, damping: 15 });
  const move = (e) => {
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  return (
    <motion.div ref={ref} className="magnet" style={{ x, y }} onMouseMove={move} onMouseLeave={() => { x.set(0); y.set(0); }}>
      {children}
    </motion.div>
  );
}

function Word({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  return <motion.span style={{ opacity }}>{children} </motion.span>;
}
function ScrollText({ text }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "end 0.55"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className="scroll-text">
      {words.map((w, i) => <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>{w}</Word>)}
    </p>
  );
}

function CountUp({ to, suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf; const start = performance.now();
    const tick = (t) => {
      const p = Math.min((t - start) / 1400, 1);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);
  return <span ref={ref}>{n}{suffix}</span>;
}

function useTyping(words) {
  const [text, setText] = useState("");
  const [del, setDel] = useState(false);
  const [i, setI] = useState(0);
  useEffect(() => {
    const word = words[i % words.length];
    let delay = del ? 30 : 70;
    if (!del && text === word) delay = 1400;
    const t = setTimeout(() => {
      if (!del && text === word) setDel(true);
      else if (del && text === "") { setDel(false); setI(i + 1); }
      else setText(del ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1));
    }, delay);
    return () => clearTimeout(t);
  }, [text, del, i, words]);
  return text;
}

function DubaiClock() {
  const fmt = () => new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Dubai", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(new Date());
  const [t, setT] = useState(fmt());
  useEffect(() => { const id = setInterval(() => setT(fmt()), 1000); return () => clearInterval(id); }, []);
  return <time>{t}</time>;
}

function Marquee({ items, reverse = false }) {
  const row = [...items, ...items];
  const { scrollY } = useScroll();
  const smooth = useSpring(useVelocity(scrollY), { stiffness: 200, damping: 40 });
  const skewX = useTransform(smooth, [-2500, 2500], [-12, 12]);
  return (
    <motion.div className="marquee" style={{ skewX }} aria-hidden="true">
      <div className={`track${reverse ? " rev" : ""}`}>
        {row.map((t, i) => <span key={i}>{t}<i /></span>)}
      </div>
    </motion.div>
  );
}

function ProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 24 });
  return <motion.div className="progress" style={{ scaleX }} />;
}

// Glyph strip: a column of LEDs that light up as you scroll
function Glyph() {
  const { scrollYProgress } = useScroll();
  const [lit, setLit] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setLit(Math.round(v * 14)));
  return (
    <div className="glyph" aria-hidden="true">
      {Array.from({ length: 14 }).map((_, i) => <i key={i} className={i < lit ? "on" : ""} />)}
    </div>
  );
}

const reveal = (i = 0) => ({
  initial: { opacity: 0, y: 40, scale: 0.97 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.7, ease: EASE, delay: i * 0.08 },
});

/* ================= graphics ================= */

// Hero backdrop: grid of dots that swell and glow red around the cursor
function DotGrid() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current, ctx = c.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0, H = 0, raf = 0, vis = false;
    const m = { x: -999, y: -999 };
    const size = () => {
      const r = c.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width; H = r.height; c.width = W * dpr; c.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const draw = (t) => {
      ctx.clearRect(0, 0, W, H);
      const S = 30;
      for (let y = S / 2; y < H; y += S) {
        for (let x = S / 2; x < W; x += S) {
          const near = Math.max(0, 1 - Math.hypot(x - m.x, y - m.y) / 200);
          const w = reduce ? 0.3 : (Math.sin(t / 1100 + x * 0.012 + y * 0.008) + 1) / 2;
          ctx.fillStyle = near > 0.45 ? `rgba(215,25,33,${0.35 + near * 0.65})` : `rgba(255,255,255,${0.09 + w * 0.12 + near * 0.5})`;
          ctx.beginPath(); ctx.arc(x, y, 1 + w * 0.9 + near * 4.2, 0, 6.283); ctx.fill();
        }
      }
      if (vis && !reduce) raf = requestAnimationFrame(draw);
    };
    size(); draw(0);
    const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; cancelAnimationFrame(raf); if (vis) raf = requestAnimationFrame(draw); });
    io.observe(c);
    const ro = new ResizeObserver(() => { size(); if (reduce) draw(0); });
    ro.observe(c);
    const move = (e) => { const r = c.getBoundingClientRect(); m.x = e.clientX - r.left; m.y = e.clientY - r.top; };
    window.addEventListener("mousemove", move);
    return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); window.removeEventListener("mousemove", move); };
  }, []);
  return <canvas ref={ref} className="dotgrid" aria-hidden="true" />;
}

// Rotating dotted globe with a pulsing marker on Dubai and M-E-R-N nodes orbiting it
const CODE = [
  "const dev = {",
  '  name: "Abiyouth Shalvin",',
  '  role: "MERN Stack Developer",',
  '  stack: ["MongoDB", "Express", "React", "Node"],',
  '  location: "Dubai, UAE",',
  "  openToWork: true,",
  "};",
  "",
  'dev.build("something great");',
];
function colorize(line) {
  return line.split(/("[^"]*"?|\bconst\b|\btrue\b)/).map((t, i) => {
    if (t.startsWith('"')) return <span key={i} className="t-s">{t}</span>;
    if (t === "const" || t === "true") return <span key={i} className="t-k">{t}</span>;
    return t;
  });
}
// Code window that types itself out when scrolled into view
function Terminal() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const full = CODE.join("\n");
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setN(full.length); return; }
    const id = setInterval(() => setN((v) => (v >= full.length ? v : v + 1)), 28);
    return () => clearInterval(id);
  }, [inView, full.length]);
  const lines = full.slice(0, n).split("\n");
  return (
    <div className="terminal" ref={ref} aria-label="Code snippet describing Abiyouth Shalvin" role="img">
      <div className="t-bar"><i className="r" /><i /><i /><span>dev.js</span></div>
      <pre>
        {lines.map((l, i) => (
          <div className="t-line" key={i}><em>{i + 1}</em><span>{colorize(l)}{i === lines.length - 1 && <b className="caret">▍</b>}</span></div>
        ))}
      </pre>
    </div>
  );
}

function Badge() {
  return (
    <svg viewBox="0 0 200 200" className="badge" aria-hidden="true">
      <defs><path id="badge-circle" d="M100,100 m-76,0 a76,76 0 1,1 152,0 a76,76 0 1,1 -152,0" /></defs>
      <g className="badge-spin">
        <text><textPath href="#badge-circle" textLength="470" lengthAdjust="spacing">OPEN TO WORK • MERN DEVELOPER • DUBAI, UAE • </textPath></text>
      </g>
      <circle cx="100" cy="100" r="14" fill="#d71921" className="badge-dot" />
    </svg>
  );
}

// Giant words that slide sideways as you scroll
function BigWords() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x1 = useTransform(scrollYProgress, [0, 1], ["12%", "-48%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["-48%", "12%"]);
  return (
    <div className="bigwords dark" ref={ref} aria-hidden="true">
      <motion.div className="bw outline" style={{ x: x1 }}>MONGODB • EXPRESS • REACT • NODE • MONGODB • EXPRESS •</motion.div>
      <motion.div className="bw" style={{ x: x2 }}>FULL STACK • DEVELOPER • DUBAI • FULL STACK • DEVELOPER •</motion.div>
    </div>
  );
}

// Little website wireframes drawn on the monitor screen, one layout per project
const WIRES = [
  [[0, 0, 12, 1], [0, 1, 12, 3, 1], [0, 4, 4, 3], [4, 4, 4, 3], [8, 4, 4, 3]],
  [[0, 0, 12, 1], [0, 1, 3, 4, 1], [3, 1, 3, 4], [6, 1, 3, 4], [9, 1, 3, 4], [0, 5, 12, 2]],
  [[0, 0, 12, 1], [0, 1, 3, 6], [3, 1, 3, 2, 1], [6, 1, 3, 2], [9, 1, 3, 2], [3, 3, 3, 2], [6, 3, 3, 2], [9, 3, 3, 2], [3, 5, 9, 2]],
  [[0, 0, 3, 7], [3, 0, 9, 1], [3, 1, 4, 3, 1], [7, 1, 5, 3], [3, 4, 9, 3]],
];
function Wire({ i }) {
  const w = WIRES[i % WIRES.length];
  return (
    <div className="wire" aria-hidden="true">
      {w.map(([c, r, cw, rh, hot], k) => (
        <motion.i key={`${i}-${k}`} className={hot ? "hot" : ""} style={{ gridColumn: `${c + 1} / span ${cw}`, gridRow: `${r + 1} / span ${rh}` }}
          initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: k * 0.06, duration: 0.4, ease: EASE }} />
      ))}
    </div>
  );
}

// Cards lean toward the cursor (uses the CSS `rotate` property so it never fights framer-motion's transform)
function useTilt() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let el = null;
    const reset = () => { if (el) { el.style.rotate = ""; el = null; } };
    const move = (e) => {
      const t = e.target.closest?.(".card");
      if (t !== el) { reset(); el = t; }
      if (!el) return;
      const r = el.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
      const rx = -py * 9, ry = px * 9, ang = Math.hypot(rx, ry);
      el.style.rotate = ang ? `${rx / ang} ${ry / ang} 0 ${ang}deg` : "";
    };
    window.addEventListener("pointermove", move);
    return () => { window.removeEventListener("pointermove", move); reset(); };
  }, []);
}


/* ================= hero: MERN request flow (packets that transform at every hop) ================= */
const FLOW_NODES = [["R", "React", "UI"], ["E", "Express", "API"], ["N", "Node.js", "SERVER"], ["M", "MongoDB", "DATABASE"]];
const FLOW_STEPS = [
  { p: 0, t: "onClick()", s: "pill" }, { p: 1, t: "GET /api/movies", s: "square" },
  { p: 2, t: "controller()", s: "diamond" }, { p: 3, t: "find({})", s: "pill" },
  { p: 3, t: "{ _id, title }", s: "square", back: true }, { p: 2, t: "JSON.stringify", s: "diamond", back: true },
  { p: 1, t: "200 OK", s: "pill", back: true }, { p: 0, t: "<MovieCard />", s: "square", back: true },
];
function StackFlow() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setI((v) => (v + 1) % FLOW_STEPS.length), 1300);
    return () => clearInterval(id);
  }, []);
  const st = FLOW_STEPS[i];
  return (
    <motion.div className="flow" aria-label="MERN request flow: React, Express, Node.js, MongoDB" role="img" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3, duration: 0.8, ease: EASE }}>
      <div className="flow-track"><i className="flow-fill" style={{ width: `${(st.p / 3) * 100}%` }} /></div>
      <div className="flow-pkt" style={{ left: `calc(12.5% + ${st.p * 25}%)` }}>
        <span key={i} className={`chip ${st.s} ${st.back ? "resp" : ""}`}>{st.t}</span>
        <b className={`flow-dot ${st.back ? "resp" : ""}`} />
      </div>
      <div className="flow-nodes">
        {FLOW_NODES.map(([l, name, role], n) => (
          <div key={name} className={`flow-node ${st.p === n ? "on" : ""}`}>
            <span className="ic">{l}</span>
            <strong>{name}</strong>
            <small>{role}</small>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// text that decodes itself whenever it changes
function Scramble({ text }) {
  const [out, setOut] = useState(text);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setOut(text); return; }
    const chars = "01<>{}/#_[]";
    let f = 0;
    const id = setInterval(() => {
      f++;
      setOut(text.split("").map((c, k) => (c === " " || k < f / 2 ? c : chars[(Math.random() * chars.length) | 0])).join(""));
      if (f > text.length * 2) { clearInterval(id); setOut(text); }
    }, 32);
    return () => clearInterval(id);
  }, [text]);
  return <span aria-label={text}>{out}</span>;
}

/* ================= sections ================= */

const NAV = [
  ["home", "Home"], ["about", "About"], ["education", "Education"], ["experience", "Experience"],
  ["projects", "Projects"], ["skills", "Skills"], ["contact", "Contact"],
];

function Nav() {
  const [active, setActive] = useState("home");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hover, setHover] = useState(false);
  const [vw, setVw] = useState(typeof window === "undefined" ? 1280 : window.innerWidth);
  const ref = useRef(null);
  useEffect(() => {
    const onScroll = () => {
      let cur = NAV[0][0];
      for (const [id] of NAV) {
        const s = document.getElementById(id);
        if (s && s.getBoundingClientRect().top <= 200) cur = id;
      }
      setActive(cur);
      setScrolled(window.scrollY > 80);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      ref.current?.style.setProperty("--p", max > 0 ? Math.min(1, window.scrollY / max).toFixed(3) : "0");
    };
    const onResize = () => setVw(window.innerWidth);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onResize); };
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const esc = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open]);

  const wide = vw >= 900;
  const expanded = wide && (!scrolled || hover);
  const full = Math.min(880, vw - 32);
  const width = wide ? (expanded ? full : 300) : full;
  const idx = Math.max(0, NAV.findIndex(([id]) => id === active));
  const label = NAV[idx][1];

  return (
    <>
      <motion.header
        ref={ref}
        className={`nav ${expanded ? "is-open" : "is-compact"}`}
        initial={{ y: -90, opacity: 0, width }}
        animate={{ y: 0, opacity: 1, width }}
        transition={{ duration: 0.6, ease: EASE, y: { duration: 0.8, delay: 0.3 }, opacity: { duration: 0.8, delay: 0.3 } }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onFocus={() => setHover(true)}
        onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setHover(false); }}
      >
        <a className="logo" href="#home"><i />AS</a>
        <div className="nav-mid">
          <AnimatePresence mode="wait" initial={false}>
            {expanded ? (
              <motion.nav key="links" className="nav-links" aria-label="Primary" initial={{ opacity: 0, filter: "blur(8px)", scale: 0.92 }} animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }} exit={{ opacity: 0, filter: "blur(8px)", scale: 0.92 }} transition={{ duration: 0.3, ease: EASE }}>
                {NAV.map(([id, l]) => (
                  <a key={id} href={`#${id}`} className={active === id ? "on" : ""}>
                    {active === id && <motion.span layoutId="nav-pill" className="nav-pill" transition={{ duration: 0.35, ease: EASE }} />}
                    <span className="nav-txt">{l}</span>
                  </a>
                ))}
              </motion.nav>
            ) : (
              <motion.button key="now" type="button" className="nav-now" aria-label={`Current section: ${label}. Open menu`} onClick={() => (wide ? setHover(true) : setOpen(true))} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.25, ease: EASE }}>
                <em>{String(idx + 1).padStart(2, "0")}/{String(NAV.length).padStart(2, "0")}</em>
                <Scramble text={label.toUpperCase()} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
        <svg className="nav-ring" viewBox="0 0 36 36" aria-hidden="true"><circle className="ring-bg" cx="18" cy="18" r="14" /><circle className="ring-fg" cx="18" cy="18" r="14" /></svg>
        {!wide && <button className="menu-btn" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? "Close" : "Menu"}</button>}
      </motion.header>
      <AnimatePresence>
        {open && (
          <motion.div className="overlay" initial={{ clipPath: "circle(0% at 90% 4%)" }} animate={{ clipPath: "circle(150% at 90% 4%)" }} exit={{ clipPath: "circle(0% at 90% 4%)" }} transition={{ duration: 0.6, ease: EASE }}>
            {NAV.map(([id, l], i) => (
              <motion.a key={id} href={`#${id}`} onClick={() => setOpen(false)} initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.15 + i * 0.06, duration: 0.5, ease: EASE }}>
                <em>{String(i + 1).padStart(2, "0")}</em>{l}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Hero() {
  const role = useTyping(ROLES);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  return (
    <section id="home" className="hero dark" ref={ref}>
      <DotGrid />
      <motion.div className="hero-inner" style={{ y, opacity: fade }}>
        <motion.p className="mono-label" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
          <i className="led" /> Open to work · Dubai, UAE
        </motion.p>
        <DotText lines={["ABIYOUTH", "SHALVIN"]} morph={[["ABIYOUTH", "SHALVIN"], ["MERN", "DEVELOPER"], ["FULL", "STACK"]]} maxFs={165} label="Abiyouth Shalvin, MERN Stack Developer" />
        <StackFlow />
        <motion.div className="hero-bottom" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: 0.8, ease: EASE }}>
          <div>
            <p className="typing">{`> ${role}`}<b className="caret">_</b></p>
            <p className="lead">1 year as a React JS Developer. I build responsive full-stack apps with MongoDB, Express, React and Node.js.</p>
          </div>
          <div className="row">
            <Magnetic><a className="btn solid" href="#projects">View projects</a></Magnetic>
            <Magnetic><a className="btn" href={RESUME} download="Abiyouth_Shalvin_Resume.pdf">Download resume ↓</a></Magnetic>
          </div>
        </motion.div>
      </motion.div>
      <div className="scroll-hint" aria-hidden="true"><i /><span>Scroll</span></div>
    </section>
  );
}

function About() {
  return (
    <Morph id="about" className="sec light">
      <div className="wrap">
        <p className="eyebrow">( 01 ) About</p>
        <DotText lines={["ABOUT"]} morph={[["ABOUT"], ["ME"]]} every={4200} color="#0a0a0a" maxFs={150} />
        <div className="bento">
          <motion.div className="card c-intro" {...reveal(0)}>
            <ScrollText text="MERN Stack Developer who turns ideas into complete, working products. I build responsive full-stack apps with MongoDB, Express.js, React.js and Node.js, plus MySQL, with clean REST APIs and secure authentication." />
          </motion.div>
          <motion.div className="card c-photo grow" {...reveal(1)} whileHover={{ y: -6 }}>
            <img src={PHOTO} alt="Portrait of Abiyouth Shalvin" />
          </motion.div>
          <motion.div className="card c-stats" {...reveal(2)}>
            <div><b><CountUp to={1} suffix="+" /></b><span>Year experience</span></div>
            <div><b><CountUp to={25} suffix="+" /></b><span>React components</span></div>
            <div><b><CountUp to={PROJECTS.length} /></b><span>Projects</span></div>
          </motion.div>
          <motion.div className="card c-clock invert" {...reveal(3)}>
            <span className="mono-label">DXB · Dubai, UAE</span>
            <b><DubaiClock /></b>
          </motion.div>
          <motion.div className="card c-term invert" {...reveal(0)}><Terminal /></motion.div>
          <motion.div className="card c-badge invert" {...reveal(1)}>
            <Badge />
            <p className="mono-label">1 year · React JS · MERN</p>
          </motion.div>
          <motion.div className="card c-open invert" {...reveal(0)}>
            <p><i className="led" /> Open to React JS and MERN developer roles</p>
            <Magnetic><a className="btn solid-light" href="#contact">Say hello →</a></Magnetic>
          </motion.div>
        </div>
      </div>
    </Morph>
  );
}

function Education() {
  const EDU = [
    ["B.E. Computer Science Engineering", "Jeppiaar Engineering College, Chennai", "2022 – 2025"],
    ["Diploma in Computer Science", "Morning Star Polytechnic College, Nagercoil", "2019 – 2022"],
    ["MERN Stack Course", "Naresh IT, Hyderabad", "Apr – Aug 2025"],
  ];
  return (
    <Morph id="education" className="sec light tight">
      <div className="wrap">
        <p className="eyebrow">( 02 ) Education</p>
        <DotText lines={["EDUCATION"]} morph={[["EDUCATION"], ["B.E. CSE"]]} every={4200} color="#0a0a0a" maxFs={130} />
        <div className="edu-grid">
          {EDU.map(([t, sch, y], i) => (
            <motion.div key={t} className="card c-edu grow" {...reveal(i)} whileHover={{ y: -6 }}>
              <span className="mono-label">{y}</span>
              <div><h3>{t}</h3><p>{sch}</p></div>
            </motion.div>
          ))}
        </div>
      </div>
    </Morph>
  );
}

function Experience() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.75", "end 0.6"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 25 });
  return (
    <Morph id="experience" className="sec dark">
      <div className="wrap">
        <p className="eyebrow">( 03 ) Experience</p>
        <DotText lines={["EXPERIENCE"]} morph={[["EXPERIENCE"], ["1 YEAR"]]} every={4200} maxFs={130} />
        {EXPERIENCE.map((e) => (
          <div className="exp" ref={ref} key={e.company}>
            <div className="exp-line"><motion.span style={{ scaleY }} /></div>
            <div>
              <motion.div className="exp-head" {...reveal(0)}>
                <h3>{e.role}</h3>
                <p>{e.company} · {e.place}</p>
                <span className="mono-label">{e.period}</span>
              </motion.div>
              <ul>
                {e.points.map((p, i) => (
                  <motion.li key={p} initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.9 }} transition={{ duration: 0.55, ease: EASE, delay: i * 0.03 }}>
                    <em>{String(i + 1).padStart(2, "0")}</em><span>{p}</span>
                  </motion.li>
                ))}
              </ul>
              <p className="stack">{e.stack.join("  /  ")}</p>
            </div>
          </div>
        ))}
      </div>
    </Morph>
  );
}

// Pinned phone: scroll and the screen swaps to the next project
function Projects() {
  const ref = useRef(null);
  const rig = useRef(null);
  const [idx, setIdx] = useState(0);
  const n = PROJECTS.length;
  const p = PROJECTS[idx];
  const [full, setFull] = useState(false);

  // the monitor stays frozen; scrolling pans the projects across its screen, one after another
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const span = el.offsetHeight - window.innerHeight;
      const pr = Math.min(1, Math.max(0, span > 0 ? -r.top / span : 0));
      const t = pr * (n - 1);
      const k = Math.min(n - 2, Math.floor(t));
      const l = t - k;
      const s = Math.min(1, Math.max(0, (l - 0.25) / 0.5));
      const e = s * s * (3 - 2 * s);          // dwell on each project, then glide to the next
      const pos = n > 1 ? k + e : 0;
      rig.current?.style.setProperty("--pos", pos.toFixed(3));
      const near = Math.round(pos);
      setIdx((cur) => (cur === near ? cur : near));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, [n]);

  useEffect(() => {
    document.body.style.overflow = full ? "hidden" : "";
    const esc = (e) => e.key === "Escape" && setFull(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [full]);

  const jump = (i) => {
    const el = ref.current;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + (el.offsetHeight - window.innerHeight) * ((i + 0.5) / n), behavior: "smooth" });
  };
  const host = p.live ? new URL(p.live).host : "private project";

  return (
    <section id="projects" className="proj dark" ref={ref} style={{ height: `${n * 90 + 20}vh` }}>
      <div className="proj-sticky">
        <div className="proj-left">
          <p className="eyebrow">( 04 ) Selected work</p>
          <div className="proj-count"><b>{String(idx + 1).padStart(2, "0")}</b><span>/ {String(n).padStart(2, "0")}</span></div>
          <AnimatePresence mode="wait">
            <motion.h3 key={idx} initial={{ opacity: 0, x: 60, filter: "blur(8px)" }} animate={{ opacity: 1, x: 0, filter: "blur(0px)" }} exit={{ opacity: 0, x: -60, filter: "blur(8px)" }} transition={{ duration: 0.35, ease: EASE }}>{p.title}</motion.h3>
          </AnimatePresence>
        </div>

        <div className="proj-stage">
          <div className="mon3d" ref={rig} style={{ "--n": n }}>
            <div className="monitor" role="button" tabIndex={0} aria-label={`Expand ${p.title}`} onClick={() => setFull(true)} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setFull(true)}>
              <div className="mon-screen">
                <div className="mon-bar"><i className="r" /><i /><i /><span>{host}</span></div>
                <div className="mon-view">
                  <div className="mon-strip" style={{ width: `${n * 100}%` }}>
                    {PROJECTS.map((q, k) => (
                      <div className="mon-body slide" key={q.title} aria-hidden={k !== idx}>
                        <Wire i={k} />
                        <div className="mon-text">
                          <b>{String(k + 1).padStart(2, "0")}</b>
                          <h4>{q.title}</h4>
                          <div className="chips">{q.stack.slice(0, 5).map((t) => <span key={t}>{t}</span>)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="screen-bar" />
              </div>
            </div>
            <i className="m-neck" aria-hidden="true" />
            <i className="m-foot" aria-hidden="true" />
          </div>
          <p className="expand-hint">Scroll to browse · click the screen to expand</p>
        </div>

        <div className="proj-right">
          <AnimatePresence mode="wait">
            <motion.div key={idx} initial={{ opacity: 0, x: 60, filter: "blur(8px)" }} animate={{ opacity: 1, x: 0, filter: "blur(0px)" }} exit={{ opacity: 0, x: -60, filter: "blur(8px)" }} transition={{ duration: 0.35, ease: EASE }}>
              <p className="proj-text">{p.text}</p>
              <p className="stack">{p.stack.join("  /  ")}</p>
              <div className="row">
                {p.live && <a className="btn solid" href={p.live} target="_blank" rel="noreferrer">Open live demo ↗</a>}
                {p.code && <a className="btn" href={p.code} target="_blank" rel="noreferrer">View code ↗</a>}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="proj-dots" role="tablist" aria-label="Projects">
          {PROJECTS.map((q, i) => (
            <button key={q.title} role="tab" aria-selected={i === idx} aria-label={q.title} className={i === idx ? "on" : ""} onClick={() => jump(i)} />
          ))}
        </div>
      </div>
      <AnimatePresence>
        {full && (
          <motion.div className="mon-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setFull(false)}>
            <motion.div className="mon-full" initial={{ opacity: 0, scale: 0.88, rotateX: 18 }} animate={{ opacity: 1, scale: 1, rotateX: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.45, ease: EASE }} onClick={(e) => e.stopPropagation()} role="dialog" aria-label={p.title}>
              <div className="mon-bar">
                <i className="r" /><i /><i />
                <span>{host}</span>
                <button className="mon-close" onClick={() => setFull(false)}>Close ✕</button>
              </div>
              <motion.div className="mon-full-body" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5, ease: EASE }}>
                <Wire i={idx} />
                <b>{String(idx + 1).padStart(2, "0")}</b>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
                <p className="stack">{p.stack.join("  /  ")}</p>
                <div className="row">
                  {p.live && <a className="btn solid" href={p.live} target="_blank" rel="noreferrer">Open live demo ↗</a>}
                  {p.code && <a className="btn" href={p.code} target="_blank" rel="noreferrer">View code ↗</a>}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function Skills() {
  const all = Object.values(SKILLS).flat();
  return (
    <Morph id="skills" className="sec light">
      <div className="wrap">
        <p className="eyebrow">( 05 ) Skills</p>
        <DotText lines={["SKILLS"]} morph={[["SKILLS"], ["MERN"]]} every={4200} color="#0a0a0a" maxFs={150} />
        <div className="mern-grid">
          {MERN.map((m, i) => (
            <motion.div key={m.k} className="mern-card grow" tabIndex={0} {...reveal(i)}>
              <div className="flip">
                <div className="face front"><b>{m.k}</b><h3>{m.name}</h3></div>
                <div className="face back"><i className="led" /><h3>{m.name}</h3><p>{m.text}</p></div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="specs">
          {Object.entries(SKILLS).map(([g, items], i) => (
            <motion.div key={g} className="spec-row" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.8 }}>
              <motion.span className="spec-line" variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1 } }} transition={{ duration: 0.8, ease: EASE, delay: i * 0.05 }} />
              <strong>{g}</strong>
              <span>{items.join("  /  ")}</span>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="dark-band"><Marquee items={all} /><Marquee items={[...all].reverse()} reverse /></div>
    </Morph>
  );
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const check = (name, v) => {
  v = v.trim();
  if (name === "name" && !v) return "Enter your name so I know who to reply to.";
  if (name === "email" && !v) return "Enter your email so I can reply.";
  if (name === "email" && !EMAIL_RE.test(v)) return "Check your email. It should look like name@example.com.";
  if (name === "message" && !v) return "Write a short message so I know how to help.";
  return "";
};

function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "", website: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: "", text: "" });
  const [sending, setSending] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };
  const onBlur = (e) => setErrors((p) => ({ ...p, [e.target.name]: check(e.target.name, e.target.value) }));

  const submit = async (e) => {
    e.preventDefault();
    const next = {};
    ["name", "email", "message"].forEach((k) => (next[k] = check(k, form[k])));
    setErrors(next);
    if (Object.values(next).some(Boolean)) { setStatus({ type: "error", text: "Fix the marked fields, then send again." }); return; }
    const endpoint = import.meta.env.VITE_FORM_ENDPOINT;
    if (!endpoint) { setStatus({ type: "error", text: `The form is not available right now. Email me at ${LINKS.email}.` }); return; }
    try {
      setSending(true); setStatus({ type: "", text: "" });
      const res = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error("fail");
      setStatus({ type: "success", text: "Message sent. I will reply soon." });
      setForm({ name: "", email: "", message: "", website: "" }); setErrors({});
    } catch {
      setStatus({ type: "error", text: `Your message did not send. Try again, or email me at ${LINKS.email}.` });
    } finally { setSending(false); }
  };

  const field = (name, label, props = {}) => (
    <div className="field">
      <label htmlFor={`f-${name}`}>{label}</label>
      {props.area
        ? <textarea id={`f-${name}`} name={name} rows="4" value={form[name]} onChange={onChange} onBlur={onBlur} aria-invalid={!!errors[name]} />
        : <input id={`f-${name}`} name={name} type={props.type || "text"} autoComplete={props.ac} value={form[name]} onChange={onChange} onBlur={onBlur} aria-invalid={!!errors[name]} />}
      <AnimatePresence>
        {errors[name] && <motion.p className="field-error" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>{errors[name]}</motion.p>}
      </AnimatePresence>
    </div>
  );

  return (
    <form className="form" onSubmit={submit} noValidate>
      <input name="website" value={form.website} onChange={onChange} tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0 }} />
      {field("name", "Name", { ac: "name" })}
      {field("email", "Email", { type: "email", ac: "email" })}
      {field("message", "Message", { area: true })}
      <Magnetic><button className="btn solid" type="submit" aria-busy={sending}>{sending ? "Sending message" : "Send message"}</button></Magnetic>
      <p className={`status ${status.type}`} role="status" aria-live="polite">{status.text}</p>
    </form>
  );
}

function Contact() {
  return (
    <Morph id="contact" className="sec dark">
      <div className="wrap">
        <p className="eyebrow">( 06 ) Contact</p>
        <DotText lines={["SAY", "HELLO"]} morph={[["SAY", "HELLO"], ["HIRE", "ME"]]} every={4200} maxFs={165} />
        <div className="contact-grid">
          <div>
            <p className="lead">Open to React JS and MERN developer roles. Send a message or reach me here.</p>
            <ul className="links">
              <li><span>Email</span><a href={`mailto:${LINKS.email}`}>{LINKS.email}</a></li>
              <li><span>GitHub</span><a href={LINKS.github} target="_blank" rel="noreferrer">Abiyouthshalvin ↗</a></li>
              <li><span>LinkedIn</span><a href={LINKS.linkedin} target="_blank" rel="noreferrer">abiyouth-shalvin ↗</a></li>
              <li><span>Location</span><b>Dubai, UAE</b></li>
            </ul>
            <Magnetic><a className="btn" href={RESUME} download="Abiyouth_Shalvin_Resume.pdf">Download resume ↓</a></Magnetic>
          </div>
          <ContactForm />
        </div>
      </div>
    </Morph>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);
  useTilt();
  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>{loading && <Preloader onDone={() => setLoading(false)} />}</AnimatePresence>
      <Cursor />
      <ProgressBar />
      <Glyph />
      <Nav />
      <main>
        <Hero />
        <Marquee items={["MongoDB", "Express.js", "React.js", "Node.js", "JavaScript", "REST APIs", "JWT", "MySQL"]} />
        <About />
        <Education />
        <Experience />
        <BigWords />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <footer className="foot">
        <div className="wordmark" aria-hidden="true">ABIYOUTH</div>
        <div className="footer">
          <span><i className="led" /> © 2026 Abiyouth Shalvin</span>
          <a href="#home">Back to top ↑</a>
        </div>
      </footer>
    </MotionConfig>
  );
}
