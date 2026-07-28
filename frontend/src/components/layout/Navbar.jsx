import { useState } from "react";
import { NavLink } from "react-router-dom";
import clsx from "clsx";
import { Menu, X, Users2, LogOut, Sparkles, ShieldCheck, UserPlus } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import ThemeToggle from "./ThemeToggle.jsx";

const linkClasses = ({ isActive }) =>
  clsx(
    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
    isActive
      ? "bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
  );

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { to: "/employees", label: "Employees", icon: Users2 },
    ...(isAdmin ? [{ to: "/employees/new", label: "Add Employee", icon: UserPlus }] : []),
    { to: "/ai-insights", label: "AI Insights", icon: Sparkles },
    ...(isAdmin ? [{ to: "/team", label: "Team", icon: ShieldCheck }] : []),
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            EmployeeAI
          </span>
        </div>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClasses}>
              <link.icon className="h-4 w-4" />
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <div className="flex items-center gap-2 border-l border-slate-200 pl-3 dark:border-slate-800">
            <div className="text-right leading-tight">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{user?.name}</p>
              <p className="text-xs capitalize text-slate-400">{user?.role}</p>
            </div>
            <button
              onClick={logout}
              aria-label="Log out"
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-slate-800 dark:hover:text-rose-400"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="flex flex-col gap-1 border-t border-slate-200 px-4 py-3 md:hidden dark:border-slate-800">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={linkClasses}
              onClick={() => setMobileOpen(false)}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </NavLink>
          ))}
          <div className="mt-2 flex items-center justify-between rounded-lg border-t border-slate-100 px-3 pt-3 dark:border-slate-800">
            <div className="leading-tight">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{user?.name}</p>
              <p className="text-xs capitalize text-slate-400">{user?.role}</p>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-sm font-medium text-rose-600 dark:text-rose-400"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
