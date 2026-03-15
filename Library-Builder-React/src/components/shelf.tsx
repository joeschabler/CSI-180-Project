import type { FC } from "react";
import { Book, type BookProps } from "./book";

interface ShelfProps {
  books: BookProps[];
  onAddBook: () => void;
}

export const Shelf: FC<ShelfProps> = ({ books, onAddBook }) => {
  return (
    <div
      style={{
        borderBottom: "12px solid white",
        borderLeft: "8px solid white",
        borderRight: "8px solid white",
        minHeight: "150px",
        marginBottom: "2rem",
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
        />
      ))}

      <button
        onClick={onAddBook}
        style={{
          height: "40px",
          marginLeft: books.length === 0 ? "0" : "auto", // Check the array length now
          alignSelf: "center",
          cursor: "pointer",
        }}
      >
        ➕ Add Book
      </button>
    </div>
  );
};
