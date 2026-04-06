const BENEFITS = [
  {
    icon: (
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="100% Natural"
      >
        <circle cx="24" cy="24" r="23" stroke="#D4AF37" strokeWidth="1.5" />
        <path
          d="M24 8C24 8 16 16 16 24C16 29.523 19.477 34 24 34C28.523 34 32 29.523 32 24C32 16 24 8 24 8Z"
          fill="#2D6A4F"
          opacity="0.8"
        />
        <path
          d="M24 16C24 16 20 20 20 24C20 26.209 21.791 28 24 28C26.209 28 28 26.209 28 24C28 20 24 16 24 16Z"
          fill="#52B788"
        />
        <path
          d="M18 22C20 18 24 16 28 18"
          stroke="#74C69D"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: "100% Natural",
    description:
      "Every ingredient is sourced directly from nature — no synthetic additives, no artificial fragrances, no compromises.",
  },
  {
    icon: (
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Handcrafted"
      >
        <circle cx="24" cy="24" r="23" stroke="#D4AF37" strokeWidth="1.5" />
        <path
          d="M28 10L32 20L24 18L16 20L20 10L24 14L28 10Z"
          fill="#D4AF37"
          opacity="0.9"
        />
        <path
          d="M16 22C16 22 12 28 14 34C16 38 20 38 24 36C28 38 32 38 34 34C36 28 32 22 32 22H16Z"
          fill="#C9784B"
          opacity="0.8"
        />
        <path
          d="M20 26L24 30L28 26"
          stroke="#F7C96E"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: "Handcrafted",
    description:
      "Each product is lovingly crafted by skilled artisans using traditional methods passed down through generations.",
  },
  {
    icon: (
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Eco-Friendly"
      >
        <circle cx="24" cy="24" r="23" stroke="#D4AF37" strokeWidth="1.5" />
        <path
          d="M24 12C18 12 12 16 12 24C12 30 16 36 24 38C32 36 36 30 36 24C36 16 30 12 24 12Z"
          fill="#52B788"
          opacity="0.4"
        />
        <path
          d="M24 38V12M12 24H36"
          stroke="#2D6A4F"
          strokeWidth="1"
          strokeDasharray="2 2"
        />
        <path
          d="M20 20L24 16L28 20L32 24L28 28L24 32L20 28L16 24L20 20Z"
          fill="#52B788"
          opacity="0.7"
        />
        <circle cx="24" cy="24" r="3" fill="#D4AF37" />
      </svg>
    ),
    title: "Eco-Friendly",
    description:
      "We are committed to sustainable practices — biodegradable packaging, zero-waste production, and reforestation partnerships.",
  },
  {
    icon: (
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Divine Fragrance"
      >
        <circle cx="24" cy="24" r="23" stroke="#D4AF37" strokeWidth="1.5" />
        <path
          d="M24 36C24 36 14 28 14 20C14 14.477 18.477 10 24 10C29.523 10 34 14.477 34 20C34 28 24 36 24 36Z"
          fill="#D4AF37"
          opacity="0.3"
        />
        <path
          d="M24 32C24 32 22 26 20 22C19 20 20 16 24 14C28 16 29 20 28 22C26 26 24 32 24 32Z"
          fill="#D4AF37"
          opacity="0.8"
        />
        <circle cx="24" cy="20" r="4" fill="#F7C96E" />
        <path
          d="M20 14L16 10M28 14L32 10M24 10V6"
          stroke="#D4AF37"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: "Divine Fragrance",
    description:
      "Our signature blends of sacred woods, flowers, and resins create fragrances that elevate prayers and soothe the spirit.",
  },
];

export function BenefitsSection() {
  return (
    <section
      id="benefits"
      className="py-20 px-4"
      style={{ backgroundColor: "#F7F2E7" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14 reveal">
          <p
            className="text-sm font-semibold tracking-widest uppercase mb-3"
            style={{ color: "#D4AF37" }}
          >
            Our Promise
          </p>
          <h2
            className="font-serif text-4xl lg:text-5xl font-bold mb-4"
            style={{
              color: "#8B1A1A",
              fontFamily: "'Cormorant Garamond', serif",
            }}
          >
            Why Choose HSV Sugandhika?
          </h2>
          <div className="gold-divider">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              role="img"
              aria-label="decorative star"
            >
              <path
                d="M10 1 L12.5 7.5 L19 8 L14 13 L15.5 19.5 L10 16 L4.5 19.5 L6 13 L1 8 L7.5 7.5 Z"
                fill="#D4AF37"
              />
            </svg>
          </div>
        </div>

        {/* 4-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {BENEFITS.map((b, i) => (
            <div
              key={b.title}
              className="text-center reveal group"
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div className="flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {b.icon}
              </div>
              <h3
                className="font-bold text-xl mb-3"
                style={{
                  color: "#6A1B1B",
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.25rem",
                }}
              >
                {b.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "#6B6257" }}
              >
                {b.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
