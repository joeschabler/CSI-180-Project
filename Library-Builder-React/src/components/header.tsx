import type { FC } from "react";
import type { AppMode } from "../App";

interface HeaderProps {
  title: string;
  mode: AppMode;
  setMode: (mode: AppMode) => void;
}

export const Header: FC<HeaderProps> = ({ title, mode, setMode }) => {
  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 2rem",
        minHeight: "70px",
        width: "100%",
        boxSizing: "border-box",
        borderBottom: "1px solid #ddd",
        backgroundColor: "#000000",
      }}
    >
      <h1 style={{ margin: 0, fontSize: "1.5rem", color: "#ffffff" }}>
        {title}
      </h1>

      <button
        onClick={() => setMode(mode === "edit" ? "content" : "edit")}
        style={{
          padding: "10px 20px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          borderRadius: "6px",
          border: "none",
          background: "#58acff",
          color: "white",
          fontWeight: "bold",
          fontSize: "1rem",
        }}
      >
        🔄 {mode === "edit" ? "View Library" : "Edit Library"}
      </button>
    </header>
  );
};
