import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence, MotionConfig, motion, motionValue, useInView,
  useMotionValueEvent, useScroll, useTransform,
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


/* Optional: drop a real screenshot in /public/projects/ and set its path here, e.g. "/projects/movie.png".
   Empty = an illustrated preview is drawn instead. */
const SHOTS = {
  "Sanishsoft Company Website": { kind: "site", img: "" },
  "SayuTech Business Website": { kind: "site", img: "" },
  "Chennai Company Website": { kind: "site", img: "" },
  "Movie Ticket Booking Application": { kind: "cinema", img: "" },
  "E-commerce Application": { kind: "shop", img: "" },
  "Hospital Token Management System": { kind: "queue", img: "" },
};

const SKILL_GROUPS = [
  { title: "Frontend", glyph: "</>", hue: "blue", items: ["HTML5", "CSS3", "JavaScript", "React.js", "Redux", "Bootstrap", "jQuery"] },
  { title: "Backend", glyph: "{ }", hue: "violet", items: ["Node.js", "Express.js", "REST APIs", "JWT Authentication"] },
  { title: "Database", glyph: "DB", hue: "cyan", items: ["MongoDB", "MySQL"] },
  { title: "Tools", glyph: "$_", hue: "blue", items: ["Git", "GitHub", "VS Code", "MongoDB Compass"] },
  { title: "Also working with", glyph: "+", hue: "violet", items: ["TypeScript", "Material UI", "SQL", "Responsive Design", "Role-Based Access", "Stored Procedures"] },
];

const MERN = [
  { k: "M", name: "MongoDB", text: "Collections, queries and validated documents." },
  { k: "E", name: "Express.js", text: "REST APIs, middleware and JWT-protected routes." },
  { k: "R", name: "React.js", text: "Hooks, reusable components and responsive UI." },
  { k: "N", name: "Node.js", text: "Server logic, role-based access and deployment." },
];

const NAV = [
  ["home", "Home"], ["about", "About"], ["skills", "Skills"],
  ["experience", "Experience"], ["projects", "Projects"], ["contact", "Contact"],
];
const SECTION_IDS = ["home", "about", "skills", "experience", "projects", "process", "contact"];
const EASE = [0.16, 1, 0.3, 1];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ramp = (p, a, b) => clamp((p - a) / (b - a));

/* ================= shared hooks ================= */
function useMedia(q) {
  const [m, setM] = useState(() => typeof window !== "undefined" && window.matchMedia(q).matches);
  useEffect(() => {
    const mq = window.matchMedia(q);
    const f = () => setM(mq.matches);
    f(); mq.addEventListener("change", f);
    return () => mq.removeEventListener("change", f);
  }, [q]);
  return m;
}
const useReduced = () => useMedia("(prefers-reduced-motion: reduce)");
const useCompact = () => useMedia("(max-width: 820px), (pointer: coarse)");

/* One smoothed pointer for the whole site. Mouse on desktop, touch position on phones. */
const mx = motionValue(0), my = motionValue(0);      // -1..1, eased
const pxv = motionValue(-999), pyv = motionValue(-999); // pixels, eased
const target = { x: 0, y: 0, px: -999, py: -999, seen: false };
let pointerOn = false;
function startPointer() {
  if (pointerOn || typeof window === "undefined") return;
  pointerOn = true;
  const set = (x, y) => {
    if (!target.seen) { target.seen = true; pxv.set(x); pyv.set(y); }
    target.px = x; target.py = y;
    target.x = (x / window.innerWidth) * 2 - 1;
    target.y = (y / window.innerHeight) * 2 - 1;
  };
  window.addEventListener("pointermove", (e) => set(e.clientX, e.clientY), { passive: true });
  window.addEventListener("touchmove", (e) => { const t = e.touches[0]; if (t) set(t.clientX, t.clientY); }, { passive: true });
  window.addEventListener("touchstart", (e) => { const t = e.touches[0]; if (t) set(t.clientX, t.clientY); }, { passive: true });
  const tick = () => {
    mx.set(mx.get() + (target.x - mx.get()) * 0.07);
    my.set(my.get() + (target.y - my.get()) * 0.07);
    if (target.seen) {
      pxv.set(pxv.get() + (target.px - pxv.get()) * 0.16);
      pyv.set(pyv.get() + (target.py - pyv.get()) * 0.16);
    }
    requestAnimationFrame(tick);
  };
  tick();
}

/* Scroll offsets (px) of the main sections, used to move the fixed 3D model between them. */
function useSectionTops() {
  const [tops, setTops] = useState(null);
  useEffect(() => {
    const measure = () => {
      const y = window.scrollY;
      const t = ["home", "about", "skills", "experience", "projects"].map((id) => {
        const el = document.getElementById(id);
        return el ? Math.round(el.getBoundingClientRect().top + y) : 0;
      });
      setTops((p) => (p && p.join() === t.join() ? p : t));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure);
    return () => { ro.disconnect(); window.removeEventListener("resize", measure); };
  }, []);
  return tops;
}

/* ================= small building blocks ================= */
function Magnetic({ children, strength = 0.35 }) {
  const ref = useRef(null);
  const compact = useCompact();
  const move = (e) => {
    if (compact) return;
    const r = ref.current.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) * strength;
    const dy = (e.clientY - (r.top + r.height / 2)) * strength;
    ref.current.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
  };
  const leave = () => { ref.current.style.transform = ""; };
  return <span ref={ref} className="mag" onPointerMove={move} onPointerLeave={leave}>{children}</span>;
}

function Tilt({ children, className = "", max = 9, zoom = 1.04, active = true }) {
  const ref = useRef(null);
  const compact = useCompact();
  const move = (e) => {
    if (compact || !active) return;
    const el = ref.current, r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--rx", `${((0.5 - y) * max * 2).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${((x - 0.5) * max * 2).toFixed(2)}deg`);
    el.style.setProperty("--gx", `${(x * 100).toFixed(1)}%`);
    el.style.setProperty("--gy", `${(y * 100).toFixed(1)}%`);
  };
  const leave = () => {
    const s = ref.current.style;
    s.setProperty("--rx", "0deg"); s.setProperty("--ry", "0deg");
  };
  return (
    <div ref={ref} className={`tilt ${className}`} style={{ "--z": zoom }} onPointerMove={move} onPointerLeave={leave}>
      {children}
      <span className="tilt-glare" aria-hidden="true" />
    </div>
  );
}

