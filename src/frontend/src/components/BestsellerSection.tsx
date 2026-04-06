import { ShoppingCart, Star, TrendingUp } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "../backend.d";
import { useCart } from "../contexts/CartContext";
import { useActor } from "../hooks/useActor";
import { useAllProducts } from "../hooks/useQueries";
import { ProductDetailModal } from "./ProductDetailModal";

const BESTSELLER_IDS = [BigInt(1), BigInt(3), BigInt(5), BigInt(6), BigInt(7)];

function SmallStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className="w-2.5 h-2.5"
          fill={i <= Math.round(rating) ? "#D4AF37" : "none"}
          style={{ color: "#D4AF37" }}
        />
      ))}
    </div>
  );
}

function SmallProductCard({
  product,
  badge,
}: {
  product: Product;
  badge?: string;
}) {
  const { addItem, openCart } = useCart();
  const { actor } = useActor();
  const [selected, setSelected] = useState<Product | null>(null);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await addItem(
      product.id,
      1,
      product.name,
      product.price,
      product.imageUrl,
      actor,
    );
    toast.success(`${product.name} added to cart!`, {
      action: { label: "View Cart", onClick: openCart },
    });
  };

  return (
    <>
      <article
        className="bg-white rounded-xl overflow-hidden border flex-shrink-0 w-40 sm:w-44"
        style={{ borderColor: "#EDE0C8" }}
      >
        <button
          type="button"
          className="relative w-full aspect-square bg-amber-50 block p-0 border-0 overflow-hidden"
          onClick={() => setSelected(product)}
        >
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            loading="lazy"
          />
          {badge && (
            <span
              className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
              style={{
                backgroundColor: badge === "NEW" ? "#D4AF37" : "#6A1B1B",
              }}
            >
              {badge}
            </span>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white text-xs font-semibold">
                Out of Stock
              </span>
            </div>
          )}
        </button>

        <div className="p-2.5">
          <p
            className="text-xs font-semibold leading-snug mb-1 line-clamp-2"
            style={{
              color: "#1C1C1C",
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "0.75rem",
            }}
          >
            {product.name}
          </p>
          <SmallStars rating={product.rating} />
          <div className="flex items-center justify-between mt-2">
            <span className="font-bold text-sm" style={{ color: "#6A1B1B" }}>
              \u20B9{product.price.toLocaleString("en-IN")}
            </span>
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="flex items-center justify-center w-7 h-7 rounded-full text-white transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#6A1B1B" }}
              title="Add to cart"
            >
              <ShoppingCart className="w-3 h-3" />
            </button>
          </div>
        </div>
      </article>

      {selected && (
        <ProductDetailModal
          product={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}

function HorizontalScroll({
  products,
  badge,
}: {
  products: Product[];
  badge?: string;
}) {
  return (
    <div
      className="flex gap-3 overflow-x-auto pb-3 scroll-smooth snap-x snap-mandatory [-webkit-overflow-scrolling:touch]"
      style={{ scrollbarWidth: "none" }}
    >
      {products.map((p) => (
        <div key={p.id.toString()} className="snap-start flex-shrink-0">
          <SmallProductCard product={p} badge={badge} />
        </div>
      ))}
    </div>
  );
}

const SACRED_PROMISES = [
  {
    icon: "\uD83E\uDEAA",
    title: "Agarbatti & Dhoop",
    desc: "Pure fragrance for your daily pooja rituals",
  },
  {
    icon: "\uD83C\uDF38",
    title: "Camphor & Oils",
    desc: "Hand-pressed essential oils & camphor cubes",
  },
  {
    icon: "\uD83E\uDDBF",
    title: "Pooja Kits",
    desc: "Complete sacred kits for every occasion",
  },
];

function SacredPlaceholder() {
  return (
    <div
      className="py-6 px-4 rounded-xl"
      style={{
        background:
          "linear-gradient(135deg, rgba(255,245,230,0.9) 0%, rgba(247,242,231,1) 100%)",
        border: "1px dashed #D4AF37",
      }}
    >
      <p
        className="text-center text-sm mb-5 italic"
        style={{ color: "#8B1A1A", fontFamily: "'Cormorant Garamond', serif" }}
      >
        \u2728 Curating our sacred collection for you\u2026
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {SACRED_PROMISES.map((item) => (
          <div
            key={item.title}
            className="flex items-start gap-3 p-3 rounded-lg bg-white/70"
            style={{ border: "1px solid #EDE0C8" }}
          >
            <span className="text-2xl flex-shrink-0">{item.icon}</span>
            <div>
              <p
                className="font-semibold text-sm"
                style={{
                  color: "#6A1B1B",
                  fontFamily: "'Cormorant Garamond', serif",
                }}
              >
                {item.title}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "#6B5B3E" }}>
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BestsellerSection() {
  const { data: products, isLoading } = useAllProducts();

  const hasProducts = !isLoading && products && products.length > 0;

  const bestsellers = hasProducts
    ? (() => {
        const byId = BESTSELLER_IDS.map((id) =>
          products!.find((p) => p.id === id),
        ).filter(Boolean) as Product[];
        return byId.length > 0
          ? byId
          : [...products!].sort((a, b) => b.rating - a.rating).slice(0, 5);
      })()
    : [];

  return (
    <section className="py-6 px-4" style={{ backgroundColor: "#FFFDF7" }}>
      <div className="max-w-7xl mx-auto">
        <div className="reveal">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp
              className="w-5 h-5 flex-shrink-0"
              style={{ color: "#6A1B1B" }}
            />
            <h2
              className="font-serif text-xl sm:text-2xl font-bold"
              style={{
                color: "#8B1A1A",
                fontFamily: "'Cormorant Garamond', serif",
              }}
            >
              Bestselling Products
            </h2>
            {hasProducts && (
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full text-white ml-1"
                style={{ backgroundColor: "#6A1B1B" }}
              >
                \uD83D\uDD25 Popular
              </span>
            )}
          </div>

          {hasProducts ? (
            <HorizontalScroll products={bestsellers} badge="BEST" />
          ) : (
            <SacredPlaceholder />
          )}
        </div>
      </div>
    </section>
  );
}
