import { Toaster } from "@/components/ui/sonner";
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { AboutSection } from "./components/AboutSection";
import { BenefitsSection } from "./components/BenefitsSection";
import { BestsellerSection } from "./components/BestsellerSection";
import { CartDrawer } from "./components/CartDrawer";
import { ContactSection } from "./components/ContactSection";
import { Footer } from "./components/Footer";
import { HeroSection } from "./components/HeroSection";
import { Navbar } from "./components/Navbar";
import { ProductsSection } from "./components/ProductsSection";
import { PromoBanner } from "./components/PromoBanner";
import { TestimonialsSection } from "./components/TestimonialsSection";
import { TrustStrip } from "./components/TrustStrip";
import { WhatsAppFab } from "./components/WhatsAppFab";
import { CartProvider } from "./contexts/CartContext";
import { AdminPanel } from "./pages/AdminPanel";
import { CheckoutPage } from "./pages/CheckoutPage";
import { PaymentFailure } from "./pages/PaymentFailure";
import { PaymentSuccess } from "./pages/PaymentSuccess";

// ─── Scroll Reveal Hook ───────────────────────────────────────────────

function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        }
      },
      { threshold: 0.12 },
    );
    for (const el of document.querySelectorAll(".reveal")) {
      observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);
}

// ─── Meta Tags Hook ───────────────────────────────────────────

function useMetaTags() {
  useEffect(() => {
    document.title =
      "HSV Sugandhika \u2013 From Nature's Heart | Sacred Pooja Items";
    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(
        `meta[name='${name}']`,
      ) as HTMLMetaElement;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };
    const setOg = (prop: string, content: string) => {
      let el = document.querySelector(
        `meta[property='${prop}']`,
      ) as HTMLMetaElement;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("property", prop);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };
    setMeta(
      "description",
      "HSV Sugandhika offers 100% natural, handcrafted Indian pooja items: agarbatti, dhoop, camphor, pooja kits, and sacred essential oils.",
    );
    setOg(
      "og:title",
      "HSV Sugandhika \u2013 Sacred Pooja Items from Nature's Heart",
    );
    setOg(
      "og:description",
      "100% natural agarbatti, dhoop, camphor, pooja kits, and essential oils. Handcrafted by Indian artisans.",
    );
    setOg("og:type", "website");
    setOg(
      "og:image",
      `${window.location.origin}/assets/generated/hero-bg.dim_1920x800.jpg`,
    );
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", "HSV Sugandhika \u2013 Sacred Pooja Items");
    setMeta(
      "twitter:description",
      "100% natural, handcrafted Indian pooja items. Agarbatti, Dhoop, Camphor & more.",
    );
  }, []);
}

// ─── Main Store Page ───────────────────────────────────────────────

function StorePage() {
  useScrollReveal();
  useMetaTags();

  return (
    <div className="min-h-screen">
      <Navbar />
      <PromoBanner />
      <main>
        <HeroSection />
        <TrustStrip />
        <BestsellerSection />
        <ProductsSection />
        <AboutSection />
        <BenefitsSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
      <CartDrawer />
      <WhatsAppFab />
    </div>
  );
}

// ─── Router Setup ─────────────────────────────────────────────────────────────

const rootRoute = createRootRoute();

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: StorePage,
});

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/checkout",
  component: CheckoutPage,
});

const paymentSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/payment-success",
  component: PaymentSuccess,
});

const paymentFailureRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/payment-failure",
  component: PaymentFailure,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPanel,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  checkoutRoute,
  paymentSuccessRoute,
  paymentFailureRoute,
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// ─── App Root ────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <CartProvider>
      <RouterProvider router={router} />
      <Toaster richColors position="top-right" />
    </CartProvider>
  );
}
