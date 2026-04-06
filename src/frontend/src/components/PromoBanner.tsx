// ─── PromoBanner ────────────────────────────────────────────────────────────────────
// Continuously scrolling marquee ticker that sits directly below the sticky
// navbar. Repeats the promo messages multiple times so there is never a gap.

export function PromoBanner() {
  const messages = [
    "🚚 Order now & enjoy FREE DELIVERY above ₹999/-",
    "🎁 Shop above ₹1999/- & get a free gift",
  ];

  // Repeat messages enough times to fill wide screens without gaps
  const repeated = Array.from({ length: 6 }, () => messages).flat();

  return (
    <>
      <style>{`
        @keyframes marquee-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .promo-track {
          display: flex;
          width: max-content;
          animation: marquee-scroll 30s linear infinite;
          will-change: transform;
        }
      `}</style>

      <div
        className="sticky top-16 lg:top-20 z-40 overflow-hidden py-2 select-none"
        style={{
          background:
            "linear-gradient(90deg, #FF7A00 0%, #D4AF37 50%, #FF7A00 100%)",
        }}
        aria-label="Promotions"
        data-ocid="promo.section"
      >
        <div className="promo-track">
          {repeated.map((msg, idx) => (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: stable repeated list
              key={idx}
              className="inline-flex items-center gap-3 text-white font-bold text-sm whitespace-nowrap px-6"
              style={{
                fontFamily: "'Inter', sans-serif",
                letterSpacing: "0.03em",
              }}
            >
              {msg}
              <span
                className="opacity-50 font-normal text-base"
                aria-hidden="true"
              >
                ✦
              </span>
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
