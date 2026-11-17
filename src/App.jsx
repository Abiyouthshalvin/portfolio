import { useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useSpring } from "framer-motion";
import CodeBackground from "./CodeBackground";
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

// Quick, light scroll reveal
const fade = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.3, ease: "easeOut" },
};

const slideLeft = { ...fade, initial: { opacity: 0, x: -50 }, whileInView: { opacity: 1, x: 0 }, transition: { duration: 0.5, ease: "easeOut" } };
const slideRight = { ...fade, initial: { opacity: 0, x: 50 }, whileInView: { opacity: 1, x: 0 }, transition: { duration: 0.5, ease: "easeOut" } };

// Staggered grids: cards pop in one after another
const container = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };
const item = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
};
const gridProps = { variants: container, initial: "hidden", whileInView: "show", viewport: { once: true, amount: 0.1 } };

// Hero text appears line by line
const heroList = { hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } } };
const heroItem = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } } };

// Numbers count up when they scroll into view
function CountUp({ to, suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf;
    const start = performance.now();
    const tick = (t) => {
      const p = Math.min((t - start) / 1200, 1);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);
  return <span ref={ref}>{n}{suffix}</span>;
}

// Scroll progress bar at the top
function ProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 24 });
  return <motion.div className="progress" style={{ scaleX }} />;
}

function useTyping(words) {
  const [text, setText] = useState("");
  const [del, setDel] = useState(false);
  const [i, setI] = useState(0);

  useEffect(() => {
    const word = words[i % words.length];
    let delay = del ? 30 : 70;
    if (!del && text === word) delay = 1300;

    const t = setTimeout(() => {
      if (!del && text === word) setDel(true);
      else if (del && text === "") {
        setDel(false);
        setI(i + 1);
      } else setText(del ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1));
    }, delay);

    return () => clearTimeout(t);
  }, [text, del, i, words]);

  return text;
}

function Hero() {
  const role = useTyping(ROLES);

  return (
    <section id="home" className="hero">
      <div className="hero-grid">
        <motion.div className="hero-left" variants={heroList} initial="hidden" animate="show">
          <motion.span variants={heroItem} className="badge"><i /> Open to work</motion.span>
          <motion.h1 variants={heroItem}>
            Hi, I'm <span className="grad">Abiyouth Shalvin</span>
          </motion.h1>
          <motion.h2 variants={heroItem} className="typing">
            &lt;{role}<b className="cursor">|</b> /&gt;
          </motion.h2>
          <motion.p variants={heroItem}>
            MERN Stack Developer with 1 year of experience as a React JS Developer. I build
            responsive, full-stack web apps with React, Node.js, Express, MongoDB and MySQL.
            Based in Dubai, UAE.
          </motion.p>
          <motion.div variants={heroItem} className="row">
            <a className="btn" href="#projects">View Projects</a>
            <a className="btn ghost" href={RESUME} download="Abiyouth_Shalvin_Resume.pdf">
              Download Resume ↓
            </a>
            <a className="btn ghost" href="#contact">Contact Me</a>
          </motion.div>
          <motion.div variants={heroItem} className="stats">
            <div><b><CountUp to={1} suffix="+" /></b><span>Year experience</span></div>
            <div><b><CountUp to={25} suffix="+" /></b><span>React components</span></div>
            <div><b><CountUp to={3} /></b><span>Projects built</span></div>
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 60, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }} className="hero-visual">
          <div className="glass photo-frame">
            <img src={PHOTO} alt="Abiyouth Shalvin" />
          </div>
          <div className="glass code-window mini">
            <div className="window-bar">
              <span /><span /><span />
              <em>developer.js</em>
            </div>
            <pre>
