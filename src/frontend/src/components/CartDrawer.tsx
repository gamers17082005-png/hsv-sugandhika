import { useNavigate } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useActor } from "../hooks/useActor";

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    total,
    removeItem,
    updateQuantity,
    clearCart,
  } = useCart();
  const { actor } = useActor();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleCheckout = () => {
    closeCart();
    navigate({ to: "/checkout" });
  };

  return (
    <>
      {/* Backdrop */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: backdrop dismissal via click is standard pattern */}
      <div
        className="fixed inset-0 z-50 bg-black/50"
        onClick={closeCart}
        role="presentation"
        data-ocid="cart.modal"
      />

      {/* Drawer */}
      <aside
        className="fixed right-0 top-0 h-full z-50 w-full max-w-md flex flex-col shadow-2xl"
        style={{ backgroundColor: "#FDF6E3" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5 border-b"
          style={{ borderColor: "#EDE0C8" }}
        >
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6" style={{ color: "#6A1B1B" }} />
            <h2
              className="font-serif text-2xl font-bold"
              style={{
                color: "#6A1B1B",
                fontFamily: "'Cormorant Garamond', serif",
              }}
            >
              Your Cart
            </h2>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="p-2 rounded-full hover:bg-amber-100 transition-colors"
            data-ocid="cart.close_button"
          >
            <X className="w-5 h-5" style={{ color: "#6A1B1B" }} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center h-full gap-4 text-center"
              data-ocid="cart.empty_state"
            >
              <ShoppingBag
                className="w-16 h-16"
                style={{ color: "#D4AF37", opacity: 0.4 }}
              />
              <p className="text-lg font-medium" style={{ color: "#6B6257" }}>
                Your cart is empty
              </p>
              <p className="text-sm" style={{ color: "#9B8E82" }}>
                Add some sacred items to get started
              </p>
              <button
                type="button"
                onClick={closeCart}
                className="mt-2 px-6 py-2 rounded-full text-sm font-medium text-white"
                style={{ backgroundColor: "#6A1B1B" }}
                data-ocid="cart.secondary_button"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item, idx) => (
                <div
                  key={item.productId.toString()}
                  className="flex gap-4 p-4 rounded-xl"
                  style={{
                    backgroundColor: "white",
                    border: "1px solid #EDE0C8",
                  }}
                  data-ocid={`cart.item.${idx + 1}`}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-semibold text-sm leading-tight mb-1 truncate"
                      style={{ color: "#1C1C1C" }}
                    >
                      {item.name}
                    </p>
                    <p className="font-bold" style={{ color: "#6A1B1B" }}>
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </p>
                    {/* Qty controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.quantity - 1,
                            actor,
                          )
                        }
                        className="w-7 h-7 rounded-full flex items-center justify-center border transition-colors hover:bg-amber-100"
                        style={{ borderColor: "#D4AF37" }}
                        data-ocid={`cart.secondary_button.${idx + 1}`}
                      >
                        <Minus
                          className="w-3 h-3"
                          style={{ color: "#6A1B1B" }}
                        />
                      </button>
                      <span
                        className="text-sm font-medium w-6 text-center"
                        style={{ color: "#1C1C1C" }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.quantity + 1,
                            actor,
                          )
                        }
                        className="w-7 h-7 rounded-full flex items-center justify-center border transition-colors hover:bg-amber-100"
                        style={{ borderColor: "#D4AF37" }}
                        data-ocid={`cart.secondary_button.${idx + 1}`}
                      >
                        <Plus
                          className="w-3 h-3"
                          style={{ color: "#6A1B1B" }}
                        />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId, actor)}
                        className="ml-auto text-xs hover:text-red-600 transition-colors"
                        style={{ color: "#9B8E82" }}
                        data-ocid={`cart.delete_button.${idx + 1}`}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div
            className="border-t px-6 py-5 space-y-4"
            style={{ borderColor: "#EDE0C8" }}
          >
            <div className="flex items-center justify-between">
              <span
                className="font-semibold text-base"
                style={{ color: "#3B2A16" }}
              >
                Total
              </span>
              <span
                className="font-bold text-2xl font-serif"
                style={{
                  color: "#6A1B1B",
                  fontFamily: "'Cormorant Garamond', serif",
                }}
              >
                ₹{total.toLocaleString("en-IN")}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCheckout}
              className="w-full py-3.5 rounded-full font-semibold text-white transition-all duration-200 hover:scale-[1.02]"
              style={{ backgroundColor: "#6A1B1B" }}
              data-ocid="cart.primary_button"
            >
              Proceed to Checkout
            </button>
            <button
              type="button"
              onClick={() => {
                clearCart(actor);
              }}
              className="w-full py-2 text-sm transition-colors hover:text-red-600"
              style={{ color: "#9B8E82" }}
              data-ocid="cart.delete_button"
            >
              Clear Cart
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