/* Line-by-line reveal: measures the real wrapped lines and staggers them. */
function Lines({ text, as: Tag = "p", className = "", delay = 0, play, stagger = 0.1 }) {
  const ref = useRef(null);
  const [lines, setLines] = useState(null);
  const seen = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const words = text.split(" ");
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      let top = null, n = -1;
      const out = [...el.querySelectorAll(".lr-m")].map((w) => {
        if (top === null || Math.abs(w.offsetTop - top) > 4) { top = w.offsetTop; n++; }
        return n;
      });
      setLines((p) => (p && p.join() === out.join() ? p : out));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, [text]);
  const on = play === undefined ? seen : play;
  return (
    <Tag ref={ref} className={`lr ${on ? "on" : ""} ${className}`} aria-label={text}>
      {words.map((w, i) => (
        <span key={i}>
          <span className="lr-m" aria-hidden="true">
            <span className="lr-w" style={{ transitionDelay: `${delay + (lines ? lines[i] : 0) * stagger}s` }}>{w}</span>
          </span>{" "}
        </span>
      ))}
    </Tag>
  );
}

/* Headings where every line is written out explicitly. */
function HeadLines({ lines, as: Tag = "h2", className = "", delay = 0, now = false }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 80); return () => clearTimeout(t); }, []);
  const on = now ? mounted : seen;
  return (
    <Tag ref={ref} className={`hl ${on ? "on" : ""} ${className}`}>
      {lines.map((l, i) => (
        <span className="hl-m" key={i}>
          <span className="hl-l" style={{ transitionDelay: `${delay + i * 0.12}s` }}>{l}</span>
        </span>
      ))}
    </Tag>
  );
}

