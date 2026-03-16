import "./App.css";
import { useState, useEffect } from "react";
import Layout from "./components/layout";
import { Shelf } from "./components/shelf";
import type { BookProps } from "./components/book";
import { EditModal } from "./components/editModal";

export type AppMode = "edit" | "content";
export type sidebarCollapsed = "open" | "closed";

export type ShelfData = {
  id: number;
  books: BookProps[];
};

export type EditingBookState = {
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
        <EditModal
          editingBook={editingBook}
          setEditingBook={setEditingBook}
          saveEditedBook={saveEditedBook}
          deleteBook={deleteBook}
        />
      )}
    </Layout>
  );
}
export default App;
