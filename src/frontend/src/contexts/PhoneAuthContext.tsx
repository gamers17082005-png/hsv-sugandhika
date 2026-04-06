import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ContactType = "phone" | "email";

export interface PhoneUser {
  contact: string; // raw value: phone digits or email address
  contactType: ContactType;
  /** @deprecated use contact+contactType — kept for backwards compatibility */
  phone: string;
}

interface PhoneAuthContextValue {
  phoneUser: PhoneUser | null;
  /** @deprecated prefer loginWithContact */
  loginWithPhone: (phone: string) => void;
  loginWithContact: (contact: string, type: ContactType) => void;
  logoutPhone: () => void;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const PhoneAuthContext = createContext<PhoneAuthContextValue | null>(null);

const STORAGE_KEY = "hsv_phone_user";

export function PhoneAuthProvider({ children }: { children: React.ReactNode }) {
  const [phoneUser, setPhoneUser] = useState<PhoneUser | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;
      const parsed = JSON.parse(stored) as Partial<PhoneUser>;
      // Migrate old format (had only `phone`)
      if (parsed.phone && !parsed.contact) {
        return {
          contact: parsed.phone,
          contactType: "phone",
          phone: parsed.phone,
        };
      }
      return parsed as PhoneUser;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (phoneUser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(phoneUser));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [phoneUser]);

  const loginWithContact = (contact: string, type: ContactType) => {
    setPhoneUser({
      contact,
      contactType: type,
      phone: type === "phone" ? contact : "",
    });
  };

  // Backwards-compatible shim
  const loginWithPhone = (phone: string) => {
    loginWithContact(phone, "phone");
  };

  const logoutPhone = () => {
    setPhoneUser(null);
  };

  return (
    <PhoneAuthContext.Provider
      value={{ phoneUser, loginWithPhone, loginWithContact, logoutPhone }}
    >
      {children}
    </PhoneAuthContext.Provider>
  );
}

export function usePhoneAuth(): PhoneAuthContextValue {
  const ctx = useContext(PhoneAuthContext);
  if (!ctx)
    throw new Error("usePhoneAuth must be used within PhoneAuthProvider");
  return ctx;
}
