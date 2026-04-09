import { useState, useEffect, type FC } from "react";
import { Book, type BookProps } from "./book";
import type { AppMode } from "../App";
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { SortableBook } from "./sortableBook";
import { CSS } from "@dnd-kit/utilities";

interface ShelfProps {
  id: number;
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
  id,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef, // This is a ref that we need to set on the root element of the shelf to make it draggable.
    transform,
    transition,
    isDragging, // This is a boolean that indicates whether the shelf is currently being dragged.
  } = useSortable({ id: id });

  // Resizing State for the shelf width
  const [isResizing, setIsResizing] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(width);

  // Style for the shelf container, including drag and drop and resizing effects
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? "none" : transition, // Disables transition while dragging for instant response
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : 1,
    boxShadow: isDragging ? "0 10px 20px rgba(0,0,0,0.3)" : "none", // Adds a "lift" effect
  };

  // Mouse event handlers for resizing the shelf width.
  const handleMouseDown = (e: React.MouseEvent) => {
    if (mode !== "edit") return;
    setIsResizing(true);
    setStartX(e.clientX);
    setStartWidth(width);
    e.preventDefault(); // Stops the screen from highlighting text while you drag!
  };

  // Effect to handle mouse move and mouse up events for resizing the shelf width.
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

    // When the user releases the mouse button, we stop resizing.
    const handleMouseUp = () => {
      setIsResizing(false);
    };

    // We listen to mousemove and mouseup on the window to ensure we
    // capture these events even if the cursor goes outside the shelf area.
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    // Cleanup function to remove event listeners when the component
    // unmounts or when resizing stops.
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, startX, startWidth, width, onUpdateWidth]);

  // Custom Tooltip State
  const [isHoveringTitle, setIsHoveringTitle] = useState(false);

  return (
    // The main container for the shelf, which is also the draggable element.
    // It includes the title, edit button, and the area where books are displayed.
    <div
      ref={setNodeRef}
      style={{
        ...style,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        width: `${width}px`,
        maxWidth: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* The resize handle on the right edge of the shelf, which only appears in edit mode. */}
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
      {/*The header of the shelf, which includes the title and the edit button. 
      It also serves as the handle for dragging the shelf when in edit mode.*/}
      <div
        {...attributes}
        {...listeners}
        style={{
          cursor: mode === "edit" ? "grab" : "default",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
          padding: "0 10px",
        }}
      >
        {/* The title of the shelf, which shows a tooltip with the full name when hovered. */}
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
          {/* Custom tooltip that appears when hovering over the title, showing the full name of the shelf. */}
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
