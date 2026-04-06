import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle,
  ChevronDown,
  ClipboardList,
  Loader2,
  Lock,
  Mail,
  Package,
  Plus,
  Settings,
  ShieldCheck,
  Smartphone,
  Star,
  Trash2,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import type {
  backendInterface as AdminBackend,
  ContactInquiry,
  Order,
  Product,
  Review,
} from "../backend.d";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (timestamp: bigint) => {
  const ms = Number(timestamp) / 1_000_000;
  return new Date(ms).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const statusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "delivered":
      return { bg: "#F0FDF4", text: "#16A34A", border: "#86EFAC" };
    case "processing":
    case "confirmed":
      return { bg: "#FFFBEB", text: "#D97706", border: "#FCD34D" };
    case "cancelled":
      return { bg: "#FEF2F2", text: "#DC2626", border: "#FCA5A5" };
    case "shipped":
      return { bg: "#EFF6FF", text: "#2563EB", border: "#93C5FD" };
    default:
      return { bg: "#F9FAFB", text: "#6B7280", border: "#E5E7EB" };
  }
};

const CATEGORIES = [
  "Agarbatti",
  "Dhoop",
  "Camphor",
  "Pooja Kits",
  "Essential Oils",
];

const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

// ─── Orders Tab ───────────────────────────────────────────────────────────────

