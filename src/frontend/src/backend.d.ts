import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface OrderItem {
    name: string;
    productId: bigint;
    quantity: bigint;
    price: number;
}
export interface Order {
    id: bigint;
    customerName: string;
    status: string;
    paymentStatus: string;
    email: string;
    totalAmount: number;
    address: string;
    timestamp: bigint;
    customerId: Principal;
    phone: string;
    items: Array<OrderItem>;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface Cart {
    sessionId: string;
    items: Array<CartItem>;
}
export interface CartItem {
    productId: bigint;
    quantity: bigint;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface ContactInquiry {
    id: bigint;
    name: string;
    email: string;
    message: string;
    timestamp: bigint;
}
export interface Product {
    id: bigint;
    inStock: boolean;
    name: string;
    description: string;
    imageUrl: string;
    category: string;
    rating: number;
    price: number;
}
export interface Review {
    id: bigint;
    name: string;
    location: string;
    rating: bigint;
    comment: string;
    imageUrl: string;
    timestamp: bigint;
    approved: boolean;
}
export interface UserProfile {
    name: string;
    email: string;
    address: string;
    phone: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addToCart(sessionId: string, productId: bigint, quantity: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearCart(sessionId: string): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    getAllInquiries(): Promise<Array<ContactInquiry>>;
    getAllOrders(): Promise<Array<Order>>;
    getAllProducts(): Promise<Array<Product>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCart(sessionId: string): Promise<Cart | null>;
    getOrderById(orderId: bigint): Promise<Order | null>;
    getProductById(productId: bigint): Promise<Product | null>;
    getProductsByCategory(category: string): Promise<Array<Product>>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    placeOrder(customerName: string, email: string, phone: string, address: string, cartItems: Array<CartItem>, totalAmount: number): Promise<bigint>;
    placeOrderAsGuest(customerName: string, email: string, phone: string, address: string, cartItems: Array<CartItem>, totalAmount: number): Promise<bigint>;
    removeFromCart(sessionId: string, productId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    submitContactInquiry(name: string, email: string, message: string): Promise<bigint>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateCartItem(sessionId: string, productId: bigint, quantity: bigint): Promise<void>;
    submitReview(name: string, location: string, rating: bigint, comment: string, imageUrl: string): Promise<bigint>;
    getApprovedReviews(): Promise<Array<Review>>;
    getAllReviews(): Promise<Array<Review>>;
    // Product management (admin-only)
    addProduct(name: string, category: string, price: number, description: string, imageUrl: string): Promise<bigint>;
    removeProduct(productId: bigint): Promise<void>;
    updateProductStock(productId: bigint, inStock: boolean): Promise<void>;
    // Review management (admin-only)
    deleteReview(reviewId: bigint): Promise<void>;
    // Order management (admin-only)
    updateOrderStatus(orderId: bigint, status: string): Promise<void>;
    // SMS configuration (admin-only)
    setFast2SMSKey(apiKey: string): Promise<void>;
    isSMSConfigured(): Promise<boolean>;
    // SMS OTP delivery
    sendOTP(phone: string, otp: string): Promise<boolean>;
}
