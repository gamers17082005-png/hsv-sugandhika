export function AboutSection() {
  return (
    <section
      id="about"
      className="py-20 px-4"
      style={{ backgroundColor: "#F7F2E7" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text */}
          <div className="reveal">
            <p
              className="text-sm font-semibold tracking-widest uppercase mb-3"
              style={{ color: "#D4AF37" }}
            >
              Our Heritage
            </p>
            <h2
              className="font-serif text-4xl lg:text-5xl font-bold mb-6 leading-tight"
              style={{
                color: "#8B1A1A",
                fontFamily: "'Cormorant Garamond', serif",
              }}
            >
              Our Story – Born from
              <br />
              <em
                style={{
                  color: "#3B2A16",
                }}
              >
                Nature's Purest Gifts
              </em>
            </h2>

            <div
              className="w-16 h-1 rounded-full mb-6"
              style={{ backgroundColor: "#D4AF37" }}
            />

            <p
              className="text-base leading-relaxed mb-4"
              style={{ color: "#3B2A16" }}
            >
              HSV Sugandhika was born from a deep reverence for India's ancient
              pooja traditions. Nestled in the heart of Hyderabad, Telangana,
              our artisans have been crafting sacred items for three
              generations, preserving age-old techniques passed down through
              family lineages.
            </p>
            <p
              className="text-base leading-relaxed mb-4"
              style={{ color: "#6B6257" }}
            >
              Every product we create — from our hand-rolled agarbattis to our
              forest-sourced camphor — is made without synthetic chemicals or
              artificial fragrances. We believe the divine deserves only the
              purest offerings from nature.
            </p>
            <p
              className="text-base leading-relaxed mb-8"
              style={{ color: "#6B6257" }}
            >
              Our mission is simple: to connect you with the sacred through
              fragrances and materials that have been used in Indian worship for
              thousands of years. From our family's hands to your altar.
            </p>
          </div>

          {/* Decorative visual */}
          <div className="reveal relative flex items-center justify-center">
            <div
              className="w-full max-w-md aspect-square rounded-full absolute opacity-10"
              style={{
                background:
                  "radial-gradient(circle, #D4AF37 0%, transparent 70%)",
                transform: "scale(1.3)",
              }}
            />
            <div
              className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
              style={{ border: "3px solid #D4AF37" }}
            >
              <img
                src="/assets/generated/product-pooja-kit.dim_400x400.jpg"
                alt="Traditional Pooja Items"
                className="w-full aspect-square object-cover"
              />
              {/* Overlay badge */}
              <div
                className="absolute bottom-4 left-4 right-4 rounded-2xl p-4 backdrop-blur-sm"
                style={{ backgroundColor: "rgba(59,42,22,0.85)" }}
              >
                <p
                  className="font-serif text-xl font-bold"
                  style={{ color: "#D4AF37" }}
                >
                  Est. 1992
                </p>
                <p className="text-sm text-gray-200">
                  Three generations of sacred craftsmanship
                </p>
              </div>
            </div>

            {/* Floating stats */}
            <div
              className="absolute -top-4 -right-4 rounded-2xl p-4 shadow-xl"
              style={{ backgroundColor: "#6A1B1B", color: "white" }}
            >
              <p
                className="font-serif text-3xl font-bold"
                style={{ color: "#D4AF37" }}
              >
                10K+
              </p>
              <p className="text-xs text-gray-200">Happy Customers</p>
            </div>
            <div
              className="absolute -bottom-4 -left-4 rounded-2xl p-4 shadow-xl"
              style={{ backgroundColor: "white", border: "2px solid #D4AF37" }}
            >
              <p
                className="font-serif text-3xl font-bold"
                style={{ color: "#6A1B1B" }}
              >
                100%
              </p>
              <p className="text-xs" style={{ color: "#6B6257" }}>
                Natural Ingredients
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
