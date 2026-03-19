import type { FC } from "react";
import type { ShelfData } from "../App";

interface ShelfModalProps {
  editingShelf: NonNullable<ShelfData>;
  setEditingShelf: (shelf: ShelfData | null) => void;
  saveEditedShelf: () => void;
  deleteShelf: () => void;
}

export const ShelfModal: FC<ShelfModalProps> = ({
  editingShelf,
  setEditingShelf,
  saveEditedShelf,
  deleteShelf,
}) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "white",
          color: "#333",
          padding: "2rem",
          borderRadius: "12px",
          width: "320px",
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          boxShadow: "0px 10px 30px rgba(0,0,0,0.3)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <h2
          style={{
            margin: "0 0 10px 0",
            borderBottom: "2px solid #58acff",
            paddingBottom: "8px",
          }}
        >
          Edit Shelf
        </h2>
        <label
          style={{
            fontWeight: "bold",
            fontSize: "0.85rem",
            marginTop: "10px",
          }}
        >
          Shelf Name
        </label>
        <input
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            fontSize: "1rem",
          }}
          value={editingShelf.name || ""}
          onChange={(e) =>
            setEditingShelf({
              ...editingShelf,
              name: e.target.value,
            })
          }
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "20px",
          }}
        >
          <button
            onClick={deleteShelf}
            style={{
              padding: "8px 16px",
              backgroundColor: "#ff4d4d",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            🗑️ Delete Shelf
          </button>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => setEditingShelf(null)}
              style={{
                padding: "10px 15px",
                cursor: "pointer",
                borderRadius: "6px",
                border: "none",
                background: "#ff4d4d",
                color: "white",
                fontWeight: "bold",
              }}
            >
              Cancel
            </button>
            <button
              onClick={saveEditedShelf}
              style={{
                padding: "8px 16px",
                background: "#58acff",
                color: "white",
                fontWeight: "bold",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