<code>
<span className="k">const</span> <span className="v">dev</span> = {"{"}{"\n"}
{"  "}role: <span className="s">"MERN Developer"</span>,{"\n"}
{"  "}location: <span className="s">"Dubai, UAE"</span>,{"\n"}
{"  "}openToWork: <span className="k">true</span>{"\n"}
{"}"};
</code>
            </pre>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "", website: "" });
  const [status, setStatus] = useState({ type: "", text: "" });
  const [sending, setSending] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    const endpoint = import.meta.env.VITE_FORM_ENDPOINT;

    if (!endpoint) {
      setStatus({ type: "error", text: "The contact form is not configured yet. Please email me directly." });
      return;
    }

    try {
      setSending(true);
      setStatus({ type: "", text: "" });
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Request failed");
      }

      setStatus({ type: "success", text: "Message sent. I will get back to you soon." });
      setForm({ name: "", email: "", message: "", website: "" });
    } catch (err) {
      const generic = err.message === "Request failed" || err.message === "Failed to fetch";
      setStatus({
        type: "error",
        text: generic
          ? "Could not send your message. Please try again or email me directly."
          : err.message,
      });
    } finally {
      setSending(false);
    }
  };

  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <form className="glass form" onSubmit={submit}>
      {/* Hidden spam trap: real visitors never fill this in */}
      <input
        name="website"
        value={form.website}
        onChange={set}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0 }}
      />
      <input name="name" placeholder="Your name" value={form.name} onChange={set} required />
      <input name="email" type="email" placeholder="Your email" value={form.email} onChange={set} required />
      <textarea name="message" rows="5" placeholder="Your message" value={form.message} onChange={set} required />
      <button className="btn" disabled={sending}>{sending ? "Sending..." : "Send Message"}</button>
      {status.text && <p className={`status ${status.type}`}>{status.text}</p>}
    </form>
  );
}

const NAV = [
  ["home", "Home"],
  ["about", "About"],
  ["experience", "Experience"],
  ["projects", "Projects"],
  ["skills", "Skills"],
  ["contact", "Contact"],
];

