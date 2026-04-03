import { useState } from "react";
import { ChevronDown, ChevronRight, Copy, Check } from "lucide-react";

function getImagePositionStyle(part) {
  const style = {};

  if (!part.isAnchored) {
    style.display = "inline-block";
    style.verticalAlign = "middle";
    return style;
  }

  const hasTextWrap =
    part.wrapType === "square" ||
    part.wrapType === "tight" ||
    part.wrapType === "through";

  if (hasTextWrap) {
    if (part.hAlign === "right") {
      style.float = "right";
      style.marginLeft = "16px";
      style.marginBottom = "12px";
    } else if (part.hAlign === "center") {
      style.display = "block";
      style.marginLeft = "auto";
      style.marginRight = "auto";
      style.marginBottom = "12px";
    } else {
      style.float = "left";
      style.marginRight = "16px";
      style.marginBottom = "12px";
    }
  } else if (part.wrapType === "topAndBottom") {
    style.display = "block";
    style.marginBottom = "12px";
    if (part.hAlign === "right") {
      style.marginLeft = "auto";
      style.marginRight = "0";
    } else if (part.hAlign === "center") {
      style.marginLeft = "auto";
      style.marginRight = "auto";
    }
  } else {
    style.display = "block";
    style.marginBottom = "12px";
    if (part.hAlign === "right") {
      style.marginLeft = "auto";
      style.marginRight = "0";
    } else if (part.hAlign === "center") {
      style.marginLeft = "auto";
      style.marginRight = "auto";
    }
  }

  return style;
}

function DisclaimerBar({ title, content }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      style={{
        display: "block",
        margin: "12px 0",
        borderRadius: "8px",
        border: "1px solid #E5E7EB",
        overflow: "hidden",
        backgroundColor: "#F8FAFC",
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          width: "100%",
          padding: "12px 16px",
          border: "none",
          background: "none",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: 600,
          color: "#1d4a3c",
          textAlign: "left",
        }}
      >
        {isOpen ? (
          <ChevronDown size={16} style={{ flexShrink: 0, opacity: 0.6 }} />
        ) : (
          <ChevronRight size={16} style={{ flexShrink: 0, opacity: 0.6 }} />
        )}
        {title}
      </button>
      {isOpen && (
        <div
          style={{
            padding: "0 16px 14px 40px",
            fontSize: "14px",
            lineHeight: "1.7",
            color: "#444",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            borderTop: "1px solid #E5E7EB",
            paddingTop: "12px",
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
}

function CopyableBlock({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div
      onClick={handleCopy}
      style={{
        display: "block",
        margin: "12px 0",
        padding: "14px 16px",
        borderRadius: "10px",
        backgroundColor: copied ? "#EDE9FE" : "#F5F3FF",
        border: copied ? "2px solid #7C3AED" : "2px solid #DDD6FE",
        cursor: "pointer",
        transition: "all 0.15s ease",
        position: "relative",
      }}
      title="Klik om te kopiëren"
      onMouseEnter={(e) => {
        if (!copied) {
          e.currentTarget.style.backgroundColor = "#EDE9FE";
          e.currentTarget.style.borderColor = "#A78BFA";
        }
      }}
      onMouseLeave={(e) => {
        if (!copied) {
          e.currentTarget.style.backgroundColor = "#F5F3FF";
          e.currentTarget.style.borderColor = "#DDD6FE";
        }
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "10px",
        }}
      >
        <div
          style={{
            flex: 1,
            fontSize: "14px",
            lineHeight: "1.7",
            color: "#4C1D95",
            whiteSpace: "pre-wrap",
            fontFamily: "monospace",
          }}
        >
          {text}
        </div>
        <div
          style={{
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            gap: "4px",
            fontSize: "12px",
            fontWeight: 600,
            color: copied ? "#16a34a" : "#7C3AED",
            backgroundColor: copied ? "#dcfce7" : "#EDE9FE",
            padding: "4px 10px",
            borderRadius: "6px",
            whiteSpace: "nowrap",
          }}
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? "Gekopieerd!" : "Kopieer"}
        </div>
      </div>
    </div>
  );
}

export function RichText({ parts, images }) {
  return (
    <>
      {parts.map((part, i) => {
        // Handle copyable blocks (@@@text@@@)
        if (part.type === "copyable") {
          return <CopyableBlock key={i} text={part.text} />;
        }

        // Handle iframes
        if (part.type === "iframe") {
          return (
            <iframe
              key={i}
              src={part.url}
              width="980"
              height="500"
              frameBorder="0"
              scrolling="no"
              style={{
                display: "block",
                margin: "16px 0",
                maxWidth: "100%",
                border: "none",
              }}
              title={`Embedded content ${i}`}
            />
          );
        }

        // Handle disclaimers (%%% title;content %%%)
        if (part.type === "disclaimer") {
          return (
            <DisclaimerBar
              key={i}
              title={part.disclaimerTitle}
              content={part.disclaimerContent}
            />
          );
        }

        // Handle images (inline or anchored)
        if (part.type === "image" && part.imageName && images[part.imageName]) {
          const imgStyle = {};
          if (part.widthPx && part.heightPx) {
            imgStyle.maxWidth = "100%";
            imgStyle.width = `${part.widthPx}px`;
            imgStyle.height = "auto";
            imgStyle.aspectRatio = `${part.widthPx} / ${part.heightPx}`;
          } else {
            imgStyle.maxWidth = "100%";
            imgStyle.height = "auto";
          }

          const positionStyle = getImagePositionStyle(part);

          return (
            <img
              key={i}
              src={images[part.imageName]}
              alt=""
              style={{
                ...imgStyle,
                ...positionStyle,
                borderRadius: "4px",
              }}
            />
          );
        }

        if (!part.text) return null;

        let el = part.text;

        // Build inline styles from Word document properties
        const inlineStyle = {};
        if (part.fontSize) inlineStyle.fontSize = part.fontSize;
        if (part.fontFamily) inlineStyle.fontFamily = part.fontFamily;
        if (part.color) inlineStyle.color = part.color;

        if (part.bold) el = <strong key={i}>{el}</strong>;
        if (part.italic) el = <em key={i}>{el}</em>;
        if (part.underline && !part.link)
          el = (
            <span key={i} className="underline" style={inlineStyle}>
              {el}
            </span>
          );
        if (part.link) {
          // Use explicit href if provided (from ###text;url### pattern),
          // otherwise derive URL from the display text
          let href = part.href || part.text;

          // Only add https:// if there's no protocol already
          const hasProtocol =
            href.startsWith("http://") ||
            href.startsWith("https://") ||
            href.startsWith("mailto:") ||
            href.startsWith("tel:") ||
            href.startsWith("ftp://");

          if (!hasProtocol) {
            if (href.startsWith("www.")) {
              href = "https://" + href;
            } else if (href.includes(".")) {
              href = "https://" + href;
            }
          }

          el = (
            <a
              key={i}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-[#2563EB] hover:text-[#1e40af] cursor-pointer"
              style={inlineStyle}
            >
              {el}
            </a>
          );
        }

        // If we have styles but no other formatting, wrap in a span
        if (
          !part.underline &&
          !part.link &&
          Object.keys(inlineStyle).length > 0
        ) {
          el = (
            <span key={i} style={inlineStyle}>
              {el}
            </span>
          );
        }

        return <span key={i}>{el}</span>;
      })}
    </>
  );
}
