// TrustStrip — Always-visible compact strip between hero and bestsellers.
// Shows 4 brand promise icons with saffron/gold brand palette.

export function TrustStrip() {
  const features = [
    {
      icon: "🌿",
      title: "100% Natural",
      sub: "Pure botanical ingredients",
    },
    {
      icon: "🙏",
      title: "Handcrafted",
      sub: "By skilled Indian artisans",
    },
    {
      icon: "🚚",
      title: "Free Delivery",
      sub: "On orders above ₹999",
    },
    {
      icon: "⭐",
      title: "10,000+ Customers",
      sub: "Happy & satisfied",
    },
  ];

  return (
    <section
      className="py-5 px-4"
      style={{
        background:
          "linear-gradient(90deg, #6A1B1B 0%, #8B1A1A 40%, #6A1B1B 100%)",
        borderTop: "2px solid #D4AF37",
        borderBottom: "2px solid #D4AF37",
      }}
      aria-label="Brand promises"
    >
      <div className="max-w-7xl mx-auto">
        <ul className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-0 list-none m-0 p-0">
          {features.map((f, i) => (
            <li
              key={f.title}
              className="flex flex-col sm:flex-row items-center sm:justify-center gap-2 sm:gap-3 text-center sm:text-left py-1"
              style={{
                borderRight:
                  i < features.length - 1
                    ? "1px solid rgba(212,175,55,0.25)"
                    : "none",
              }}
            >
              <span
                className="text-2xl sm:text-3xl leading-none"
                role="img"
                aria-hidden="true"
              >
                {f.icon}
              </span>
              <div>
                <p
                  className="font-semibold text-sm sm:text-base leading-tight"
                  style={{
                    color: "#FFD700",
                    fontFamily: "'Cormorant Garamond', serif",
                  }}
                >
                  {f.title}
                </p>
                <p
                  className="text-xs leading-tight mt-0.5"
                  style={{ color: "rgba(255,245,210,0.80)" }}
                >
                  {f.sub}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
