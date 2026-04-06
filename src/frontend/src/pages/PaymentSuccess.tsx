import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { CheckCircle, Package, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { useRef } from "react";
import { useCart } from "../contexts/CartContext";
import { useActor } from "../hooks/useActor";

export function PaymentSuccess() {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const { actor } = useActor();
  const cleared = useRef(false);

  // Clear cart once on mount (use ref to avoid running twice in strict mode)
  if (!cleared.current) {
    cleared.current = true;
    clearCart(actor);
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ backgroundColor: "#FDF6E3" }}
      data-ocid="payment_success.page"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center space-y-6"
      >
        {/* Logo */}
        <button
          type="button"
          onClick={() => navigate({ to: "/" })}
          className="flex items-center gap-3 mx-auto"
          data-ocid="payment_success.nav.link"
        >
          <img
            src="/assets/whatsapp_image_2026-04-05_at_11.22.46_am-019d5c71-2980-708c-8674-1ca562889a60.jpeg"
            alt="HSV Sugandhika"
            className="h-10 w-auto object-contain"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
          <span
            className="font-bold text-lg"
            style={{
              color: "#6A1B1B",
              fontFamily: "'Cormorant Garamond', serif",
            }}
          >
            HSV Sugandhika
          </span>
        </button>

        {/* Success card */}
        <div
          className="rounded-2xl p-8 shadow-lg space-y-5"
          style={{ backgroundColor: "white", border: "2px solid #D4AF37" }}
        >
          {/* Animated check */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.2,
            }}
            className="w-24 h-24 mx-auto rounded-full flex items-center justify-center"
            style={{ backgroundColor: "#F0FDF4" }}
          >
            <CheckCircle className="w-12 h-12" style={{ color: "#16A34A" }} />
          </motion.div>

          <div>
            <h1
              className="text-3xl font-bold"
              style={{
                color: "#6A1B1B",
                fontFamily: "'Cormorant Garamond', serif",
              }}
            >
              🙏 Payment Successful!
            </h1>
            <p className="mt-2 text-sm" style={{ color: "#6B6257" }}>
              Your sacred order has been placed. May these divine items bring
              blessings and peace to your home.
            </p>
          </div>

          <div
            className="p-4 rounded-xl flex items-center gap-3"
            style={{
              backgroundColor: "#FFFBEB",
              border: "1px solid #D4AF37",
            }}
          >
            <Package
              className="w-5 h-5 flex-shrink-0"
              style={{ color: "#D4AF37" }}
            />
            <div className="text-left">
              <p className="font-semibold text-sm" style={{ color: "#92400E" }}>
                Order Confirmed
              </p>
              <p className="text-xs" style={{ color: "#92400E" }}>
                Expected delivery in 3–5 business days. A confirmation will be
                sent to your email.
              </p>
            </div>
          </div>

          <div
            className="flex items-center gap-2 justify-center text-xs"
            style={{ color: "#9B8E82" }}
          >
            <ShieldCheck className="w-4 h-4" style={{ color: "#D4AF37" }} />
            <span>Secure payment processed · Order tracked</span>
          </div>

          <Button
            type="button"
            onClick={() => navigate({ to: "/" })}
            className="w-full h-12 rounded-full font-semibold text-base"
            style={{ backgroundColor: "#6A1B1B", color: "#FDF6E3" }}
            data-ocid="payment_success.primary_button"
          >
            Continue Shopping
          </Button>
        </div>

        <p className="text-xs" style={{ color: "#9B8E82" }}>
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            caffeine.ai
          </a>
        </p>
      </motion.div>
    </div>
  );
}