function CountUp({ to, suffix = "" }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true });
  const reduce = useReduced();
  const [v, setV] = useState(reduce ? to : 0);
  useEffect(() => {
    if (!seen || reduce) { if (reduce) setV(to); return; }
    let raf, t0;
    const step = (t) => {
      t0 = t0 ?? t;
      const k = clamp((t - t0) / 1400);
      setV(Math.round(to * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [seen, to, reduce]);
  return <span ref={ref}>{v}{suffix}</span>;
}

const reveal = (i = 0) => ({
  initial: { opacity: 0, y: 44 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-8% 0px" },
  transition: { duration: 0.85, delay: i * 0.08, ease: EASE },
});

function Eyebrow({ n, children }) {
  return <p className="eyebrow"><span>{n}</span><i />{children}</p>;
}

/* drag / swipe for the carousels (mouse + touch), no listeners on the cards themselves */
function useDrag(onStep, threshold = 60) {
  const [dx, setDx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const start = useRef(null);
  const moved = useRef(false);
  const stepRef = useRef(onStep);
  stepRef.current = onStep;
  useEffect(() => {
    if (!dragging) return;
    const move = (e) => {
      const d = e.clientX - start.current;
      if (Math.abs(d) > 6) moved.current = true;
      setDx(d);
    };
    const up = (e) => {
      const d = e.clientX - start.current;
      if (Math.abs(d) > threshold) stepRef.current(d < 0 ? 1 : -1);
      setDragging(false); setDx(0);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [dragging, threshold]);
  const bind = {
    onPointerDown: (e) => {
      if (e.button !== undefined && e.button !== 0) return;
      start.current = e.clientX; moved.current = false; setDragging(true);
    },
    onClickCapture: (e) => { if (moved.current) { e.preventDefault(); e.stopPropagation(); moved.current = false; } },
  };
  return { dx, dragging, bind };
}

/* ================= site-wide mouse / touch effects ================= */
function Cursor() {
  const fine = useMedia("(hover: hover) and (pointer: fine)");
  const [hot, setHot] = useState(false);
  useEffect(() => {
    if (!fine) return;
    const over = (e) => setHot(!!e.target.closest?.("a, button, input, textarea, [data-hot]"));
    window.addEventListener("pointerover", over, { passive: true });
    return () => window.removeEventListener("pointerover", over);
  }, [fine]);
  if (!fine) return null;
  return (
    <>
      <motion.div className={`cursor ${hot ? "hot" : ""}`} style={{ x: pxv, y: pyv }} aria-hidden="true" />
      <motion.div className="cursor-dot" style={{ x: pxv, y: pyv }} aria-hidden="true" />
    </>
  );
}

function Spotlight() {
  return <motion.div className="spot" style={{ x: pxv, y: pyv }} aria-hidden="true" />;
}

function Particles() {
  const ref = useRef(null);
  const compact = useCompact();
  const reduce = useReduced();
  useEffect(() => {
    const c = ref.current, ctx = c.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let W = 0, H = 0, raf = 0, on = true;
    const cols = ["79,124,255", "139,92,246", "34,211,238"];
    const N = reduce ? 28 : compact ? 34 : 72;
    let parts = [];
    const resize = () => {
      W = window.innerWidth; H = window.innerHeight;
      c.width = W * dpr; c.height = H * dpr;
      c.style.width = W + "px"; c.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    parts = Array.from({ length: N }, (_, i) => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.28, vy: (Math.random() - 0.5) * 0.28,
      r: Math.random() * 1.5 + 0.7, col: cols[i % 3],
    }));
    const draw = (move) => {
      ctx.clearRect(0, 0, W, H);
      const { px, py } = target;
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        if (move) {
          p.x += p.vx; p.y += p.vy;
          const dx = p.x - px, dy = p.y - py, d2 = dx * dx + dy * dy;
          if (d2 < 26000) { const d = Math.sqrt(d2) || 1, f = (1 - d2 / 26000) * 2.2; p.x += (dx / d) * f; p.y += (dy / d) * f; }
          if (p.x < -10) p.x = W + 10; if (p.x > W + 10) p.x = -10;
          if (p.y < -10) p.y = H + 10; if (p.y > H + 10) p.y = -10;
        }
        ctx.fillStyle = `rgba(${p.col},0.75)`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
        if (!compact) for (let j = i + 1; j < parts.length; j++) {
          const q = parts[j], ex = p.x - q.x, ey = p.y - q.y, e2 = ex * ex + ey * ey;
          if (e2 < 11000) { ctx.strokeStyle = `rgba(${p.col},${0.16 * (1 - e2 / 11000)})`; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
        }
      }
    };
    const loop = () => { if (on) draw(true); raf = requestAnimationFrame(loop); };
    if (reduce) draw(false); else loop();
    const vis = () => { on = !document.hidden; };
    document.addEventListener("visibilitychange", vis);
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); document.removeEventListener("visibilitychange", vis); window.removeEventListener("resize", resize); };
  }, [compact, reduce]);
  return <canvas ref={ref} className="particles" aria-hidden="true" />;
}

function ProgressBar() {
  const { scrollYProgress } = useScroll();
  return <motion.div className="progress" style={{ scaleX: scrollYProgress }} />;
}

/* ================= fixed 3D model (CSS 3D laptop, follows you through Hero > About > Skills) ================= */
function Model3D() {
  const tops = useSectionTops();
  const compact = useCompact();
  const reduce = useReduced();
  const { scrollY } = useScroll();
  const W = typeof window !== "undefined" ? window.innerWidth : 1280;
  const H = typeof window !== "undefined" ? window.innerHeight : 800;
  const t = tops || [0, H, H * 2, H * 3, H * 4];
  const marks = [0, t[1], Math.max(t[1] + 1, t[2] - H * 0.9), Math.max(t[1] + 2, t[2]), Math.max(t[1] + 3, t[3] + H * 0.15)];
  // keep the marks strictly increasing
  for (let i = 1; i < marks.length; i++) if (marks[i] <= marks[i - 1]) marks[i] = marks[i - 1] + 1;
  const xs = compact ? [0.22 * W, 0.26 * W, 0.26 * W, 0.26 * W, 0.26 * W] : [0.24 * W, -0.27 * W, -0.27 * W, 0.37 * W, 0.37 * W];
  const ys = compact ? [-0.22 * H, -0.3 * H, -0.3 * H, -0.34 * H, -0.34 * H] : [0.02 * H, 0.22 * H, 0.22 * H, -0.3 * H, -0.3 * H];
  const ss = compact ? [0.55, 0.4, 0.4, 0.34, 0.34] : [1.1, 0.74, 0.74, 0.42, 0.42];
  const os = compact ? [0.4, 0.2, 0.15, 0, 0] : [1, 0.95, 0.9, 0.55, 0];
  const x = useTransform(scrollY, marks, xs);
  const y = useTransform(scrollY, marks, ys);
  const scale = useTransform(scrollY, marks, ss);
  const opacity = useTransform(scrollY, marks, os);
  const spin = useTransform(scrollY, [0, 4000], reduce ? [0, 0] : [0, 160]);
  const ry0 = useTransform(mx, [-1, 1], reduce ? [0, 0] : [-26, 26]);
  const rx0 = useTransform(my, [-1, 1], reduce ? [0, 0] : [10, -10]);
  const ry = useTransform([ry0, spin], ([a, b]) => a + Math.sin((b * Math.PI) / 180) * 18);
  return (
    <motion.div className="m3d" style={{ x, y, scale, opacity }} aria-hidden="true">
      <motion.div className="m3d-rot" style={{ rotateX: rx0, rotateY: ry }}>
        <div className="lp-glow" />
        <div className="lp">
          <div className="lp-screen">
            <div className="lp-bar"><i /><i /><i /><span>server.js</span></div>
            <div className="lp-code">
              <div className="lp-scroll">
                {[...CODE_LINES, ...CODE_LINES].map((l, i) => (
                  <p key={i} style={{ "--w": l[0], paddingLeft: l[1] * 12 }}><b className={l[2]} style={{ width: `${l[0]}%` }} /></p>
                ))}
              </div>
            </div>
          </div>
          <div className="lp-base"><span /></div>
        </div>
        <div className="orbit o1"><i /></div>
        <div className="orbit o2"><i /></div>
      </motion.div>
    </motion.div>
  );
}
const CODE_LINES = [
  [46, 0, "b"], [30, 1, "v"], [58, 1, "c"], [38, 2, "b"], [64, 2, "v"], [24, 1, "c"], [52, 1, "b"], [34, 2, "c"],
  [70, 2, "v"], [28, 1, "b"], [44, 0, "c"], [56, 1, "v"],
];

/* ================= navigation ================= */
function Nav() {
  const [active, setActive] = useState("home");
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => {
      const y = window.scrollY + window.innerHeight * 0.4;
      let cur = "home";
      SECTION_IDS.forEach((id) => { const el = document.getElementById(id); if (el && el.getBoundingClientRect().top + window.scrollY <= y) cur = id; });
      setActive(cur === "process" ? "projects" : cur);
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); };
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const esc = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    return () => { window.removeEventListener("keydown", esc); document.body.style.overflow = ""; };
  }, [open]);
  return (
    <>
      <motion.header className="nav" initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}>
        <a className="logo" href="#home" aria-label="Abiyouth Shalvin, home"><span className="logo-mark">A</span><b>Abiyouth</b></a>
        <nav className="nav-links" aria-label="Primary">
          {NAV.map(([id, label]) => (
            <a key={id} href={`#${id}`} className={active === id ? "on" : ""} aria-current={active === id ? "true" : undefined}>
              {active === id && <motion.span layoutId="navpill" className="nav-pill" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
              <span className="nav-txt">{label}</span>
            </a>
          ))}
        </nav>
        <button className="burger" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
          <i className={open ? "x" : ""} /><i className={open ? "x" : ""} />
        </button>
      </motion.header>
      <AnimatePresence>
        {open && (
          <motion.div className="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            {NAV.map(([id, label], i) => (
              <motion.a key={id} href={`#${id}`} onClick={() => setOpen(false)} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 * i + 0.05, duration: 0.5, ease: EASE }}>
                <small>0{i + 1}</small>{label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ================= HERO: layered parallax ================= */
function Floater({ scroll, d, cls = "", style, children }) {
  const reduce = useReduced();
  const y = useTransform(scroll, [0, 1], reduce ? [0, 0] : [0, -300 * d]);
  const px = useTransform(mx, [-1, 1], reduce ? [0, 0] : [-40 * d, 40 * d]);   // opposite to the cursor
  const py = useTransform(my, [-1, 1], reduce ? [0, 0] : [-28 * d, 28 * d]);
  return (
    <motion.div className={`floater ${cls}`} style={{ ...style, y }}>
      <motion.div style={{ x: px, y: py }}>{children}</motion.div>
    </motion.div>
  );
}

const Cube = () => (
  <div className="cube">{["f", "b", "r", "l", "t", "bt"].map((f) => <i key={f} className={f} />)}</div>
);

function Hero() {
  const ref = useRef(null);
  const compact = useCompact();
  const reduce = useReduced();
  const { scrollYProgress: sp } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const gridY = useTransform(sp, [0, 1], reduce ? [0, 0] : [0, 90]);
  const blobY = useTransform(sp, [0, 1], reduce ? [0, 0] : [0, 180]);
  const blobX = useTransform(mx, [-1, 1], reduce ? [0, 0] : [50, -50]);
  const typeY = useTransform(sp, [0, 1], reduce ? [0, 0] : [0, -140]);
  const typeX = useTransform(mx, [-1, 1], reduce ? [0, 0] : [-30, 30]);
  const contentY = useTransform(sp, [0, 1], reduce ? [0, 0] : [0, -70]);
  const contentO = useTransform(sp, [0, 0.7], reduce ? [1, 1] : [1, 0]);
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 80); return () => clearTimeout(t); }, []);
  return (
    <section id="home" ref={ref} className="hero">
      {/* layer 1: far grid */}
      <motion.div className="layer l-grid" style={{ y: gridY }} />
      {/* layer 2: colour blobs */}
      <motion.div className="layer l-blobs" style={{ y: blobY, x: blobX }}><i className="b1" /><i className="b2" /><i className="b3" /></motion.div>
      {/* layer 3: giant outlined type */}
      <motion.div className="layer l-type" style={{ y: typeY, x: typeX }} aria-hidden="true">
        <span>MERN</span>
      </motion.div>
      {/* layer 4: floating objects at different depths */}
      <div className="layer l-float" aria-hidden="true">
        <Floater scroll={sp} d={0.5} cls="f1" style={{ left: "8%", top: "22%" }}><div className="chip">{"</>"}</div></Floater>
        <Floater scroll={sp} d={1.4} cls="f2" style={{ left: "46%", top: "14%" }}><Cube /></Floater>
        <Floater scroll={sp} d={0.8} cls="f3" style={{ left: "58%", top: "70%" }}><div className="ring" /></Floater>
        <Floater scroll={sp} d={1.1} cls="f4" style={{ left: "5%", top: "68%" }}><div className="chip alt">JWT</div></Floater>
        <Floater scroll={sp} d={0.35} cls="f5" style={{ left: "36%", top: "82%" }}><div className="dotp" /></Floater>
        {!compact && <>
          <Floater scroll={sp} d={1.7} cls="f6" style={{ left: "88%", top: "12%" }}><div className="chip">{"{ }"}</div></Floater>
          <Floater scroll={sp} d={0.9} cls="f7" style={{ left: "78%", top: "78%" }}><Cube /></Floater>
          <Floater scroll={sp} d={0.6} cls="f8" style={{ left: "26%", top: "10%" }}><div className="chip alt">API</div></Floater>
          <Floater scroll={sp} d={1.25} cls="f9" style={{ left: "92%", top: "52%" }}><div className="ring sm" /></Floater>
          <Floater scroll={sp} d={0.45} cls="f10" style={{ left: "16%", top: "46%" }}><div className="dotp b" /></Floater>
        </>}
      </div>

      <motion.div className="hero-in wrap" style={{ y: contentY, opacity: contentO }}>
        <motion.p className="pill" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8, ease: EASE }}>
          <i className="led" /> Open to React JS &amp; MERN roles · Dubai, UAE
        </motion.p>
        <h1 className="hero-h" aria-label="Hi, I'm Abiyouth Shalvin">
          <HeadLines as="span" now lines={["Hi, I'm"]} delay={0.5} className="h-sm" />
          <HeadLines as="span" now lines={["Abiyouth", "Shalvin"]} delay={0.65} className="h-big grad" />
        </h1>
        <motion.p className="hero-sub" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 0.8, ease: EASE }}>
          Software Developer <span>|</span> MERN Stack Developer
        </motion.p>
        <Lines className="hero-p" delay={1.2} play={ready}
          text="I build complete, working web products with MongoDB, Express.js, React.js and Node.js. Responsive interfaces, clean REST APIs and secure JWT authentication, shipped from the first sketch to a live deploy." />
        <motion.div className="cta" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.7, duration: 0.8, ease: EASE }}>
          <Magnetic><a className="btn primary" href="#projects">View My Projects <span aria-hidden="true">→</span></a></Magnetic>
          <Magnetic><a className="btn glass" href={RESUME} download="Abiyouth_Shalvin_Resume.pdf">Download Resume <span aria-hidden="true">↓</span></a></Magnetic>
          <Magnetic><a className="btn ghost" href="#contact">Contact Me</a></Magnetic>
        </motion.div>
      </motion.div>

      <a className="scroll-cue" href="#about" aria-label="Scroll down to About">
        <span className="mouse"><i /></span><small>Scroll</small>
      </a>
    </section>
  );
}

