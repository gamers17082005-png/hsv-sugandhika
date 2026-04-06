import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Camera, Loader2, Star, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import type { backendInterface as BackendFull, Review } from "../backend.d";
import { useActor } from "../hooks/useActor";

const STATIC_TESTIMONIALS = [
  {
    quote:
      "I'm ordering this HSV Sugandhika incense sticks for the 2nd time, I've ordered 4 flavors of this sticks all are good, and fragrance feels like temple and these are naturally made so, there no toxic chemicals. Must recommended for temple like feels",
    name: "Akash",
    location: "Bangalore",
    rating: 5,
    initial: "A",
    imageUrl:
      "/assets/whatsapp_image_2026-04-06_at_4.06.29_pm-019d6263-2f46-76bf-a3dc-25da0e783058.jpeg",
  },
  {
    quote:
      'Me product reviews and agarbatti making details chusaka nenu online lo konna first agarbatti product anna. Nenu koncham sensitive anna nenu ae agarbatti use chesina naku throat infection ai matladaniki chala hard ga undedhi. But finally me product order chesi few days nunchi use chestunanu, "abbha em smell anna temple lo kurchoni pooja chesinattu untadi mind calm ga aipotadi" and throat infection kuda thaggipoyindi. nijamga chala chala thanks anna ee product ni market lo ki thechinandhuku — na lanti sensitive persons ki itey its a big gift.',
    name: "Harsha",
    location: "Hyderabad",
    rating: 5,
    initial: "H",
    imageUrl:
      "/assets/whatsapp_image_2026-04-06_at_4.06.00_pm-019d6264-5ab5-77d2-a502-9590754e952b.jpeg",
  },
  {
    quote:
      "This incense set, along with the sambrani cups, offers a calming and traditional aromatic experience. The fragrances — Javadhu, Kesari Chandan, and Kasturi — are mild, natural, and pleasantly authentic, making them ideal for daily pooja. Each incense stick burns for approximately an hour with a moderate level of smoke, while the sambrani cups provide a richer, more traditional aroma. The fragrance remains for about 20-30 minutes after use, creating a calm and uplifting atmosphere. Overall quality is good — rating it 4 out of 5. I'll definitely experience the other fragrance incense sticks and products soon. All the best!",
    name: "Soomanadh",
    location: "Chennai",
    rating: 4,
    initial: "S",
    imageUrl:
      "/assets/whatsapp_image_2026-04-06_at_4.05.31_pm-019d6265-5e80-73ca-90d8-e09b55a01c0d.jpeg",
  },
];

const STAR_KEYS = ["s1", "s2", "s3", "s4", "s5"] as const;
const STAR_VALUES = [1, 2, 3, 4, 5] as const;
const FILLED_STAR_POSITIONS = [1, 2, 3, 4, 5] as const;
const MAX_IMAGE_SIZE = 500 * 1024; // 500KB

// ─── Star Rating Input ──────────────────────────────────────────────────────────────────────────────

function StarRatingInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1" aria-label="Rating">
      {STAR_VALUES.map((star) => (
        <button
          key={star}
          type="button"
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
          aria-pressed={value === star}
          className="p-0.5 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 rounded"
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
        >
          <Star
            className="w-7 h-7"
            fill={(hovered || value) >= star ? "#D4AF37" : "transparent"}
            style={{
              color: (hovered || value) >= star ? "#D4AF37" : "#C8B89A",
            }}
          />
        </button>
      ))}
    </div>
  );
}

// ─── Review Card ───────────────────────────────────────────────────────────────────────────────────

