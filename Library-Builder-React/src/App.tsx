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
  pointerWithin,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

export type AppMode = "edit" | "content";
export type sidebarCollapsed = "open" | "closed";

export type ShelfData = {
  id: number;
  books: BookProps[];
  name?: string;
  width?: number;
};

export type LibraryData = {
  [roomName: string]: ShelfData[];
};

export type EditingBookState = {
  shelfId: number;
  bookIndex: number;
  bookData: BookProps;
} | null;

function App() {
  const [mode, setMode] = useState<AppMode>("edit");
  const [isCollapsed, setIsCollapsed] = useState<sidebarCollapsed>("open");
  // 🟢 Room States
  const [currentRoom, setCurrentRoom] = useState<string>("Living Room");
  const [library, setLibrary] = useState<LibraryData>(() => {
    const savedData = localStorage.getItem("library-rooms");
    if (savedData) return JSON.parse(savedData);
    return { "Living Room": [{ id: 1, books: [] }] };
  });

  // 🟢 Helper for current shelves
  const shelves = library[currentRoom] || [];
  const allRooms = Object.keys(library);

  // Persistence
  useEffect(() => {
    localStorage.setItem("library-rooms", JSON.stringify(library));
  }, [library]);

  // setting menu state
  const [useRandomBooks, setUseRandomBooks] = useState(true);

  const [defaultBookHeight, setDefaultBookHeight] = useState(130);
  const [defaultBookWidth, setDefaultBookWidth] = useState(35);
  const [defaultBookColor, setDefaultBookColor] = useState("#404040");

  // DEV OPTIONS STATE
  const [devOptionsEnabled, setDevOptionsEnabled] = useState(false);

  const [editingBook, setEditingBook] = useState<EditingBookState>(null);

  const [editingShelf, setEditingShelf] = useState<ShelfData | null>(null);

  const hardResetSite = () => {
    localStorage.clear();
    window.location.reload();
  };

  useEffect(() => {
    localStorage.setItem("library-shelves", JSON.stringify(shelves));
  }, [shelves]);

  const addRoom = (name: string) => {
    if (library[name]) return alert("Room already exists!");
    setLibrary((prev) => ({
      ...prev,
      [name]: [{ id: Date.now(), books: [] }],
    }));
    setCurrentRoom(name);
  };

  const renameRoom = (oldName: string) => {
    const newName = window.prompt(`Rename "${oldName}" to:`, oldName);

    if (!newName || newName.trim() === "" || newName === oldName) return;
    if (library[newName]) return alert("A room with that name already exists!");

    setLibrary((prev) => {
      const newLibrary = { ...prev };
      // Move the shelves to the new key
      newLibrary[newName] = newLibrary[oldName];
      // Delete the old key
      delete newLibrary[oldName];
      return newLibrary;
    });

    // If we renamed the room we are currently looking at, update the pointer
    if (currentRoom === oldName) {
      setCurrentRoom(newName);
    }
  };

  const deleteShelf = () => {
    if (!editingShelf) return;
    setLibrary((prev) => ({
      ...prev,
      [currentRoom]: prev[currentRoom].filter((s) => s.id !== editingShelf.id),
    }));
    setEditingShelf(null);
  };

  const exportLibrary = () => {
    const dataStr = JSON.stringify(library, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "my-library-rooms-backup.json";
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
        // Basic check: is it an object (rooms) or an array (legacy)?
        if (Array.isArray(importedData)) {
          setLibrary({ "Imported Room": importedData });
          setCurrentRoom("Imported Room");
        } else {
          setLibrary(importedData);
          setCurrentRoom(Object.keys(importedData)[0]);
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
    setLibrary((prev) => ({
      ...prev,
      [currentRoom]: prev[currentRoom].map((s) =>
        s.id === editingShelf.id ? editingShelf : s,
      ),
    }));
    setEditingShelf(null);
  };

  const updateShelfWidth = (shelfId: number, newWidth: number) => {
    setLibrary((prev) => ({
      ...prev,
      [currentRoom]: prev[currentRoom].map((s) =>
        s.id === shelfId ? { ...s, width: newWidth } : s,
      ),
    }));
  };

  const headerTitle = mode === "edit" ? "Library Editor" : "Your Library";

  const clearLibrary = () => {
    setLibrary((prev) => ({
      ...prev,
      [currentRoom]: [{ id: Date.now(), books: [] }],
    }));
  };

  const addNewShelf = () => {
    setLibrary((prev) => ({
      ...prev,
      [currentRoom]: [...prev[currentRoom], { id: Date.now(), books: [] }],
    }));
  };

  const addBookToShelf = (shelfId: number) => {
    const randomHeight = useRandomBooks
      ? Math.floor(Math.random() * 41 + 100)
      : defaultBookHeight;
    const randomWidth = useRandomBooks
      ? Math.floor(Math.random() * 31 + 20)
      : defaultBookWidth;
    const randomColor = useRandomBooks
      ? "#" + Math.floor(Math.random() * 16777215).toString(16)
      : defaultBookColor;

    const newBook: BookProps = {
      id: crypto.randomUUID(),
      title: "New Book",
      color: randomColor,
      height: randomHeight,
      width: randomWidth,
    };

    setLibrary((prev) => ({
      ...prev,
      [currentRoom]: prev[currentRoom].map((s) =>
        s.id === shelfId ? { ...s, books: [...s.books, newBook] } : s,
      ),
    }));
  };

  const deleteBook = () => {
    if (!editingBook) return;
    setLibrary((prev) => ({
      ...prev,
      [currentRoom]: prev[currentRoom].map((shelf) => {
        if (shelf.id === editingBook.shelfId) {
          return {
            ...shelf,
            books: shelf.books.filter((_, i) => i !== editingBook.bookIndex),
          };
        }
        return shelf;
      }),
    }));
    setEditingBook(null);
  };

  const saveEditedBook = () => {
    if (!editingBook) return;
    setLibrary((prev) => ({
      ...prev,
      [currentRoom]: prev[currentRoom].map((shelf) => {
        if (shelf.id === editingBook.shelfId) {
          const updatedBooks = [...shelf.books];
          updatedBooks[editingBook.bookIndex] = editingBook.bookData;
          return { ...shelf, books: updatedBooks };
        }
        return shelf;
      }),
    }));
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
    [newBooks[currentIndex], newBooks[targetIndex]] = [
      newBooks[targetIndex],
      newBooks[currentIndex],
    ];

    setLibrary((prev) => ({
      ...prev,
      [currentRoom]: prev[currentRoom].map((s) =>
        s.id === editingBook.shelfId ? { ...s, books: newBooks } : s,
      ),
    }));
    setEditingBook({ ...editingBook, bookIndex: targetIndex });
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const isActiveShelf = shelves.some((s) => s.id === active.id);

    setLibrary((prev) => {
      const roomShelves = [...prev[currentRoom]];
      if (isActiveShelf) {
        const oldIdx = roomShelves.findIndex((s) => s.id === active.id);
        const newIdx = roomShelves.findIndex((s) => s.id === over.id);
        return {
          ...prev,
          [currentRoom]: arrayMove(roomShelves, oldIdx, newIdx),
        };
      }

      return {
        ...prev,
        [currentRoom]: roomShelves.map((shelf) => {
          const oldIndex = shelf.books.findIndex((b) => b.id === active.id);
          const newIndex = shelf.books.findIndex((b) => b.id === over.id);
          if (oldIndex !== -1 && newIndex !== -1) {
            return {
              ...shelf,
              books: arrayMove(shelf.books, oldIndex, newIndex),
            };
          }
          return shelf;
        }),
      };
    });
  };

  return (
    <Layout
      title={`${mode === "edit" ? "Library Editor" : "Your Library"} - ${currentRoom}`}
      sidebarStatus={isCollapsed}
      setSidebarStatus={setIsCollapsed}
      mode={mode}
      setMode={setMode}
      onAddShelf={addNewShelf}
      exportLibrary={exportLibrary}
      importLibrary={importLibrary}
      useRandomBooks={useRandomBooks}
      setUseRandomBooks={setUseRandomBooks}
      defaultBookHeight={defaultBookHeight}
      setDefaultBookHeight={setDefaultBookHeight}
      defaultBookWidth={defaultBookWidth}
      setDefaultBookWidth={setDefaultBookWidth}
      defaultBookColor={defaultBookColor}
      setDefaultBookColor={setDefaultBookColor}
      clearLibrary={clearLibrary}
      devOptionsEnabled={devOptionsEnabled}
      setDevOptionsEnabled={setDevOptionsEnabled}
      hardResetSite={hardResetSite}
      // Room Props for Sidebar
      currentRoom={currentRoom}
      setCurrentRoom={setCurrentRoom}
      allRooms={allRooms}
      addRoom={addRoom}
      renameRoom={renameRoom}
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
          collisionDetection={pointerWithin}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={shelves.map((s) => s.id)}
            strategy={rectSortingStrategy}
          >
            {shelves.map((shelf) => (
              <Shelf
                key={shelf.id}
                id={shelf.id}
                name={shelf.name}
                width={shelf.width}
                onUpdateWidth={(newWidth) =>
                  updateShelfWidth(shelf.id, newWidth)
                }
                books={shelf.books}
                mode={mode}
                onAddBook={() => addBookToShelf(shelf.id)}
                onEditShelf={() => setEditingShelf(shelf)}
                onBookClick={(bookIndex) =>
                  setEditingBook({
                    shelfId: shelf.id,
                    bookIndex,
                    bookData: shelf.books[bookIndex],
                  })
                }
              />
            ))}
          </SortableContext>
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