/* ================= SIDEWAYS TEXT ================= */
function Sideways() {
  const ref = useRef(null);
  const reduce = useReduced();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const a = useTransform(p, [0, 1], reduce ? [0, 0] : ["8%", "-38%"]);
  const b = useTransform(p, [0, 1], reduce ? [0, 0] : ["-45%", "5%"]);
  const c = useTransform(p, [0, 1], reduce ? [0, 0] : ["6%", "-30%"]);
  const row = (t, x, cls) => (
    <motion.div className={`sw-row ${cls}`} style={{ x }}>
      {[0, 1, 2].map((k) => <span key={k}>{t}<i /></span>)}
    </motion.div>
  );
  return (
    <section className="sideways" ref={ref} aria-label="Full stack developer, building digital experiences, creative developer">
      {row("FULL STACK DEVELOPER", a, "")}
      {row("BUILDING DIGITAL EXPERIENCES", b, "out")}
      {row("CREATIVE DEVELOPER", c, "")}
    </section>
  );
}

/* ================= ABOUT: pinned heading + line reveal ================= */
const ABOUT_STAGES = [
  { n: "01", t: "Who I am", s: "MERN developer · Dubai" },
  { n: "02", t: "My path", s: "Experience · education · numbers" },
  { n: "03", t: "How I build", s: "The stack behind every project" },
];

