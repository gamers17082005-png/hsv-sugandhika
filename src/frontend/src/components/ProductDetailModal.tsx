import { Minus, Plus, ShoppingCart, Star, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "../backend.d";
import { useCart } from "../contexts/CartContext";
import { useActor } from "../hooks/useActor";

interface Props {
  product: Product;
  onClose: () => void;
}

export function ProductDetailModal({ product, onClose }: Props) {
  const [quantity, setQuantity] = useState(1);
  const { addItem, openCart } = useCart();
  const { actor } = useActor();

  const handleAddToCart = async () => {
    await addItem(
      product.id,
      quantity,
      product.name,
      product.price,
      product.imageUrl,
      actor,
    );
    toast.success(`${product.name} (x${quantity}) added to cart!`, {
      action: { label: "View Cart", onClick: openCart },
    });
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: backdrop dismissal via click is standard pattern */}
      <div
        className="fixed inset-0 z-50 bg-black/60"
        onClick={onClose}
        role="presentation"
      />

      {/* Modal */}
      <div
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl overflow-hidden shadow-2xl"
        style={{ backgroundColor: "#FDF6E3" }}
        data-ocid="products.modal"
      >
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image */}
          <div className="aspect-square md:aspect-auto md:h-full relative">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-md hover:bg-white transition-colors"
              data-ocid="products.close_button"
            >
              <X className="w-4 h-4" style={{ color: "#6A1B1B" }} />
            </button>
          </div>

          {/* Details */}
          <div className="p-6 flex flex-col">
            <span
              className="inline-block text-xs font-semibold px-3 py-1 rounded-full text-white mb-3 w-fit"
              style={{ backgroundColor: "#6A1B1B" }}
            >
              {product.category}
            </span>

            <h2
              className="font-serif text-2xl font-bold mb-2 leading-tight"
              style={{
                color: "#1C1C1C",
                fontFamily: "'Cormorant Garamond', serif",
              }}
            >
              {product.name}
            </h2>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className="w-4 h-4"
                    fill={i <= Math.round(product.rating) ? "#D4AF37" : "none"}
                    style={{ color: "#D4AF37" }}
                  />
                ))}
              </div>
              <span className="text-sm" style={{ color: "#6B6257" }}>
                {product.rating.toFixed(1)} / 5.0
              </span>
            </div>

            <p
              className="text-sm leading-relaxed mb-5"
              style={{ color: "#6B6257" }}
            >
              {product.description}
            </p>

            <p
              className="font-serif text-3xl font-bold mb-6"
              style={{ color: "#6A1B1B" }}
            >
              ₹{product.price.toLocaleString("en-IN")}
            </p>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-5">
              <span
                className="text-sm font-medium"
                style={{ color: "#3B2A16" }}
              >
                Qty:
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-full border flex items-center justify-center transition-colors hover:bg-amber-100"
                  style={{ borderColor: "#D4AF37" }}
                  data-ocid="products.secondary_button"
                >
                  <Minus className="w-3.5 h-3.5" style={{ color: "#6A1B1B" }} />
                </button>
                <span
                  className="w-8 text-center font-semibold"
                  style={{ color: "#1C1C1C" }}
                >
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-8 h-8 rounded-full border flex items-center justify-center transition-colors hover:bg-amber-100"
                  style={{ borderColor: "#D4AF37" }}
                  data-ocid="products.secondary_button"
                >
                  <Plus className="w-3.5 h-3.5" style={{ color: "#6A1B1B" }} />
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="flex items-center justify-center gap-2 py-3 rounded-full font-semibold text-white transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 mt-auto"
              style={{ backgroundColor: "#6A1B1B" }}
              data-ocid="products.primary_button"
            >
              <ShoppingCart className="w-5 h-5" />
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