function Nav() {
  const [active, setActive] = useState("home");
  const [pill, setPill] = useState({ left: 0, width: 0 });
  const listRef = useRef(null);
  const lock = useRef(false);

  const place = () => {
    const el = listRef.current?.querySelector(`[data-id="${active}"]`);
    if (el) setPill({ left: el.offsetLeft, width: el.offsetWidth });
  };

  useEffect(() => {
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  useEffect(() => {
    const onScroll = () => {
      if (lock.current) return;
      let current = NAV[0][0];
      for (const [id] of NAV) {
        const s = document.getElementById(id);
        if (s && s.getBoundingClientRect().top <= 160) current = id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (e, id) => {
    e.preventDefault();
    setActive(id);
    lock.current = true;
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => (lock.current = false), 800);
  };

  return (
    <nav className="nav glass">
      <span className="logo">&lt;Abiyouth /&gt;</span>
      <div className="nav-links" ref={listRef}>
        <span className="nav-pill" style={{ transform: `translateX(${pill.left}px)`, width: pill.width }} />
        {NAV.map(([id, label]) => (
          <a
            key={id}
            href={`#${id}`}
            data-id={id}
            className={active === id ? "active" : ""}
            onClick={(e) => go(e, id)}
          >
            {label}
          </a>
        ))}
      </div>
    </nav>
  );
}

export default function App() {
  // Cursor spotlight + 3D tilt on every .hoverable card
  useEffect(() => {
    const move = (e) => {
      const el = e.target.closest?.(".hoverable");
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);
      el.style.setProperty("--ry", `${((x / r.width) - 0.5) * 8}deg`);
      el.style.setProperty("--rx", `${(0.5 - (y / r.height)) * 8}deg`);
    };
    const leave = (e) => {
      const el = e.target.closest?.(".hoverable");
      if (el) { el.style.setProperty("--rx", "0deg"); el.style.setProperty("--ry", "0deg"); }
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseout", leave);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseout", leave); };
  }, []);

  return (
    <>
      <div className="orb orb1" /><div className="orb orb2" />
      <CodeBackground />

      <ProgressBar />
      <Nav />

      <main>
        <Hero />

        <section id="about">
          <motion.div {...slideLeft} className="glass card">
            <h3>About</h3>
            <p>
              I am a MERN Stack Developer with hands-on experience building responsive, full-stack web
              applications with MongoDB, Express.js, React.js and Node.js, along with MySQL. I am skilled in
              JavaScript, RESTful APIs and secure authentication, and I enjoy turning ideas into complete,
              working products.
            </p>
            <div className="timeline">
              <div>
                <b>B.E. Computer Science Engineering</b>
                <span>Jeppiaar Engineering College, Chennai</span>
                <small>2022 – 2025</small>
              </div>
              <div>
                <b>Diploma in Computer Science</b>
                <span>Morning Star Polytechnic College, Nagercoil</span>
                <small>2019 – 2022</small>
              </div>
              <div>
                <b>MERN Stack Course</b>
                <span>Naresh IT, Hyderabad</span>
                <small>April 2025 – August 2025</small>
              </div>
            </div>
          </motion.div>
        </section>

        <section id="experience">
          <motion.h3 className="title" {...fade}>Experience</motion.h3>
          <div className="exp-list">
            {EXPERIENCE.map((e) => (
              <motion.div key={e.company + e.period} {...slideRight} className="exp-item">
                <span className="exp-dot" />
                <div className="glass card hoverable">
                  <div className="exp-head">
                    <div>
                      <h4>{e.role}</h4>
                      <p className="exp-company">{e.company} · {e.place}</p>
                    </div>
                    <span className="exp-period">{e.period}</span>
                  </div>
                  <ul>
                    {e.points.map((p) => <li key={p}>{p}</li>)}
                  </ul>
                  <div className="tags">{e.stack.map((t) => <span key={t}>{t}</span>)}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="projects">
          <motion.h3 className="title" {...fade}>Projects</motion.h3>
          <motion.div className="grid" {...gridProps}>
            {PROJECTS.map((p) => (
              <motion.div key={p.title} variants={item} className="cell">
              <article className="glass card hoverable project">
                <h4>{p.title}</h4>
                <p>{p.text}</p>
                <div className="tags">{p.stack.map((t) => <span key={t}>{t}</span>)}</div>
                <div className="links">
                  {p.live && (
                    <a className="btn small" href={p.live} target="_blank" rel="noreferrer">Live Demo ↗</a>
                  )}
                  {p.code && (
                    <a className="btn small ghost" href={p.code} target="_blank" rel="noreferrer">GitHub ↗</a>
                  )}
                </div>
              </article>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <section id="skills">
          <motion.h3 className="title" {...fade}>Skills</motion.h3>
          <motion.div className="grid" {...gridProps}>
            {Object.entries(SKILLS).map(([group, items]) => (
              <motion.div key={group} variants={item} className="cell">
              <div className="glass card hoverable">
                <h4>{group}</h4>
                <div className="tags">{items.map((t) => <span key={t}>{t}</span>)}</div>
              </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <section id="contact">
          <motion.h3 className="title" {...fade}>Contact</motion.h3>
          <div className="contact-wrap">
            <motion.div {...slideLeft} className="glass card">
              <h4>Let's talk</h4>
              <p>Open to React JS developer roles. Send a message or reach me here.</p>
              <p><a href={`mailto:${LINKS.email}`}>{LINKS.email}</a></p>
              <p><a href={LINKS.github} target="_blank" rel="noreferrer">GitHub</a></p>
              <p><a href={LINKS.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></p>
              <p>Dubai, UAE</p>
              <a className="btn small" href={RESUME} download="Abiyouth_Shalvin_Resume.pdf">
                Download Resume ↓
              </a>
            </motion.div>
            <Contact />
          </div>
        </section>
      </main>

      <footer className="footer glass">
        <span>© 2026 Abiyouth Shalvin. Built with React and Framer Motion.</span>
      </footer>
    </>
  );
}