import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Dashboard", to: "/vendor/dashboard" },
  { label: "Order History", to: "/vendor/order-history" },
  { label: "Store Schedule", to: "/vendor/store-status" },
 
];

const Sidebar = () => {
  return (
    <aside className="h-full w-[15%] rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <h1 className="mb-6 text-2xl font-semibold text-zinc-100">
        QuickVerse-🚀
      </h1>

      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/dashboard"}
            className={({ isActive }) =>
              [
                "block rounded-md px-3 py-2 text-sm font-medium transition",
                isActive
                  ? "bg-zinc-100 text-zinc-900"
                  : "text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100",
              ].join(" ")
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;