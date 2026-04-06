import Stripe "stripe/stripe";
import OutCall "http-outcalls/outcall";

import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Float "mo:core/Float";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Int "mo:core/Int";
import Order "mo:core/Order";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

// Use with clause to enable migration capability

actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User profile type
  public type UserProfile = {
    name : Text;
    email : Text;
    phone : Text;
    address : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // User profile management functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  module Product {
    public func compare(product1 : Product, product2 : Product) : Order.Order {
      Nat.compare(product1.id, product2.id);
    };

    public func compareByPrice(product1 : Product, product2 : Product) : Order.Order {
      Float.compare(product1.price, product2.price);
    };

    public func compareByRating(product1 : Product, product2 : Product) : Order.Order {
      Float.compare(product2.rating, product1.rating); // Descending rating
    };
  };

  module ContactInquiry {
    public func compare(inquiry1 : ContactInquiry, inquiry2 : ContactInquiry) : Order.Order {
      Int.compare(inquiry2.timestamp, inquiry1.timestamp);
    };
  };

  type Product = {
    id : Nat;
    name : Text;
    category : Text;
    price : Float;
    description : Text;
    imageUrl : Text;
    inStock : Bool;
    rating : Float;
  };

  type CartItem = {
    productId : Nat;
    quantity : Nat;
  };

  type Cart = {
    sessionId : Text;
    items : [CartItem];
  };

  type ContactInquiry = {
    id : Nat;
    name : Text;
    email : Text;
    message : Text;
    timestamp : Int;
  };


  public type Review = {
    id : Nat;
    name : Text;
    location : Text;
    rating : Nat; // 1-5
    comment : Text;
    imageUrl : Text; // base64 data URL or empty string
    timestamp : Int;
    approved : Bool;
  };

  public type ShoppingCartItem = {
    productID : Nat;
    quantity : Nat;
    price : Float;
  };

  public type ShoppingCart = {
    id : Text;
    items : [ShoppingCartItem];
    total : Float;
    customerID : Text;
    createdOn : Nat64;
    shippingAddress : Text;
  };

  public type OrderItem = {
    productId : Nat;
    quantity : Nat;
    name : Text;
    price : Float;
  };

  public type Order = {
    id : Nat;
    customerName : Text;
    email : Text;
    phone : Text;
    address : Text;
    items : [OrderItem];
    totalAmount : Float;
    status : Text; // "pending", "paid", "shipped", "delivered"
    timestamp : Int;
    paymentStatus : Text; // "pending", "completed"
    customerId : Principal; // Track who placed the order
  };

  let products = Map.empty<Nat, Product>();
  let carts = Map.empty<Text, Cart>();
  let inquiries = Map.empty<Nat, ContactInquiry>();
  let orders = Map.empty<Nat, Order>();

  let reviews = Map.empty<Nat, Review>();
  var nextReviewId = 1;

  // OTP store: phone -> {otp, expiry}
  type OTPEntry = { otp : Text; expiry : Int };
  let otpStore = Map.empty<Text, OTPEntry>();

  var nextProductId = 1;
  var nextInquiryId = 1;
  var nextOrderId = 1;

  let initialProducts = [
    {
      name = "Sandalwood Agarbatti";
      category = "Agarbatti";
      price = 49.99;
      description = "Premium sandalwood scented incense sticks";
      imageUrl = "https://example.com/sandalwood.jpg";
      inStock = true;
      rating = 4.5;
    },
    {
      name = "Jasmine Agarbatti";
      category = "Agarbatti";
      price = 39.99;
      description = "Fragrant jasmine incense sticks for pooja";
      imageUrl = "https://example.com/jasmine.jpg";
      inStock = true;
      rating = 4.7;
    },
    {
      name = "Rose Agarbatti";
      category = "Agarbatti";
      price = 44.99;
      description = "Refreshing rose-flavored incense sticks";
      imageUrl = "https://example.com/rose.jpg";
      inStock = true;
      rating = 4.3;
    },
    {
      name = "Sambrani Dhoop";
      category = "Dhoop";
      price = 59.99;
      description = "Traditional sambrani dhoop for rituals";
      imageUrl = "https://example.com/sambrani.jpg";
      inStock = true;
      rating = 4.6;
    },
    {
      name = "Loban Dhoop";
      category = "Dhoop";
      price = 54.99;
      description = "Authentic loban dhoop for pooja";
      imageUrl = "https://example.com/loban.jpg";
      inStock = true;
      rating = 4.4;
    },
    {
      name = "Pure Camphor";
      category = "Camphor";
      price = 69.99;
      description = "High quality, pure camphor tablets";
      imageUrl = "https://example.com/camphor.jpg";
      inStock = true;
      rating = 4.8;
    },
    {
      name = "Basic Pooja Kit";
      category = "Pooja Kits";
      price = 199.99;
      description = "Essential items for daily pooja";
      imageUrl = "https://example.com/basickit.jpg";
      inStock = true;
      rating = 4.9;
    },
    {
      name = "Festive Pooja Kit";
      category = "Pooja Kits";
      price = 499.99;
      description = "Comprehensive kit for festivals";
      imageUrl = "https://example.com/festivekit.jpg";
      inStock = true;
      rating = 4.7;
    },
    {
      name = "Lavender Essential Oil";
      category = "Essential Oils";
      price = 89.99;
      description = "Soothing lavender essential oil";
      imageUrl = "https://example.com/lavender.jpg";
      inStock = true;
      rating = 4.6;
    },
    {
      name = "Sandalwood Essential Oil";
      category = "Essential Oils";
      price = 109.99;
      description = "Premium sandalwood oil for pooja";
      imageUrl = "https://example.com/sandalwoodoil.jpg";
      inStock = true;
      rating = 4.8;
    },
  ];

  // Admin-only: Initialize store
  public shared ({ caller }) func _initializeStore() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can initialize the store");
    };
    if (products.size() == 0) {
      for (product in initialProducts.values()) {
        let newProduct : Product = {
          id = nextProductId;
          name = product.name;
          category = product.category;
          price = product.price;
          description = product.description;
          imageUrl = product.imageUrl;
          inStock = product.inStock;
          rating = product.rating;
        };
        products.add(nextProductId, newProduct);
        nextProductId += 1;
      };
    };
  };

  // Public: Browse products
  public query _ func getAllProducts() : async [Product] {
    products.values().toArray().sort();
  };

  public query _ func getProductsByCategory(category : Text) : async [Product] {
    products.values().toArray().filter(func(product) { product.category == category });
  };

  public query _ func getProductById(productId : Nat) : async ?Product {
    products.get(productId);
  };

  // Admin-only: Add a new product
  public shared ({ caller }) func addProduct(name : Text, category : Text, price : Float, description : Text, imageUrl : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };
    if (name == "" or category == "") {
      Runtime.trap("Name and category are required");
    };
    let newProduct : Product = {
      id = nextProductId;
      name;
      category;
      price;
      description;
      imageUrl;
      inStock = true;
      rating = 0.0;
    };
    products.add(nextProductId, newProduct);
    let productId = nextProductId;
    nextProductId += 1;
    productId;
  };

  // Admin-only: Remove a product
  public shared ({ caller }) func removeProduct(productId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can remove products");
    };
    products.remove(productId);
  };

  // Admin-only: Update product stock status
  public shared ({ caller }) func updateProductStock(productId : Nat, inStock : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update product stock");
    };
    let product = switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?p) { p };
    };
    let updated : Product = {
      id = product.id;
      name = product.name;
      category = product.category;
      price = product.price;
      description = product.description;
      imageUrl = product.imageUrl;
      inStock;
      rating = product.rating;
    };
    products.add(productId, updated);
  };

  // Admin-only: Delete a review
  public shared ({ caller }) func deleteReview(reviewId : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete reviews");
    };
    reviews.remove(reviewId);
  };

  // Admin-only: Update order status
  public shared ({ caller }) func updateOrderStatus(orderId : Nat, status : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };
    let order = switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?o) { o };
    };
    let updated : Order = {
      id = order.id;
      customerName = order.customerName;
      email = order.email;
      phone = order.phone;
      address = order.address;
      items = order.items;
      totalAmount = order.totalAmount;
      status;
      timestamp = order.timestamp;
      paymentStatus = order.paymentStatus;
      customerId = order.customerId;
    };
    orders.add(orderId, updated);
  };

  // Public: Cart management (session-based, no auth required)
  public shared _ func addToCart(sessionId : Text, productId : Nat, quantity : Nat) : async () {
    let product = switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };

    if (quantity == 0) {
      Runtime.trap("Quantity must be greater than 0");
    };

    let newItem : CartItem = {
      productId;
      quantity;
    };

    let existingCart = carts.get(sessionId);

    let updatedCart : Cart = switch (existingCart) {
      case (null) {
        {
          sessionId;
          items = [newItem];
        };
      };
      case (?cart) {
        let existingProduct = cart.items.find(func(item) { item.productId == productId });
        switch (existingProduct) {
          case (null) {
            {
              sessionId;
              items = cart.items.concat([newItem]);
            };
          };
          case (_) {
            {
              sessionId;
              items = cart.items.map(
                func(item) {
                  if (item.productId == productId) {
                    { productId = item.productId; quantity = item.quantity + quantity };
                  } else {
                    item;
                  };
                }
              );
            };
          };
        };
      };
    };

    carts.add(sessionId, updatedCart);
  };

  public shared _ func updateCartItem(sessionId : Text, productId : Nat, quantity : Nat) : async () {
    if (quantity == 0) {
      Runtime.trap("Quantity must be greater than 0");
    };

    let cart = switch (carts.get(sessionId)) {
      case (null) { Runtime.trap("Cart not found") };
      case (?cart) { cart };
    };

    let cartItem = cart.items.find(func(item) { item.productId == productId });
    switch (cartItem) {
      case (null) { Runtime.trap("Product not found in cart") };
      case (_) {};
    };

    let updatedItems = cart.items.map(
      func(item) {
        if (item.productId == productId) {
          { productId = item.productId; quantity };
        } else {
          item;
        };
      }
    );

    let updatedCart : Cart = {
      sessionId = cart.sessionId;
      items = updatedItems;
    };

    carts.add(sessionId, updatedCart);
  };

  public shared _ func removeFromCart(sessionId : Text, productId : Nat) : async () {
    let cart = switch (carts.get(sessionId)) {
      case (null) { Runtime.trap("Cart not found") };
      case (?cart) { cart };
    };

    let updatedItems = cart.items.filter(func(item) { item.productId != productId });

    let updatedCart : Cart = {
      sessionId;
      items = updatedItems;
    };

    carts.add(sessionId, updatedCart);
  };

  public shared _ func clearCart(sessionId : Text) : async () {
    carts.remove(sessionId);
  };

  public query _ func getCart(sessionId : Text) : async ?Cart {
    carts.get(sessionId);
  };

  // Public: Contact inquiry submission
  public shared _ func submitContactInquiry(name : Text, email : Text, message : Text) : async Nat {
    if (name == "" or email == "" or message == "") {
      Runtime.trap("All fields are required");
    };

    let newInquiry : ContactInquiry = {
      id = nextInquiryId;
      name;
      email;
      message;
      timestamp = Time.now();
    };

    inquiries.add(nextInquiryId, newInquiry);

    let inquiryId = nextInquiryId;
    nextInquiryId += 1;
    inquiryId;
  };

  // Admin-only: View all inquiries
  public query ({ caller }) func getAllInquiries() : async [ContactInquiry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all inquiries");
    };
    inquiries.values().toArray().sort();
  };

  var stripeConfiguration : ?Stripe.StripeConfiguration = null;

  // Admin-only: Configure Stripe
  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can set stripe configuration");
    };
    stripeConfiguration := ?config;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (stripeConfiguration) {
      case (null) { Runtime.trap("Stripe needs to be first configured") };
      case (?value) { value };
    };
  };

  // Public: Check if Stripe is configured
  public query _ func isStripeConfigured() : async Bool {
    stripeConfiguration != null;
  };

  // Public: Get session status
  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  // User-only: Create checkout session
  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create checkout sessions");
    };
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // Fast2SMS API key for real SMS OTP delivery
  var fast2smsApiKey : Text = "";

  // Admin-only: Set Fast2SMS API key
  public shared ({ caller }) func setFast2SMSKey(apiKey : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can set SMS configuration");
    };
    fast2smsApiKey := apiKey;
  };

  // Public: Check if SMS is configured
  public query func isSMSConfigured() : async Bool {
    fast2smsApiKey != "";
  };

  // Public: Request OTP — backend generates, stores, and sends OTP via Fast2SMS
  public shared func requestOTP(phone : Text) : async Bool {
    // Generate a 6-digit OTP using current time as seed
    let seed = Int.abs(Time.now());
    let otp = ((seed % 900000) + 100000).toText();
    // Store with 5-minute expiry
    let expiry = Time.now() + 5 * 60 * 1_000_000_000;
    otpStore.add(phone, { otp; expiry });
    // If no API key configured, return false (OTP stored but SMS not sent)
    if (fast2smsApiKey == "") {
      return false;
    };
    let url = "https://www.fast2sms.com/dev/bulkV2";
    let message = "Your%20HSV%20Sugandhika%20OTP%20is%20" # otp # ".%20Valid%20for%205%20minutes.%20Do%20not%20share.";
    let body = "route=q&message=" # message # "&language=english&flash=0&numbers=" # phone;
    let headers : [OutCall.Header] = [
      { name = "authorization"; value = fast2smsApiKey },
      { name = "Content-Type"; value = "application/x-www-form-urlencoded" },
      { name = "cache-control"; value = "no-cache" },
    ];
    try {
      let response = await OutCall.httpPostRequest(url, headers, body, transform);
      return response.contains(#text "\"return\":true");
    } catch (_) {
      return false;
    };
  };

  // Public: Verify OTP — checks stored OTP, validates expiry, clears on match (single-use)
  public shared func verifyOTP(phone : Text, otp : Text) : async Bool {
    switch (otpStore.get(phone)) {
      case (null) { return false };
      case (?entry) {
        if (Time.now() > entry.expiry) {
          otpStore.remove(phone);
          return false;
        };
        if (entry.otp == otp) {
          otpStore.remove(phone);
          return true;
        };
        return false;
      };
    };
  };

  public shared ({ caller }) func placeOrder(customerName : Text, email : Text, phone : Text, address : Text, cartItems : [CartItem], totalAmount : Float) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can place orders");
    };

    if (cartItems.size() == 0) {
      Runtime.trap("Cart cannot be empty");
    };

    if (customerName == "" or email == "" or phone == "" or address == "") {
      Runtime.trap("All fields are required");
    };

    let orderItems = cartItems.map(
      func(cartItem) {
        let product = switch (products.get(cartItem.productId)) {
          case (null) {
            Runtime.trap("Product with ID " # cartItem.productId.toText() # " not found");
          };
          case (?product) { product };
        };
        {
          productId = cartItem.productId;
          quantity = cartItem.quantity;
          name = product.name;
          price = product.price;
        };
      }
    );

    let newOrder : Order = {
      id = nextOrderId;
      customerName;
      email;
      phone;
      address;
      items = orderItems;
      totalAmount;
      status = "pending";
      timestamp = Time.now();
      paymentStatus = "pending";
      customerId = caller;
    };

    orders.add(nextOrderId, newOrder);

    let orderId = nextOrderId;
    nextOrderId += 1;
    orderId;
  };

  // Public: Place order as guest (no authentication required — for UPI/COD)
  public shared func placeOrderAsGuest(customerName : Text, email : Text, phone : Text, address : Text, cartItems : [CartItem], totalAmount : Float) : async Nat {
    if (cartItems.size() == 0) {
      Runtime.trap("Cart cannot be empty");
    };

    if (customerName == "" or email == "" or phone == "" or address == "") {
      Runtime.trap("All fields are required");
    };

    let orderItems = cartItems.map(
      func(cartItem) {
        let product = switch (products.get(cartItem.productId)) {
          case (null) {
            Runtime.trap("Product with ID " # cartItem.productId.toText() # " not found");
          };
          case (?product) { product };
        };
        {
          productId = cartItem.productId;
          quantity = cartItem.quantity;
          name = product.name;
          price = product.price;
        };
      }
    );

    let newOrder : Order = {
      id = nextOrderId;
      customerName;
      email;
      phone;
      address;
      items = orderItems;
      totalAmount;
      status = "pending";
      timestamp = Time.now();
      paymentStatus = "pending";
      customerId = Principal.fromText("2vxsx-fae"); // anonymous principal for guests
    };

    orders.add(nextOrderId, newOrder);

    let orderId = nextOrderId;
    nextOrderId += 1;
    orderId;
  };


  // Ownership-based: Get order by ID (user can only see their own, admin can see all)
  public query ({ caller }) func getOrderById(orderId : Nat) : async ?Order {
    let order = orders.get(orderId);
    switch (order) {
      case (null) { null };
      case (?ord) {
        // Users can only see their own orders, admins can see all
        if (ord.customerId == caller or AccessControl.isAdmin(accessControlState, caller)) {
          ?ord;
        } else {
          Runtime.trap("Unauthorized: You can only view your own orders");
        };
      };
    };
  };

  // Admin-only: Get all orders
  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    orders.values().toArray();
  };

  // Public: Submit a review (anyone can submit)
  public shared _ func submitReview(name : Text, location : Text, rating : Nat, comment : Text, imageUrl : Text) : async Nat {
    if (name == "" or comment == "") {
      Runtime.trap("Name and comment are required");
    };
    if (rating < 1 or rating > 5) {
      Runtime.trap("Rating must be between 1 and 5");
    };
    let newReview : Review = {
      id = nextReviewId;
      name;
      location;
      rating;
      comment;
      imageUrl;
      timestamp = Time.now();
      approved = true; // auto-approve for now
    };
    reviews.add(nextReviewId, newReview);
    let reviewId = nextReviewId;
    nextReviewId += 1;
    reviewId;
  };

  // Public query: Get all approved reviews
  public query func getApprovedReviews() : async [Review] {
    reviews.values().toArray().filter(func(r) { r.approved });
  };

  // Admin: Get all reviews including unapproved
  public query ({ caller }) func getAllReviews() : async [Review] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all reviews");
    };
    reviews.values().toArray();
  };

};
