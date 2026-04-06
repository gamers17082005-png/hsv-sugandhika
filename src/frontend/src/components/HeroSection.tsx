import { useEffect, useRef } from "react";

const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  size: Math.random() * 10 + 4,
  left: `${Math.random() * 100}%`,
  delay: `${Math.random() * 8}s`,
  duration: `${Math.random() * 6 + 6}s`,
}));

const BG_IMAGE =
  "/assets/whatsapp_image_2026-04-05_at_12.09.48_pm_1-019d5c64-be42-72b5-b10d-0b9d0b33a06b.jpeg";

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.classList.add("visible");
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="relative overflow-hidden min-h-[85vh] flex items-center justify-center"
      style={{
        backgroundImage: `url('${BG_IMAGE}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Dark overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(59,42,22,0.88) 0%, rgba(106,27,27,0.72) 50%, rgba(59,42,22,0.85) 100%)",
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {PARTICLES.map((p) => (
          <span
            key={p.id}
            className="particle"
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              left: p.left,
              bottom: "-20px",
              animationDelay: p.delay,
              animationDuration: p.duration,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Brand title — Cormorant Garamond with deep 3D gold effect */}
        <p
          className="font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-semibold mb-4 tracking-widest uppercase"
          style={{
            color: "#FFD700",
            fontFamily:
              "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
            textShadow:
              "1px 1px 0 #8B6914, 2px 2px 0 #7a5c10, 3px 3px 0 #6a4f0c, 4px 4px 0 #5a4209, 5px 5px 0 #3d2d05, 6px 6px 0 #261800, 7px 7px 10px rgba(0,0,0,0.85), 0 0 24px rgba(255,180,0,0.45)",
          }}
        >
          HSV Sugandhika – From Nature's Heart
        </p>

        {/* Main headline */}
        <h1
          className="font-serif font-bold text-2xl sm:text-3xl lg:text-4xl xl:text-5xl leading-tight text-white mb-4"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            textShadow:
              "1px 1px 0 rgba(255,255,255,0.3), 2px 2px 0 rgba(0,0,0,0.4), 3px 3px 0 rgba(0,0,0,0.35), 4px 4px 0 rgba(0,0,0,0.3), 5px 5px 8px rgba(0,0,0,0.6)",
          }}
        >
          Spiritual, 100% Natural, Handcrafted,
          <br />
          and Authentic Indian Pooja Products.
        </h1>

        {/* Sub-tagline */}
        <p
          className="font-serif text-xl sm:text-2xl lg:text-3xl italic mb-10 tracking-wide"
          style={{
            color: "#D4AF37",
            fontFamily: "'Cormorant Garamond', serif",
            textShadow:
              "1px 1px 0 #8B6914, 2px 2px 0 #6a4f0c, 3px 3px 6px rgba(0,0,0,0.5), 0 0 20px rgba(212,175,55,0.6)",
          }}
        >
          “Your Sacred Rituals”
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            type="button"
            onClick={() => scrollTo("#products")}
            className="px-10 py-4 rounded-full font-semibold text-white text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            style={{
              backgroundColor: "#6A1B1B",
              boxShadow: "0 4px 20px rgba(106,27,27,0.5)",
            }}
            data-ocid="hero.primary_button"
          >
            Shop Now
          </button>
          <button
            type="button"
            onClick={() => scrollTo("#products")}
            className="px-10 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 hover:bg-yellow-400"
            style={{
              border: "2px solid #D4AF37",
              color: "#D4AF37",
              backgroundColor: "transparent",
            }}
            data-ocid="hero.secondary_button"
          >
            Explore Products
          </button>
        </div>

        {/* Decorative divider */}
        <div className="mt-14 flex items-center justify-center gap-4">
          <div className="w-16 h-px" style={{ backgroundColor: "#D4AF37" }} />
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            role="img"
            aria-label="decorative lotus"
          >
            <path
              d="M12 2C12 2 6 8 6 12C6 15.314 8.686 18 12 18C15.314 18 18 15.314 18 12C18 8 12 2 12 2Z"
              fill="#D4AF37"
              opacity="0.8"
            />
            <circle cx="12" cy="12" r="2" fill="#F7C96E" />
          </svg>
          <div className="w-16 h-px" style={{ backgroundColor: "#D4AF37" }} />
        </div>
      </div>
    </section>
  );
}
