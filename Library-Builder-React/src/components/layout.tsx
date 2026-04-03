import type { ReactNode } from "react";
import { Header } from "./header";
import { Sidebar } from "./sidebar";
import { Footer } from "./footer";
import type { AppMode } from "../App";
import type { sidebarCollapsed } from "../App";

interface LayoutProps {
  children: ReactNode;
  title: string;
  sidebarStatus: sidebarCollapsed;
  setSidebarStatus: (status: sidebarCollapsed) => void;
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  onAddShelf: () => void;
  exportLibrary: () => void;
  importLibrary: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Layout = ({
  children,
  title,
  sidebarStatus,
  setSidebarStatus,
  mode,
  setMode,
  onAddShelf,
  exportLibrary,
  importLibrary,
}: LayoutProps) => {
  return (
    <div
      className="layout-wrapper"
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        overflowY: "scroll",
        width: "100%",
        minWidth: "100vw",
        overflowX: "hidden",
      }}
    >
      <Header title={title} mode={mode} setMode={setMode} />

      <div style={{ display: "flex", flex: 1 }}>
        <div
          style={{
            width: sidebarStatus === "open" ? "240px" : "80px",
            transition: "width 0.3s ease",
            overflow: "hidden",
            borderRight: "1px solid #ddd",
            display: "flex",
            flexDirection: "column",
            minHeight: "calc(100vh - 70px)",
          }}
        >
          <Sidebar
            status={sidebarStatus}
            setStatus={setSidebarStatus}
            mode={mode}
            setMode={setMode}
            onAddShelf={onAddShelf}
            exportLibrary={exportLibrary}
            importLibrary={importLibrary}
          />
        </div>

        <main style={{ flex: 1, padding: "2rem" }}>{children}</main>
      </div>

      <Footer />
    </div>
  );
};

export default Layout;
