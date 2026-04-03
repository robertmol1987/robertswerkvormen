import { Star } from "lucide-react";

export function StarRating({ rating }) {
  if (rating === -1) {
    return (
      <div className="flex items-center">
        <span
          className="text-sm font-medium"
          style={{ color: "#F59E0B", fontStyle: "italic" }}
        >
          Beoordeling volgt.
        </span>
      </div>
    );
  }
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Star
        key={i}
        size={20}
        fill={i <= rating ? "#F59E0B" : "none"}
        color={i <= rating ? "#F59E0B" : "#D1D5DB"}
        strokeWidth={1.5}
      />,
    );
  }
  return (
    <div className="flex items-center gap-0.5">
      {stars}
      <span className="ml-1.5 text-sm font-medium" style={{ color: "#666" }}>
        {rating}/5
      </span>
    </div>
  );
}

export function StarRatingSmall({ rating }) {
  if (rating === -1) {
    return (
      <div className="flex items-center">
        <span
          style={{ color: "#F59E0B", fontSize: "12px", fontStyle: "italic" }}
        >
          Beoordeling volgt.
        </span>
      </div>
    );
  }
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Star
        key={i}
        size={14}
        fill={i <= rating ? "#F59E0B" : "none"}
        color={i <= rating ? "#F59E0B" : "#D1D5DB"}
        strokeWidth={1.5}
      />,
    );
  }
  return <div className="flex items-center gap-0.5">{stars}</div>;
}
