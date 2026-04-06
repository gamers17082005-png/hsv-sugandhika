import type React from "react";
import { createContext, useContext, useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface CartItem {
  productId: bigint;
  quantity: number;
  name: string;
  price: number;
  imageUrl: string;
}

export type ActorType = {
  addToCart: (
    sessionId: string,
    productId: bigint,
    quantity: bigint,
  ) => Promise<void>;
  removeFromCart: (sessionId: string, productId: bigint) => Promise<void>;
  updateCartItem: (
    sessionId: string,
    productId: bigint,
    quantity: bigint,
  ) => Promise<void>;
  clearCart: (sessionId: string) => Promise<void>;
};

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  total: number;
  isOpen: boolean;
  sessionId: string;
  openCart: () => void;
  closeCart: () => void;
  addItem: (
    productId: bigint,
    quantity: number,
    name: string,
    price: number,
    imageUrl: string,
    actor?: ActorType | null,
  ) => Promise<void>;
  removeItem: (productId: bigint, actor?: ActorType | null) => Promise<void>;
  updateQuantity: (
    productId: bigint,
    quantity: number,
    actor?: ActorType | null,
  ) => Promise<void>;
  clearCart: (actor?: ActorType | null) => Promise<void>;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const CartContext = createContext<CartContextValue | null>(null);

function getOrCreateSessionId(): string {
  const stored = localStorage.getItem("hsv_session_id");
  if (stored) return stored;
  const newId = crypto.randomUUID();
  localStorage.setItem("hsv_session_id", newId);
  return newId;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [sessionId] = useState<string>(getOrCreateSessionId);
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const addItem = async (
    productId: bigint,
    quantity: number,
    name: string,
    price: number,
    imageUrl: string,
    actor?: ActorType | null,
  ) => {
    const existing = items.find((i) => i.productId === productId);
    const newQty = (existing?.quantity ?? 0) + quantity;

    setItems((prev) => {
      if (existing) {
        return prev.map((i) =>
          i.productId === productId ? { ...i, quantity: newQty } : i,
        );
      }
      return [...prev, { productId, quantity, name, price, imageUrl }];
    });

    if (actor) {
      try {
        await actor.addToCart(sessionId, productId, BigInt(newQty));
      } catch {
        // silent — local state already updated
      }
    }
  };

  const removeItem = async (productId: bigint, actor?: ActorType | null) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
    if (actor) {
      try {
        await actor.removeFromCart(sessionId, productId);
      } catch {
        // silent
      }
    }
  };

  const updateQuantity = async (
    productId: bigint,
    quantity: number,
    actor?: ActorType | null,
  ) => {
    if (quantity <= 0) {
      return removeItem(productId, actor);
    }
    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
    );
    if (actor) {
      try {
        await actor.updateCartItem(sessionId, productId, BigInt(quantity));
      } catch {
        // silent
      }
    }
  };

  const clearCart = async (actor?: ActorType | null) => {
    setItems([]);
    if (actor) {
      try {
        await actor.clearCart(sessionId);
      } catch {
        // silent
      }
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        total,
        isOpen,
        openCart,
        closeCart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        sessionId,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
