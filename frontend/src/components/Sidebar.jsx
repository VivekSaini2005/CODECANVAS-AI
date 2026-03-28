import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Code2,
  BarChart2,
  User,
  MessageSquare
} from "lucide-react";

function Sidebar() {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Problem Sheets", path: "/sheets", icon: FileText },
    { name: "Problems", path: "/problems", icon: Code2 },
    { name: "Leaderboard", path: "/leaderboard", icon: BarChart2 },
    { name: "Discuss", path: "/discuss", icon: MessageSquare },
  ];

  const bottomNavItems = [
    { name: "Profile", path: "/profile", icon: User },
  ];

  // ✅ FIX: handle nested routes properly
  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="w-64 bg-white dark:bg-[#0f121b] border-r border-gray-200 dark:border-[#1e2332] flex flex-col h-screen sticky top-0 z-10 shadow-sm">

      {/* Logo */}
      <div className="px-6 py-6 flex items-center gap-2">
        <div className="w-8 h-8 rounded bg-gradient-to-br from-[#625df5] to-[#45b7f1] flex items-center justify-center shadow-lg">
          <Code2 size={18} className="text-gray-900 dark:text-white" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-wide">
          CodeCanvas <span className="text-[#625df5] text-sm ml-1">AI</span>
        </h1>
      </div>

      {/* Navigation */}
      <div className="flex flex-col px-3 flex-1">

        {/* Top Nav */}
        <div className="flex flex-col gap-1">
          {navItems.map((item) => {
            const active = isActive(item.path);

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${active
                    ? "bg-indigo-50 dark:bg-[#1e2332] text-[#625df5] font-semibold"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-900 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-100 dark:bg-[#1a1f2e]"
                  }
                `}
              >
                <item.icon
                  size={20}
                  className={active ? "text-[#625df5]" : "text-gray-500 dark:text-gray-400"}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Divider */}
        <div className="my-4 border-t border-gray-200 dark:border-[#1e2332]" />

        {/* Bottom Nav */}
        <div className="flex flex-col gap-1 mt-auto">
          {bottomNavItems.map((item) => {
            const active = isActive(item.path);

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${active
                    ? "bg-indigo-50 dark:bg-[#1e2332] text-[#625df5] font-semibold"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-900 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-100 dark:bg-[#1a1f2e]"
                  }
                `}
              >
                <item.icon
                  size={20}
                  className={active ? "text-[#625df5]" : "text-gray-500 dark:text-gray-400"}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

      </div>

    </div>
  );
}

export default Sidebar;