function ReviewCard({
  name,
  location,
  rating,
  quote,
  initial,
  index,
  imageUrl,
}: {
  name: string;
  location: string;
  rating: number;
  quote: string;
  initial: string;
  index: number;
  imageUrl?: string;
}) {
  return (
    <div
      className="reveal rounded-2xl p-6 relative"
      style={{
        backgroundColor: "#FDF6E3",
        borderTop: "4px solid #D4AF37",
        boxShadow: "0 4px 24px rgba(106,27,27,0.08)",
        transitionDelay: `${index * 0.1}s`,
      }}
      data-ocid={`testimonials.item.${index + 1}`}
    >
      <svg
        className="absolute top-4 right-6 opacity-20"
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        role="img"
        aria-label="decorative quote"
      >
        <path
          d="M12 8C7.582 8 4 11.582 4 16V24C4 28.418 7.582 32 12 32H16V20H8V16C8 13.791 9.791 12 12 12H16V8H12ZM28 8C23.582 8 20 11.582 20 16V24C20 28.418 23.582 32 28 32H32V20H24V16C24 13.791 25.791 12 28 12H32V8H28Z"
          fill="#D4AF37"
        />
      </svg>

      <div className="flex gap-1 mb-4">
        {FILLED_STAR_POSITIONS.filter((pos) => pos <= rating).map((pos) => (
          <Star
            key={`star-${name}-${pos}`}
            className="w-4 h-4"
            fill="#D4AF37"
            style={{ color: "#D4AF37" }}
          />
        ))}
      </div>

      {imageUrl && imageUrl.length > 0 && (
        <div className="mb-4 rounded-lg overflow-hidden border border-amber-200">
          <img
            src={imageUrl}
            alt={`Shared by ${name}`}
            className="w-full object-cover"
            style={{ maxHeight: "180px" }}
          />
        </div>
      )}

      <p
        className="text-sm leading-relaxed italic mb-4"
        style={{ color: "#3B2A16" }}
      >
        "{quote}"
      </p>

      <div className="flex items-center gap-3">
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
          style={{ backgroundColor: "#6A1B1B" }}
        >
          {initial}
        </div>
        <div>
          <p className="font-semibold text-sm" style={{ color: "#1C1C1C" }}>
            {name}
          </p>
          <p className="text-xs" style={{ color: "#6B6257" }}>
            {location}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Image Upload Field ─────────────────────────────────────────────────────────────────────────

function ImageUploadField({
  preview,
  error,
  onFileChange,
  onRemove,
}: {
  preview: string | null;
  error: string | null;
  onFileChange: (file: File) => void;
  onRemove: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileChange(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <Label style={{ color: "#6A1B1B" }}>
        <Camera className="inline-block w-4 h-4 mr-1 align-text-bottom" />
        Add a Photo{" "}
        <span className="text-xs font-normal" style={{ color: "#6B6257" }}>
          (optional)
        </span>
      </Label>

      {preview ? (
        <div className="relative inline-block">
          <img
            src={preview}
            alt="Selected review preview"
            className="rounded-lg border border-amber-200 object-cover"
            style={{ maxHeight: "160px", maxWidth: "100%" }}
          />
          <button
            type="button"
            aria-label="Remove photo"
            onClick={onRemove}
            className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center text-white transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
            style={{ backgroundColor: "#C0392B" }}
            data-ocid="review.delete_button"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full rounded-xl flex flex-col items-center justify-center gap-2 py-6 px-4 transition-colors hover:bg-amber-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500"
          style={{
            border: "2px dashed #D4AF37",
            backgroundColor: "#FDF6E3",
            cursor: "pointer",
          }}
          data-ocid="review.upload_button"
        >
          <Camera className="w-7 h-7" style={{ color: "#D4AF37" }} />
          <span className="text-sm font-medium" style={{ color: "#6B6257" }}>
            📷 Add a photo (optional)
          </span>
          <span className="text-xs" style={{ color: "#9B8B75" }}>
            JPEG, PNG, WebP — max 500 KB
          </span>
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        aria-label="Upload photo"
        onChange={handleChange}
        data-ocid="review.dropzone"
      />

      {error && (
        <p
          className="text-xs"
          style={{ color: "#C0392B" }}
          data-ocid="review.error_state"
        >
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Write Review Modal ─────────────────────────────────────────────────────────────────────────

function WriteReviewModal({ onClose }: { onClose: () => void }) {
  const { actor: rawActor, isFetching } = useActor();
  const actor = rawActor as BackendFull | null;
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState("");
  const [imageError, setImageError] = useState<string | null>(null);

  const handleFileChange = (file: File) => {
    setImageError(null);
    if (file.size > MAX_IMAGE_SIZE) {
      setImageError("Image must be less than 500KB.");
      setImagePreview(null);
      setImageBase64("");
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result;
      if (typeof result === "string") {
        setImageBase64(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    setImageBase64("");
    setImageError(null);
  };

  const mutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.submitReview(
        name.trim(),
        location.trim(),
        BigInt(rating),
        comment.trim(),
        imageBase64,
      );
    },
    onSuccess: () => {
      toast.success("Thank you for your review!");
      queryClient.invalidateQueries({ queryKey: ["approvedReviews"] });
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      onClose();
    },
    onError: () => {
      toast.error("Failed to submit review. Please try again.");
    },
  });

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Name is required.";
    if (rating === 0) newErrors.rating = "Please select a rating.";
    if (!comment.trim()) newErrors.comment = "Review text is required.";
    else if (comment.trim().length < 20)
      newErrors.comment = "Review must be at least 20 characters.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    mutation.mutate();
  };

  const actorReady = !!actor && !isFetching;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {!actorReady && (
        <div
          className="text-sm text-center py-2 px-4 rounded-lg"
          style={{
            backgroundColor: "#FFF8E7",
            color: "#6B6257",
            border: "1px solid #D4AF37",
          }}
          data-ocid="review.loading_state"
        >
          Reviews require a moment to load…
        </div>
      )}

      <div className="space-y-1">
        <Label htmlFor="review-name" style={{ color: "#6A1B1B" }}>
          Your Name <span aria-hidden="true">*</span>
        </Label>
        <Input
          id="review-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Priya Sharma"
          style={{
            backgroundColor: "#FFFDF7",
            borderColor: errors.name ? "#C0392B" : "#C8B89A",
          }}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "review-name-error" : undefined}
          data-ocid="review.input"
        />
        {errors.name && (
          <p
            id="review-name-error"
            className="text-xs"
            style={{ color: "#C0392B" }}
            data-ocid="review.error_state"
          >
            {errors.name}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="review-location" style={{ color: "#6A1B1B" }}>
          Location{" "}
          <span className="text-xs font-normal" style={{ color: "#6B6257" }}>
            (optional)
          </span>
        </Label>
        <Input
          id="review-location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g. Mumbai, Maharashtra"
          style={{ backgroundColor: "#FFFDF7", borderColor: "#C8B89A" }}
          data-ocid="review.input"
        />
      </div>

      <div className="space-y-1">
        <Label style={{ color: "#6A1B1B" }}>
          Rating <span aria-hidden="true">*</span>
        </Label>
        <StarRatingInput value={rating} onChange={setRating} />
        {errors.rating && (
          <p
            className="text-xs"
            style={{ color: "#C0392B" }}
            data-ocid="review.error_state"
          >
            {errors.rating}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="review-comment" style={{ color: "#6A1B1B" }}>
          Your Review <span aria-hidden="true">*</span>
        </Label>
        <Textarea
          id="review-comment"
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with our products (min. 20 characters)…"
          style={{
            backgroundColor: "#FFFDF7",
            borderColor: errors.comment ? "#C0392B" : "#C8B89A",
            resize: "vertical",
          }}
          aria-invalid={!!errors.comment}
          aria-describedby={errors.comment ? "review-comment-error" : undefined}
          data-ocid="review.textarea"
        />
        {errors.comment && (
          <p
            id="review-comment-error"
            className="text-xs"
            style={{ color: "#C0392B" }}
            data-ocid="review.error_state"
          >
            {errors.comment}
          </p>
        )}
      </div>

      <ImageUploadField
        preview={imagePreview}
        error={imageError}
        onFileChange={handleFileChange}
        onRemove={handleRemoveImage}
      />

      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          style={{ color: "#6B6257" }}
          data-ocid="review.cancel_button"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={mutation.isPending || !actorReady}
          className="font-semibold text-white"
          style={{ backgroundColor: "#6A1B1B" }}
          data-ocid="review.submit_button"
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting…
            </>
          ) : (
            "Submit Review"
          )}
        </Button>
      </div>
    </form>
  );
}

// ─── Main Section ──────────────────────────────────────────────────────────────────────────────────

export function TestimonialsSection() {
  const { actor: rawActor, isFetching } = useActor();
  const actor = rawActor as BackendFull | null;
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: liveReviews = [] } = useQuery<Review[]>({
    queryKey: ["approvedReviews"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getApprovedReviews();
    },
    enabled: !!actor && !isFetching,
    staleTime: 2 * 60 * 1000,
  });

  const allReviews = [
    ...liveReviews.map((r) => ({
      name: r.name,
      location: r.location,
      rating: Number(r.rating),
      quote: r.comment,
      imageUrl: r.imageUrl,
      initial: r.name.charAt(0).toUpperCase(),
    })),
    ...STATIC_TESTIMONIALS,
  ];

  return (
    <section
      id="testimonials"
      className="py-20 px-4 mandala-bg"
      style={{ backgroundColor: "#FFFDF7" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14 reveal">
          <p
            className="text-sm font-semibold tracking-widest uppercase mb-3"
            style={{ color: "#D4AF37" }}
          >
            Customer Stories
          </p>
          <h2
            className="font-serif text-4xl lg:text-5xl font-bold mb-4"
            style={{
              color: "#8B1A1A",
              fontFamily: "'Cormorant Garamond', serif",
            }}
          >
            What Our Customers Say
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
          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="flex gap-1">
              {STAR_KEYS.map((key) => (
                <Star
                  key={key}
                  className="w-5 h-5"
                  fill="#D4AF37"
                  style={{ color: "#D4AF37" }}
                />
              ))}
            </div>
            <span className="text-lg font-bold" style={{ color: "#6A1B1B" }}>
              4.7
            </span>
            <span className="text-sm" style={{ color: "#6B6257" }}>
              · Based on 200+ happy customers
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allReviews.map((t, i) => (
            <ReviewCard
              key={`${t.name}-${i}`}
              name={t.name}
              location={t.location}
              rating={t.rating}
              quote={t.quote}
              initial={t.initial}
              index={i}
              imageUrl={t.imageUrl}
            />
          ))}
        </div>

        <div className="mt-14 flex justify-center">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="px-10 py-5 rounded-full text-white font-semibold text-base transition-all duration-300 hover:scale-105 hover:shadow-xl"
                style={{
                  backgroundColor: "#6A1B1B",
                  boxShadow: "0 4px 20px rgba(106,27,27,0.35)",
                }}
                data-ocid="testimonials.open_modal_button"
              >
                <Star
                  className="w-4 h-4 mr-2"
                  fill="#D4AF37"
                  style={{ color: "#D4AF37" }}
                />
                Write a Review
              </Button>
            </DialogTrigger>

            <DialogContent
              className="sm:max-w-lg"
              style={{ backgroundColor: "#FDF6E3" }}
              data-ocid="testimonials.dialog"
            >
              <DialogHeader>
                <DialogTitle
                  className="font-serif text-2xl"
                  style={{
                    color: "#6A1B1B",
                    fontFamily: "'Cormorant Garamond', serif",
                  }}
                >
                  Share Your Experience
                </DialogTitle>
              </DialogHeader>
              <WriteReviewModal onClose={() => setDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
}