function OrdersTab() {
  const { actor, isFetching } = useActor();
  const adminActor = actor as AdminBackend | null;
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ["allOrders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOrders();
    },
    enabled: !!actor && !isFetching,
  });

  const { mutate: updateStatus, isPending: updatingStatus } = useMutation({
    mutationFn: async ({
      orderId,
      status,
    }: {
      orderId: bigint;
      status: string;
    }) => {
      if (!adminActor) throw new Error("Actor not available");
      await adminActor!.updateOrderStatus(orderId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allOrders"] });
    },
  });

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center py-16"
        data-ocid="admin.orders.loading_state"
      >
        <Loader2
          className="w-6 h-6 animate-spin"
          style={{ color: "#6A1B1B" }}
        />
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div
        className="text-center py-16"
        style={{ color: "#9B8E82" }}
        data-ocid="admin.orders.empty_state"
      >
        <Package
          className="w-12 h-12 mx-auto mb-3"
          style={{ color: "#D4AF37", opacity: 0.4 }}
        />
        <p className="text-sm">No orders yet</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto" data-ocid="admin.orders.table">
      <Table>
        <TableHeader>
          <TableRow style={{ backgroundColor: "#FDF6E3" }}>
            {[
              "Order ID",
              "Customer",
              "Amount",
              "Status",
              "Payment",
              "Date",
              "Update Status",
            ].map((h) => (
              <TableHead
                key={h}
                className="font-bold"
                style={{ color: "#6A1B1B" }}
              >
                {h}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order, idx) => {
            const colors = statusColor(order.status);
            return (
              <TableRow
                key={order.id.toString()}
                data-ocid={`admin.orders.row.${idx + 1}`}
                className="hover:bg-amber-50"
              >
                <TableCell
                  className="font-mono font-semibold text-sm"
                  style={{ color: "#6A1B1B" }}
                >
                  #HSV-{order.id.toString()}
                </TableCell>
                <TableCell>
                  <div>
                    <p
                      className="font-medium text-sm"
                      style={{ color: "#1C1C1C" }}
                    >
                      {order.customerName}
                    </p>
                    <p className="text-xs" style={{ color: "#6B6257" }}>
                      {order.email}
                    </p>
                  </div>
                </TableCell>
                <TableCell
                  className="font-bold"
                  style={{
                    color: "#6A1B1B",
                    fontFamily: "'Cormorant Garamond', serif",
                  }}
                >
                  ₹{order.totalAmount.toLocaleString("en-IN")}
                </TableCell>
                <TableCell>
                  <span
                    className="px-2.5 py-1 rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor: colors.bg,
                      color: colors.text,
                      border: `1px solid ${colors.border}`,
                    }}
                  >
                    {order.status}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className="px-2 py-1 rounded text-xs"
                    style={{
                      backgroundColor: "#FDF6E3",
                      color: "#D4AF37",
                      border: "1px solid #D4AF37",
                    }}
                  >
                    {order.paymentStatus}
                  </span>
                </TableCell>
                <TableCell className="text-sm" style={{ color: "#6B6257" }}>
                  {formatDate(order.timestamp)}
                </TableCell>
                <TableCell>
                  <Select
                    value={order.status}
                    onValueChange={(val) =>
                      updateStatus({ orderId: order.id, status: val })
                    }
                    disabled={updatingStatus}
                  >
                    <SelectTrigger
                      className="w-36 h-8 text-xs"
                      style={{ borderColor: "#EDE0C8" }}
                      data-ocid={`admin.orders.status.select.${idx + 1}`}
                    >
                      <SelectValue placeholder="Update status" />
                    </SelectTrigger>
                    <SelectContent>
                      {ORDER_STATUSES.map((s) => (
                        <SelectItem
                          key={s}
                          value={s}
                          className="text-xs capitalize"
                        >
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

// ─── Products Tab ─────────────────────────────────────────────────────────────

function ProductsTab() {
  const { actor, isFetching } = useActor();
  const adminActor = actor as AdminBackend | null;
  const queryClient = useQueryClient();
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    imageUrl: "",
  });

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["allProducts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !isFetching,
  });

  const { mutate: addProduct, isPending: adding } = useMutation({
    mutationFn: async () => {
      if (!adminActor) throw new Error("Actor not available");
      await adminActor!.addProduct(
        form.name,
        form.category,
        Number.parseFloat(form.price),
        form.description,
        form.imageUrl,
      );
    },
    onSuccess: () => {
      setForm({
        name: "",
        category: "",
        price: "",
        description: "",
        imageUrl: "",
      });
      setAddOpen(false);
      queryClient.invalidateQueries({ queryKey: ["allProducts"] });
    },
  });

  const { mutate: removeProduct, isPending: removing } = useMutation({
    mutationFn: async (productId: bigint) => {
      if (!adminActor) throw new Error("Actor not available");
      await adminActor!.removeProduct(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allProducts"] });
    },
  });

  const { mutate: toggleStock } = useMutation({
    mutationFn: async ({
      productId,
      inStock,
    }: {
      productId: bigint;
      inStock: boolean;
    }) => {
      if (!adminActor) throw new Error("Actor not available");
      await adminActor!.updateProductStock(productId, inStock);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allProducts"] });
    },
  });

  return (
    <div className="space-y-6">
      {/* Add Product Collapsible */}
      <Collapsible open={addOpen} onOpenChange={setAddOpen}>
        <CollapsibleTrigger asChild>
          <Button
            type="button"
            className="flex items-center gap-2 rounded-full font-semibold px-6"
            style={{ backgroundColor: "#6A1B1B", color: "#FDF6E3" }}
            data-ocid="admin.products.open_modal_button"
          >
            <Plus className="w-4 h-4" />
            Add New Product
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                addOpen ? "rotate-180" : ""
              }`}
            />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div
            className="mt-4 p-5 rounded-2xl space-y-4"
            style={{ backgroundColor: "#FDF6E3", border: "1px solid #EDE0C8" }}
            data-ocid="admin.products.panel"
          >
            <h3
              className="font-bold text-lg"
              style={{
                color: "#6A1B1B",
                fontFamily: "'Cormorant Garamond', serif",
              }}
            >
              Add New Product
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label
                  className="text-sm font-semibold"
                  style={{ color: "#3B2A16" }}
                >
                  Name
                </Label>
                <Input
                  placeholder="Product name"
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  style={{ borderColor: "#EDE0C8" }}
                  data-ocid="admin.products.name.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  className="text-sm font-semibold"
                  style={{ color: "#3B2A16" }}
                >
                  Category
                </Label>
                <Select
                  value={form.category}
                  onValueChange={(val) =>
                    setForm((p) => ({ ...p, category: val }))
                  }
                >
                  <SelectTrigger
                    style={{ borderColor: "#EDE0C8" }}
                    data-ocid="admin.products.category.select"
                  >
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label
                  className="text-sm font-semibold"
                  style={{ color: "#3B2A16" }}
                >
                  Price (₹)
                </Label>
                <Input
                  type="number"
                  placeholder="299"
                  value={form.price}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, price: e.target.value }))
                  }
                  style={{ borderColor: "#EDE0C8" }}
                  data-ocid="admin.products.price.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  className="text-sm font-semibold"
                  style={{ color: "#3B2A16" }}
                >
                  Image URL
                </Label>
                <Input
                  placeholder="https://..."
                  value={form.imageUrl}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, imageUrl: e.target.value }))
                  }
                  style={{ borderColor: "#EDE0C8" }}
                  data-ocid="admin.products.image.input"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label
                  className="text-sm font-semibold"
                  style={{ color: "#3B2A16" }}
                >
                  Description
                </Label>
                <Textarea
                  placeholder="Product description…"
                  value={form.description}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description: e.target.value }))
                  }
                  style={{ borderColor: "#EDE0C8" }}
                  rows={3}
                  data-ocid="admin.products.description.textarea"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                onClick={() => addProduct()}
                disabled={
                  adding || !form.name.trim() || !form.category || !form.price
                }
                className="rounded-full font-semibold px-6"
                style={{ backgroundColor: "#6A1B1B", color: "#FDF6E3" }}
                data-ocid="admin.products.submit_button"
              >
                {adding ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                {adding ? "Adding…" : "Add Product"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setAddOpen(false)}
                className="rounded-full"
                style={{ borderColor: "#EDE0C8", color: "#6B6257" }}
                data-ocid="admin.products.cancel_button"
              >
                Cancel
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Products Table */}
      {isLoading ? (
        <div
          className="flex items-center justify-center py-16"
          data-ocid="admin.products.loading_state"
        >
          <Loader2
            className="w-6 h-6 animate-spin"
            style={{ color: "#6A1B1B" }}
          />
        </div>
      ) : !products || products.length === 0 ? (
        <div
          className="rounded-2xl p-8 text-center"
          style={{
            backgroundColor: "#FDF6E3",
            border: "1px solid #EDE0C8",
          }}
          data-ocid="admin.products.empty_state"
        >
          <Package
            className="w-12 h-12 mx-auto mb-3"
            style={{ color: "#D4AF37", opacity: 0.4 }}
          />
          <p className="text-sm font-medium" style={{ color: "#6B6257" }}>
            Backend products are empty.
          </p>
          <p className="text-xs mt-1" style={{ color: "#9B8E82" }}>
            The store currently uses local product data. Use the form above to
            add products to the backend.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto" data-ocid="admin.products.table">
          <Table>
            <TableHeader>
              <TableRow style={{ backgroundColor: "#FDF6E3" }}>
                {["ID", "Name", "Category", "Price", "Stock", "Actions"].map(
                  (h) => (
                    <TableHead
                      key={h}
                      className="font-bold"
                      style={{ color: "#6A1B1B" }}
                    >
                      {h}
                    </TableHead>
                  ),
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product, idx) => (
                <TableRow
                  key={product.id.toString()}
                  data-ocid={`admin.products.row.${idx + 1}`}
                  className="hover:bg-amber-50"
                >
                  <TableCell
                    className="font-mono text-xs"
                    style={{ color: "#9B8E82" }}
                  >
                    #{product.id.toString()}
                  </TableCell>
                  <TableCell
                    className="font-medium text-sm"
                    style={{ color: "#1C1C1C" }}
                  >
                    {product.name}
                  </TableCell>
                  <TableCell>
                    <span
                      className="px-2 py-0.5 rounded-full text-xs"
                      style={{
                        backgroundColor: "#FDF6E3",
                        color: "#6A1B1B",
                        border: "1px solid #EDE0C8",
                      }}
                    >
                      {product.category}
                    </span>
                  </TableCell>
                  <TableCell
                    className="font-semibold text-sm"
                    style={{ color: "#6A1B1B" }}
                  >
                    ₹{product.price.toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell>
                    <button
                      type="button"
                      onClick={() =>
                        toggleStock({
                          productId: product.id,
                          inStock: !product.inStock,
                        })
                      }
                      className="px-3 py-1 rounded-full text-xs font-semibold border transition-colors"
                      style={{
                        backgroundColor: product.inStock
                          ? "#F0FDF4"
                          : "#FEF2F2",
                        color: product.inStock ? "#16A34A" : "#DC2626",
                        borderColor: product.inStock ? "#86EFAC" : "#FCA5A5",
                      }}
                      data-ocid={`admin.products.toggle.${idx + 1}`}
                    >
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </button>
                  </TableCell>
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 rounded-lg"
                          style={{
                            borderColor: "#FCA5A5",
                            color: "#DC2626",
                          }}
                          disabled={removing}
                          data-ocid={`admin.products.delete_button.${idx + 1}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent data-ocid="admin.products.dialog">
                        <AlertDialogHeader>
                          <AlertDialogTitle
                            style={{
                              color: "#6A1B1B",
                              fontFamily: "'Cormorant Garamond', serif",
                            }}
                          >
                            Remove Product?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently remove{" "}
                            <strong>{product.name}</strong> from the backend.
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel
                            style={{ borderColor: "#EDE0C8" }}
                            data-ocid="admin.products.cancel_button"
                          >
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => removeProduct(product.id)}
                            style={{ backgroundColor: "#DC2626" }}
                            data-ocid="admin.products.confirm_button"
                          >
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

// ─── Reviews Tab ──────────────────────────────────────────────────────────────

function ReviewsTab() {
  const { actor, isFetching } = useActor();
  const adminActor = actor as AdminBackend | null;
  const queryClient = useQueryClient();

  const { data: reviews, isLoading } = useQuery<Review[]>({
    queryKey: ["allReviews"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllReviews();
    },
    enabled: !!actor && !isFetching,
  });

  const { mutate: deleteReview, isPending: deleting } = useMutation({
    mutationFn: async (reviewId: bigint) => {
      if (!adminActor) throw new Error("Actor not available");
      await adminActor!.deleteReview(reviewId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allReviews"] });
    },
  });

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center py-16"
        data-ocid="admin.reviews.loading_state"
      >
        <Loader2
          className="w-6 h-6 animate-spin"
          style={{ color: "#6A1B1B" }}
        />
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div
        className="text-center py-16"
        style={{ color: "#9B8E82" }}
        data-ocid="admin.reviews.empty_state"
      >
        <Star
          className="w-12 h-12 mx-auto mb-3"
          style={{ color: "#D4AF37", opacity: 0.4 }}
        />
        <p className="text-sm">No reviews yet</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto" data-ocid="admin.reviews.table">
      <Table>
        <TableHeader>
          <TableRow style={{ backgroundColor: "#FDF6E3" }}>
            {["Name", "Location", "Rating", "Comment", "Date", "Actions"].map(
              (h) => (
                <TableHead
                  key={h}
                  className="font-bold"
                  style={{ color: "#6A1B1B" }}
                >
                  {h}
                </TableHead>
              ),
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {reviews.map((review, idx) => (
            <TableRow
              key={review.id.toString()}
              data-ocid={`admin.reviews.row.${idx + 1}`}
              className="hover:bg-amber-50"
            >
              <TableCell
                className="font-medium text-sm"
                style={{ color: "#1C1C1C" }}
              >
                {review.name}
              </TableCell>
              <TableCell className="text-sm" style={{ color: "#6B6257" }}>
                {review.location}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {Array.from(
                    { length: Number(review.rating) },
                    (_, i) => i,
                  ).map((i) => (
                    <Star
                      key={`star-${i}`}
                      className="w-3.5 h-3.5 fill-current"
                      style={{ color: "#D4AF37" }}
                    />
                  ))}
                  <span className="text-xs ml-1" style={{ color: "#6B6257" }}>
                    {review.rating.toString()}/5
                  </span>
                </div>
              </TableCell>
              <TableCell
                className="text-sm max-w-xs"
                style={{ color: "#3B2A16" }}
              >
                <p className="truncate" style={{ maxWidth: "200px" }}>
                  {review.comment.length > 80
                    ? `${review.comment.slice(0, 80)}…`
                    : review.comment}
                </p>
              </TableCell>
              <TableCell className="text-sm" style={{ color: "#6B6257" }}>
                {formatDate(review.timestamp)}
              </TableCell>
              <TableCell>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 rounded-lg"
                      style={{ borderColor: "#FCA5A5", color: "#DC2626" }}
                      disabled={deleting}
                      data-ocid={`admin.reviews.delete_button.${idx + 1}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent data-ocid="admin.reviews.dialog">
                    <AlertDialogHeader>
                      <AlertDialogTitle
                        style={{
                          color: "#6A1B1B",
                          fontFamily: "'Cormorant Garamond', serif",
                        }}
                      >
                        Delete Review?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete the review by{" "}
                        <strong>{review.name}</strong>. This action cannot be
                        undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel
                        style={{ borderColor: "#EDE0C8" }}
                        data-ocid="admin.reviews.cancel_button"
                      >
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteReview(review.id)}
                        style={{ backgroundColor: "#DC2626" }}
                        data-ocid="admin.reviews.confirm_button"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// ─── Inquiries Tab ────────────────────────────────────────────────────────────

function InquiriesTab() {
  const { actor, isFetching } = useActor();

  const { data: inquiries, isLoading } = useQuery<ContactInquiry[]>({
    queryKey: ["allInquiries"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllInquiries();
    },
    enabled: !!actor && !isFetching,
  });

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center py-16"
        data-ocid="admin.inquiries.loading_state"
      >
        <Loader2
          className="w-6 h-6 animate-spin"
          style={{ color: "#6A1B1B" }}
        />
      </div>
    );
  }

  if (!inquiries || inquiries.length === 0) {
    return (
      <div
        className="text-center py-16"
        style={{ color: "#9B8E82" }}
        data-ocid="admin.inquiries.empty_state"
      >
        <Mail
          className="w-12 h-12 mx-auto mb-3"
          style={{ color: "#D4AF37", opacity: 0.4 }}
        />
        <p className="text-sm">No inquiries yet</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto" data-ocid="admin.inquiries.table">
      <Table>
        <TableHeader>
          <TableRow style={{ backgroundColor: "#FDF6E3" }}>
            {["Name", "Email", "Message", "Date"].map((h) => (
              <TableHead
                key={h}
                className="font-bold"
                style={{ color: "#6A1B1B" }}
              >
                {h}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {inquiries.map((inquiry, idx) => (
            <TableRow
              key={inquiry.id.toString()}
              data-ocid={`admin.inquiries.row.${idx + 1}`}
              className="hover:bg-amber-50"
            >
              <TableCell
                className="font-medium text-sm"
                style={{ color: "#1C1C1C" }}
              >
                {inquiry.name}
              </TableCell>
              <TableCell className="text-sm" style={{ color: "#6B6257" }}>
                {inquiry.email}
              </TableCell>
              <TableCell
                className="text-sm max-w-xs"
                style={{ color: "#3B2A16" }}
              >
                <p style={{ maxWidth: "280px" }} className="truncate">
                  {inquiry.message.length > 100
                    ? `${inquiry.message.slice(0, 100)}…`
                    : inquiry.message}
                </p>
              </TableCell>
              <TableCell className="text-sm" style={{ color: "#6B6257" }}>
                {formatDate(inquiry.timestamp)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// ─── Payment Settings Tab ─────────────────────────────────────────────────────

function PaymentSettingsTab() {
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();
  const [secretKey, setSecretKey] = useState("");
  const [countries, setCountries] = useState("IN, US, GB");
  const [configSuccess, setConfigSuccess] = useState(false);
  const [smsApiKey, setSmsApiKey] = useState("");
  const [smsConfigSuccess, setSmsConfigSuccess] = useState(false);

  const { data: isConfigured, isLoading: checkingStripe } = useQuery({
    queryKey: ["stripeConfigured"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isStripeConfigured();
    },
    enabled: !!actor && !isFetching,
  });

  const { mutate: saveStripeConfig, isPending: savingConfig } = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not available");
      const allowedCountries = countries
        .split(",")
        .map((c) => c.trim().toUpperCase())
        .filter(Boolean);
      await actor.setStripeConfiguration({ secretKey, allowedCountries });
    },
    onSuccess: () => {
      setConfigSuccess(true);
      setSecretKey("");
      queryClient.invalidateQueries({ queryKey: ["stripeConfigured"] });
    },
  });

  const { data: isSMSConfigured, isLoading: checkingSMS } = useQuery({
    queryKey: ["smsConfigured"],
    queryFn: async () => {
      if (!actor) return false;
      return (actor as any).isSMSConfigured();
    },
    enabled: !!actor && !isFetching,
  });

  const { mutate: saveSMSConfig, isPending: savingSMS } = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not available");
      await (actor as any).setFast2SMSKey(smsApiKey);
    },
    onSuccess: () => {
      setSmsConfigSuccess(true);
      setSmsApiKey("");
      queryClient.invalidateQueries({ queryKey: ["smsConfigured"] });
    },
  });

  if (checkingStripe) {
    return (
      <div
        className="flex items-center gap-2 py-8"
        style={{ color: "#6B6257" }}
        data-ocid="admin.stripe.loading_state"
      >
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm">Checking configuration...</span>
      </div>
    );
  }

  return (
    <div className="max-w-lg space-y-5" data-ocid="admin.stripe.panel">
      {isConfigured ? (
        <div
          className="flex items-center gap-3 p-4 rounded-xl"
          style={{
            backgroundColor: "#F0FDF4",
            border: "1px solid #86EFAC",
          }}
          data-ocid="admin.stripe.success_state"
        >
          <CheckCircle className="w-5 h-5" style={{ color: "#16A34A" }} />
          <div>
            <p className="font-semibold text-sm" style={{ color: "#15803D" }}>
              Stripe is configured and active
            </p>
            <p className="text-xs" style={{ color: "#166534" }}>
              Card payments are enabled for your store
            </p>
          </div>
        </div>
      ) : (
        <div
          className="flex items-center gap-3 p-4 rounded-xl"
          style={{
            backgroundColor: "#FFFBEB",
            border: "1px solid #FCD34D",
          }}
          data-ocid="admin.stripe.error_state"
        >
          <XCircle className="w-5 h-5" style={{ color: "#D97706" }} />
          <div>
            <p className="font-semibold text-sm" style={{ color: "#92400E" }}>
              Stripe is not configured
            </p>
            <p className="text-xs" style={{ color: "#78350F" }}>
              Enter your Stripe Secret Key below to enable card payments
            </p>
          </div>
        </div>
      )}

      <div className="space-y-1.5">
        <Label
          htmlFor="secretKey"
          className="text-sm font-semibold"
          style={{ color: "#3B2A16" }}
        >
          Stripe Secret Key
        </Label>
        <Input
          id="secretKey"
          type="password"
          placeholder="sk_live_..."
          value={secretKey}
          onChange={(e) => setSecretKey(e.target.value)}
          className="h-11 border-2 font-mono text-sm"
          style={{ borderColor: "#EDE0C8" }}
          data-ocid="admin.stripe.input"
        />
      </div>

      <div className="space-y-1.5">
        <Label
          htmlFor="countries"
          className="text-sm font-semibold"
          style={{ color: "#3B2A16" }}
        >
          Allowed Countries (comma-separated)
        </Label>
        <Input
          id="countries"
          placeholder="IN, US, GB"
          value={countries}
          onChange={(e) => setCountries(e.target.value)}
          className="h-11 border-2"
          style={{ borderColor: "#EDE0C8" }}
          data-ocid="admin.countries.input"
        />
      </div>

      {configSuccess && (
        <p
          className="text-sm"
          style={{ color: "#15803D" }}
          data-ocid="admin.config.success_state"
        >
          ✓ Stripe configuration saved successfully!
        </p>
      )}

      <Button
        type="button"
        onClick={() => saveStripeConfig()}
        disabled={savingConfig || !secretKey.trim()}
        className="h-11 rounded-full font-semibold px-8"
        style={{ backgroundColor: "#6A1B1B", color: "#FDF6E3" }}
        data-ocid="admin.stripe.submit_button"
      >
        {savingConfig ? (
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
        ) : null}
        {savingConfig ? "Saving..." : "Save Configuration"}
      </Button>

      {/* SMS Configuration Section */}
      <div className="mt-6 pt-6" style={{ borderTop: "2px solid #EDE0C8" }}>
        <div className="flex items-center gap-2 mb-4">
          <Smartphone className="w-5 h-5" style={{ color: "#FF7A00" }} />
          <h3 className="text-base font-bold" style={{ color: "#3B2A16" }}>
            SMS Configuration (Fast2SMS)
          </h3>
        </div>

        {checkingSMS ? (
          <div
            className="flex items-center gap-2 py-3"
            style={{ color: "#6B6257" }}
            data-ocid="admin.sms.loading_state"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Checking SMS configuration...</span>
          </div>
        ) : isSMSConfigured ? (
          <div
            className="flex items-center gap-3 p-4 rounded-xl mb-4"
            style={{
              backgroundColor: "#F0FDF4",
              border: "1px solid #86EFAC",
            }}
            data-ocid="admin.sms.success_state"
          >
            <CheckCircle className="w-5 h-5" style={{ color: "#16A34A" }} />
            <div>
              <p className="font-semibold text-sm" style={{ color: "#15803D" }}>
                SMS is configured and active
              </p>
              <p className="text-xs" style={{ color: "#166534" }}>
                Real OTPs will be sent to customers via Fast2SMS
              </p>
            </div>
          </div>
        ) : (
          <div
            className="flex items-center gap-3 p-4 rounded-xl mb-4"
            style={{
              backgroundColor: "#FFFBEB",
              border: "1px solid #FCD34D",
            }}
            data-ocid="admin.sms.error_state"
          >
            <XCircle className="w-5 h-5" style={{ color: "#D97706" }} />
            <div>
              <p className="font-semibold text-sm" style={{ color: "#92400E" }}>
                SMS is not configured
              </p>
              <p className="text-xs" style={{ color: "#78350F" }}>
                Enter your Fast2SMS API key to enable real OTP delivery
              </p>
            </div>
          </div>
        )}

        <div className="space-y-1.5 mb-4">
          <Label
            htmlFor="smsApiKey"
            className="text-sm font-semibold"
            style={{ color: "#3B2A16" }}
          >
            Fast2SMS API Key
          </Label>
          <Input
            id="smsApiKey"
            type="password"
            placeholder="Your Fast2SMS API key"
            value={smsApiKey}
            onChange={(e) => setSmsApiKey(e.target.value)}
            className="h-11 border-2 font-mono text-sm"
            style={{ borderColor: "#EDE0C8" }}
            data-ocid="admin.sms.input"
          />
          <p className="text-xs" style={{ color: "#9B8E82" }}>
            Get your API key from{" "}
            <a
              href="https://www.fast2sms.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
              style={{ color: "#FF7A00" }}
            >
              fast2sms.com
            </a>
          </p>
        </div>

        {smsConfigSuccess && (
          <p
            className="text-sm mb-3"
            style={{ color: "#15803D" }}
            data-ocid="admin.sms.success_state"
          >
            ✓ SMS API key saved successfully!
          </p>
        )}

        <Button
          type="button"
          onClick={() => saveSMSConfig()}
          disabled={savingSMS || !smsApiKey.trim()}
          className="h-11 rounded-full font-semibold px-8"
          style={{ backgroundColor: "#FF7A00", color: "white" }}
          data-ocid="admin.sms.submit_button"
        >
          {savingSMS ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          {savingSMS ? "Saving..." : "Save SMS Key"}
        </Button>
      </div>
    </div>
  );
}

// ─── Admin Panel Root ─────────────────────────────────────────────────────────

export function AdminPanel() {
  const navigate = useNavigate();
  const { actor, isFetching } = useActor();
  const { identity, login, isLoggingIn, isInitializing } =
    useInternetIdentity();

  const isLoggedIn = !!identity;

  // Check admin status
  const { data: isAdmin, isLoading: checkingAdmin } = useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching && isLoggedIn,
  });

  // Spinner while actor boots
  if (isFetching || isInitializing) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#FDF6E3" }}
        data-ocid="admin.loading_state"
      >
        <Loader2
          className="w-8 h-8 animate-spin"
          style={{ color: "#6A1B1B" }}
        />
      </div>
    );
  }

  // Not logged in — show login gate
  if (!isLoggedIn) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-6 px-4"
        style={{ backgroundColor: "#FDF6E3" }}
        data-ocid="admin.login.section"
      >
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "#F3EAD6", border: "2px solid #EDE0C8" }}
        >
          <Lock className="w-9 h-9" style={{ color: "#6A1B1B" }} />
        </div>
        <div className="text-center space-y-2">
          <h1
            className="text-3xl font-bold"
            style={{
              color: "#6A1B1B",
              fontFamily: "'Cormorant Garamond', serif",
            }}
          >
            Admin Access Required
          </h1>
          <p className="text-sm" style={{ color: "#6B6257" }}>
            Please log in with Internet Identity to access the admin panel.
          </p>
        </div>
        <Button
          type="button"
          onClick={login}
          disabled={isLoggingIn}
          className="h-12 rounded-full font-semibold px-8 text-base flex items-center gap-2"
          style={{ backgroundColor: "#6A1B1B", color: "#FDF6E3" }}
          data-ocid="admin.login.button"
        >
          {isLoggingIn ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Lock className="w-5 h-5" />
          )}
          {isLoggingIn ? "Logging in…" : "Login with Internet Identity"}
        </Button>
        <button
          type="button"
          onClick={() => navigate({ to: "/" })}
          className="text-sm underline transition-opacity hover:opacity-70"
          style={{ color: "#9B8E82" }}
          data-ocid="admin.back.link"
        >
          ← Back to Store
        </button>
      </div>
    );
  }

  // Logged in but checking admin status
  if (checkingAdmin) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#FDF6E3" }}
        data-ocid="admin.loading_state"
      >
        <div className="text-center space-y-3">
          <Loader2
            className="w-8 h-8 animate-spin mx-auto"
            style={{ color: "#6A1B1B" }}
          />
          <p className="text-sm" style={{ color: "#6B6257" }}>
            Verifying admin access…
          </p>
        </div>
      </div>
    );
  }

  // Logged in but NOT admin
  if (!isAdmin) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-6 px-4"
        style={{ backgroundColor: "#FDF6E3" }}
        data-ocid="admin.unauthorized.section"
      >
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "#FEF2F2", border: "2px solid #FCA5A5" }}
        >
          <XCircle className="w-9 h-9" style={{ color: "#DC2626" }} />
        </div>
        <div className="text-center space-y-2">
          <h1
            className="text-3xl font-bold"
            style={{
              color: "#6A1B1B",
              fontFamily: "'Cormorant Garamond', serif",
            }}
          >
            Access Denied
          </h1>
          <p className="text-sm" style={{ color: "#6B6257" }}>
            You must be logged in as admin to access this panel.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate({ to: "/" })}
          className="text-sm underline transition-opacity hover:opacity-70"
          style={{ color: "#9B8E82" }}
          data-ocid="admin.back.link"
        >
          ← Back to Store
        </button>
      </div>
    );
  }

  // ── Admin is authenticated and authorized ──
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F3EAD6" }}>
      {/* Admin Header */}
      <header
        className="sticky top-0 z-40 shadow-sm"
        style={{ backgroundColor: "#3B1010" }}
        data-ocid="admin.section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5" style={{ color: "#D4AF37" }} />
              <span
                className="font-bold text-lg"
                style={{
                  color: "#FDF6E3",
                  fontFamily: "'Cormorant Garamond', serif",
                }}
              >
                HSV Sugandhika Admin
              </span>
              <Badge
                className="ml-2 text-xs hidden sm:inline-flex"
                style={{
                  backgroundColor: "#D4AF37",
                  color: "#1C1C1C",
                  border: "none",
                }}
              >
                Admin Panel
              </Badge>
            </div>
            <button
              type="button"
              onClick={() => navigate({ to: "/" })}
              className="flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-75"
              style={{ color: "#FDF6E3" }}
              data-ocid="admin.back.link"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Store
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="orders" className="space-y-6">
          {/* Tab bar */}
          <TabsList
            className="flex flex-wrap gap-1 h-auto p-1.5 rounded-2xl w-full sm:w-auto"
            style={{ backgroundColor: "#3B1010" }}
            data-ocid="admin.tabs.tab"
          >
            {[
              { value: "orders", label: "Orders", icon: Package },
              { value: "products", label: "Products", icon: ShieldCheck },
              { value: "reviews", label: "Reviews", icon: Star },
              { value: "inquiries", label: "Inquiries", icon: ClipboardList },
              { value: "payment", label: "Payment Settings", icon: Settings },
            ].map(({ value, label, icon: Icon }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium transition-all data-[state=active]:shadow-sm"
                style={{
                  color: "#D4AF37",
                }}
                data-ocid={`admin.${value}.tab`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">{label.split(" ")[0]}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <section
              className="rounded-2xl p-6"
              style={{ backgroundColor: "white", border: "1px solid #EDE0C8" }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#FDF0E8" }}
                >
                  <Package className="w-5 h-5" style={{ color: "#6A1B1B" }} />
                </div>
                <div>
                  <h2
                    className="text-xl font-bold"
                    style={{
                      color: "#6A1B1B",
                      fontFamily: "'Cormorant Garamond', serif",
                    }}
                  >
                    All Orders
                  </h2>
                  <p className="text-xs" style={{ color: "#6B6257" }}>
                    Manage customer orders and update statuses
                  </p>
                </div>
              </div>
              <Separator
                className="mb-5"
                style={{ backgroundColor: "#EDE0C8" }}
              />
              <OrdersTab />
            </section>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <section
              className="rounded-2xl p-6"
              style={{ backgroundColor: "white", border: "1px solid #EDE0C8" }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#FDF0E8" }}
                >
                  <ShieldCheck
                    className="w-5 h-5"
                    style={{ color: "#6A1B1B" }}
                  />
                </div>
                <div>
                  <h2
                    className="text-xl font-bold"
                    style={{
                      color: "#6A1B1B",
                      fontFamily: "'Cormorant Garamond', serif",
                    }}
                  >
                    Products
                  </h2>
                  <p className="text-xs" style={{ color: "#6B6257" }}>
                    Add, remove, or update product stock
                  </p>
                </div>
              </div>
              <Separator
                className="mb-5"
                style={{ backgroundColor: "#EDE0C8" }}
              />
              <ProductsTab />
            </section>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <section
              className="rounded-2xl p-6"
              style={{ backgroundColor: "white", border: "1px solid #EDE0C8" }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#FDF0E8" }}
                >
                  <Star className="w-5 h-5" style={{ color: "#6A1B1B" }} />
                </div>
                <div>
                  <h2
                    className="text-xl font-bold"
                    style={{
                      color: "#6A1B1B",
                      fontFamily: "'Cormorant Garamond', serif",
                    }}
                  >
                    Reviews
                  </h2>
                  <p className="text-xs" style={{ color: "#6B6257" }}>
                    Moderate and manage customer reviews
                  </p>
                </div>
              </div>
              <Separator
                className="mb-5"
                style={{ backgroundColor: "#EDE0C8" }}
              />
              <ReviewsTab />
            </section>
          </TabsContent>

          {/* Inquiries Tab */}
          <TabsContent value="inquiries">
            <section
              className="rounded-2xl p-6"
              style={{ backgroundColor: "white", border: "1px solid #EDE0C8" }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#FDF0E8" }}
                >
                  <Mail className="w-5 h-5" style={{ color: "#6A1B1B" }} />
                </div>
                <div>
                  <h2
                    className="text-xl font-bold"
                    style={{
                      color: "#6A1B1B",
                      fontFamily: "'Cormorant Garamond', serif",
                    }}
                  >
                    Contact Inquiries
                  </h2>
                  <p className="text-xs" style={{ color: "#6B6257" }}>
                    Messages from customers via the contact form
                  </p>
                </div>
              </div>
              <Separator
                className="mb-5"
                style={{ backgroundColor: "#EDE0C8" }}
              />
              <InquiriesTab />
            </section>
          </TabsContent>

          {/* Payment Settings Tab */}
          <TabsContent value="payment">
            <section
              className="rounded-2xl p-6"
              style={{ backgroundColor: "white", border: "1px solid #EDE0C8" }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#FDF0E8" }}
                >
                  <Settings className="w-5 h-5" style={{ color: "#6A1B1B" }} />
                </div>
                <div>
                  <h2
                    className="text-xl font-bold"
                    style={{
                      color: "#6A1B1B",
                      fontFamily: "'Cormorant Garamond', serif",
                    }}
                  >
                    Stripe Payment Configuration
                  </h2>
                  <p className="text-xs" style={{ color: "#6B6257" }}>
                    Configure your Stripe Secret Key to enable card payments
                  </p>
                </div>
              </div>
              <Separator
                className="mb-5"
                style={{ backgroundColor: "#EDE0C8" }}
              />
              <PaymentSettingsTab />
            </section>
          </TabsContent>
        </Tabs>
      </main>

      <footer
        className="text-center py-4 text-xs mt-8"
        style={{ color: "#9B8E82", borderTop: "1px solid #EDE0C8" }}
      >
        © {new Date().getFullYear()}. Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-amber-600"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
