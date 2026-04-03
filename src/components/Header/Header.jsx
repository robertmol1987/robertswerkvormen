import { Menu, X, Maximize2, Home } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

export function Header({
  sidebarOpen,
  onToggleSidebar,
  pageTitle,
  pageSubtitle,
  onShowLanding,
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (typeof document === "undefined") return;
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  const handleTitleClick = useCallback(() => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  }, []);

  return (
    <header
      className="flex items-center justify-between px-8 py-4 flex-shrink-0"
      style={{
        backgroundColor: "#143d2f",
        borderBottom: "4px solid rgba(255,255,255,0.15)",
        minHeight: "120px",
      }}
    >
      <div style={{ minHeight: "60px" }}>
        {pageTitle ? (
          <h1
            className="font-bold leading-tight cursor-pointer hover:opacity-80 transition-opacity"
            style={{ color: "#FFFFFF", fontSize: "36px" }}
            onClick={handleTitleClick}
          >
            {pageTitle}
          </h1>
        ) : null}
        {pageSubtitle ? (
          <div className="mt-1">
            <span style={{ color: "#FBFBFB", fontSize: "18px" }}>
              {pageSubtitle}
            </span>
          </div>
        ) : null}
        {pageTitle ? (
          <div style={{ marginTop: "4px" }}>
            <span
              style={{
                color: "#FBFBFB",
                fontSize: "14px",
                opacity: 0.8,
              }}
            >
              door Robert Mol |{" "}
            </span>
            <a
              href="https://www.digitaledidactiek.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#FBFBFB",
                fontSize: "14px",
                opacity: 0.8,
                textDecoration: "underline",
              }}
              className="hover:opacity-100 transition-opacity"
            >
              www.digitaledidactiek.com
            </a>
            <span
              style={{
                color: "#FBFBFB",
                fontSize: "14px",
                opacity: 0.8,
              }}
            >
              {" "}
              |{" "}
            </span>
            <a
              href="https://robertspromptbibliotheek.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#FBFBFB",
                fontSize: "14px",
                opacity: 0.8,
                textDecoration: "underline",
              }}
              className="hover:opacity-100 transition-opacity"
            >
              Promptbibliotheek
            </a>
            <span
              style={{
                color: "#FBFBFB",
                fontSize: "14px",
                opacity: 0.6,
              }}
            >
              {" "}
              /{" "}
            </span>
            <a
              href="https://robertsdigitaletoolbox.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#FBFBFB",
                fontSize: "14px",
                opacity: 0.8,
                textDecoration: "underline",
              }}
              className="hover:opacity-100 transition-opacity"
            >
              Toolbox
            </a>
            <span
              style={{
                color: "#FBFBFB",
                fontSize: "14px",
                opacity: 0.6,
              }}
            >
              {" "}
              /{" "}
            </span>
            <a
              href="https://robertswerkvormen.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#FBFBFB",
                fontSize: "14px",
                opacity: 0.8,
                textDecoration: "underline",
              }}
              className="hover:opacity-100 transition-opacity"
            >
              Werkvormen
            </a>
            <span
              style={{
                color: "#FBFBFB",
                fontSize: "14px",
                opacity: 0.8,
              }}
            >
              {" "}
              |
            </span>
          </div>
        ) : null}
      </div>

      <div className="flex items-center gap-2">
        {onShowLanding && (
          <button
            onClick={onShowLanding}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            style={{ color: "#DADADA" }}
            title="Terug naar startscherm"
          >
            <Home size={22} />
          </button>
        )}

        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          style={{ color: "#DADADA" }}
          title="Volledig scherm (F11)"
        >
          <Maximize2 size={22} />
        </button>

        <button
          className="md:hidden p-2 rounded-lg"
          style={{ color: "#DADADA" }}
          onClick={onToggleSidebar}
        >
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  );
}
