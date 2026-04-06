import type { Product } from "../backend.d";

export const STATIC_PRODUCTS: Product[] = [
  {
    id: BigInt(1),
    name: "Rose & Sandalwood Agarbatti",
    category: "Agarbatti",
    price: 149,
    description:
      "Handcrafted incense sticks blending the divine fragrance of fresh roses and aged sandalwood. Each stick burns for 45 minutes, filling your puja space with sacred aroma.",
    imageUrl: "/assets/generated/product-agarbatti.dim_400x400.jpg",
    inStock: true,
    rating: 4.8,
  },
  {
    id: BigInt(2),
    name: "Jasmine Lotus Agarbatti",
    category: "Agarbatti",
    price: 129,
    description:
      "Premium jasmine and lotus fragrance incense sticks, traditionally prepared using natural plant extracts. Perfect for morning prayers and meditation.",
    imageUrl: "/assets/generated/product-agarbatti2.dim_400x400.jpg",
    inStock: true,
    rating: 4.7,
  },
  {
    id: BigInt(3),
    name: "Sandalwood Dhoop Cones",
    category: "Dhoop",
    price: 199,
    description:
      "Pure sandalwood dhoop cones made from natural resins and forest-harvested wood. Each pack contains 20 long-lasting cones that create a meditative atmosphere.",
    imageUrl: "/assets/generated/product-dhoop.dim_400x400.jpg",
    inStock: true,
    rating: 4.9,
  },
  {
    id: BigInt(4),
    name: "Sambrani Dhoop Sticks",
    category: "Dhoop",
    price: 179,
    description:
      "Traditional sambrani (benzoin resin) dhoop sticks, hand-rolled with pure natural ingredients. The ancient fragrance known for purifying the home and elevating prayers.",
    imageUrl: "/assets/generated/product-dhoop2.dim_400x400.jpg",
    inStock: true,
    rating: 4.6,
  },
  {
    id: BigInt(5),
    name: "Pure Bhimseni Camphor",
    category: "Camphor",
    price: 89,
    description:
      "100% natural Bhimseni camphor tablets, sourced from the camphor tree. Ideal for aarti ceremonies, burns completely without leaving any residue.",
    imageUrl: "/assets/generated/product-camphor.dim_400x400.jpg",
    inStock: true,
    rating: 4.9,
  },
  {
    id: BigInt(6),
    name: "Complete Puja Starter Kit",
    category: "Pooja Kits",
    price: 599,
    description:
      "Everything for your daily puja ritual: brass diya, incense sticks, camphor, kumkum, sandalwood paste, and flower garland. Beautifully presented in a traditional box.",
    imageUrl: "/assets/generated/product-pooja-kit.dim_400x400.jpg",
    inStock: true,
    rating: 4.8,
  },
  {
    id: BigInt(7),
    name: "Festival Pooja Grand Kit",
    category: "Pooja Kits",
    price: 999,
    description:
      "Deluxe festival pooja kit with brass thali, 5 diyas, premium incense, camphor, roli, moli, and seasonal flower arrangements. The perfect gift for auspicious occasions.",
    imageUrl: "/assets/generated/product-pooja-kit2.dim_400x400.jpg",
    inStock: true,
    rating: 5.0,
  },
  {
    id: BigInt(8),
    name: "Sandalwood & Rose Essential Oil",
    category: "Essential Oils",
    price: 349,
    description:
      "Cold-pressed sandalwood and rose essential oil blend for aromatherapy, meditation, and anointing rituals. 100% pure, undiluted, therapeutic grade.",
    imageUrl: "/assets/generated/product-essential-oil.dim_400x400.jpg",
    inStock: true,
    rating: 4.7,
  },
  {
    id: BigInt(9),
    name: "Sacred Herbs Oil Collection",
    category: "Essential Oils",
    price: 449,
    description:
      "A curated collection of tulsi, neem, and patchouli essential oils. Traditional Ayurvedic formulations used for centuries in Indian spiritual practices.",
    imageUrl: "/assets/generated/product-essential-oil2.dim_400x400.jpg",
    inStock: true,
    rating: 4.8,
  },
];
