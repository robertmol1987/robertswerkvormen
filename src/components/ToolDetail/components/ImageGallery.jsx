import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";

/**
 * Extracts all image URLs from afbeeldingen items.
 * Each item has a `parts` array; we collect all image parts.
 */
function collectImages(afbeeldingen, images) {
  const result = [];
  for (const item of afbeeldingen) {
    if (!item.parts) continue;
    for (const part of item.parts) {
      if (part.type === "image" && part.imageName && images[part.imageName]) {
        result.push({
          src: images[part.imageName],
          name: part.imageName,
          widthPx: part.widthPx,
          heightPx: part.heightPx,
        });
      }
    }
  }
  return result;
}

export function ImageGallery({ afbeeldingen, images }) {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const allImages = collectImages(afbeeldingen, images);

  const isOpen = lightboxIndex !== null;

  const goNext = useCallback(() => {
    if (allImages.length === 0) return;
    setLightboxIndex((prev) =>
      prev === null ? 0 : (prev + 1) % allImages.length,
    );
  }, [allImages.length]);

  const goPrev = useCallback(() => {
    if (allImages.length === 0) return;
    setLightboxIndex((prev) =>
      prev === null ? 0 : (prev - 1 + allImages.length) % allImages.length,
    );
  }, [allImages.length]);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  // Keyboard navigation — use capture phase so lightbox Escape fires BEFORE the modal's handler
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopImmediatePropagation();
        closeLightbox();
      }
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKey, true);
    return () => window.removeEventListener("keydown", handleKey, true);
  }, [isOpen, goNext, goPrev, closeLightbox]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (allImages.length === 0) return null;

  const counterLabel = isOpen
    ? `${lightboxIndex + 1} / ${allImages.length}`
    : "";

  return (
    <>
      {/* Styled card — similar to "De werkvorm uitgelegd" green box */}
      <div
        className="mb-8 p-6 rounded-xl"
        style={{
          backgroundColor: "#EEF2FF",
          border: "2px solid #B8C4F0",
        }}
      >
        <h3
          className="font-bold mb-4 flex items-center gap-2"
          style={{ fontSize: "20px", color: "#3730A3" }}
        >
          <ImageIcon size={20} />
          Afbeeldingen
        </h3>

        {/* Thumbnail grid */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          {allImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setLightboxIndex(idx)}
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "12px",
                overflow: "hidden",
                border: "2px solid rgba(55,48,163,0.15)",
                cursor: "pointer",
                padding: 0,
                background: "#FFFFFF",
                transition:
                  "transform 0.15s, box-shadow 0.15s, border-color 0.15s",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow =
                  "0 6px 20px rgba(55,48,163,0.2)";
                e.currentTarget.style.borderColor = "#6366F1";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = "rgba(55,48,163,0.15)";
              }}
              title={`Afbeelding ${idx + 1} — klik om te vergroten`}
            >
              <img
                src={img.src}
                alt={`Afbeelding ${idx + 1}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </button>
          ))}
        </div>

        <p
          style={{
            fontSize: "13px",
            color: "rgba(55,48,163,0.5)",
            marginTop: "12px",
          }}
        >
          Klik op een afbeelding om te vergroten
        </p>
      </div>

      {/* Lightbox overlay */}
      {isOpen && (
        <div
          onClick={closeLightbox}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50000,
            backgroundColor: "rgba(0,0,0,0.88)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "lbFadeIn 0.2s ease-out",
          }}
        >
          {/* Counter */}
          <div
            style={{
              position: "absolute",
              top: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              color: "rgba(255,255,255,0.7)",
              fontSize: "14px",
              fontWeight: 600,
              letterSpacing: "0.05em",
              pointerEvents: "none",
              userSelect: "none",
            }}
          >
            {counterLabel}
          </div>

          {/* Close button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeLightbox();
            }}
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              backgroundColor: "rgba(255,255,255,0.12)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
              transition: "background-color 0.15s",
              zIndex: 2,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.12)";
            }}
            title="Sluiten (Esc)"
          >
            <X size={22} />
          </button>

          {/* Previous arrow */}
          {allImages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              style={{
                position: "absolute",
                left: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                backgroundColor: "rgba(255,255,255,0.12)",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                transition: "background-color 0.15s",
                zIndex: 2,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  "rgba(255,255,255,0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  "rgba(255,255,255,0.12)";
              }}
              title="Vorige (←)"
            >
              <ChevronLeft size={28} />
            </button>
          )}

          {/* Next arrow */}
          {allImages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              style={{
                position: "absolute",
                right: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                backgroundColor: "rgba(255,255,255,0.12)",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                transition: "background-color 0.15s",
                zIndex: 2,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  "rgba(255,255,255,0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  "rgba(255,255,255,0.12)";
              }}
              title="Volgende (→)"
            >
              <ChevronRight size={28} />
            </button>
          )}

          {/* Main image */}
          <img
            onClick={(e) => e.stopPropagation()}
            src={allImages[lightboxIndex].src}
            alt={`Afbeelding ${lightboxIndex + 1}`}
            style={{
              maxWidth: "88vw",
              maxHeight: "85vh",
              objectFit: "contain",
              borderRadius: "12px",
              boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
              animation: "lbImageIn 0.25s ease-out",
              userSelect: "none",
            }}
          />

          {/* Bottom thumbnail strip */}
          {allImages.length > 1 && (
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                position: "absolute",
                bottom: "20px",
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: "8px",
                padding: "8px 12px",
                backgroundColor: "rgba(0,0,0,0.5)",
                borderRadius: "14px",
                backdropFilter: "blur(12px)",
                maxWidth: "90vw",
                overflowX: "auto",
              }}
            >
              {allImages.map((img, idx) => {
                const isActive = idx === lightboxIndex;
                return (
                  <button
                    key={idx}
                    onClick={() => setLightboxIndex(idx)}
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "8px",
                      overflow: "hidden",
                      border: isActive
                        ? "2px solid #FFFFFF"
                        : "2px solid transparent",
                      opacity: isActive ? 1 : 0.5,
                      cursor: "pointer",
                      padding: 0,
                      background: "none",
                      transition: "opacity 0.15s, border-color 0.15s",
                      flexShrink: 0,
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.opacity = "0.8";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.opacity = "0.5";
                    }}
                  >
                    <img
                      src={img.src}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      <style jsx global>{`
        @keyframes lbFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes lbImageIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  );
}