function About() {
  const ref = useRef(null);
  const reduce = useReduced();
  const { scrollYProgress: sp } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [stage, setStage] = useState(0);
  useMotionValueEvent(sp, "change", (v) => setStage(Math.min(2, Math.floor(v * 3))));
  const bgX = useTransform(sp, [0, 1], reduce ? [0, 0] : [260, -1100]);
  const fill = useTransform(sp, [0, 1], [0, 1]);
  const S = ABOUT_STAGES[stage];
  return (
    <section id="about" ref={ref} className="about">
      <motion.div className="bg-word" style={{ x: bgX }} aria-hidden="true">DEVELOPER · DEVELOPER</motion.div>
      <div className="wrap pin-grid">
        <div className="pin-left">
          <div className="pin-in">
            <Eyebrow n="01">About</Eyebrow>
            <AnimatePresence mode="wait">
              <motion.div key={stage} initial={{ opacity: 0, y: 46, filter: "blur(10px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -34, filter: "blur(8px)" }} transition={{ duration: 0.55, ease: EASE }}>
                <h2 className="pin-h"><span className="grad">{S.t}</span></h2>
                <p className="pin-s">{S.s}</p>
              </motion.div>
            </AnimatePresence>
            <div className="pin-track" aria-hidden="true">
              <motion.i style={{ scaleY: fill }} />
              {ABOUT_STAGES.map((a, i) => <b key={a.n} className={i <= stage ? "on" : ""} style={{ top: `${i * 50}%` }}>{a.n}</b>)}
            </div>
          </div>
        </div>

        <div className="pin-right">
          <div className="pin-block b1">
            <Lines as="p" className="lead" text="MERN Stack Developer who turns ideas into complete, working products." />
            <Lines className="body" delay={0.1} text="I build responsive full-stack apps with MongoDB, Express.js, React.js and Node.js, plus MySQL, with clean REST APIs and secure authentication. I care about the details users feel: fast pages, clear states and layouts that hold up on every screen." />
            <Lines className="body" delay={0.15} text="I completed a Diploma and a B.E. in Computer Science, then a MERN stack course at Naresh IT in Hyderabad. Since September 2025 I have been building React interfaces at Adot Publishing Service in Chennai, and I am now based in Dubai." />
            <motion.div {...reveal(1)}>
              <Tilt className="photo-card" max={7} zoom={1.03}>
                <img src={PHOTO} alt="Portrait of Abiyouth Shalvin" loading="lazy" />
              </Tilt>
            </motion.div>
          </div>

          <div className="pin-block b2">
            <div className="stats">
              {[[1, "+", "Year of experience"], [10, "+", "Responsive pages built"], [25, "+", "React components"], [PROJECTS.length, "", "Projects shipped"]].map(([n, s, l], i) => (
                <motion.div key={l} className="glass stat" {...reveal(i)}>
                  <b><CountUp to={n} suffix={s} /></b><span>{l}</span>
                </motion.div>
              ))}
            </div>
            <ol className="path">
              {[["2019 – 2022", "Diploma in Computer Science", "Morning Star Polytechnic College, Nagercoil"],
                ["2022 – 2025", "B.E. Computer Science Engineering", "Jeppiaar Engineering College, Chennai"],
                ["Apr – Aug 2025", "MERN Stack Course", "Naresh IT, Hyderabad"],
                ["Sep 2025 – now", "React JS Developer", "Adot Publishing Service, Chennai"]].map(([y, t, s], i) => (
                <motion.li key={t} className="glass" {...reveal(i)}>
                  <span>{y}</span><div><b>{t}</b><small>{s}</small></div>
                </motion.li>
              ))}
            </ol>
          </div>

          <div className="pin-block b3">
            <div className="mern">
              {MERN.map((m, i) => (
                <motion.div key={m.k} {...reveal(i)}>
                  <Tilt className="glass mern-card" max={11}>
                    <b>{m.k}</b><h3>{m.name}</h3><p>{m.text}</p>
                  </Tilt>
                </motion.div>
              ))}
            </div>
            <motion.div className="open glass" {...reveal(1)}>
              <p><i className="led" /> Open to React JS and MERN developer roles</p>
              <Magnetic><a className="btn primary" href="#contact">Say hello <span aria-hidden="true">→</span></a></Magnetic>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= SKILLS: card arc carousel ================= */
function SkillCard({ g, active }) {
  const max = 7, r = 26, C = 2 * Math.PI * r;
  return (
    <div className={`glass skill-card hue-${g.hue} ${active ? "is-active" : ""}`}>
      <div className="sk-top">
        <span className="sk-glyph">{g.glyph}</span>
        <svg className="sk-ring" viewBox="0 0 64 64" aria-hidden="true">
          <circle cx="32" cy="32" r={r} className="trk" />
          <circle cx="32" cy="32" r={r} className="val" style={{ strokeDasharray: C, strokeDashoffset: active ? C * (1 - g.items.length / max) : C }} />
          <text x="32" y="37" textAnchor="middle">{g.items.length}</text>
        </svg>
      </div>
      <h3>{g.title}</h3>
      <ul>
        {g.items.map((it, i) => <li key={it} style={{ "--d": `${i * 0.12}s` }}>{it}</li>)}
      </ul>
    </div>
  );
}

function ArcCarousel({ items }) {
  const [idx, setIdx] = useState(1);
  const n = items.length;
  const go = (d) => setIdx((i) => clamp(i + d, 0, n - 1));
  const { dx, dragging, bind } = useDrag(go, 50);
  const compact = useCompact();
  const R = compact ? 380 : 560, TH = compact ? 30 : 25;
  const gap = compact ? 190 : 250;
  const onKey = (e) => { if (e.key === "ArrowRight") { e.preventDefault(); go(1); } if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); } };
  return (
    <div className="arc" role="group" aria-roledescription="carousel" aria-label="Skill groups">
      <div className={`arc-view ${dragging ? "drag" : ""}`} tabIndex={0} onKeyDown={onKey} {...bind}>
        <div className="arc-stage">
          {items.map((g, i) => {
            const o = i - idx - dx / gap, a = Math.abs(o);
            const rad = (o * TH * Math.PI) / 180;
            const x = R * Math.sin(rad), z = R * (Math.cos(rad) - 1);
            const s = 1.06 - Math.min(a, 1) * 0.2;
            return (
              <div key={g.title} className="arc-card" aria-hidden={Math.round(a) !== 0}
                style={{ transform: `translate3d(${x}px, ${a * a * 8}px, ${z}px) rotateY(${-o * TH}deg) scale(${s})`, opacity: clamp(1 - a * 0.3, 0, 1), zIndex: 100 - Math.round(a * 10), pointerEvents: a > 2.2 ? "none" : "auto" }}
                onClick={() => setIdx(i)}>
                <SkillCard g={g} active={Math.round(a) === 0} />
              </div>
            );
          })}
        </div>
      </div>
      <div className="car-ctl">
        <button className="arrow" aria-label="Previous skill group" onClick={() => go(-1)} disabled={idx === 0}>←</button>
        <div className="dots">{items.map((g, i) => <button key={g.title} className={i === idx ? "on" : ""} aria-label={`Show ${g.title}`} onClick={() => setIdx(i)} />)}</div>
        <button className="arrow" aria-label="Next skill group" onClick={() => go(1)} disabled={idx === n - 1}>→</button>
      </div>
    </div>
  );
}

function Skills() {
  return (
    <section id="skills" className="sec skills">
      <div className="wrap">
        <Eyebrow n="02">Technical skills</Eyebrow>
        <HeadLines className="sec-h" lines={["Tools I reach for", "every single day."]} />
        <Lines className="sec-p" text="Drag, swipe or use the arrows. Each card is one part of the stack, from the screen a user touches to the database behind it." />
      </div>
      <ArcCarousel items={SKILL_GROUPS} />
    </section>
  );
}

/* ================= EXPERIENCE: stacking cards ================= */
function StackCard({ i, n, p, children }) {
  const reduce = useReduced();
  const last = i === n - 1;
  const scale = useTransform(p, [i / n, 1], reduce || last ? [1, 1] : [1, 1 - (n - 1 - i) * 0.05 - 0.03]);
  const dim = useTransform(p, [(i + 0.35) / n, 1], reduce || last ? [0, 0] : [0, 0.6]);
  return (
    <motion.div className="stack-item" style={{ "--i": i, scale }}>
      <div className="glass stack-card">{children}</div>
      <motion.span className="stack-dim" style={{ opacity: dim }} aria-hidden="true" />
    </motion.div>
  );
}

function Experience() {
  const ref = useRef(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const job = EXPERIENCE[0];
  const cards = [
    <>
      <div className="sc-head"><span className="sc-n">01</span><span className="sc-tag">Work experience</span></div>
      <h3>{job.role}</h3>
      <p className="sc-sub">{job.company} · {job.place}</p>
      <p className="sc-when">{job.period}</p>
      <div className="badges">{job.stack.map((s) => <span key={s}>{s}</span>)}</div>
    </>,
    <>
      <div className="sc-head"><span className="sc-n">02</span><span className="sc-tag">What I delivered</span></div>
      <ul className="sc-list">{job.points.map((t) => <li key={t}>{t}</li>)}</ul>
    </>,
    <>
      <div className="sc-head"><span className="sc-n">03</span><span className="sc-tag">Education</span></div>
      <ul className="edu">
        {[["B.E. Computer Science Engineering", "Jeppiaar Engineering College, Chennai", "2022 – 2025"],
          ["Diploma in Computer Science", "Morning Star Polytechnic College, Nagercoil", "2019 – 2022"],
          ["MERN Stack Course", "Naresh IT, Hyderabad", "Apr – Aug 2025"]].map(([t, s, y]) => (
          <li key={t}><span>{y}</span><div><b>{t}</b><small>{s}</small></div></li>
        ))}
      </ul>
    </>,
  ];
  return (
    <section id="experience" className="sec experience">
      <div className="wrap">
        <Eyebrow n="03">Experience &amp; education</Eyebrow>
        <HeadLines className="sec-h" lines={["Where I have", "built and learned."]} />
      </div>
      <div className="wrap stack" ref={ref}>
        {cards.map((c, i) => <StackCard key={i} i={i} n={cards.length} p={p}>{c}</StackCard>)}
      </div>
    </section>
  );
}

/* ================= PROJECTS: focus-frame slider + 3D zoom cards ================= */
function Mock({ kind }) {
  if (kind === "cinema") return (
    <div className="mock cinema">
      <div className="mk-bar"><i /><i /><i /></div>
      <div className="mk-screen" />
      <div className="seats">{Array.from({ length: 40 }, (_, i) => <i key={i} className={[11, 12, 13, 22, 23].includes(i) ? "sel" : [4, 5, 17, 18, 30, 31, 32].includes(i) ? "taken" : ""} />)}</div>
    </div>
  );
  if (kind === "shop") return (
    <div className="mock shop">
      <div className="mk-bar"><i /><i /><i /></div>
      <div className="mk-search" />
      <div className="tiles">{Array.from({ length: 6 }, (_, i) => <div key={i}><span /><b /><em /></div>)}</div>
    </div>
  );
  if (kind === "queue") return (
    <div className="mock queue">
      <div className="mk-bar"><i /><i /><i /></div>
      <div className="now"><small>NOW SERVING</small><b>A-024</b></div>
      <div className="next"><span>A-025</span><span>A-026</span><span>A-027</span></div>
    </div>
  );
  return (
    <div className="mock site">
      <div className="mk-bar"><i /><i /><i /></div>
      <div className="mk-hero"><b /><b /><em /></div>
      <div className="mk-cards"><i /><i /><i /></div>
    </div>
  );
}

function ProjectCard({ p, active }) {
  const shot = SHOTS[p.title] || { kind: "site", img: "" };
  return (
    <Tilt className="p3d" active={active} max={8} zoom={1.045}>
      <div className="glass p-card">
        <div className="p-shot">
          {shot.img ? <img src={shot.img} alt={`${p.title} preview`} loading="lazy" /> : <Mock kind={shot.kind} />}
          <span className="p-tag">{shot.img ? "Screenshot" : "Preview"}</span>
        </div>
        <h3>{p.title}</h3>
        <Lines className="p-text" text={p.text} play={active} stagger={0.07} />
        <div className="badges">{p.stack.map((s) => <span key={s}>{s}</span>)}</div>
        <div className="p-links">
          {p.live && <a className="btn primary sm" href={p.live} target="_blank" rel="noreferrer" tabIndex={active ? 0 : -1}>Live demo ↗</a>}
          {p.code && <a className="btn glass sm" href={p.code} target="_blank" rel="noreferrer" tabIndex={active ? 0 : -1}>GitHub ↗</a>}
        </div>
      </div>
      <span className="p-floor" aria-hidden="true" />
    </Tilt>
  );
}

function Projects() {
  const [idx, setIdx] = useState(0);
  const n = PROJECTS.length;
  const go = (d) => setIdx((i) => clamp(i + d, 0, n - 1));
  const { dx, dragging, bind } = useDrag(go, 60);
  const ref = useRef(null);
  const reduce = useReduced();
  const { scrollYProgress: sp } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgX = useTransform(sp, [0, 1], reduce ? [0, 0] : [300, -1000]);
  const onKey = (e) => { if (e.key === "ArrowRight") { e.preventDefault(); go(1); } if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); } };
  return (
    <section id="projects" ref={ref} className="sec projects">
      <motion.div className="bg-word" style={{ x: bgX }} aria-hidden="true">PROJECTS · PROJECTS</motion.div>
      <div className="wrap">
        <Eyebrow n="04">Featured projects</Eyebrow>
        <HeadLines className="sec-h" lines={["Things I have", "shipped."]} />
      </div>
      <div className="fs" style={{ "--i": idx, "--d": dx }} role="group" aria-roledescription="carousel" aria-label="Featured projects">
        <div className="fs-frame" aria-hidden="true"><i /><i /><i /><i /><span>{String(idx + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}</span></div>
        <div className="fs-view" tabIndex={0} onKeyDown={onKey} {...bind}>
          <div className={`fs-track ${dragging ? "drag" : ""}`}>
            {PROJECTS.map((p, i) => (
              <div key={p.title} className={`fs-item ${i === idx ? "on" : ""}`} onClick={() => i !== idx && setIdx(i)}
                aria-label={`${i + 1} of ${n}`}
                ref={(el) => { if (el) { if (i === idx) el.removeAttribute("inert"); else el.setAttribute("inert", ""); } }}>
                <ProjectCard p={p} active={i === idx} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="car-ctl">
        <button className="arrow" aria-label="Previous project" onClick={() => go(-1)} disabled={idx === 0}>←</button>
        <div className="dots">{PROJECTS.map((p, i) => <button key={p.title} className={i === idx ? "on" : ""} aria-label={`Show ${p.title}`} onClick={() => setIdx(i)} />)}</div>
        <button className="arrow" aria-label="Next project" onClick={() => go(1)} disabled={idx === n - 1}>→</button>
      </div>
    </section>
  );
}

/* ================= DEVELOPMENT PROCESS: scroll-triggered demo ================= */
const STEPS = [
  { k: "01", t: "UI/UX Design", d: "Wireframes, spacing and a colour system before any code." },
  { k: "02", t: "Frontend Development", d: "Reusable React components with state and responsive layouts." },
  { k: "03", t: "API Integration", d: "Fetch calls with loading, error and success states." },
  { k: "04", t: "Backend Development", d: "Express routes, middleware and JWT-protected endpoints." },
  { k: "05", t: "Database Connection", d: "MongoDB collections, queries and validated documents." },
  { k: "06", t: "Testing and Deployment", d: "Check, build and ship: Vercel for the UI, Render for the API." },
];
const LOGS = [
  ["$ sketch layout", "✓ tokens: colour, type, spacing"],
  ["$ npm run dev", "VITE ready · localhost:5173"],
  ["GET /api/movies", "→ 200 OK · JSON"],
  ["verifyJWT ✓", "role: user · next()"],
  ["MongoDB connected", "✓ collection: movies"],
  ["$ vite build", "✓ live on Vercel + Render"],
];
const CODE_FE = `function MovieCard({ movie }) {
  const [booked, setBooked] = useState(false);

  return (
    <article className="card">
      <h3>{movie.title}</h3>
      <button onClick={() => setBooked(true)}>
        {booked ? "Booked ✓" : "Book seats"}
      </button>
    </article>
  );
}`;
const CODE_API = `const res = await fetch("/api/movies", {
  headers: { Authorization: \`Bearer \${token}\` },
});
if (!res.ok) throw new Error("Request failed");
const movies = await res.json();`;
const CODE_BE = `router.get("/movies", verifyJWT, async (req, res) => {
  const movies = await db
    .collection("movies")
    .find()
    .toArray();
  res.json(movies);
});`;
const CODE_DB = `const client = new MongoClient(process.env.MONGO_URI);
await client.connect();
const db = client.db("cinema");
// collections: users, movies, bookings`;

const KW = new Set(["const", "let", "await", "async", "return", "function", "import", "from", "new", "if", "throw"]);
function Code({ text }) {
  const parts = text.split(/(\/\/.*$|`[^`]*`|"[^"]*"|\b\d+\b|<\/?[A-Za-z][\w.]*|\b[A-Za-z_]+\b)/m).filter((x) => x !== "");
  return (
    <pre className="code"><code>
      {parts.map((s, i) => {
        let c = "";
        if (s.startsWith("//")) c = "cm";
        else if (/^["`]/.test(s)) c = "st";
        else if (KW.has(s)) c = "kw";
        else if (/^<\/?[A-Za-z]/.test(s)) c = "tg";
        else if (/^\d+$/.test(s)) c = "nm";
        else if (/^[A-Z]/.test(s)) c = "cl";
        return c ? <span key={i} className={c}>{s}</span> : s;
      })}
      <span className="caret" />
    </code></pre>
  );
}
const typed = (t, p) => t.slice(0, Math.floor(t.length * clamp(p)));

