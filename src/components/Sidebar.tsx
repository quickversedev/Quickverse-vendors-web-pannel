import { NavLink } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import { useThemeStore } from "../stores/useThemeStore";

const navItems = [
  { label: "Dashboard", to: "/vendor/dashboard" },
  { label: "Order History", to: "/vendor/order-history" },
  { label: "Store Schedule", to: "/vendor/store-status" },
 
];

const Sidebar = () => {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <aside className="h-full w-[15%] rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 flex flex-col">
      <h1 className="mb-6 text-2xl font-semibold text-slate-900 dark:text-zinc-100">
        QuickVerse-🚀
      </h1>

      <nav className="space-y-2 flex-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/dashboard"}
            className={({ isActive }) =>
              [
                "block rounded-md px-3 py-2 text-sm font-medium transition",
                isActive
                  ? "bg-blue-50 text-blue-900 dark:bg-zinc-100 dark:text-zinc-900"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100",
              ].join(" ")
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="mt-auto flex items-center gap-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 px-3 py-2.5 text-sm font-medium text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-700 transition-all duration-300 active:scale-[0.97] w-full"
        title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        <div className="relative w-5 h-5">
          <Sun
            size={18}
            className={`absolute inset-0 transition-all duration-300 ${
              theme === "light" ? "opacity-100 rotate-0" : "opacity-0 rotate-90"
            }`}
          />
          <Moon
            size={18}
            className={`absolute inset-0 transition-all duration-300 ${
              theme === "dark" ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"
            }`}
          />
        </div>
        <span>{theme === "dark" ? "Dark Mode" : "Light Mode"}</span>
      </button>
    </aside>
  );
};

export default Sidebar;