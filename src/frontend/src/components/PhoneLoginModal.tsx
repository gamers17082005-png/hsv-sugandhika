import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Loader2, Mail, Phone, Shield } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { usePhoneAuth } from "../contexts/PhoneAuthContext";
import { useActor } from "../hooks/useActor";

// ─── Types ──────────────────────────────────────────────────────────────────────────────

interface PhoneLoginModalProps {
  open: boolean;
  onClose: () => void;
}

type Step = "contact" | "otp";
type ContactType = "phone" | "email" | "unknown";

// ─── Helpers ──────────────────────────────────────────────────────────────────────────────

// Only used for email (simulated) OTP - phone OTP is generated server-side
function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function detectContactType(value: string): ContactType {
  if (/^[6-9]\d{9}$/.test(value)) return "phone";
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "email";
  return "unknown";
}

function maskContact(value: string, type: ContactType): string {
  if (type === "phone") return `+91 ${value.slice(0, 5)}XXXXX`;
  if (type === "email") {
    const [local, domain] = value.split("@");
    const maskedLocal =
      local.length > 3
        ? `${local.slice(0, 3)}${"*".repeat(local.length - 3)}`
        : local;
    return `${maskedLocal}@${domain}`;
  }
  return value;
}

// ─── Component ─────────────────────────────────────────────────────────────────────────────

