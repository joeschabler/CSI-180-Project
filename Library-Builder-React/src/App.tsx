import "./App.css";
import { useState, useEffect } from "react";
import Layout from "./components/layout";
import { Shelf } from "./components/shelf";
import type { BookProps } from "./components/book";

export type AppMode = "edit" | "content";
export type sidebarCollapsed = "open" | "closed";

export type ShelfData = {
  id: number;
  books: BookProps[];
};

type EditingBookState = {
  shelfId: number;
  bookIndex: number;
  bookData: BookProps;
} | null;

function App() {
  const [mode, setMode] = useState<AppMode>("edit");
  const [isCollapsed, setIsCollapsed] = useState<sidebarCollapsed>("open");
  const [shelves, setShelves] = useState<ShelfData[]>(() => {
    const savedData = localStorage.getItem("library-shelves");

    if (savedData) {
      return JSON.parse(savedData);
    }

    return [{ id: 1, books: [] }];
  });

  useEffect(() => {
    localStorage.setItem("library-shelves", JSON.stringify(shelves));
  }, [shelves]);

  const [editingBook, setEditingBook] = useState<EditingBookState>(null);

  const headerTitle = mode === "edit" ? "Library Editor" : "Your Library";

  const addNewShelf = () => {
    setShelves([...shelves, { id: Date.now(), books: [] }]);
  };

  const addBookToShelf = (shelfId: number) => {
    const randomHeight =
      Math.floor(Math.random() * (140 - 100 + 1) + 100) + "px";
    const randomWidth = Math.floor(Math.random() * (50 - 20 + 1) + 20) + "px";
    const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);

    const newBook: BookProps = {
      title: "New Book",
      color: randomColor,
      height: randomHeight,
      width: randomWidth,
    };

    setShelves(
      shelves.map((shelf) =>
        shelf.id === shelfId
          ? { ...shelf, books: [...shelf.books, newBook] }
          : shelf,
      ),
    );
  };

  const deleteBook = () => {
    if (!editingBook) return;

    setShelves((prevShelves) =>
      prevShelves.map((shelf) => {
        if (shelf.id === editingBook.shelfId) {
          return {
            ...shelf,
            books: shelf.books.filter(
              (_, index) => index !== editingBook.bookIndex,
            ),
          };
        }
        return shelf;
      }),
    );

    setEditingBook(null);
  };

  const saveEditedBook = () => {
    if (!editingBook) return;

    setShelves(
      shelves.map((shelf) => {
        if (shelf.id === editingBook.shelfId) {
          const updatedBooks = [...shelf.books];
          updatedBooks[editingBook.bookIndex] = editingBook.bookData;
          return { ...shelf, books: updatedBooks };
        }
        return shelf;
      }),
    );

    setEditingBook(null);
  };

  return (
    <Layout
      title={headerTitle}
      sidebarStatus={isCollapsed}
      setSidebarStatus={setIsCollapsed}
      mode={mode}
      setMode={setMode}
      onAddShelf={addNewShelf}
    >
      <div style={{ paddingBottom: "2rem" }}>
        {shelves.map((shelf) => (
          <Shelf
            key={shelf.id}
            books={shelf.books}
            mode={mode}
            onAddBook={() => addBookToShelf(shelf.id)}
            onBookClick={(bookIndex) =>
              setEditingBook({
                shelfId: shelf.id,
                bookIndex: bookIndex,
                bookData: shelf.books[bookIndex],
              })
            }
          />
        ))}
      </div>
      {editingBook && (
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
                    pageCount: e.target.value
                      ? Number(e.target.value)
                      : undefined,
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
      )}
    </Layout>
  );
}
export default App;
