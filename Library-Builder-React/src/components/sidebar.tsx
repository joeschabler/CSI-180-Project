import type { FC } from "react";
import type { AppMode, sidebarCollapsed } from "../App";

interface SidebarProps {
  status: sidebarCollapsed;
  setStatus: (status: sidebarCollapsed) => void;
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  onAddShelf: () => void;
}

export const Sidebar: FC<SidebarProps> = ({
  status,
  setStatus,
  mode,
  setMode,
  onAddShelf,
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
          style={{
            width: "100%",
            display: "flex",
            justifyContent: status === "open" ? "flex-start" : "center",
          }}
        >
          {status === "open" ? "Collapse" : "→"}
        </button>

        <nav style={{ marginTop: "1rem" }}>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li>
              <a
                href="#home"
                style={{
                  textDecoration: "none",
                  color: "black",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: status === "open" ? "flex-start" : "center",
                  gap: "8px",
                }}
              >
                🏠 {status === "open" && <span>Home</span>}
              </a>
            </li>
            {mode === "edit" && (
              <li style={{ marginTop: "15px" }}>
                <button
                  onClick={onAddShelf}
                  style={{
                    background: "transparent",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    fontSize: "1rem",
                    color: "black",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: status === "open" ? "flex-start" : "center",
                    gap: "8px",
                  }}
                >
                  ➕ {status === "open" && <span>Add Bookshelf</span>}
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </aside>
  );
};
