import { useRef, useEffect, useState } from "react";
import {
  ExternalLink,
  Plus,
  Minus,
  Shield,
  Tag,
  Target,
  Clock,
  Users,
  Monitor,
  MapPin,
  Lightbulb,
  ListOrdered,
  Shuffle,
  Quote,
  Package,
  Bot,
  FileText,
  Copy,
  Check,
  ImageIcon,
  UserCircle,
} from "lucide-react";
import { StarRating } from "../components/StarRating";
import { ImageGallery } from "../components/ImageGallery";
import { RichText } from "@/components/Content/RichText";

export function DetailView({
  selectedTool,
  images,
  onSelectTool,
  hideBackButton,
}) {
  const scrollRef = useRef(null);
  const [promptCopied, setPromptCopied] = useState(false);

  // Scroll to top when selectedTool changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
    setPromptCopied(false);
  }, [selectedTool]);

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(selectedTool.dePrompt);
      setPromptCopied(true);
      setTimeout(() => setPromptCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      <div className="p-8 pt-6 page-fade" style={{ maxWidth: "900px" }}>
        {!hideBackButton && (
          <button
            onClick={() => onSelectTool(null)}
            className="mb-4 text-sm font-medium px-3 py-1.5 rounded-lg transition-all"
            style={{
              color: "#143d2f",
              backgroundColor: "#E8F0EC",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#d0e4d8";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#E8F0EC";
            }}
          >
            ← Terug naar overzicht
          </button>
        )}

        {/* Werkvorm Header */}
        <div className="flex items-start gap-5 mb-6">
          {selectedTool.icon &&
            selectedTool.icon.imageName &&
            images[selectedTool.icon.imageName] && (
              <div
                style={{
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={images[selectedTool.icon.imageName]}
                  alt={selectedTool.name}
                  style={{
                    width: "auto",
                    height: "auto",
                    maxWidth: "240px",
                    maxHeight: "80px",
                    objectFit: "contain",
                    borderRadius: "10px",
                    border: "1px solid #E5E7EB",
                    display: "block",
                  }}
                />
              </div>
            )}
          <div className="flex-1 min-w-0">
            <h2
              className="font-bold"
              style={{ fontSize: "28px", color: "#1A1A1A", lineHeight: 1.2 }}
            >
              {selectedTool.name}
            </h2>
            {selectedTool.subtitle && (
              <p
                className="mt-1"
                style={{
                  fontSize: "16px",
                  color: "#666",
                  fontStyle: "italic",
                }}
              >
                {selectedTool.subtitle}
              </p>
            )}
            <div className="flex items-center gap-4 mt-3 flex-wrap">
              <StarRating rating={selectedTool.rating} />
              {selectedTool.url && (
                <a
                  href={
                    selectedTool.url.startsWith("http")
                      ? selectedTool.url
                      : "https://" + selectedTool.url
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#2563EB",
                    textDecoration: "underline",
                    fontSize: "14px",
                  }}
                  className="flex items-center gap-1"
                >
                  Website
                  <ExternalLink size={14} />
                </a>
              )}
            </div>

            {/* Goals — directly under rating */}
            {selectedTool.goals && selectedTool.goals.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedTool.goals.map((goal, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full text-sm"
                    style={{
                      backgroundColor: "#E8F0EC",
                      color: "#143d2f",
                      fontSize: "13px",
                    }}
                  >
                    {goal}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Meta badges — no labels */}
        <div className="flex flex-wrap gap-2 mb-6">
          {selectedTool.categories &&
            selectedTool.categories.length > 0 &&
            selectedTool.categories.map((cat, idx) => (
              <span
                key={"cat-" + idx}
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: "#F0F7F4",
                  color: "#143d2f",
                  border: "1px solid #D1E7D9",
                }}
              >
                {cat}
              </span>
            ))}
          {selectedTool.duur && (
            <span
              className="px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"
              style={{
                backgroundColor: "#FFF7ED",
                color: "#9A3412",
                border: "1px solid #FED7AA",
              }}
            >
              <Clock size={12} />
              {selectedTool.duur}
            </span>
          )}
          {selectedTool.analoogDigitaal &&
            selectedTool.analoogDigitaal.length > 0 &&
            selectedTool.analoogDigitaal.map((ad, idx) => (
              <span
                key={"ad-" + idx}
                className="px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                style={{
                  backgroundColor: "#EFF6FF",
                  color: "#1E40AF",
                  border: "1px solid #BFDBFE",
                }}
              >
                <Monitor size={12} />
                {ad}
              </span>
            ))}
          {selectedTool.plaatsTijd &&
            selectedTool.plaatsTijd.length > 0 &&
            selectedTool.plaatsTijd.map((pt, idx) => (
              <span
                key={"pt-" + idx}
                className="px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                style={{
                  backgroundColor: "#F5F3FF",
                  color: "#5B21B6",
                  border: "1px solid #DDD6FE",
                }}
              >
                <MapPin size={12} />
                {pt}
              </span>
            ))}
        </div>

        {/* Doelgroep */}
        {selectedTool.doelgroepen && selectedTool.doelgroepen.length > 0 && (
          <div className="mb-6">
            <h3
              className="font-semibold mb-2 flex items-center gap-2"
              style={{ fontSize: "16px", color: "#333" }}
            >
              <Users size={16} style={{ color: "#143d2f" }} />
              Doelgroep
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedTool.doelgroepen.map((dg, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full text-sm"
                  style={{
                    backgroundColor: "#FEF3C7",
                    color: "#92400E",
                    fontSize: "13px",
                  }}
                >
                  {dg}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Beschrijving van de werkvorm - plain text, above the green box */}
        {selectedTool.description && (
          <div className="mb-6">
            <p
              style={{
                fontSize: "15px",
                lineHeight: "1.7",
                color: "#444",
                whiteSpace: "pre-wrap",
              }}
            >
              {selectedTool.description}
            </p>
          </div>
        )}

        {/* Description / De werkvorm uitgelegd - PROMINENT */}
        {selectedTool.werkvormUitgelegd &&
          (Array.isArray(selectedTool.werkvormUitgelegd)
            ? selectedTool.werkvormUitgelegd.length > 0
            : !!selectedTool.werkvormUitgelegd) && (
            <div
              className="mb-8 p-6 rounded-xl"
              style={{
                backgroundColor: "#E8F5EC",
                border: "2px solid #A7D5B8",
              }}
            >
              <h3
                className="font-bold mb-3 flex items-center gap-2"
                style={{ fontSize: "20px", color: "#143d2f" }}
              >
                📖 De werkvorm uitgelegd
              </h3>
              {Array.isArray(selectedTool.werkvormUitgelegd) ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
                  {selectedTool.werkvormUitgelegd.map((item, idx) => {
                    if (item.type === "list-item") {
                      const listPad = (item.listLevel || 0) * 20;
                      return (
                        <div
                          key={idx}
                          style={{
                            display: "flex",
                            gap: "8px",
                            paddingLeft: listPad + 8,
                          }}
                        >
                          <span
                            style={{
                              flexShrink: 0,
                              color: "#1A3A2A",
                              fontSize: "16px",
                              lineHeight: "1.8",
                            }}
                          >
                            •
                          </span>
                          <p
                            style={{
                              fontSize: "16px",
                              lineHeight: "1.8",
                              color: "#1A3A2A",
                              margin: 0,
                            }}
                          >
                            <RichText
                              parts={item.parts || []}
                              images={images}
                            />
                          </p>
                        </div>
                      );
                    }
                    return (
                      <p
                        key={idx}
                        style={{
                          fontSize: "16px",
                          lineHeight: "1.8",
                          color: "#1A3A2A",
                          margin: 0,
                        }}
                      >
                        <RichText parts={item.parts || []} images={images} />
                      </p>
                    );
                  })}
                </div>
              ) : (
                <p
                  style={{
                    fontSize: "16px",
                    lineHeight: "1.8",
                    color: "#1A3A2A",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {selectedTool.werkvormUitgelegd}
                </p>
              )}
            </div>
          )}

        {/* Afbeeldingen — shown under De werkvorm uitgelegd */}
        {selectedTool.afbeeldingen && selectedTool.afbeeldingen.length > 0 && (
          <ImageGallery
            afbeeldingen={selectedTool.afbeeldingen}
            images={images}
          />
        )}

        {/* Benodigdheden */}
        {selectedTool.benodigdheden && (
          <div className="mb-6">
            <h3
              className="font-semibold mb-2 flex items-center gap-2"
              style={{ fontSize: "16px", color: "#333" }}
            >
              <Package size={16} style={{ color: "#143d2f" }} />
              Benodigdheden
            </h3>
            <p
              style={{
                fontSize: "14px",
                lineHeight: "1.6",
                color: "#444",
                whiteSpace: "pre-wrap",
              }}
            >
              {selectedTool.benodigdheden}
            </p>
          </div>
        )}

        {/* Stappenplan */}
        {selectedTool.stappenplan && selectedTool.stappenplan.length > 0 && (
          <div className="mb-6">
            <h3
              className="font-semibold mb-2 flex items-center gap-2"
              style={{ fontSize: "16px", color: "#333" }}
            >
              <ListOrdered size={16} style={{ color: "#143d2f" }} />
              Stappenplan
            </h3>
            <ol className="flex flex-col gap-2" style={{ paddingLeft: "20px" }}>
              {selectedTool.stappenplan.map((step, idx) => (
                <li
                  key={idx}
                  style={{
                    fontSize: "14px",
                    lineHeight: "1.6",
                    color: "#444",
                    listStyleType: "decimal",
                  }}
                >
                  {step}
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Variaties */}
        {selectedTool.variaties && (
          <div className="mb-6">
            <h3
              className="font-semibold mb-2 flex items-center gap-2"
              style={{ fontSize: "16px", color: "#333" }}
            >
              <Shuffle size={16} style={{ color: "#143d2f" }} />
              Variaties op de werkvorm
            </h3>
            <p
              style={{
                fontSize: "14px",
                lineHeight: "1.6",
                color: "#444",
                whiteSpace: "pre-wrap",
              }}
            >
              {selectedTool.variaties}
            </p>
          </div>
        )}

        {/* Extra tips */}
        {selectedTool.extraTips && (
          <div className="mb-6">
            <h3
              className="font-semibold mb-2 flex items-center gap-2"
              style={{ fontSize: "16px", color: "#333" }}
            >
              <Lightbulb size={16} style={{ color: "#F59E0B" }} />
              Extra tips
            </h3>
            <p
              style={{
                fontSize: "14px",
                lineHeight: "1.6",
                color: "#444",
                whiteSpace: "pre-wrap",
              }}
            >
              {selectedTool.extraTips}
            </p>
          </div>
        )}

        {/* AI-ondersteuning - after extra tips */}
        {selectedTool.aiOndersteuning && (
          <div className="mb-6">
            <h3
              className="font-semibold mb-2 flex items-center gap-2"
              style={{ fontSize: "16px", color: "#333" }}
            >
              <Bot size={16} style={{ color: "#7C3AED" }} />
              AI-ondersteuning
            </h3>
            <p
              style={{
                fontSize: "14px",
                lineHeight: "1.6",
                color: "#444",
                whiteSpace: "pre-wrap",
              }}
            >
              {selectedTool.aiOndersteuning}
            </p>
          </div>
        )}

        {/* De prompt */}
        {selectedTool.dePrompt && (
          <div
            className="mb-6 p-4 rounded-lg"
            onClick={handleCopyPrompt}
            style={{
              backgroundColor: "#F5F3FF",
              border: "1px solid #DDD6FE",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              if (!promptCopied) {
                e.currentTarget.style.backgroundColor = "#EDE9FE";
                e.currentTarget.style.borderColor = "#A78BFA";
              }
            }}
            onMouseLeave={(e) => {
              if (!promptCopied) {
                e.currentTarget.style.backgroundColor = "#F5F3FF";
                e.currentTarget.style.borderColor = "#DDD6FE";
              }
            }}
            title="Klik om te kopiëren"
          >
            <div className="flex items-center justify-between mb-2">
              <h3
                className="font-semibold flex items-center gap-2"
                style={{ fontSize: "16px", color: "#5B21B6" }}
              >
                <FileText size={16} />
                De prompt
              </h3>
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium"
                style={{
                  backgroundColor: promptCopied ? "#dcfce7" : "#EDE9FE",
                  color: promptCopied ? "#16a34a" : "#5B21B6",
                  border: promptCopied
                    ? "1px solid #bbf7d0"
                    : "1px solid #DDD6FE",
                }}
              >
                {promptCopied ? <Check size={14} /> : <Copy size={14} />}
                {promptCopied ? "Gekopieerd!" : "Kopieer"}
              </div>
            </div>
            <pre
              style={{
                fontSize: "13px",
                lineHeight: "1.6",
                color: "#4C1D95",
                whiteSpace: "pre-wrap",
                fontFamily: "monospace",
                backgroundColor: "#EDE9FE",
                padding: "12px",
                borderRadius: "8px",
              }}
            >
              {selectedTool.dePrompt}
            </pre>
          </div>
        )}

        {/* Pros & Cons grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {selectedTool.pros && selectedTool.pros.length > 0 && (
            <div
              className="p-4 rounded-lg"
              style={{
                backgroundColor: "#F0FFF4",
                border: "1px solid #C6F6D5",
              }}
            >
              <h3
                className="font-semibold mb-3"
                style={{ fontSize: "15px", color: "#22543D" }}
              >
                Positieve punten
              </h3>
              <ul className="flex flex-col gap-2">
                {selectedTool.pros.map((pro, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Plus
                      size={16}
                      style={{
                        color: "#38A169",
                        flexShrink: 0,
                        marginTop: "2px",
                      }}
                    />
                    <span style={{ fontSize: "14px", color: "#2D3748" }}>
                      {pro}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {selectedTool.cons && selectedTool.cons.length > 0 && (
            <div
              className="p-4 rounded-lg"
              style={{
                backgroundColor: "#FFF5F5",
                border: "1px solid #FED7D7",
              }}
            >
              <h3
                className="font-semibold mb-3"
                style={{ fontSize: "15px", color: "#742A2A" }}
              >
                Minder positieve punten
              </h3>
              <ul className="flex flex-col gap-2">
                {selectedTool.cons.map((con, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Minus
                      size={16}
                      style={{
                        color: "#E53E3E",
                        flexShrink: 0,
                        marginTop: "2px",
                      }}
                    />
                    <span style={{ fontSize: "14px", color: "#2D3748" }}>
                      {con}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Disclaimers / Belangrijke informatie */}
        {selectedTool.disclaimers && (
          <div
            className="mb-6 p-4 rounded-lg"
            style={{
              backgroundColor: "#FFFBEB",
              border: "1px solid #FDE68A",
            }}
          >
            <h3
              className="font-semibold mb-2 flex items-center gap-2"
              style={{ fontSize: "15px", color: "#92400E" }}
            >
              <Shield size={16} />
              Belangrijke informatie / Dataveiligheid
            </h3>
            <p
              style={{
                fontSize: "14px",
                lineHeight: "1.6",
                color: "#78350F",
                whiteSpace: "pre-wrap",
              }}
            >
              {selectedTool.disclaimers}
            </p>
          </div>
        )}

        {/* Persoonlijke reactie */}
        {selectedTool.persoonlijkeReactie && (
          <div className="mb-6">
            <h3
              className="font-semibold mb-2 flex items-center gap-2"
              style={{ fontSize: "16px", color: "#333" }}
            >
              <Quote size={16} style={{ color: "#143d2f" }} />
              Persoonlijke reactie
            </h3>
            <p
              style={{
                fontSize: "14px",
                lineHeight: "1.6",
                color: "#555",
                fontStyle: "italic",
                whiteSpace: "pre-wrap",
              }}
            >
              &ldquo;{selectedTool.persoonlijkeReactie}&rdquo;
            </p>
          </div>
        )}

        {/* Eigenaar — where this werkvorm comes from */}
        {selectedTool.eigenaar && (
          <div className="mb-6">
            <h3
              className="font-semibold mb-2 flex items-center gap-2"
              style={{ fontSize: "16px", color: "#333" }}
            >
              <UserCircle size={16} style={{ color: "#143d2f" }} />
              Bron / van
            </h3>
            <p
              style={{
                fontSize: "14px",
                lineHeight: "1.6",
                color: "#444",
                whiteSpace: "pre-wrap",
              }}
            >
              {selectedTool.eigenaar}
            </p>
          </div>
        )}

        {/* Tags */}
        {selectedTool.tags && selectedTool.tags.length > 0 && (
          <div className="mb-6">
            <h3
              className="font-semibold mb-2 flex items-center gap-2"
              style={{ fontSize: "16px", color: "#333" }}
            >
              <Tag size={16} style={{ color: "#143d2f" }} />
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedTool.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded text-xs"
                  style={{
                    backgroundColor: "#F3F4F6",
                    color: "#4B5563",
                    border: "1px solid #E5E7EB",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