export function PhoneLoginModal({ open, onClose }: PhoneLoginModalProps) {
  const { loginWithContact } = usePhoneAuth();
  const { actor } = useActor();

  const [step, setStep] = useState<Step>("contact");
  const [contact, setContact] = useState("");
  const [contactType, setContactType] = useState<ContactType>("unknown");
  const [contactError, setContactError] = useState("");
  const [otp, setOtp] = useState("");
  // Only used for email OTP (simulated); phone OTP is verified server-side
  const [emailOtp, setEmailOtp] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setStep("contact");
      setContact("");
      setContactType("unknown");
      setContactError("");
      setOtp("");
      setEmailOtp("");
      setResendCountdown(0);
      setSending(false);
      setVerifying(false);
      if (countdownRef.current) clearInterval(countdownRef.current);
    }
  }, [open]);

  // Live-detect contact type as user types
  const handleContactChange = (raw: string) => {
    const looksLikePhone = /^\d+$/.test(raw.replace(/^\+91\s?/, ""));
    const cleaned = looksLikePhone
      ? raw.replace(/[^\d]/g, "").slice(0, 10)
      : raw.trim();
    setContact(cleaned);
    setContactType(detectContactType(cleaned));
    if (contactError) setContactError("");
  };

  const startResendCountdown = () => {
    setResendCountdown(30);
    if (countdownRef.current) clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) {
          if (countdownRef.current) clearInterval(countdownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOtp = async () => {
    const type = detectContactType(contact);
    if (type === "unknown") {
      setContactError("Enter a valid 10-digit mobile number or email address.");
      return;
    }
    setContactType(type);
    setContactError("");

    if (type === "phone") {
      // Backend generates and sends OTP
      if (!actor) {
        toast.error("Service not ready — please try again.", { icon: "⚠️" });
        return;
      }
      setSending(true);
      try {
        const sent = await (actor as any).requestOTP(contact);
        const masked = maskContact(contact, "phone");
        if (sent) {
          toast.success(`OTP sent to ${masked}`, {
            duration: 6000,
            icon: "📱",
          });
        } else {
          toast.warning(
            "SMS not configured — OTP generated but not delivered. Check admin settings.",
            { duration: 8000, icon: "⚠️" },
          );
        }
        setOtp("");
        setStep("otp");
        startResendCountdown();
      } catch {
        toast.error("Failed to send OTP — please try again", {
          duration: 6000,
          icon: "❌",
        });
      } finally {
        setSending(false);
      }
    } else {
      // Email: simulated OTP (shown in toast)
      const newOtp = generateOtp();
      setEmailOtp(newOtp);
      setOtp("");
      toast.info(`Dev Mode: Your OTP for ${contact} is ${newOtp}`, {
        duration: 12000,
        icon: "✉️",
      });
      setStep("otp");
      startResendCountdown();
    }
  };

  const handleResend = async () => {
    if (resendCountdown > 0) return;

    if (contactType === "phone") {
      if (!actor) {
        toast.error("Service not ready — please try again.", { icon: "⚠️" });
        return;
      }
      setSending(true);
      try {
        const sent = await (actor as any).requestOTP(contact);
        const masked = maskContact(contact, "phone");
        if (sent) {
          toast.success(`OTP resent to ${masked}`, {
            duration: 6000,
            icon: "📱",
          });
        } else {
          toast.warning("SMS not configured — check admin settings", {
            duration: 8000,
            icon: "⚠️",
          });
        }
        setOtp("");
        startResendCountdown();
      } catch {
        toast.error("Failed to resend OTP — please try again", {
          duration: 6000,
          icon: "❌",
        });
      } finally {
        setSending(false);
      }
    } else {
      // Email resend
      const newOtp = generateOtp();
      setEmailOtp(newOtp);
      setOtp("");
      toast.info(`Dev Mode: Your OTP for ${contact} is ${newOtp}`, {
        duration: 12000,
        icon: "✉️",
      });
      startResendCountdown();
    }
  };

  const handleVerify = async () => {
    if (contactType === "phone") {
      // Server-side verification
      if (!actor) {
        toast.error("Service not ready — please try again.", { icon: "⚠️" });
        return;
      }
      setVerifying(true);
      try {
        const valid = await (actor as any).verifyOTP(contact, otp);
        if (valid) {
          loginWithContact(contact, "phone");
          toast.success("Welcome! You're logged in.", { icon: "🎉" });
          onClose();
        } else {
          toast.error("Incorrect or expired OTP. Please try again.", {
            icon: "❌",
          });
          setOtp("");
        }
      } catch {
        toast.error("Verification failed — please try again.", { icon: "❌" });
        setOtp("");
      } finally {
        setVerifying(false);
      }
    } else {
      // Email: local comparison
      if (otp === emailOtp) {
        loginWithContact(contact, "email");
        toast.success("Welcome! You're logged in.", { icon: "🎉" });
        onClose();
      } else {
        toast.error("Incorrect OTP. Please try again.", { icon: "❌" });
        setOtp("");
      }
    }
  };

  const maskedContact = maskContact(contact, contactType);
  const isPhone = contactType === "phone";
  const isEmail = contactType === "email";
  const isLoading = sending || verifying;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-sm w-full rounded-2xl border-0 shadow-2xl p-0 overflow-hidden"
        style={{ backgroundColor: "#F3EAD6" }}
        data-ocid="phone_login.dialog"
      >
        {/* Decorative top bar */}
        <div
          className="h-1.5 w-full"
          style={{
            background: "linear-gradient(90deg, #FF7A00 0%, #D4AF37 100%)",
          }}
        />

        <div className="px-7 py-6">
          <DialogHeader className="mb-5">
            <div className="flex items-center gap-2 mb-1">
              <span
                className="flex items-center justify-center w-8 h-8 rounded-full"
                style={{ backgroundColor: "#6A1B1B", color: "#F3EAD6" }}
              >
                {step === "contact" ? (
                  isEmail ? (
                    <Mail className="w-4 h-4" />
                  ) : (
                    <Phone className="w-4 h-4" />
                  )
                ) : isEmail ? (
                  <Mail className="w-4 h-4" />
                ) : (
                  <Phone className="w-4 h-4" />
                )}
              </span>
              <DialogTitle
                className="text-xl font-bold tracking-tight"
                style={{
                  color: "#6A1B1B",
                  fontFamily: "'Cormorant Garamond', serif",
                }}
              >
                {step === "contact" ? "Login with OTP" : "Verify OTP"}
              </DialogTitle>
            </div>
            <p className="text-sm mt-1" style={{ color: "#7A5C3A" }}>
              {step === "contact"
                ? "Enter your mobile number or email address"
                : `Enter the 6-digit OTP sent to ${maskedContact}`}
            </p>
          </DialogHeader>

          {/* ── Step 1: Contact Input ─────────────────────────────────────────── */}
          {step === "contact" && (
            <div className="space-y-4">
              <div>
                <label
                  className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
                  style={{ color: "#9B7B4E" }}
                  htmlFor="contact-input"
                >
                  Mobile Number or Email
                </label>

                {/* Input row */}
                <div
                  className="flex items-center rounded-xl border-2 overflow-hidden transition-colors"
                  style={{
                    borderColor: contactError
                      ? "#DC2626"
                      : isPhone
                        ? "#FF7A00"
                        : isEmail
                          ? "#D4AF37"
                          : "#D4AF37",
                    backgroundColor: "#FDF7EE",
                  }}
                >
                  {(isPhone || (!isEmail && /^\d+$/.test(contact))) && (
                    <span
                      className="px-3 py-3 text-sm font-semibold border-r-2 select-none flex items-center gap-1"
                      style={{
                        color: "#6A1B1B",
                        borderColor: "#D4AF37",
                        backgroundColor: "#EDE0C8",
                      }}
                    >
                      <Phone className="w-3.5 h-3.5" />
                      +91
                    </span>
                  )}
                  {isEmail && (
                    <span
                      className="px-3 py-3 text-sm font-semibold border-r-2 select-none flex items-center gap-1"
                      style={{
                        color: "#6A1B1B",
                        borderColor: "#D4AF37",
                        backgroundColor: "#EDE0C8",
                      }}
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </span>
                  )}
                  <input
                    id="contact-input"
                    type={isEmail ? "email" : "tel"}
                    inputMode={isEmail ? "email" : "numeric"}
                    value={contact}
                    onChange={(e) => handleContactChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !isLoading) handleSendOtp();
                    }}
                    placeholder="9876543210 or you@email.com"
                    className="flex-1 px-3 py-3 text-sm bg-transparent outline-none"
                    style={{ color: "#3B2A16" }}
                    autoComplete="off"
                    data-ocid="phone_login.input"
                  />
                </div>

                {/* Live hint */}
                {contact.length > 0 && !contactError && (
                  <p
                    className="text-xs mt-1.5 flex items-center gap-1"
                    style={{
                      color: isPhone || isEmail ? "#22C55E" : "#9B7B4E",
                    }}
                  >
                    {isPhone && (
                      <>
                        <Phone className="w-3 h-3" /> Phone number detected
                      </>
                    )}
                    {isEmail && (
                      <>
                        <Mail className="w-3 h-3" /> Email address detected
                      </>
                    )}
                    {!isPhone && !isEmail && "Keep typing…"}
                  </p>
                )}

                {contactError && (
                  <p
                    className="text-xs mt-1.5"
                    style={{ color: "#DC2626" }}
                    data-ocid="phone_login.error_state"
                  >
                    {contactError}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={handleSendOtp}
                disabled={isLoading}
                className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ backgroundColor: "#FF7A00" }}
                data-ocid="phone_login.submit_button"
              >
                {sending && <Loader2 className="w-4 h-4 animate-spin" />}
                {sending ? "Sending OTP..." : "Send OTP"}
              </button>
            </div>
          )}

          {/* ── Step 2: OTP Input ───────────────────────────────────────────── */}
          {step === "otp" && (
            <div className="space-y-5">
              <div>
                <p
                  className="text-xs font-semibold mb-3 uppercase tracking-wider"
                  style={{ color: "#9B7B4E" }}
                >
                  Enter OTP
                </p>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={setOtp}
                    data-ocid="phone_login.input"
                  >
                    <InputOTPGroup>
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <InputOTPSlot
                          key={i}
                          index={i}
                          className="w-11 h-12 text-base font-bold"
                          style={{
                            borderColor: "#D4AF37",
                            backgroundColor: "#FDF7EE",
                            color: "#6A1B1B",
                          }}
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>

              <button
                type="button"
                onClick={handleVerify}
                disabled={otp.length !== 6 || verifying}
                className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ backgroundColor: "#6A1B1B" }}
                data-ocid="phone_login.confirm_button"
              >
                {verifying && <Loader2 className="w-4 h-4 animate-spin" />}
                {verifying ? "Verifying..." : "Verify OTP"}
              </button>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setStep("contact");
                    setOtp("");
                  }}
                  className="text-xs underline underline-offset-2 transition-opacity hover:opacity-70"
                  style={{ color: "#9B7B4E" }}
                  data-ocid="phone_login.cancel_button"
                >
                  ← Change contact
                </button>

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendCountdown > 0 || sending}
                  className="text-xs font-medium transition-opacity disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-70 flex items-center gap-1"
                  style={{ color: resendCountdown > 0 ? "#9B7B4E" : "#FF7A00" }}
                  data-ocid="phone_login.secondary_button"
                >
                  {sending && <Loader2 className="w-3 h-3 animate-spin" />}
                  {resendCountdown > 0
                    ? `Resend in ${resendCountdown}s`
                    : sending
                      ? "Sending..."
                      : "Resend OTP"}
                </button>
              </div>
            </div>
          )}

          {/* Brand footer */}
          <div
            className="mt-6 pt-4 flex items-center gap-2 border-t"
            style={{ borderColor: "#EDE0C8" }}
          >
            <Shield
              className="w-3.5 h-3.5 flex-shrink-0"
              style={{ color: "#D4AF37" }}
            />
            <p className="text-xs" style={{ color: "#9B7B4E" }}>
              Your details are safe with us. We never share your data.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
