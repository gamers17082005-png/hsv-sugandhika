import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "../backend.d";
import { useCart } from "../contexts/CartContext";
import { useActor } from "../hooks/useActor";
import { useAllProducts } from "../hooks/useQueries";
import { ProductDetailModal } from "./ProductDetailModal";

const CATEGORIES = [
  "All",
  "Agarbatti",
  "Dhoop",
  "Camphor",
  "Pooja Kits",
  "Essential Oils",
];

const DEVOTIONAL_SLOGANS: {
  id: string;
  text: string;
  type: "slogan" | "divider";
}[] = [
  { id: "s1", text: "Every ritual begins with pure devotion", type: "slogan" },
  { id: "d1", text: "✦", type: "divider" },
  {
    id: "s2",
    text: "Let fragrance carry your prayers to the divine",
    type: "slogan",
  },
  { id: "d2", text: "🙏", type: "divider" },
  { id: "s3", text: "Where nature meets the sacred", type: "slogan" },
  { id: "d3", text: "✦", type: "divider" },
  { id: "s4", text: "Pure offerings for a blessed life", type: "slogan" },
  { id: "d4", text: "🙏", type: "divider" },
  {
    id: "s5",
    text: "Handcrafted with love, offered with faith",
    type: "slogan",
  },
  { id: "d5", text: "✦", type: "divider" },
  {
    id: "s6",
    text: "Ignite your soul with nature's sacred gifts",
    type: "slogan",
  },
  { id: "d6", text: "🙏", type: "divider" },
];

const SKELETON_KEYS = ["s0", "s1", "s2", "s3", "s4", "s5", "s6", "s7"];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className="w-3.5 h-3.5"
          fill={i <= Math.round(rating) ? "#D4AF37" : "none"}
          style={{ color: "#D4AF37" }}
        />
      ))}
      <span className="text-xs ml-1" style={{ color: "#6B6257" }}>
        ({rating.toFixed(1)})
      </span>
    </div>
  );
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const { addItem, openCart } = useCart();
  const { actor } = useActor();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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

  const handleSelect = () => setSelectedProduct(product);

  return (
    <>
      <article
        className="product-card bg-white rounded-2xl overflow-hidden border"
        style={{ borderColor: "#EDE0C8" }}
        data-ocid={`products.item.${index + 1}`}
      >
        {/* Image – clickable */}
        <button
          type="button"
          className="relative overflow-hidden aspect-square bg-amber-50 w-full block p-0 border-0"
          onClick={handleSelect}
        >
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            loading="lazy"
          />
          {/* Category tag */}
          <span
            className="absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full text-white"
            style={{ backgroundColor: "#6A1B1B" }}
          >
            {product.category}
          </span>
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-semibold">Out of Stock</span>
            </div>
          )}
        </button>

        {/* Info */}
        <div className="p-4">
          <h3
            className="font-serif font-semibold text-base lg:text-lg leading-tight mb-2"
            style={{
              color: "#1C1C1C",
              fontFamily: "'Cormorant Garamond', serif",
            }}
          >
            {product.name}
          </h3>
          <StarRating rating={product.rating} />
          <div className="flex items-center justify-between mt-3">
            <span className="font-bold text-xl" style={{ color: "#6A1B1B" }}>
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium text-white transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#6A1B1B" }}
              data-ocid={`products.button.${index + 1}`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Add
            </button>
          </div>
        </div>
      </article>

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
}

function ProductSkeleton() {
  return (
    <div
      className="rounded-2xl overflow-hidden border"
      style={{ borderColor: "#EDE0C8" }}
    >
      <Skeleton className="aspect-square w-full skeleton-shimmer" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4 skeleton-shimmer" />
        <Skeleton className="h-4 w-1/2 skeleton-shimmer" />
        <div className="flex justify-between">
          <Skeleton className="h-6 w-16 skeleton-shimmer" />
          <Skeleton className="h-8 w-20 rounded-full skeleton-shimmer" />
        </div>
      </div>
    </div>
  );
}

function DevotionalMarquee() {
  return (
    <div
      className="overflow-hidden rounded-lg mb-8"
      style={{ backgroundColor: "#FFF8E7", border: "1px solid #EDE0C8" }}
    >
      <style>{`
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee-scroll 28s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>
      <div className="marquee-track py-3">
        {/* First copy */}
        {DEVOTIONAL_SLOGANS.map((item) => (
          <span
            key={`a-${item.id}`}
            className="px-4 text-sm whitespace-nowrap"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              color: item.type === "divider" ? "#FF7A00" : "#8B6A2E",
              fontSize: item.type === "divider" ? "1rem" : "0.95rem",
            }}
          >
            {item.text}
          </span>
        ))}
        {/* Duplicate for seamless loop */}
        {DEVOTIONAL_SLOGANS.map((item) => (
          <span
            key={`b-${item.id}`}
            className="px-4 text-sm whitespace-nowrap"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              color: item.type === "divider" ? "#FF7A00" : "#8B6A2E",
              fontSize: item.type === "divider" ? "1rem" : "0.95rem",
            }}
          >
            {item.text}
          </span>
        ))}
      </div>
    </div>
  );
}

export function ProductsSection() {
  const [activeCategory, setActiveCategory] = useState("All");
  const { data: products, isLoading } = useAllProducts();

  const allProducts = products ?? [];

  const filtered =
    activeCategory === "All"
      ? allProducts
      : allProducts.filter((p) => p.category === activeCategory);

  return (
    <section
      id="products"
      className="py-12 px-4"
      style={{ backgroundColor: "#FFFDF7" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-8 reveal">
          <p
            className="text-sm font-semibold tracking-widest uppercase mb-3"
            style={{ color: "#D4AF37" }}
          >
            Crafted with Devotion
          </p>
          <h2
            className="font-serif text-4xl lg:text-5xl font-bold mb-4"
            style={{
              color: "#8B1A1A",
              fontFamily: "'Cormorant Garamond', serif",
            }}
          >
            Our Sacred Collection
          </h2>
          <div className="gold-divider">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              role="img"
              aria-label="decorative star"
            >
              <path
                d="M10 1 L12.5 7.5 L19 8 L14 13 L15.5 19.5 L10 16 L4.5 19.5 L6 13 L1 8 L7.5 7.5 Z"
                fill="#D4AF37"
              />
            </svg>
          </div>
        </div>

        {/* Devotional slogans marquee */}
        <DevotionalMarquee />

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                type="button"
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105"
                style={{
                  backgroundColor: isActive ? "#6A1B1B" : "transparent",
                  color: isActive ? "#fff" : "#6A1B1B",
                  border: `1.5px solid ${isActive ? "#6A1B1B" : "#D4AF37"}`,
                  fontFamily: "'Cormorant Garamond', serif",
                }}
                data-ocid="products.tab"
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading
            ? SKELETON_KEYS.map((sk) => <ProductSkeleton key={sk} />)
            : filtered.map((product, i) => (
                <ProductCard
                  key={product.id.toString()}
                  product={product}
                  index={i}
                />
              ))}
        </div>

        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-16" data-ocid="products.empty_state">
            <p className="text-gray-500 text-lg">
              No products found in this category.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
