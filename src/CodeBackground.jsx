import { useEffect, useRef } from "react";

const CHARS = "{}[]()<>/=+-*;:.,01$#&|".split("");

export default function CodeBackground() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    const size = 16;
    let w, h, cols, drops, raf, last = 0;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      cols = Math.floor(w / size);
      drops = Array.from({ length: cols }, () => Math.random() * (h / size));
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = (t) => {
      raf = requestAnimationFrame(draw);
      if (t - last < 50) return; // about 20 frames per second keeps it light
      last = t;

      ctx.fillStyle = "rgba(6, 8, 24, 0.14)";
      ctx.fillRect(0, 0, w, h);
      ctx.font = `${size}px monospace`;

      for (let i = 0; i < cols; i++) {
        const ch = CHARS[Math.floor(Math.random() * CHARS.length)];
        ctx.fillStyle = Math.random() > 0.97 ? "#a5f3fc" : "rgba(124, 92, 255, 0.5)";
        ctx.fillText(ch, i * size, drops[i] * size);
        if (drops[i] * size > h && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="scene" />;
}