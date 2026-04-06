import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import {
  SiFacebook,
  SiGmail,
  SiInstagram,
  SiWhatsapp,
  SiYoutube,
} from "react-icons/si";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";

const BG_IMAGE =
  "/assets/whatsapp_image_2026-04-05_at_12.09.48_pm_1-019d5c64-be42-72b5-b10d-0b9d0b33a06b.jpeg";

const FOLLOW_LINKS = [
  {
    Icon: SiInstagram,
    href: "https://www.instagram.com/hsv_sugandhika_sticks?igsh=MWx6cmJ5cTNxNm01ZA%3D%3D&utm_source=qr",
    label: "Instagram",
  },
  {
    Icon: SiFacebook,
    href: "https://www.facebook.com/share/1GiKf5GyKt/?mibextid=wwXIfr",
    label: "Facebook",
  },
  {
    Icon: SiYoutube,
    href: "https://youtube.com/@hsvsugandhika?si=9eCTRcq_GZoyDz3g",
    label: "YouTube",
  },
  { Icon: SiWhatsapp, href: "https://wa.me/918125117683", label: "WhatsApp" },
  { Icon: SiGmail, href: "mailto:hsvgrouphub@gmail.com", label: "Gmail" },
];

export function ContactSection() {
  const { actor } = useActor();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Save inquiry to backend if actor is available
      if (actor) {
        try {
          await actor.submitContactInquiry(
            name.trim(),
            email.trim(),
            message.trim(),
          );
        } catch {
          // Backend save failed - fall through to mailto fallback
        }
      }

      // Open mailto as the delivery method (direct email)
      const subject = encodeURIComponent(
        `Inquiry from ${name.trim()} - HSV Sugandhika`,
      );
      const body = encodeURIComponent(
        `Name: ${name.trim()}\nEmail: ${email.trim()}\n\nMessage:\n${message.trim()}`,
      );
      const mailtoLink = `mailto:hsvgrouphub@gmail.com?subject=${subject}&body=${body}`;
      window.location.href = mailtoLink;

      toast.success("Opening your email app to send the message.");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      toast.error(
        "Could not send message. Please try WhatsApp or email us directly at hsvgrouphub@gmail.com",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative py-20 px-4 overflow-hidden"
      style={{
        backgroundImage: `url('${BG_IMAGE}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(42,10,10,0.85) 0%, rgba(59,42,22,0.8) 100%)",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 reveal">
          <p
            className="text-sm font-semibold tracking-widest uppercase mb-3"
            style={{ color: "#D4AF37" }}
          >
            We're Here for You
          </p>
          <h2
            className="text-4xl lg:text-5xl font-bold mb-4"
            style={{
              color: "#FFD700",
              fontFamily:
                "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
            }}
          >
            Get in Touch with Us
          </h2>
          <p className="text-gray-300 text-lg">
            Have questions about our products? We'd love to hear from you.
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-3xl p-8 lg:p-12 reveal"
          style={{
            backgroundColor: "rgba(243, 234, 214, 0.08)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(212,175,55,0.3)",
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Form */}
            <div className="lg:col-span-3">
              <form
                onSubmit={handleSubmit}
                className="space-y-5"
                data-ocid="contact.modal"
              >
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-sm font-medium mb-2 text-gray-200"
                  >
                    Your Name
                  </label>
                  <Input
                    id="contact-name"
                    type="text"
                    placeholder="e.g. Priya Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-xl border-0 bg-white/10 text-white placeholder:text-gray-400 focus:ring-2"
                    style={{ borderColor: "rgba(212,175,55,0.4)" }}
                    data-ocid="contact.input"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-sm font-medium mb-2 text-gray-200"
                  >
                    Email Address
                  </label>
                  <Input
                    id="contact-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-xl border-0 bg-white/10 text-white placeholder:text-gray-400 focus:ring-2"
                    data-ocid="contact.input"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-sm font-medium mb-2 text-gray-200"
                  >
                    Message
                  </label>
                  <Textarea
                    id="contact-message"
                    placeholder="Tell us about your inquiry, bulk order, or feedback..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    className="rounded-xl border-0 bg-white/10 text-white placeholder:text-gray-400 focus:ring-2 resize-none"
                    data-ocid="contact.textarea"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-[1.02] disabled:opacity-60"
                  style={{ backgroundColor: "#6A1B1B" }}
                  data-ocid="contact.submit_button"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>
                <p className="text-xs text-gray-400 text-center">
                  Clicking "Send Message" will open your email app with your
                  message pre-filled.
                </p>
              </form>
            </div>

            {/* Side info */}
            <div className="lg:col-span-2 flex flex-col justify-between gap-8">
              <div>
                <h3
                  className="font-serif text-2xl font-bold mb-4"
                  style={{
                    color: "#D4AF37",
                    fontFamily: "'Cormorant Garamond', serif",
                  }}
                >
                  Instant Support
                </h3>
                <p className="text-gray-300 text-sm mb-6">
                  For quick queries, product recommendations, or bulk orders,
                  reach us directly on WhatsApp. We reply within minutes.
                </p>

                {/* WhatsApp button */}
                <a
                  href="https://wa.me/918125117683"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-6 py-4 rounded-2xl font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                  style={{ backgroundColor: "#25D366", width: "fit-content" }}
                  data-ocid="contact.primary_button"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="white"
                    role="img"
                    aria-label="WhatsApp"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  Chat on WhatsApp
                </a>
              </div>

              {/* Contact details */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: "rgba(212,175,55,0.2)" }}
                  >
                    <MessageCircle
                      className="w-4 h-4"
                      style={{ color: "#D4AF37" }}
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Email</p>
                    <a
                      href="mailto:hsvgrouphub@gmail.com"
                      className="text-sm text-gray-200 hover:text-yellow-400 transition-colors"
                    >
                      hsvgrouphub@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: "rgba(212,175,55,0.2)" }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="#D4AF37"
                      role="img"
                      aria-label="Location"
                    >
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Address</p>
                    <p className="text-sm text-gray-200">
                      Beeramguda, Hyderabad - 502032
                    </p>
                  </div>
                </div>
              </div>

              {/* Follow Us */}
              <div>
                <h4
                  className="text-sm font-semibold tracking-wider uppercase mb-3"
                  style={{ color: "#D4AF37" }}
                >
                  Follow Us
                </h4>
                <div className="flex flex-wrap gap-3">
                  {FOLLOW_LINKS.map(({ Icon, href, label }) => (
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
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 hover:shadow-lg"
                      style={{
                        backgroundColor: "rgba(212,175,55,0.15)",
                        border: "1px solid rgba(212,175,55,0.4)",
                      }}
                      data-ocid="contact.link"
                    >
                      <Icon className="w-5 h-5" style={{ color: "#D4AF37" }} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
