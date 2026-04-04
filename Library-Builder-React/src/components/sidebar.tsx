import { useState } from "react";
import type { FC } from "react";
import type { AppMode, sidebarCollapsed } from "../App";

interface SidebarProps {
  status: sidebarCollapsed;
  setStatus: (status: sidebarCollapsed) => void;
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  onAddShelf: () => void;
  exportLibrary: () => void;
  importLibrary: (e: React.ChangeEvent<HTMLInputElement>) => void;
  useRandomBooks: boolean;
  setUseRandomBooks: (val: boolean) => void;
  defaultBookHeight: number;
  setDefaultBookHeight: (val: number) => void;
  defaultBookWidth: number;
  setDefaultBookWidth: (val: number) => void;
  defaultBookColor: string;
  setDefaultBookColor: (val: string) => void;
  clearLibrary: () => void;
  devOptionsEnabled: boolean;
  setDevOptionsEnabled: (val: boolean) => void;
  hardResetSite: () => void;
}

export const Sidebar: FC<SidebarProps> = ({
  status,
  setStatus,
  mode,
  setMode,
  onAddShelf,
  exportLibrary,
  importLibrary,
  useRandomBooks,
  setUseRandomBooks,
  defaultBookHeight,
  setDefaultBookHeight,
  defaultBookWidth,
  setDefaultBookWidth,
  defaultBookColor,
  setDefaultBookColor,
  clearLibrary,
  devOptionsEnabled,
  setDevOptionsEnabled,
  hardResetSite,
}) => {
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(false);
  const [clearStep, setClearStep] = useState(0);
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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginTop: "20px",
        }}
      >
        <button
          onClick={exportLibrary}
          style={{
            background: "black",
            color: "white",
            border: "none",
            padding: "8px",
            cursor: "pointer",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: status === "open" ? "flex-start" : "center",
            gap: "8px",
            fontWeight: "bold",
          }}
        >
          💾 {status === "open" && <span>Backup Library</span>}
        </button>
        {mode === "edit" && (
          <label
            style={{
              background: "white",
              color: "black",
              border: "none",
              padding: "8px",
              cursor: "pointer",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: status === "open" ? "flex-start" : "center",
              gap: "8px",
              fontWeight: "bold",
            }}
          >
            📂 {status === "open" && <span>Load Backup</span>}
            <input
              type="file"
              accept=".json"
              style={{ display: "none" }}
              onChange={importLibrary}
            />
          </label>
        )}
        {status === "open" && mode === "edit" && (
          <div
            style={{
              marginTop: "15px",
              paddingTop: "15px",
              borderTop: "1px solid rgba(255,255,255,0.3)",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {/* The clickable toggle button */}
            <button
              onClick={() => setIsSettingsExpanded(!isSettingsExpanded)}
              style={{
                background: "transparent",
                border: "none",
                color: "white",
                padding: 0,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontWeight: "bold",
                fontSize: "0.85rem",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              <span
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                ⚙️ Settings
              </span>
              <span>{isSettingsExpanded ? "▼" : "▶"}</span>
            </button>

            {/* The hidden content that drops down */}
            {isSettingsExpanded && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  marginTop: "5px",
                  paddingLeft: "5px",
                }}
              >
                <label
                  style={{
                    color: "white",
                    fontSize: "0.85rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={useRandomBooks}
                    onChange={(e) => setUseRandomBooks(e.target.checked)}
                    style={{ cursor: "pointer" }}
                  />
                  Randomize New Books
                </label>

                {!useRandomBooks && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                      marginTop: "10px",
                      padding: "10px",
                      background: "rgba(0,0,0,0.2)",
                      borderRadius: "6px",
                    }}
                  >
                    <label
                      style={{
                        color: "white",
                        fontSize: "0.8rem",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      Height (px):
                      <input
                        type="number"
                        value={defaultBookHeight}
                        onChange={(e) =>
                          setDefaultBookHeight(Number(e.target.value))
                        }
                        style={{
                          width: "60px",
                          padding: "4px",
                          borderRadius: "4px",
                          border: "none",
                        }}
                      />
                    </label>

                    <label
                      style={{
                        color: "white",
                        fontSize: "0.8rem",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      Width (px):
                      <input
                        type="number"
                        value={defaultBookWidth}
                        onChange={(e) =>
                          setDefaultBookWidth(Number(e.target.value))
                        }
                        style={{
                          width: "60px",
                          padding: "4px",
                          borderRadius: "4px",
                          border: "none",
                        }}
                      />
                    </label>

                    <label
                      style={{
                        color: "white",
                        fontSize: "0.8rem",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      Spine Color:
                      <input
                        type="color"
                        value={defaultBookColor}
                        onChange={(e) => setDefaultBookColor(e.target.value)}
                        style={{
                          padding: "0",
                          border: "none",
                          width: "30px",
                          height: "24px",
                          cursor: "pointer",
                          background: "transparent",
                        }}
                      />
                    </label>
                  </div>
                )}

                <div
                  style={{
                    marginTop: "15px",
                    paddingTop: "15px",
                    borderTop: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <label
                    style={{
                      color: "#ffcc00",
                      fontSize: "0.85rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={devOptionsEnabled}
                      onChange={(e) => setDevOptionsEnabled(e.target.checked)}
                      style={{ cursor: "pointer" }}
                    />
                    🛠️ Enable Developer Options
                  </label>
                </div>

                <div
                  onMouseLeave={() => setClearStep(0)} // Safely resets if they move their mouse away
                  style={{
                    marginTop: "15px",
                    paddingTop: "15px",
                    borderTop: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <button
                    onClick={() => {
                      if (clearStep === 0) setClearStep(1);
                      else if (clearStep === 1) setClearStep(2);
                      else {
                        // Pop up the typing prompt
                        const userInput = window.prompt(
                          "Type 'confirm' to permanently delete your entire library:",
                        );

                        if (
                          userInput &&
                          userInput.toLowerCase() === "confirm"
                        ) {
                          clearLibrary(); // Wipes the data
                          setClearStep(0); // Resets the button
                        } else if (
                          devOptionsEnabled &&
                          userInput &&
                          userInput.toLowerCase() === "reset"
                        ) {
                          hardResetSite(); // Triggers the complete wipe and refresh
                        } else {
                          // If they hit cancel or misspell it, just reset the button safely
                          setClearStep(0);
                        }
                      }
                    }}
                    style={{
                      width: "100%",
                      padding: "8px",
                      background:
                        clearStep === 0
                          ? "transparent"
                          : clearStep === 1
                            ? "#ff9999"
                            : "#ff4d4d",
                      color: clearStep === 0 ? "#ff4d4d" : "black",
                      border: `1px solid ${clearStep === 0 ? "#ff4d4d" : "transparent"}`,
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontWeight: "bold",
                      transition: "all 0.2s",
                    }}
                  >
                    {clearStep === 0 && "🗑️ Clear Library"}
                    {clearStep === 1 && "⚠️ Are you sure?"}
                    {clearStep === 2 && "🚨 Click to Wipe Data!"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
