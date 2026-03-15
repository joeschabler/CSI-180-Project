import { useState } from "react";
import Layout from "./components/layout";
import { Shelf } from "./components/shelf";
import type { BookProps } from "./components/book";

export type AppMode = "edit" | "content";
export type sidebarCollapsed = "open" | "closed";

export type ShelfData = {
  id: number;
  books: BookProps[];
};

function App() {
  const [mode, setMode] = useState<AppMode>("edit");
  const [isCollapsed, setIsCollapsed] = useState<sidebarCollapsed>("open");

  const [shelves, setShelves] = useState<ShelfData[]>([{ id: 1, books: [] }]);

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
            onAddBook={() => addBookToShelf(shelf.id)}
          />
        ))}
      </div>
    </Layout>
  );
}

export default App;
