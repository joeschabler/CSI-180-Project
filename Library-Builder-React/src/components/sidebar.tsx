import type { FC } from "react";
import type { AppMode, sidebarCollapsed } from "../App";

interface SidebarProps {
  status: sidebarCollapsed;
  setStatus: (status: sidebarCollapsed) => void;
  mode: AppMode;
  setMode: (mode: AppMode) => void;
}

export const Sidebar: FC<SidebarProps> = ({
  status,
  setStatus,
  mode,
  setMode,
}) => {
  return (
    <aside
      style={{
        width: "100%",
        background: "#58acff",
        height: "100%",
        padding: "1rem",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        <button
          onClick={() => setStatus(status === "open" ? "closed" : "open")}
        >
          {status === "open" ? "Collapse" : "→"}
        </button>

        <nav style={{ marginTop: "1rem" }}>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li>
              <a
                href="#home"
                style={{ textDecoration: "none", color: "black" }}
              >
                {/* Show text only if open */}
                🏠 {status === "open" && "Home"}
              </a>
            </li>
            <li style={{ marginTop: "10px" }}>
              <a
                href="#docs"
                style={{ textDecoration: "none", color: "black" }}
              >
                📄 {status === "open" && "Documentation"}
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <div>
        <button
          onClick={() => setMode(mode === "edit" ? "content" : "edit")}
          style={{ width: "100%", whiteSpace: "nowrap", overflow: "hidden" }}
        >
          🔄{" "}
          {status === "open" &&
            (mode === "edit" ? "View Library" : "Edit Library")}
        </button>
      </div>
    </aside>
  );
};
