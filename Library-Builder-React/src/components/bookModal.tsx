import type { FC } from "react";
import type { EditingBookState } from "../App";

interface BookModalProps {
  editingBook: NonNullable<EditingBookState>;
  setEditingBook: (state: EditingBookState) => void;
  saveEditedBook: () => void;
  deleteBook: () => void;
}

export const EditModal: FC<BookModalProps> = ({
  editingBook,
  setEditingBook,
  saveEditedBook,
  deleteBook,
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
          Edit Book
        </h2>

        <label
          style={{
            fontWeight: "bold",
            fontSize: "0.85rem",
            marginTop: "10px",
          }}
        >
          Title
        </label>
        <input
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            fontSize: "1rem",
          }}
          value={editingBook.bookData.title || ""}
          onChange={(e) =>
            setEditingBook({
              ...editingBook,
              bookData: { ...editingBook.bookData, title: e.target.value },
            })
          }
        />

        <label
          style={{
            fontWeight: "bold",
            fontSize: "0.85rem",
            marginTop: "10px",
          }}
        >
          Color (Hex)
        </label>
        <input
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            fontSize: "1rem",
          }}
          value={editingBook.bookData.color || ""}
          onChange={(e) =>
            setEditingBook({
              ...editingBook,
              bookData: { ...editingBook.bookData, color: e.target.value },
            })
          }
        />

        <label
          style={{
            fontWeight: "bold",
            fontSize: "0.85rem",
            marginTop: "10px",
          }}
        >
          Height (px)
        </label>
        <input
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            fontSize: "1rem",
          }}
          value={editingBook.bookData.height || ""}
          onChange={(e) =>
            setEditingBook({
              ...editingBook,
              bookData: { ...editingBook.bookData, height: e.target.value },
            })
          }
        />

        <label
          style={{
            fontWeight: "bold",
            fontSize: "0.85rem",
            marginTop: "10px",
          }}
        >
          Width (px)
        </label>
        <input
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            fontSize: "1rem",
          }}
          value={editingBook.bookData.width || ""}
          onChange={(e) =>
            setEditingBook({
              ...editingBook,
              bookData: { ...editingBook.bookData, width: e.target.value },
            })
          }
        />

        <label
          style={{
            fontWeight: "bold",
            fontSize: "0.85rem",
            marginTop: "10px",
          }}
        >
          Edition
        </label>
        <input
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            fontSize: "1rem",
          }}
          value={editingBook.bookData.edition || ""}
          onChange={(e) =>
            setEditingBook({
              ...editingBook,
              bookData: {
                ...editingBook.bookData,
                edition: e.target.value,
              },
            })
          }
        />

        <label
          style={{
            fontWeight: "bold",
            fontSize: "0.85rem",
            marginTop: "10px",
          }}
        >
          ISBN
        </label>
        <input
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            fontSize: "1rem",
          }}
          value={editingBook.bookData.isbn || ""}
          onChange={(e) =>
            setEditingBook({
              ...editingBook,
              bookData: { ...editingBook.bookData, isbn: e.target.value },
            })
          }
        />

        <label
          style={{
            fontWeight: "bold",
            fontSize: "0.85rem",
            marginTop: "10px",
          }}
        >
          Page Count
        </label>
        <input
          type="number"
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            fontSize: "1rem",
          }}
          value={editingBook.bookData.pageCount || ""}
          onChange={(e) =>
            setEditingBook({
              ...editingBook,
              bookData: {
                ...editingBook.bookData,
                // Converts the string input back into a number so it matches BookProps interface
                pageCount: e.target.value ? Number(e.target.value) : undefined,
              },
            })
          }
        />

        <label
          style={{
            fontWeight: "bold",
            fontSize: "0.85rem",
            marginTop: "10px",
          }}
        >
          Cover Art URL
        </label>
        <input
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            fontSize: "1rem",
          }}
          value={editingBook.bookData.coverArt || ""}
          onChange={(e) =>
            setEditingBook({
              ...editingBook,
              bookData: {
                ...editingBook.bookData,
                coverArt: e.target.value,
              },
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
            onClick={deleteBook}
            style={{
              padding: "8px 16px",
              backgroundColor: "#ff4d4d", // Red for danger
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            🗑️ Delete Book
          </button>
          <button
            onClick={() => setEditingBook(null)}
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
            onClick={saveEditedBook}
            style={{
              padding: "10px 20px",
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
  );
};
