import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./Navbar.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";

export default function AppLayout() {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Outlet />
      </main>
      <Toaster
        position="top-right"
        toastOptions={{
          className:
            theme === "dark" ? "!bg-slate-800 !text-slate-100" : "!bg-white !text-slate-900",
        }}
      />
    </div>
  );
}
