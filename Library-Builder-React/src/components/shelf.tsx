import { useState, useEffect, type FC } from "react";
import { Book, type BookProps } from "./book";
import type { AppMode } from "../App";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableBook } from "./sortableBook";

interface ShelfProps {
  books: BookProps[];
  mode: AppMode;
  onAddBook: () => void;
  onBookClick: (bookIndex: number) => void;
  onEditShelf: () => void;
  name?: string;
  width?: number;
  onUpdateWidth?: (newWidth: number) => void;
}

export const Shelf: FC<ShelfProps> = ({
  books,
  mode,
  onAddBook,
  onBookClick,
  onEditShelf,
  name,
  width = 450,
  onUpdateWidth,
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(width);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (mode !== "edit") return;
    setIsResizing(true);
    setStartX(e.clientX);
    setStartWidth(width);
    e.preventDefault(); // Stops the screen from highlighting text while you drag!
  };

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      let newWidth = startWidth + deltaX;

      newWidth = Math.round(newWidth / 20) * 20;

      if (newWidth < 200) newWidth = 200;
      if (newWidth > 2000) newWidth = 2000;

      if (onUpdateWidth && newWidth !== width) {
        onUpdateWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, startX, startWidth, width, onUpdateWidth]);

  // Custom Tooltip State
  const [isHoveringTitle, setIsHoveringTitle] = useState(false);

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        width: `${width}px`,
        marginBottom: "2rem",
      }}
    >
      {mode === "edit" && (
        <div
          onMouseDown={handleMouseDown}
          style={{
            position: "absolute",
            right: "-10px",
            top: 0,
            bottom: 0,
            width: "20px",
            cursor: "col-resize",
            zIndex: 10,
            backgroundColor: isResizing
              ? "rgba(88, 172, 255, 0.2)"
              : "transparent",
            transition: "background-color 0.2s",
          }}
        />
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
          padding: "0 10px",
        }}
      >
        <div
          onMouseEnter={() => setIsHoveringTitle(true)}
          onMouseLeave={() => setIsHoveringTitle(false)}
          style={{ position: "relative", maxWidth: "calc(100% - 110px)" }} // Prevents text from hitting the button
        >
          <h2
            style={{
              margin: 0,
              fontSize: "1.5rem",
              color: "#ffffff",
              paddingRight: "15px",

              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {name || "Untitled Shelf"}
          </h2>

          {isHoveringTitle && (
            <div
              style={{
                position: "absolute",
                top: "-35px", // Floats perfectly above the title
                left: "0",
                backgroundColor: "#333",
                color: "#fff",
                padding: "6px 10px",
                borderRadius: "6px",
                fontSize: "0.85rem",
                fontWeight: "normal",
                whiteSpace: "nowrap",
                zIndex: 100, // Forces it to the very front
                boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
                pointerEvents: "none", // Prevents the tooltip itself from glitching the hover state
              }}
            >
              {name || "Untitled Shelf"}
            </div>
          )}
        </div>

        {mode === "edit" && (
          <button
            onClick={onEditShelf}
            style={{
              flexShrink: 0, // Prevents a massive title from crushing the button
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
        <SortableContext
          items={books.map((b) => b.id)}
          strategy={horizontalListSortingStrategy}
        >
          {books.map((book, index) => (
            <SortableBook
              key={book.id}
              id={book.id}
              disabled={mode !== "edit"} // disables dragging if not in edit
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
        </SortableContext>
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
