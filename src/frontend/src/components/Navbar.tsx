import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogIn, LogOut, Menu, ShoppingCart, UserCircle, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "../contexts/CartContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Products", href: "#products" },
  { label: "About", href: "#about" },
  { label: "Benefits", href: "#benefits" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const { itemCount, openCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  const { identity, login, clear, isLoggingIn, isInitializing } =
    useInternetIdentity();

  const isIILoggedIn = !!identity;
  const principal = identity?.getPrincipal().toString() ?? "";
  const shortPrincipal = principal ? `${principal.slice(0, 8)}…` : "";

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className="sticky top-0 z-50 shadow-sm"
      style={{ backgroundColor: "#F3EAD6" }}
      data-ocid="nav.section"
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo + Brand Name */}
          <button
            type="button"
            onClick={() => handleNavClick("#home")}
            className="flex items-center gap-3 flex-shrink-0"
            data-ocid="nav.link"
          >
            <img
              src="/assets/whatsapp_image_2026-04-05_at_11.22.46_am-019d5c71-2980-708c-8674-1ca562889a60.jpeg"
              alt="HSV Sugandhika"
              className="h-10 lg:h-14 w-auto object-contain"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
            <div className="flex flex-col leading-tight text-left">
              <span
                className="font-bold text-lg lg:text-xl tracking-wide"
                style={{
                  color: "#6A1B1B",
                  fontFamily: "'Cormorant Garamond', serif",
                }}
              >
                HSV Sugandhika
              </span>
              <span
                className="text-xs hidden sm:block"
                style={{
                  color: "#D4AF37",
                  fontFamily: "'Inter', sans-serif",
                  letterSpacing: "0.08em",
                }}
              >
                From Nature's Heart
              </span>
            </div>
          </button>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <button
                type="button"
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-md hover:text-amber-700"
                style={{
                  color: "#3B2A16",
                  fontFamily: "'Inter', sans-serif",
                }}
                data-ocid="nav.link"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right: Cart + Admin Login + Mobile toggle */}
          <div className="flex items-center gap-2">
            {/* Cart Button */}
            <button
              type="button"
              onClick={openCart}
              className="relative p-2 rounded-full transition-colors hover:bg-amber-100"
              aria-label="Open cart"
              data-ocid="cart.open_modal_button"
            >
              <ShoppingCart className="w-6 h-6" style={{ color: "#6A1B1B" }} />
              {itemCount > 0 && (
                <Badge
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs text-white rounded-full"
                  style={{ backgroundColor: "#6A1B1B" }}
                >
                  {itemCount}
                </Badge>
              )}
            </button>

            {/* Admin Login / User Button (Internet Identity only) */}
            {isInitializing ? (
              <div
                className="w-8 h-8 rounded-full animate-pulse"
                style={{ backgroundColor: "#EDE0C8" }}
              />
            ) : isIILoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border-2 transition-colors hover:bg-amber-50"
                    style={{ borderColor: "#6A1B1B", color: "#6A1B1B" }}
                    data-ocid="nav.user.toggle"
                    aria-label="User menu"
                  >
                    <UserCircle className="w-4 h-4" />
                    <span className="hidden sm:inline font-mono text-xs">
                      {shortPrincipal}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56"
                  style={{ borderColor: "#EDE0C8" }}
                  data-ocid="nav.user.dropdown_menu"
                >
                  <div className="px-3 py-2">
                    <p
                      className="text-xs font-medium"
                      style={{ color: "#9B8E82" }}
                    >
                      Logged in as
                    </p>
                    <p
                      className="text-xs font-mono truncate mt-0.5"
                      style={{ color: "#3B2A16" }}
                    >
                      {principal}
                    </p>
                  </div>
                  <DropdownMenuSeparator
                    style={{ backgroundColor: "#EDE0C8" }}
                  />
                  <DropdownMenuItem
                    onClick={() => {
                      window.location.href = "/admin";
                    }}
                    className="cursor-pointer text-sm"
                    style={{ color: "#6A1B1B" }}
                    data-ocid="nav.admin.link"
                  >
                    Admin Panel
                  </DropdownMenuItem>
                  <DropdownMenuSeparator
                    style={{ backgroundColor: "#EDE0C8" }}
                  />
                  <DropdownMenuItem
                    onClick={clear}
                    className="cursor-pointer text-sm"
                    style={{ color: "#DC2626" }}
                    data-ocid="nav.logout.button"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={login}
                disabled={isLoggingIn}
                className="rounded-full border-2 font-medium text-sm flex items-center gap-1.5 px-3 h-9"
                style={{ borderColor: "#6A1B1B", color: "#6A1B1B" }}
                data-ocid="nav.login.button"
              >
                {isLoggingIn ? (
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <LogIn className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">
                  {isLoggingIn ? "Logging in…" : "Admin"}
                </span>
              </Button>
            )}

            {/* Mobile toggle */}
            <button
              type="button"
              className="lg:hidden p-2 rounded-md"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
              data-ocid="nav.toggle"
            >
              {mobileOpen ? (
                <X className="w-6 h-6" style={{ color: "#6A1B1B" }} />
              ) : (
                <Menu className="w-6 h-6" style={{ color: "#6A1B1B" }} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div
            className="lg:hidden border-t py-4 flex flex-col gap-2"
            style={{ borderColor: "#D4AF37", backgroundColor: "#F3EAD6" }}
          >
            {NAV_LINKS.map((link) => (
              <button
                type="button"
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="px-4 py-3 text-left font-medium rounded-lg transition-colors hover:bg-amber-100"
                style={{ color: "#3B2A16" }}
                data-ocid="nav.link"
              >
                {link.label}
              </button>
            ))}

            {/* Mobile Admin Login/Logout */}
            {isIILoggedIn ? (
              <button
                type="button"
                onClick={clear}
                className="mx-4 mt-1 px-4 py-3 text-left font-medium rounded-lg flex items-center gap-2 border-2"
                style={{
                  color: "#6A1B1B",
                  borderColor: "#6A1B1B",
                  backgroundColor: "transparent",
                }}
                data-ocid="nav.logout.button"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  login();
                }}
                disabled={isLoggingIn}
                className="mx-4 mt-1 px-4 py-3 text-left font-medium rounded-lg flex items-center gap-2 border-2"
                style={{
                  color: "#6A1B1B",
                  borderColor: "#6A1B1B",
                  backgroundColor: "transparent",
                }}
                data-ocid="nav.login.button"
              >
                <LogIn className="w-4 h-4" />
                {isLoggingIn ? "Logging in…" : "Admin Login"}
              </button>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
