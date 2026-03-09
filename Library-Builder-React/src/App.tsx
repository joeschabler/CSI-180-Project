import { useState } from "react";
import Layout from "./components/layout";

export type AppMode = "edit" | "content";
export type sidebarCollapsed = "open" | "closed";

function App() {
  const [mode, setMode] = useState<AppMode>("edit");
  const [isCollapsed, setIsCollapsed] = useState<sidebarCollapsed>("open");

  const headerTitle = mode === "edit" ? "Library Editor" : "Your Library";

  return (
    <Layout
      title={headerTitle}
      sidebarStatus={isCollapsed}
      setSidebarStatus={setIsCollapsed}
      mode={mode}
      setMode={setMode}
    >
      <div>Main Content Area</div>
    </Layout>
  );
}

export default App;
