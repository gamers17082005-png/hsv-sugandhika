import { useMutation } from "@tanstack/react-query";
import type { ShoppingItem } from "../backend.d";
import { useActor } from "./useActor";

export interface CheckoutSession {
  id: string;
  url: string;
}

export function useCreateCheckoutSession() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (items: ShoppingItem[]): Promise<CheckoutSession> => {
      if (!actor) throw new Error("Actor not available");
      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      const result = await actor.createCheckoutSession(
        items,
        `${baseUrl}/payment-success`,
        `${baseUrl}/payment-failure`,
      );
      const session = JSON.parse(result) as CheckoutSession;
      if (!session?.url) throw new Error("Stripe session missing url");
      return session;
    },
  });
}
