import { useQuery } from "@tanstack/react-query";
import type { Product } from "../backend.d";
import { STATIC_PRODUCTS } from "../data/staticProducts";
import { useActor } from "./useActor";

export function useAllProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return STATIC_PRODUCTS;
      try {
        const products = await actor.getAllProducts();
        if (!products || products.length === 0) return STATIC_PRODUCTS;
        return products;
      } catch {
        return STATIC_PRODUCTS;
      }
    },
    enabled: !isFetching,
    staleTime: 5 * 60 * 1000,
  });
}

export function useProductsByCategory(category: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products", category],
    queryFn: async () => {
      if (!actor) {
        return category === "All"
          ? STATIC_PRODUCTS
          : STATIC_PRODUCTS.filter((p) => p.category === category);
      }
      try {
        if (category === "All") {
          const products = await actor.getAllProducts();
          if (!products || products.length === 0) return STATIC_PRODUCTS;
          return products;
        }
        const products = await actor.getProductsByCategory(category);
        if (!products || products.length === 0)
          return STATIC_PRODUCTS.filter((p) => p.category === category);
        return products;
      } catch {
        return category === "All"
          ? STATIC_PRODUCTS
          : STATIC_PRODUCTS.filter((p) => p.category === category);
      }
    },
    enabled: !isFetching,
    staleTime: 5 * 60 * 1000,
  });
}
