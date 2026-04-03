import "./App.css";
import { useState, useEffect } from "react";
import Layout from "./components/layout";
import { Shelf } from "./components/shelf";
import type { BookProps } from "./components/book";
import { EditModal } from "./components/bookModal";
import { ShelfModal } from "./components/shelfModal";
import {
  DndContext,
  closestCenter,
  type DragEndEvent,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

export type AppMode = "edit" | "content";
export type sidebarCollapsed = "open" | "closed";

export type ShelfData = {
  id: number;
  books: BookProps[];
  name?: string;
  width?: number;
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

  const [editingShelf, setEditingShelf] = useState<ShelfData | null>(null);

  const deleteShelf = () => {
    if (!editingShelf) return;

    // .filter keeps every shelf EXCEPT the one that matches the ID I want to delete
    setShelves((prevShelves) =>
      prevShelves.filter((s) => s.id !== editingShelf.id),
    );
    setEditingShelf(null);
  };

  const exportLibrary = () => {
    const dataStr = JSON.stringify(shelves, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "my-library-backup.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const importLibrary = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        if (Array.isArray(importedData)) {
          setShelves(importedData);
        } else {
          alert("Invalid backup file format!");
        }
      } catch (error) {
        alert("Error reading file.");
      }
    };
    reader.readAsText(file);

    event.target.value = "";
  };

  const saveEditedShelf = () => {
    if (!editingShelf) return;

    // .map finds the specific shelf and swaps it out with our newly edited version
    setShelves((prevShelves) =>
      prevShelves.map((s) => (s.id === editingShelf.id ? editingShelf : s)),
    );
    setEditingShelf(null);
  };

  const updateShelfWidth = (shelfId: number, newWidth: number) => {
    setShelves((prevShelves) =>
      prevShelves.map((s) =>
        s.id === shelfId ? { ...s, width: newWidth } : s,
      ),
    );
  };

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
      id: crypto.randomUUID(), // gives book randomly assigned id
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

  const moveBook = (direction: "left" | "right") => {
    if (!editingBook) return;

    const currentShelf = shelves.find((s) => s.id === editingBook.shelfId);
    if (!currentShelf) return;

    const currentIndex = editingBook.bookIndex;
    const targetIndex =
      direction === "left" ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= currentShelf.books.length) return;

    const newBooks = [...currentShelf.books];
    const temp = newBooks[currentIndex];
    newBooks[currentIndex] = newBooks[targetIndex];
    newBooks[targetIndex] = temp;

    setShelves((prevShelves) =>
      prevShelves.map((shelf) =>
        shelf.id === editingBook.shelfId
          ? { ...shelf, books: newBooks }
          : shelf,
      ),
    );

    setEditingBook({
      ...editingBook,
      bookIndex: targetIndex,
    });
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    // if not dropped in a valid space do nothing
    if (!over || active.id === over.id) return;

    setShelves((prevShelves) =>
      prevShelves.map((shelf) => {
        const oldIndex = shelf.books.findIndex((b) => b.id === active.id);
        const newIndex = shelf.books.findIndex((b) => b.id === over.id);
        // if books exist on same shelf swap them using dnd-kit's arrayMove
        if (oldIndex !== -1 && newIndex !== -1) {
          return {
            ...shelf,
            books: arrayMove(shelf.books, oldIndex, newIndex),
          };
        }
        return shelf;
      }),
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
      exportLibrary={exportLibrary}
      importLibrary={importLibrary}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "2rem",
          alignItems: "flex-start",
          paddingBottom: "2rem",
        }}
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          {shelves.map((shelf) => (
            <Shelf
              key={shelf.id}
              name={shelf.name}
              width={shelf.width}
              onUpdateWidth={(newWidth) => updateShelfWidth(shelf.id, newWidth)}
              books={shelf.books}
              mode={mode}
              onAddBook={() => addBookToShelf(shelf.id)}
              onEditShelf={() => setEditingShelf(shelf)}
              onBookClick={(bookIndex) =>
                setEditingBook({
                  shelfId: shelf.id,
                  bookIndex: bookIndex,
                  bookData: shelf.books[bookIndex],
                })
              }
            />
          ))}
        </DndContext>
      </div>
      {editingBook && (
        <EditModal
          editingBook={editingBook}
          setEditingBook={setEditingBook}
          saveEditedBook={saveEditedBook}
          deleteBook={deleteBook}
          moveBook={moveBook}
        />
      )}
      {editingShelf && (
        <ShelfModal
          editingShelf={editingShelf}
          setEditingShelf={setEditingShelf}
          saveEditedShelf={saveEditedShelf}
          deleteShelf={deleteShelf}
        />
      )}
    </Layout>
  );
}
export default App;
