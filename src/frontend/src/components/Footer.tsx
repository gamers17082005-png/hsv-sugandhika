import {
  SiFacebook,
  SiGmail,
  SiInstagram,
  SiWhatsapp,
  SiYoutube,
} from "react-icons/si";

const QUICK_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Products", href: "#products" },
  { label: "About Us", href: "#about" },
  { label: "Benefits", href: "#benefits" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

const SOCIAL_LINKS = [
  {
    Icon: SiFacebook,
    href: "https://www.facebook.com/share/1GiKf5GyKt/?mibextid=wwXIfr",
    label: "Facebook",
  },
  {
    Icon: SiInstagram,
    href: "https://www.instagram.com/hsv_sugandhika_sticks?igsh=MWx6cmJ5cTNxNm01ZA%3D%3D&utm_source=qr",
    label: "Instagram",
  },
  {
    Icon: SiYoutube,
    href: "https://youtube.com/@hsvsugandhika?si=9eCTRcq_GZoyDz3g",
    label: "YouTube",
  },
  { Icon: SiWhatsapp, href: "https://wa.me/918125117683", label: "WhatsApp" },
  { Icon: SiGmail, href: "mailto:hsvgrouphub@gmail.com", label: "Gmail" },
];

const FOOTER_BG =
  "/assets/whatsapp_image_2026-04-05_at_12.09.48_pm_1-019d5c64-be42-72b5-b10d-0b9d0b33a06b.jpeg";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer
      className="px-4 pt-16 pb-8 relative"
      style={{
        backgroundImage: `url(${FOOTER_BG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark overlay for readability */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(20, 4, 4, 0.82)" }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <img
              src="/assets/whatsapp_image_2026-04-05_at_11.22.46_am-019d5c71-2980-708c-8674-1ca562889a60.jpeg"
              alt="HSV Sugandhika"
              className="h-14 w-auto object-contain mb-4"
              onError={(e) => {
                const t = e.currentTarget as HTMLImageElement;
                t.style.display = "none";
              }}
            />
            <p
              className="text-sm leading-relaxed mb-6"
              style={{ color: "#B59A8E" }}
            >
              HSV Sugandhika brings the purest, most authentic Indian pooja
              items crafted by skilled artisans using traditional methods and
              100% natural ingredients.
            </p>
            <div className="flex gap-3">
              {SOCIAL_LINKS.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("mailto") ? undefined : "_blank"}
                  rel={
                    href.startsWith("mailto")
                      ? undefined
                      : "noopener noreferrer"
                  }
                  aria-label={label}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                  style={{
                    backgroundColor: "rgba(212,175,55,0.15)",
                    border: "1px solid rgba(212,175,55,0.3)",
                  }}
                  data-ocid="footer.link"
                >
                  <Icon className="w-4 h-4" style={{ color: "#D4AF37" }} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3
              className="font-serif font-bold text-lg mb-5"
              style={{
                color: "#D4AF37",
                fontFamily: "'Cormorant Garamond', serif",
              }}
            >
              Quick Links
            </h3>
            <ul className="space-y-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <button
                    type="button"
                    onClick={() => scrollTo(link.href)}
                    className="text-sm transition-colors hover:text-yellow-400 text-left"
                    style={{ color: "#B59A8E" }}
                    data-ocid="footer.link"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3
              className="font-serif font-bold text-lg mb-5"
              style={{
                color: "#D4AF37",
                fontFamily: "'Cormorant Garamond', serif",
              }}
            >
              Contact Us
            </h3>
            <ul className="space-y-3 text-sm" style={{ color: "#B59A8E" }}>
              <li className="flex items-start gap-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="#D4AF37"
                  className="mt-0.5 flex-shrink-0"
                  role="img"
                  aria-label="Location"
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                Beeramguda, Hyderabad - 502032
              </li>
              <li className="flex items-start gap-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="#D4AF37"
                  className="mt-0.5 flex-shrink-0"
                  role="img"
                  aria-label="Phone"
                >
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
                +91 81251 17683
              </li>
              <li className="flex items-start gap-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="#D4AF37"
                  className="mt-0.5 flex-shrink-0"
                  role="img"
                  aria-label="Email"
                >
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
                <a
                  href="mailto:hsvgrouphub@gmail.com"
                  className="hover:text-yellow-400 transition-colors"
                >
                  hsvgrouphub@gmail.com
                </a>
              </li>
            </ul>

            {/* WhatsApp */}
            <a
              href="https://wa.me/918125117683"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-5 px-4 py-2.5 rounded-full text-sm font-medium text-white transition-all hover:scale-105"
              style={{ backgroundColor: "#25D366" }}
              data-ocid="footer.link"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="white"
                role="img"
                aria-label="WhatsApp"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              WhatsApp Support
            </a>
          </div>
        </div>

        {/* Divider */}
        <div
          className="h-px w-full my-6"
          style={{ backgroundColor: "rgba(212,175,55,0.2)" }}
        />

        {/* Copyright */}
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs"
          style={{ color: "#7A6055" }}
        >
          <p>&copy; {currentYear} HSV Sugandhika. All rights reserved.</p>
          <p>
            Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-400 transition-colors"
              style={{ color: "#9B8072" }}
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
