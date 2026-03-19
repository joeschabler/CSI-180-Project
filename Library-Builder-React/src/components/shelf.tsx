import type { FC } from "react";
import { Book, type BookProps } from "./book";
import type { AppMode } from "../App";

interface ShelfProps {
  books: BookProps[];
  mode: AppMode;
  onAddBook: () => void;
  onBookClick: (bookIndex: number) => void;
  onEditShelf: () => void;
  name?: string;
}

export const Shelf: FC<ShelfProps> = ({
  books,
  mode,
  onAddBook,
  onBookClick,
  onEditShelf,
  name,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "fit-content",
        marginBottom: "2rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
          padding: "0 10px",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "1.5rem", color: "#ffffff" }}>
          {name || "Untitled Shelf"}
        </h2>

        {mode === "edit" && (
          <button
            onClick={onEditShelf}
            style={{
              padding: "6px 12px",
              backgroundColor: "#58acff",
              color: "white",
              border: "none",
              cursor: "pointer",
              fontSize: "0.85rem",
              fontWeight: "bold",
            }}
          >
            ⚙️ Edit Shelf
          </button>
        )}
      </div>
      <div
        style={{
          borderBottom: "8px solid white",
          borderLeft: "8px solid white",
          borderRight: "8px solid white",
          borderTop: "8px solid white",
          minHeight: "150px",
          padding: "1rem",
          display: "flex",
          flexWrap: "wrap",
          gap: "4px",
          alignItems: "flex-end",
          backgroundColor: "rgba(0,0,0,0.02)",
        }}
      >
        {books.map((book, index) => (
          <Book
            key={index} // In the future, this should be book.id or book.isbn
            title={book.title}
            color={book.color}
            height={book.height}
            width={book.width}
            isbn={book.isbn}
            pageCount={book.pageCount}
            coverArt={book.coverArt}
            edition={book.edition}
            onClick={mode === "edit" ? () => onBookClick(index) : undefined}
          />
        ))}
      </div>
      {mode === "edit" && (
        <button
          onClick={onAddBook}
          style={{
            height: "40px",
            marginTop: "10px",
            alignSelf: "center",
            cursor: "pointer",
            padding: "0 16px",
            borderRadius: "6px",
            border: "none",
            background: "#58acff",
            color: "white",
            fontWeight: "bold",
          }}
        >
          ➕ Add Book
        </button>
      )}
    </div>
  );
};