function StageDesign({ p }) {
  const fill = ramp(p, 0.45, 0.8);
  return (
    <div className="st st-design">
      <div className={`wf ${fill > 0.02 ? "filled" : ""}`} style={{ "--f": fill }}>
        <div className="wf-nav" style={{ opacity: ramp(p, 0, 0.12) }}><i /><span /><span /><span /></div>
        <div className="wf-hero" style={{ opacity: ramp(p, 0.1, 0.25) }}><b /><b /><em /></div>
        <div className="wf-cards">{[0, 1, 2].map((i) => <div key={i} style={{ opacity: ramp(p, 0.22 + i * 0.07, 0.38 + i * 0.07) }} />)}</div>
      </div>
      <div className="tokens" style={{ opacity: ramp(p, 0.5, 0.75) }}>
        <span style={{ background: "#4f7cff" }} /><span style={{ background: "#8b5cf6" }} /><span style={{ background: "#22d3ee" }} />
        <b>Aa</b><small>Type · spacing · colour</small>
      </div>
    </div>
  );
}
function StageFront({ p }) {
  const done = p > 0.9;
  return (
    <div className="st st-front">
      <Code text={typed(CODE_FE, p / 0.75)} />
      <div className="live" style={{ opacity: ramp(p, 0.7, 0.85), transform: `translateY(${(1 - ramp(p, 0.7, 0.85)) * 16}px)` }}>
        <small>Rendered output</small>
        <div className="live-card"><h4>Interstellar</h4><span className={done ? "ok" : ""}>{done ? "Booked ✓" : "Book seats"}</span></div>
      </div>
    </div>
  );
}
function StageApi({ p }) {
  const req = ramp(p, 0.12, 0.5), res = ramp(p, 0.55, 0.9);
  return (
    <div className="st st-api">
      <Code text={typed(CODE_API, p / 0.5)} />
      <div className="wire">
        <div className="node"><b>React</b><small>:5173</small></div>
        <div className="line">
          <i />
          {req > 0 && req < 1 && <span className="pkt req" style={{ left: `${req * 100}%` }}>GET</span>}
          {res > 0 && res < 1 && <span className="pkt res" style={{ left: `${(1 - res) * 100}%` }}>200</span>}
        </div>
        <div className="node alt"><b>Express</b><small>:5000</small></div>
      </div>
      <pre className="json" style={{ opacity: ramp(p, 0.8, 0.95) }}>{`[{ "title": "Interstellar", "seats": 48 }]`}</pre>
    </div>
  );
}
function StageBack({ p }) {
  const chain = ["Request", "CORS", "verifyJWT", "Route", "Response"];
  const at = Math.floor(ramp(p, 0.3, 0.95) * chain.length);
  return (
    <div className="st st-back">
      <Code text={typed(CODE_BE, p / 0.6)} />
      <div className="chain">{chain.map((c, i) => <span key={c} className={i < at ? "on" : ""}>{c}</span>)}</div>
    </div>
  );
}
function StageDb({ p }) {
  const on = p > 0.45;
  return (
    <div className="st st-db">
      <Code text={typed(CODE_DB, p / 0.5)} />
      <div className="dbstat"><i className={on ? "on" : ""} /> {on ? "connected to MongoDB" : "connecting…"}</div>
      <div className="docs">
        {["users", "movies", "bookings"].map((c, i) => (
          <div key={c} className="coll" style={{ opacity: ramp(p, 0.5 + i * 0.1, 0.65 + i * 0.1), transform: `translateY(${(1 - ramp(p, 0.5 + i * 0.1, 0.65 + i * 0.1)) * 18}px)` }}>
            <b>{c}</b><span>{"{ _id, … }"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
function StageDeploy({ p }) {
  const list = ["Test API routes and auth", "Check layouts on mobile and desktop", "Run the production build", "Deploy the UI to Vercel", "Deploy the API to Render"];
  const done = Math.floor(ramp(p, 0.05, 0.85) * list.length + 0.001);
  return (
    <div className="st st-deploy">
      <ul>{list.map((l, i) => <li key={l} className={i < done ? "ok" : ""}><i>{i < done ? "✓" : ""}</i>{l}</li>)}</ul>
      <div className="bar"><i style={{ width: `${ramp(p, 0.05, 0.9) * 100}%` }} /></div>
      <div className={`live-badge ${p > 0.93 ? "on" : ""}`}><i /> Live</div>
    </div>
  );
}
const STAGES = [StageDesign, StageFront, StageApi, StageBack, StageDb, StageDeploy];

function Process() {
  const ref = useRef(null);
  const { scrollYProgress: sp } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [st, setSt] = useState({ i: 0, p: 0 });
  useMotionValueEvent(sp, "change", (v) => {
    const t = clamp(v, 0, 0.9999) * STEPS.length;
    const i = Math.floor(t), p = Math.round((t - i) * 50) / 50;
    setSt((o) => (o.i === i && o.p === p ? o : { i, p }));
  });
  const Stage = STAGES[st.i];
  const fillW = useTransform(sp, [0, 1], ["0%", "100%"]);
  const log = LOGS[st.i];
  return (
    <section id="process" ref={ref} className="process" style={{ "--n": STEPS.length }}>
      <div className="proc-sticky">
        <div className="wrap proc-grid">
          <div className="proc-left">
            <Eyebrow n="05">Development process</Eyebrow>
            <HeadLines className="sec-h sm" lines={["From idea", "to live."]} />
            <ol className="steps">
              {STEPS.map((s, i) => (
                <li key={s.k} className={i === st.i ? "on" : i < st.i ? "past" : ""}>
                  <span>{s.k}</span>
                  <div><b>{s.t}</b><small>{s.d}</small></div>
                </li>
              ))}
            </ol>
          </div>
          <div className="proc-right">
            <div className="pipe" aria-hidden="true">
              <i className="pipe-line"><motion.b style={{ width: fillW }} /></i>
              {STEPS.map((s, i) => <span key={s.k} className={i <= st.i ? "on" : ""} style={{ left: `${(i / (STEPS.length - 1)) * 100}%` }} />)}
            </div>
            <div className="win glass" role="img" aria-label={`Step ${st.i + 1}: ${STEPS[st.i].t}`}>
              <div className="win-bar"><i /><i /><i /><span>{STEPS[st.i].t}</span></div>
              <AnimatePresence mode="wait">
                <motion.div key={st.i} className="win-body" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35, ease: EASE }}>
                  <Stage p={st.p} />
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="fw fw-term glass" aria-hidden="true"><small>terminal</small><p>{log[0]}</p><p className="g">{log[1]}</p></div>
            <div className="fw fw-step glass" aria-hidden="true"><small>step</small><b>{STEPS[st.i].k}<em>/06</em></b></div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= CONTACT ================= */
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
    <form className="form glass" onSubmit={submit} noValidate>
      <input name="website" value={form.website} onChange={onChange} tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0 }} />
      {field("name", "Name", { ac: "name" })}
      {field("email", "Email", { type: "email", ac: "email" })}
      {field("message", "Message", { area: true })}
      <Magnetic><button className="btn primary" type="submit" aria-busy={sending}>{sending ? "Sending message" : "Send message"}</button></Magnetic>
      <p className={`status ${status.type}`} role="status" aria-live="polite">{status.text}</p>
    </form>
  );
}

function Contact() {
  const ref = useRef(null);
  const move = (e) => {
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--cx", `${e.clientX - r.left}px`);
    ref.current.style.setProperty("--cy", `${e.clientY - r.top}px`);
  };
  return (
    <section id="contact" ref={ref} className="sec contact" onPointerMove={move}>
      <div className="c-glow" aria-hidden="true" />
      <div className="wrap">
        <Eyebrow n="06">Contact</Eyebrow>
        <HeadLines className="sec-h big" lines={["Let's build", "something."]} />
        <div className="contact-grid">
          <div>
            <Lines className="sec-p" text="Open to React JS and MERN developer roles. Send a message or reach me here." />
            <ul className="links">
              <motion.li {...reveal(0)}><span>Email</span><a href={`mailto:${LINKS.email}`}>{LINKS.email}</a></motion.li>
              <motion.li {...reveal(1)}><span>GitHub</span><a href={LINKS.github} target="_blank" rel="noreferrer">Abiyouthshalvin ↗</a></motion.li>
              <motion.li {...reveal(2)}><span>LinkedIn</span><a href={LINKS.linkedin} target="_blank" rel="noreferrer">abiyouth-shalvin ↗</a></motion.li>
              <motion.li {...reveal(3)}><span>Location</span><b>Dubai, UAE</b></motion.li>
            </ul>
            <div className="c-btns">
              <Magnetic><a className="btn primary" href={`mailto:${LINKS.email}`}>Email me</a></Magnetic>
              <Magnetic><a className="btn glass" href={RESUME} download="Abiyouth_Shalvin_Resume.pdf">Download resume ↓</a></Magnetic>
            </div>
          </div>
          <motion.div {...reveal(1)}><ContactForm /></motion.div>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  useEffect(() => { startPointer(); }, []);
  return (
    <MotionConfig reducedMotion="user">
      <div className="bg" aria-hidden="true" />
      <Particles />
      <Spotlight />
      <Cursor />
      <ProgressBar />
      <Nav />
      <Model3D />
      <main>
        <Hero />
        <Sideways />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Process />
        <Contact />
      </main>
      <footer className="foot">
        <div className="wrap foot-in">
          <span><i className="led" /> © 2026 Abiyouth Shalvin</span>
          <a href="#home">Back to top ↑</a>
        </div>
      </footer>
    </MotionConfig>
  );
}
