import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { AlertCircle, ArrowLeft, RefreshCcw } from "lucide-react";
import { motion } from "motion/react";

export function PaymentFailure() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ backgroundColor: "#FDF6E3" }}
      data-ocid="payment_failure.page"
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
          data-ocid="payment_failure.nav.link"
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

        {/* Failure card */}
        <div
          className="rounded-2xl p-8 shadow-lg space-y-5"
          style={{ backgroundColor: "white", border: "2px solid #EDE0C8" }}
        >
          {/* Animated X */}
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
            style={{ backgroundColor: "#FEF2F2" }}
          >
            <AlertCircle className="w-12 h-12" style={{ color: "#DC2626" }} />
          </motion.div>

          <div>
            <h1
              className="text-3xl font-bold"
              style={{
                color: "#6A1B1B",
                fontFamily: "'Cormorant Garamond', serif",
              }}
            >
              Payment Unsuccessful
            </h1>
            <p className="mt-2 text-sm" style={{ color: "#6B6257" }}>
              Your payment could not be processed. Don't worry — your cart is
              still saved. Please try again or choose a different payment
              method.
            </p>
          </div>

          <div
            className="p-4 rounded-xl text-left"
            style={{
              backgroundColor: "#FEF2F2",
              border: "1px solid #FCA5A5",
            }}
          >
            <p className="text-sm font-semibold" style={{ color: "#DC2626" }}>
              What might have gone wrong:
            </p>
            <ul
              className="text-xs mt-2 space-y-1 list-disc list-inside"
              style={{ color: "#7F1D1D" }}
            >
              <li>Card declined or insufficient funds</li>
              <li>Payment session timed out</li>
              <li>Network connectivity issue</li>
              <li>Incorrect card details entered</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              onClick={() => navigate({ to: "/checkout" })}
              className="flex-1 h-11 rounded-full font-semibold"
              style={{ backgroundColor: "#6A1B1B", color: "#FDF6E3" }}
              data-ocid="payment_failure.retry.primary_button"
            >
              <RefreshCcw className="w-4 h-4 mr-2" /> Try Again
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: "/" })}
              className="flex-1 h-11 rounded-full"
              style={{ borderColor: "#6A1B1B", color: "#6A1B1B" }}
              data-ocid="payment_failure.shop.secondary_button"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Return to Shop
            </Button>
          </div>
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
